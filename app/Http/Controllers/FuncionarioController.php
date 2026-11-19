<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\ReporteAvance;
use App\Models\SeguimientoFuncionario;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class FuncionarioController extends Controller
{
    // ==========================================
    // VERIFICAR PERMISOS
    // ==========================================

    private function verificarAcceso(): void
    {
        $usuario = Auth::user();

        abort_unless(
            $usuario &&
            $usuario->rol === 'funcionario' &&
            $usuario->activo,
            403,
            'No tienes permiso para acceder.'
        );
    }

    private function verificarEmprendedor(
        User $emprendedor
    ): void {
        abort_unless(
            $emprendedor->rol === 'emprendedor',
            404,
            'Emprendedor no encontrado.'
        );
    }

    // ==========================================
    // CONSULTAR EMPRENDEDORES
    // ==========================================

    public function emprendedores(): JsonResponse
    {
        $this->verificarAcceso();

        $usuarios = User::query()
            ->where('rol', 'emprendedor')
            ->orderBy('name')
            ->get();

        $seguimientos = SeguimientoFuncionario::query()
            ->orderByDesc('fecha')
            ->orderByDesc('id')
            ->get();

        $ultimosSeguimientos = $seguimientos
            ->groupBy('emprendedor_id')
            ->map(function ($lista) {
                return $lista->first();
            });

        $emprendedores = $usuarios->map(
            function ($usuario) use ($ultimosSeguimientos) {

                $ultimo = $ultimosSeguimientos
                    ->get($usuario->id);

                return [
                    'id' => $usuario->id,
                    'nombre' => $usuario->name,
                    'correo' => $usuario->email,

                    'emprendimiento' =>
                        $usuario->nombre_negocio ?? '',

                    'actividad' =>
                        $usuario->tipo_emprendimiento ?? '',

                    'telefono' =>
                        $usuario->telefono ?? '',

                    'direccion' =>
                        $usuario->direccion ?? '',

                    'estado' => $usuario->activo
                        ? 'activo'
                        : 'inactivo',

                    'atencion' => $ultimo
                        ? $ultimo->estado
                        : 'Sin registro',
                ];
            }
        );

        return response()->json([
            'emprendedores' => $emprendedores,

            'indicadores' => [
                'total_emprendedores' =>
                    $usuarios->count(),

                'total_activos' =>
                    $usuarios->where('activo', true)
                        ->count(),

                'total_seguimientos' =>
                    $seguimientos->count(),

                'total_apoyo' =>
                    $emprendedores
                        ->where(
                            'atencion',
                            'Requiere apoyo'
                        )
                        ->count(),
            ],
        ]);
    }

    // ==========================================
    // DETALLE DEL EMPRENDEDOR
    // ==========================================

    public function detalle(
        User $emprendedor
    ): JsonResponse {

        $this->verificarAcceso();

        $this->verificarEmprendedor($emprendedor);

        $seguimientos = SeguimientoFuncionario::query()
            ->where(
                'emprendedor_id',
                $emprendedor->id
            )
            ->with('funcionario:id,name')
            ->orderByDesc('fecha')
            ->orderByDesc('id')
            ->get();

        $reportes = ReporteAvance::query()
            ->whereHas(
                'inscripcion',
                function ($consulta) use ($emprendedor) {

                    $consulta->where(
                        'emprendedor_id',
                        $emprendedor->id
                    );
                }
            )
            ->with('inscripcion.programa')
            ->orderByDesc('fecha')
            ->orderByDesc('id')
            ->get();

        return response()->json([
            'emprendedor' => [
                'id' => $emprendedor->id,
                'nombre' => $emprendedor->name,
                'correo' => $emprendedor->email,

                'emprendimiento' =>
                    $emprendedor->nombre_negocio ?? '',

                'actividad' =>
                    $emprendedor->tipo_emprendimiento ?? '',

                'telefono' =>
                    $emprendedor->telefono ?? '',

                'direccion' =>
                    $emprendedor->direccion ?? '',

                'estado' => $emprendedor->activo
                    ? 'activo'
                    : 'inactivo',
            ],

            'seguimientos' => $seguimientos,

            'reportes' => $reportes->map(
                function ($reporte) {

                    return [
                        'id' => $reporte->id,

                        'programa' =>
                            $reporte->inscripcion
                                ?->programa
                                ?->nombre
                            ?? 'Programa no disponible',

                        'fecha' =>
                            $reporte->fecha
                                ? substr(
                                    (string) $reporte->fecha,
                                    0,
                                    10
                                )
                                : null,

                        'logros' =>
                            $reporte->logros,

                        'dificultades' =>
                            $reporte->dificultades,

                        'apoyo' =>
                            $reporte->apoyo_solicitado,
                    ];
                }
            ),
        ]);
    }

    // ==========================================
    // GUARDAR SEGUIMIENTO EN SQLITE
    // ==========================================

    public function guardarSeguimiento(
        Request $request,
        User $emprendedor
    ): JsonResponse {

        $this->verificarAcceso();

        $this->verificarEmprendedor($emprendedor);

        $datos = $request->validate([
            'fecha' => [
                'required',
                'date_format:Y-m-d',
                'before_or_equal:today',
            ],

            'tipo' => [
                'required',
                Rule::in([
                    'Llamada',
                    'Visita',
                    'Asesoría',
                    'Reunión',
                    'Otro',
                ]),
            ],

            'estado' => [
                'required',
                Rule::in([
                    'Pendiente',
                    'Requiere apoyo',
                    'Atendido',
                ]),
            ],

            'observaciones' => [
                'required',
                'string',
                'max:1500',
            ],
        ]);

        $seguimiento = SeguimientoFuncionario::create([
            'emprendedor_id' =>
                $emprendedor->id,

            'funcionario_id' =>
                Auth::id(),

            'fecha' =>
                $datos['fecha'],

            'tipo' =>
                $datos['tipo'],

            'estado' =>
                $datos['estado'],

            'observaciones' =>
                $datos['observaciones'],
        ]);

        return response()->json([
            'message' =>
                'Seguimiento registrado correctamente en SQLite.',

            'seguimiento' =>
                $seguimiento->load(
                    'funcionario:id,name'
                ),
        ], 201);
    }
}
