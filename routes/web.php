
<?php

use Illuminate\Support\Facades\Route;

// Página de inicio
Route::get('/', function () {
    return view('welcome');
})->name('inicio');

// Página de cursos disponibles
Route::get('/cursos', function () {
    return view('cursos');
})->name('cursos');

// Página para iniciar sesión
Route::get('/login', function () {
    return view('acceso');
})->name('login');

// Página para crear cuenta
Route::get('/registro', function () {
    return view('acceso');
})->name('registro');

// Página general de acceso
Route::get('/acceso', function () {
    return view('acceso');
})->name('acceso');
