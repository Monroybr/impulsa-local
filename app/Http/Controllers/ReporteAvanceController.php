<?php

namespace App\Http\Controllers;

use App\Models\Inscripcion;
use App\Models\ReporteAvance;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ReporteAvanceController extends Controller
{
    private function verificarAcceso(): void
    {
        $usuario = Auth::user();

        abort_unless(
            $usuario &&
            $usuario->activo &&
            $usuario->rol === 'emprendedor',
            403,
            'No tienes permiso para gestionar reportes.'
        );
    }

    public function index(): JsonResponse
    {
        $this->verificarAcceso();

        $reportes = ReporteAvance::query()
            ->whereHas('inscripcion', function ($consulta) {
                $consulta->where('emprendedor_id', Auth::id());
            })
            ->with('inscripcion.programa:id,nombre')
            ->orderByDesc('fecha')
            ->orderByDesc('id')
            ->get();

        return response()->json($reportes);
    }

    public function store(Request $request): JsonResponse
    {
        $this->verificarAcceso();

        $datos = $request->validate([
            'inscripcion_id' => [
                'required',
                'integer',
                Rule::exists('inscripciones', 'id')
                    ->where('emprendedor_id', Auth::id()),
            ],
            'fecha' => [
                'required',
                'date_format:Y-m-d',
                'before_or_equal:today'
            ],
            'logros' => [
                'required',
                'string',
                'max:5000'
            ],
            'dificultades' => [
                'nullable',
                'string',
                'max:5000'
            ],
            'apoyo_solicitado' => [
                'nullable',
                'string',
                'max:5000'
            ],
        ]);

        Inscripcion::query()
            ->where('emprendedor_id', Auth::id())
            ->findOrFail($datos['inscripcion_id']);

        $reporte = ReporteAvance::create($datos);

        return response()->json([
            'message' =>
                'Reporte de avance registrado correctamente en SQLite.',
            'reporte' => $reporte->load(
                'inscripcion.programa:id,nombre'
            ),
        ], 201);
    }
}
