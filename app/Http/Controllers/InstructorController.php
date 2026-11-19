<?php

namespace App\Http\Controllers;

use App\Models\Inscripcion;
use App\Models\ObservacionInstructor;
use App\Models\Programa;
use App\Models\ReporteAvance;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class InstructorController extends Controller
{
    // ==========================================
    // VERIFICAR ACCESO DEL INSTRUCTOR
    // ==========================================

    private function verificarAcceso(): void
    {
        $usuario = Auth::user();

        abort_unless(
            $usuario &&
            $usuario->activo &&
            $usuario->rol === 'instructor',
            403,
            'No tienes permiso para acceder a esta información.'
        );
    }

    // ==========================================
    // VERIFICAR INSCRIPCIÓN ASIGNADA
    // ==========================================

    private function verificarInscripcion(
        Inscripcion $inscripcion
    ): void {
        $inscripcion->loadMissing('programa');

        abort_unless(
            $inscripcion->programa &&
            (int) $inscripcion->programa->instructor_id
                === (int) Auth::id(),
            403,
            'Este seguimiento no está asignado a tu cuenta.'
        );
    }

    // ==========================================
    // PROGRAMAS ASIGNADOS
    // ==========================================

    public function programas(): JsonResponse
    {
        $this->verificarAcceso();

        $programas = Programa::query()
            ->where('instructor_id', Auth::id())
            ->withCount('inscripciones')
            ->orderByDesc('id')
            ->get();

        return response()->json($programas);
    }

    // ==========================================
    // PARTICIPANTES DE UN PROGRAMA
    // ==========================================

    public function participantes(
        Programa $programa
    ): JsonResponse {
        $this->verificarAcceso();

        abort_unless(
            (int) $programa->instructor_id
                === (int) Auth::id(),
            403,
            'Este programa no está asignado a tu cuenta.'
        );

        $participantes = Inscripcion::query()
            ->where('programa_id', $programa->id)
            ->with([
                'emprendedor:id,name,email,nombre_negocio'
            ])
            ->orderByDesc('id')
            ->get();

        return response()->json([
            'programa' => $programa,
            'participantes' => $participantes,
        ]);
    }

    // ==========================================
    // REPORTES DE AVANCE
    // ==========================================

    public function reportes(
        Inscripcion $inscripcion
    ): JsonResponse {
        $this->verificarAcceso();
        $this->verificarInscripcion($inscripcion);

        $inscripcion->load(
            'programa',
            'emprendedor'
        );

        $reportes = ReporteAvance::query()
            ->where('inscripcion_id', $inscripcion->id)
            ->orderByDesc('fecha')
            ->orderByDesc('id')
            ->get();

        return response()->json([
            'inscripcion' => $inscripcion,
            'reportes' => $reportes,
        ]);
    }

    // ==========================================
    // CONSULTAR OBSERVACIONES
    // ==========================================

    public function observaciones(
        Inscripcion $inscripcion
    ): JsonResponse {
        $this->verificarAcceso();
        $this->verificarInscripcion($inscripcion);

        $observaciones = ObservacionInstructor::query()
            ->where('inscripcion_id', $inscripcion->id)
            ->where('instructor_id', Auth::id())
            ->orderByDesc('fecha')
            ->orderByDesc('id')
            ->get();

        return response()->json([
            'inscripcion_id' => $inscripcion->id,
            'observaciones' => $observaciones,
        ]);
    }

    // ==========================================
    // REGISTRAR OBSERVACIÓN EN SQLITE
    // ==========================================

    public function guardarObservacion(
        Request $request,
        Inscripcion $inscripcion
    ): JsonResponse {
        $this->verificarAcceso();
        $this->verificarInscripcion($inscripcion);

        $datos = $request->validate([
            'fecha' => [
                'required',
                'date_format:Y-m-d',
            ],

            'tipo' => [
                'required',
                Rule::in([
                    'revision',
                    'asesoria',
                    'llamada',
                    'visita',
                ]),
            ],

            'comentario' => [
                'required',
                'string',
                'max:1500',
            ],

            'estado' => [
                'required',
                Rule::in([
                    'revisado',
                    'requiere apoyo',
                    'pendiente',
                ]),
            ],
        ]);

        $observacion = new ObservacionInstructor();

        $observacion->inscripcion_id = $inscripcion->id;
        $observacion->instructor_id = Auth::id();
        $observacion->fecha = $datos['fecha'];
        $observacion->tipo = $datos['tipo'];
        $observacion->comentario = $datos['comentario'];
        $observacion->estado = $datos['estado'];

        $observacion->save();

        return response()->json([
            'message' =>
                'Observación registrada correctamente en SQLite.',
            'observacion' => $observacion,
        ], 201);
    }

    // ==========================================
    // ACTUALIZAR PROGRESO DEL EMPRENDEDOR
    // ==========================================

    public function actualizarProgreso(
        Request $request,
        Inscripcion $inscripcion
    ): JsonResponse {
        $this->verificarAcceso();
        $this->verificarInscripcion($inscripcion);

        $datos = $request->validate([
            'progreso' => [
                'required',
                'integer',
                'between:0,100',
            ],
        ]);

        $inscripcion->progreso = (int) $datos['progreso'];

        // Al alcanzar el 100 %, la inscripción
        // se considera completada.
        if ($inscripcion->progreso === 100) {
            $inscripcion->estado = 'completado';
        } elseif ($inscripcion->estado === 'completado') {
            $inscripcion->estado = 'inscrito';
        }

        $inscripcion->save();

        return response()->json([
            'message' =>
                'Progreso actualizado correctamente en SQLite.',
            'inscripcion' => $inscripcion->fresh(),
        ]);
    }
}
