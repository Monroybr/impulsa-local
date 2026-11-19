<?php

namespace App\Http\Controllers;

use App\Models\Programa;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ProgramaController extends Controller
{
    private function verificarGestion(): void
    {
        $usuario = Auth::user();

        abort_unless(
            $usuario &&
            $usuario->activo &&
            in_array(
                $usuario->rol,
                ['administrador', 'coordinador'],
                true
            ),
            403,
            'No tienes permiso para gestionar programas.'
        );
    }

    // Consultar programas reales desde SQLite
    public function index(): JsonResponse
    {
        $this->verificarGestion();

        $programas = Programa::query()
            ->with('instructor:id,name')
            ->withCount('inscripciones')
            ->orderByDesc('id')
            ->get();

        return response()->json($programas);
    }

    // Consultar instructores activos
    public function instructores(): JsonResponse
    {
        $this->verificarGestion();

        $instructores = User::query()
            ->where('rol', 'instructor')
            ->where('activo', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return response()->json($instructores);
    }

    // Registrar un programa
    public function store(Request $request): JsonResponse
    {
        $this->verificarGestion();

        $datos = $request->validate(
            $this->reglas()
        );

        $programa = Programa::create($datos);

        return response()->json([
            'message' => 'Programa registrado correctamente en SQLite.',
            'programa' => $programa
                ->load('instructor')
                ->loadCount('inscripciones'),
        ], 201);
    }

    // Actualizar un programa
    public function update(
        Request $request,
        Programa $programa
    ): JsonResponse {
        $this->verificarGestion();

        $datos = $request->validate(
            $this->reglas()
        );

        $inscritos = $programa->inscripciones()->count();

        if ($datos['cupos'] < $inscritos) {
            return response()->json([
                'message' =>
                    'Los cupos no pueden ser menores que ' .
                    'la cantidad de emprendedores inscritos.',
            ], 422);
        }

        $programa->update($datos);

        return response()->json([
            'message' => 'Programa actualizado correctamente en SQLite.',
            'programa' => $programa
                ->fresh()
                ->load('instructor')
                ->loadCount('inscripciones'),
        ]);
    }

    private function reglas(): array
    {
        return [
            'nombre' => [
                'required',
                'string',
                'max:255',
            ],

            'tematica' => [
                'required',
                'string',
                'max:100',
            ],

            'descripcion' => [
                'nullable',
                'string',
            ],

            'instructor_id' => [
                'nullable',
                'integer',
                Rule::exists('users', 'id')
                    ->where('rol', 'instructor')
                    ->where('activo', true),
            ],

            'duracion_semanas' => [
                'required',
                'integer',
                'min:1',
            ],

            'cupos' => [
                'required',
                'integer',
                'min:1',
            ],

            'fecha_inicio' => [
                'nullable',
                'date',
            ],

            'estado' => [
                'required',
                Rule::in([
                    'activo',
                    'inactivo',
                    'finalizado',
                ]),
            ],
        ];
    }
}
