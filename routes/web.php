<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminUsuarioController;
use App\Http\Controllers\EmprendedorController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\VentaController;
use App\Http\Controllers\ProgramaController;
use App\Http\Controllers\ReporteAvanceController;
use App\Http\Controllers\InstructorController;
use App\Http\Controllers\FuncionarioController;
use App\Http\Controllers\CoordinadorController;

use App\Models\User;

// ==========================================
// PÁGINA PRINCIPAL
// ==========================================

Route::get('/', function () {
    return view('welcome');
})->name('inicio');

Route::get('/cursos', function () {
    return view('cursos');
})->name('cursos');

// ==========================================
// AUTENTICACIÓN
// ==========================================

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

// ==========================================
// CERRAR SESIÓN
// ==========================================

Route::post('/logout', [
    AuthController::class,
    'cerrarSesion'
])->middleware('auth')->name('logout');

// ==========================================
// USUARIOS AUTENTICADOS
// ==========================================

Route::middleware('auth')->group(function () {

    // PANEL DEL EMPRENDEDOR

    Route::get('/emprendedor', [
        EmprendedorController::class,
        'index'
    ])->name('emprendedor');

    Route::put('/emprendedor/perfil', [
        EmprendedorController::class,
        'actualizarPerfil'
    ])->name('emprendedor.perfil.actualizar');

    // PANELES SEGÚN ROL

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

                    'emprendedoresReales' => User::where('rol', 'emprendedor')
                        ->orderBy('name')
                        ->get(),

                    'usuarioActual' => $usuario
                ]);
            }

            return view($rol, [
                'usuarioActual' => $usuario
            ]);

        })->name($rol);
    }

    // ADMINISTRADOR: USUARIOS

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

    // EMPRENDEDOR: INVENTARIO

    Route::get('/emprendedor/productos', [
        ProductoController::class,
        'index'
    ])->name('emprendedor.productos.index');

    Route::post('/emprendedor/productos', [
        ProductoController::class,
        'store'
    ])->name('emprendedor.productos.store');

    Route::put('/emprendedor/productos/{producto}', [
        ProductoController::class,
        'update'
    ])->name('emprendedor.productos.update');

    Route::delete('/emprendedor/productos/{producto}', [
        ProductoController::class,
        'destroy'
    ])->name('emprendedor.productos.destroy');

    // EMPRENDEDOR: VENTAS

    Route::get('/emprendedor/ventas', [
        VentaController::class,
        'index'
    ])->name('emprendedor.ventas.index');

    Route::post('/emprendedor/ventas', [
        VentaController::class,
        'store'
    ])->name('emprendedor.ventas.store');

    // PROGRAMAS: ADMINISTRADOR Y COORDINADOR

    Route::get('/programas', [
        ProgramaController::class,
        'index'
    ])->name('programas.index');

    Route::get('/programas/instructores', [
        ProgramaController::class,
        'instructores'
    ])->name('programas.instructores');

    Route::post('/programas', [
        ProgramaController::class,
        'store'
    ])->name('programas.store');

    Route::put('/programas/{programa}', [
        ProgramaController::class,
        'update'
    ])->name('programas.update');

    // EMPRENDEDOR: PROGRAMAS E INSCRIPCIONES

    Route::get('/emprendedor/programas-disponibles', [
        EmprendedorController::class,
        'programasDisponibles'
    ])->name('emprendedor.programas.index');

    Route::get('/emprendedor/inscripciones', [
        EmprendedorController::class,
        'misInscripciones'
    ])->name('emprendedor.inscripciones.index');

    Route::post('/emprendedor/inscripciones', [
        EmprendedorController::class,
        'inscribirse'
    ])->name('emprendedor.inscripciones.store');

    // EMPRENDEDOR: REPORTES DE AVANCE EN SQLITE

    Route::get('/emprendedor/reportes-avance', [
        ReporteAvanceController::class,
        'index'
    ])->name('emprendedor.reportes.index');

    Route::post('/emprendedor/reportes-avance', [
        ReporteAvanceController::class,
        'store'
    ])->name('emprendedor.reportes.store');


    // ======================================
    // INSTRUCTOR: PROGRAMAS Y SEGUIMIENTO
    // ======================================

    Route::get('/instructor/programas', [
        InstructorController::class,
        'programas'
    ])->name('instructor.programas.index');

    Route::get('/instructor/programas/{programa}/participantes', [
        InstructorController::class,
        'participantes'
    ])->name('instructor.programas.participantes');

    Route::get('/instructor/inscripciones/{inscripcion}/reportes', [
        InstructorController::class,
        'reportes'
    ])->name('instructor.inscripciones.reportes');


    // ======================================
    // INSTRUCTOR: OBSERVACIONES
    // ======================================

    Route::get(
        '/instructor/inscripciones/{inscripcion}/observaciones',
        [
            InstructorController::class,
            'observaciones'
        ]
    )->name('instructor.inscripciones.observaciones');

    Route::post(
        '/instructor/inscripciones/{inscripcion}/observaciones',
        [
            InstructorController::class,
            'guardarObservacion'
        ]
    )->name('instructor.observaciones.store');


    // ======================================
    // INSTRUCTOR: ACTUALIZAR PROGRESO
    // ======================================

    Route::patch(
        '/instructor/inscripciones/{inscripcion}/progreso',
        [
            \App\Http\Controllers\InstructorController::class,
            'actualizarProgreso'
        ]
    )->name('instructor.inscripciones.progreso');


    // ==========================================
    // FUNCIONARIO - CONSULTAS SQLITE
    // ==========================================

    // Consultar todos los emprendedores
    Route::get(
        '/funcionario/emprendedores',
        [FuncionarioController::class, 'emprendedores']
    )->name('funcionario.emprendedores.index');

    // Consultar el detalle de un emprendedor
    Route::get(
        '/funcionario/emprendedores/{emprendedor}',
        [FuncionarioController::class, 'detalle']
    )->name('funcionario.emprendedores.detalle');

    // Registrar seguimiento institucional
    Route::post(
        '/funcionario/emprendedores/{emprendedor}/seguimientos',
        [FuncionarioController::class, 'guardarSeguimiento']
    )->name('funcionario.seguimientos.store');

    // ==========================================
    // COORDINADOR - CONSULTAS SQLITE
    // ==========================================

    Route::get(
        '/coordinador/resumen',
        [CoordinadorController::class, 'resumen']
    )->name('coordinador.resumen');


});
