<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminUsuarioController extends Controller
{
    private function verificarAdministrador(): void
    {
        abort_unless(
            auth()->check()
            && auth()->user()->rol === 'administrador'
            && auth()->user()->activo,
            403
        );
    }

    public function guardar(Request $request)
    {
        $this->verificarAdministrador();

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
                'unique:users,email'
            ],
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed'
            ],
            'rol' => [
                'required',
                Rule::in([
                    'administrador',
                    'funcionario',
                    'coordinador',
                    'instructor'
                ])
            ]
        ]);

        User::create([
            'name' => $datos['name'],
            'email' => $datos['email'],
            'password' => Hash::make($datos['password']),
            'rol' => $datos['rol'],
            'activo' => true
        ]);

        return redirect()
            ->route('administrador')
            ->with(
                'success',
                'Usuario creado correctamente.'
            );
    }

    public function cambiarEstado(User $usuario)
    {
        $this->verificarAdministrador();

        if ($usuario->id === auth()->id()) {
            return redirect()
                ->route('administrador')
                ->with(
                    'error',
                    'No puedes desactivar tu propia cuenta.'
                );
        }

        $usuario->activo = !$usuario->activo;
        $usuario->save();

        return redirect()
            ->route('administrador')
            ->with(
                'success',
                $usuario->activo
                    ? 'Usuario activado correctamente.'
                    : 'Usuario desactivado correctamente.'
            );
    }
}
