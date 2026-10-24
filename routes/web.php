
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminUsuarioController;
use App\Http\Controllers\EmprendedorController;
use App\Models\User;

Route::get('/', function () {
    return view('welcome');
})->name('inicio');

Route::get('/cursos', function () {
    return view('cursos');
})->name('cursos');

Route::middleware('guest')->group(function () {

    Route::get('/login', function () {
        return view('acceso');
    })->name('login');

    Route::get('/registro', function () {
        return view('acceso');
    })->name('registro');

    Route::get('/acceso', function () {
        return view('acceso');
    })->name('acceso');

    Route::post('/login', [
        AuthController::class,
        'iniciarSesion'
    ])->name('login.procesar');

    Route::post('/registro', [
        AuthController::class,
        'registrar'
    ])->name('registro.procesar');

});

Route::post('/logout', [
    AuthController::class,
    'cerrarSesion'
])->middleware('auth')->name('logout');

Route::middleware('auth')->group(function () {

    Route::get('/emprendedor', [
        EmprendedorController::class,
        'index'
    ])->name('emprendedor');

    Route::put('/emprendedor/perfil', [
        EmprendedorController::class,
        'actualizarPerfil'
    ])->name('emprendedor.perfil.actualizar');

    foreach ([
        'administrador',
        'funcionario',
        'coordinador',
        'instructor'
    ] as $rol) {

        Route::get("/{$rol}", function () use ($rol) {

            $usuario = auth()->user();

            abort_unless($usuario->activo, 403);
            abort_unless($usuario->rol === $rol, 403);

            if ($rol === 'administrador') {
                return view('administrador', [
                    'usuariosReales' => User::orderBy('name')->get(),
                    'usuarioActual' => $usuario
                ]);
            }

            return view($rol, [
                'usuarioActual' => $usuario
            ]);

        })->name($rol);
    }

    Route::post('/administrador/usuarios', [
        AdminUsuarioController::class,
        'guardar'
    ])->name('administrador.usuarios.guardar');

    Route::patch(
        '/administrador/usuarios/{usuario}/estado',
        [
            AdminUsuarioController::class,
            'cambiarEstado'
        ]
    )->name('administrador.usuarios.estado');

});
