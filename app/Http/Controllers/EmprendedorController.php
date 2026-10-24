<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class EmprendedorController extends Controller
{
    private function verificarAcceso(): void
    {
        abort_unless(
            Auth::check()
            && Auth::user()->rol === 'emprendedor'
            && Auth::user()->activo,
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
            'name' => [
                'required',
                'string',
                'max:255'
            ],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')
                    ->ignore($usuario->id)
            ],
            'telefono' => [
                'required',
                'string',
                'max:30'
            ],
            'direccion' => [
                'required',
                'string',
                'max:255'
            ],
            'nombre_negocio' => [
                'required',
                'string',
                'max:255'
            ],
            'tipo_emprendimiento' => [
                'required',
                'string',
                'max:255'
            ]
        ]);

        $usuario->update($datos);

        return redirect()
            ->route('emprendedor')
            ->with(
                'success',
                'Tu información se actualizó correctamente.'
            );
    }
}
