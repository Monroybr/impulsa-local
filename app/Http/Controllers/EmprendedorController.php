<?php

namespace App\Http\Controllers;

use App\Models\Inscripcion;
use App\Models\Programa;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class EmprendedorController extends Controller
{
    private function verificarAcceso(): void
    {
        abort_unless(
            Auth::check() &&
            Auth::user()->rol === 'emprendedor' &&
            Auth::user()->activo,
            403
        );
    }

    public function index()
    {
        $this->verificarAcceso();

        return view('emprendedor', [
            'usuarioActual' => Auth::user()
        ]);
    }

    public function actualizarPerfil(Request $request)
    {
        $this->verificarAcceso();

        $usuario = Auth::user();

        $datos = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required', 'email', 'max:255',
                Rule::unique('users', 'email')->ignore($usuario->id)
            ],
            'telefono' => ['required', 'string', 'max:30'],
            'direccion' => ['required', 'string', 'max:255'],
            'nombre_negocio' => ['required', 'string', 'max:255'],
            'tipo_emprendimiento' => ['required', 'string', 'max:255']
        ]);

        $usuario->update($datos);

        return redirect()
            ->route('emprendedor')
            ->with('success', 'Tu información se actualizó correctamente.');
    }

    public function programasDisponibles(): JsonResponse
    {
        $this->verificarAcceso();

        $programas = Programa::query()
            ->with('instructor:id,name')
            ->withCount('inscripciones')
            ->orderByDesc('id')
            ->get();

        return response()->json($programas);
    }

    public function misInscripciones(): JsonResponse
    {
        $this->verificarAcceso();

        $inscripciones = Inscripcion::query()
            ->where('emprendedor_id', Auth::id())
            ->with('programa.instructor:id,name')
            ->orderByDesc('id')
            ->get();

        return response()->json($inscripciones);
    }

    public function inscribirse(Request $request): JsonResponse
    {
        $this->verificarAcceso();

        $datos = $request->validate([
            'programa_id' => [
                'required',
                'integer',
                Rule::exists('programas', 'id')
            ],
        ]);

        $inscripcion = DB::transaction(function () use ($datos) {
            $programa = Programa::query()
                ->findOrFail($datos['programa_id']);

            if ($programa->estado !== 'activo') {
                throw ValidationException::withMessages([
                    'programa_id' => 'Este programa no está activo.'
                ]);
            }

            $yaInscrito = Inscripcion::query()
                ->where('programa_id', $programa->id)
                ->where('emprendedor_id', Auth::id())
                ->exists();

            if ($yaInscrito) {
                throw ValidationException::withMessages([
                    'programa_id' => 'Ya estás inscrito en este programa.'
                ]);
            }

            $inscritos = Inscripcion::query()
                ->where('programa_id', $programa->id)
                ->count();

            if ($inscritos >= $programa->cupos) {
                throw ValidationException::withMessages([
                    'programa_id' => 'Este programa ya no tiene cupos disponibles.'
                ]);
            }

            return Inscripcion::create([
                'programa_id' => $programa->id,
                'emprendedor_id' => Auth::id(),
                'progreso' => 0,
                'estado' => 'inscrito',
                'fecha_inscripcion' => now(),
            ]);
        });

        return response()->json([
            'message' => 'Inscripción registrada correctamente en SQLite.',
            'inscripcion' => $inscripcion->load('programa'),
        ], 201);
    }
}
