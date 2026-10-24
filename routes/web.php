
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminUsuarioController;
use App\Models\User;

Route::get('/', function () {
    return view('welcome');
})->name('inicio');

Route::get('/cursos', function () {
    return view('cursos');
})->name('cursos');

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
])->middleware('guest')->name('login.procesar');

Route::post('/registro', [
    AuthController::class,
    'registrar'
])->middleware('guest')->name('registro.procesar');

Route::post('/logout', [
    AuthController::class,
    'cerrarSesion'
])->middleware('auth')->name('logout');

Route::middleware('auth')->group(function () {

    foreach ([
        'administrador',
        'funcionario',
        'coordinador',
        'instructor',
        'emprendedor'
    ] as $rol) {

        Route::get("/{$rol}", function () use ($rol) {

            abort_unless(auth()->user()->activo, 403);

            abort_unless(
                auth()->user()->rol === $rol,
                403
            );

            if ($rol === 'administrador') {
                return view('administrador', [
                    'usuariosReales' => User::orderBy('name')->get()
                ]);
            }

            return view($rol);

        })->name($rol);
    }

    Route::post('/administrador/usuarios', [
        AdminUsuarioController::class,
        'guardar'
    ])->name('administrador.usuarios.guardar');

    Route::patch('/administrador/usuarios/{usuario}/estado', [
        AdminUsuarioController::class,
        'cambiarEstado'
    ])->name('administrador.usuarios.estado');

});
