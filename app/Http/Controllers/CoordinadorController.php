<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Programa;
use App\Models\Inscripcion;
use App\Models\SeguimientoFuncionario;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class CoordinadorController extends Controller
{
    private function verificarAcceso(): void
    {
        $usuario = Auth::user();

        abort_unless(
            $usuario &&
            $usuario->activo &&
            in_array(
                $usuario->rol,
                ['coordinador', 'administrador'],
                true
            ),
            403,
            'No tienes permiso para consultar esta información.'
        );
    }

    public function resumen(): JsonResponse
    {
        $this->verificarAcceso();

        // Emprendedores registrados en SQLite
        $usuarios = User::query()
            ->where('rol', 'emprendedor')
            ->orderBy('name')
            ->get();

        $emprendedores = $usuarios->map(function ($usuario) {
            return [
                'id' => $usuario->id,
                'nombre' => $usuario->name,
                'correo' => $usuario->email,
                'emprendimiento' => $usuario->nombre_negocio ?? '',
                'actividad' => $usuario->tipo_emprendimiento ?? '',
                'sector' => $usuario->tipo_emprendimiento ?? '',
                'estado' => $usuario->activo
                    ? 'activo'
                    : 'inactivo',
            ];
        });

        // Programas y sus inscripciones reales
        $programas = Programa::query()
            ->with('instructor:id,name')
            ->withCount('inscripciones')
            ->orderByDesc('id')
            ->get();

        // Avance registrado en cada inscripción
        $inscripciones = Inscripcion::query()
            ->with([
                'emprendedor:id,name,nombre_negocio',
                'programa:id,nombre',
            ])
            ->orderByDesc('id')
            ->get();

        $avances = $inscripciones->map(function ($inscripcion) {
            return [
                'id' => $inscripcion->id,
                'emprendedorId' => $inscripcion->emprendedor_id,
                'programaId' => $inscripcion->programa_id,
                'progreso' => (float) ($inscripcion->progreso ?? 0),
                'estado' => $inscripcion->estado,
            ];
        });

        // Seguimientos que requieren apoyo institucional
        $seguimientos = SeguimientoFuncionario::query()
            ->with('funcionario:id,name')
            ->where('estado', 'Requiere apoyo')
            ->orderByDesc('fecha')
            ->orderByDesc('id')
            ->get();

        $apoyos = $seguimientos->map(function ($seguimiento) {
            return [
                'id' => $seguimiento->id,
                'emprendedorId' => $seguimiento->emprendedor_id,
                'fecha' => substr(
                    (string) $seguimiento->fecha,
                    0,
                    10
                ),
                'tipo' => $seguimiento->tipo,
                'estado' => $seguimiento->estado,
                'observacion' => $seguimiento->observaciones,
                'responsable' => $seguimiento->funcionario?->name
                    ?? 'No disponible',
            ];
        });

        return response()->json([
            'emprendedores' => $emprendedores,
            'programas' => $programas,
            'avances' => $avances,
            'apoyos' => $apoyos,
            'indicadores' => [
                'total_emprendedores' => $usuarios->count(),
                'total_activos' => $usuarios
                    ->where('activo', true)->count(),
                'total_inactivos' => $usuarios
                    ->where('activo', false)->count(),
                'total_programas' => $programas->count(),
                'programas_activos' => $programas
                    ->where('estado', 'activo')->count(),
                'total_inscripciones' => $inscripciones->count(),
                'total_apoyos' => $apoyos->count(),
                'promedio_progreso' => $inscripciones->count()
                    ? round($inscripciones->avg('progreso'), 1)
                    : 0,
            ],
        ]);
    }
}
