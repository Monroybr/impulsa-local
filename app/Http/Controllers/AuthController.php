<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function registrar(Request $request)
    {
        $datos = $request->validate([
            'nombre' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'tipo_emprendimiento' => ['required', 'string', 'max:255'],
            'nombre_negocio' => ['required', 'string', 'max:255'],
            'telefono' => ['required', 'string', 'max:30'],
            'direccion' => ['required', 'string', 'max:255'],
        ]);

        $usuario = User::create([
            'name' => $datos['nombre'],
            'email' => $datos['email'],
            'password' => $datos['password'],
            'rol' => 'emprendedor',
            'tipo_emprendimiento' => $datos['tipo_emprendimiento'],
            'nombre_negocio' => $datos['nombre_negocio'],
            'telefono' => $datos['telefono'],
            'direccion' => $datos['direccion'],
            'activo' => true
        ]);

        Auth::login($usuario);

        $request->session()->regenerate();

        return redirect()->route('emprendedor');
    }

    public function iniciarSesion(Request $request)
    {
        $credenciales = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (!Auth::attempt($credenciales)) {
            throw ValidationException::withMessages([
                'email' => 'El correo o la contraseña son incorrectos.',
            ]);
        }

        $request->session()->regenerate();

        $usuario = Auth::user();

        if (!$usuario->activo) {

            Auth::logout();

            $request->session()->invalidate();
            $request->session()->regenerateToken();

            throw ValidationException::withMessages([
                'email' => 'Tu cuenta está desactivada. Comunícate con el administrador.',
            ]);
        }

        $rutas = [
            'administrador' => 'administrador',
            'funcionario' => 'funcionario',
            'coordinador' => 'coordinador',
            'instructor' => 'instructor',
            'emprendedor' => 'emprendedor',
        ];

        if (!isset($rutas[$usuario->rol])) {

            Auth::logout();

            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()
                ->route('login')
                ->withErrors([
                    'email' => 'Tu cuenta no tiene un rol válido.'
                ]);
        }

        return redirect()->route($rutas[$usuario->rol]);
    }

    public function cerrarSesion(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
