<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Ventas realizadas por los emprendedores
        Schema::create('ventas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->constrained('users')
                ->restrictOnDelete();

            $table->decimal('total', 14, 2)->default(0);
            $table->timestamp('fecha_venta');
            $table->timestamps();
        });

        // Productos incluidos en cada venta
        Schema::create('detalle_ventas', function (Blueprint $table) {
            $table->id();

            $table->foreignId('venta_id')
                ->constrained('ventas')
                ->cascadeOnDelete();

            $table->foreignId('producto_id')
                ->constrained('productos')
                ->restrictOnDelete();

            $table->string('nombre_producto', 100);
            $table->unsignedInteger('cantidad');
            $table->decimal('precio_unitario', 12, 2);
            $table->decimal('subtotal', 14, 2);
            $table->timestamps();
        });

        // Programas de formación
        Schema::create('programas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('tematica', 100);
            $table->text('descripcion')->nullable();

            $table->foreignId('instructor_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->unsignedInteger('duracion_semanas');
            $table->unsignedInteger('cupos');
            $table->date('fecha_inicio')->nullable();

            $table->string('estado', 20)->default('activo');
            $table->timestamps();
        });

        // Inscripciones de emprendedores
        Schema::create('inscripciones', function (Blueprint $table) {
            $table->id();

            $table->foreignId('programa_id')
                ->constrained('programas')
                ->restrictOnDelete();

            $table->foreignId('emprendedor_id')
                ->constrained('users')
                ->restrictOnDelete();

            $table->unsignedTinyInteger('progreso')->default(0);
            $table->string('estado', 30)->default('inscrito');
            $table->timestamp('fecha_inscripcion');
            $table->timestamps();

            $table->unique(['programa_id', 'emprendedor_id']);
        });

        // Reportes de avance del emprendedor
        Schema::create('reportes_avance', function (Blueprint $table) {
            $table->id();

            $table->foreignId('inscripcion_id')
                ->constrained('inscripciones')
                ->cascadeOnDelete();

            $table->date('fecha');
            $table->text('logros');
            $table->text('dificultades')->nullable();
            $table->text('apoyo_solicitado')->nullable();
            $table->timestamps();
        });

        // Observaciones realizadas por instructores
        Schema::create('observaciones_instructor', function (Blueprint $table) {
            $table->id();

            $table->foreignId('inscripcion_id')
                ->constrained('inscripciones')
                ->cascadeOnDelete();

            $table->foreignId('instructor_id')
                ->constrained('users')
                ->restrictOnDelete();

            $table->date('fecha');
            $table->string('tipo', 40);
            $table->text('comentario');
            $table->string('estado', 40)->default('pendiente');
            $table->timestamps();
        });

        // Seguimientos institucionales
        Schema::create('seguimientos_funcionario', function (Blueprint $table) {
            $table->id();

            $table->foreignId('emprendedor_id')
                ->constrained('users')
                ->restrictOnDelete();

            $table->foreignId('funcionario_id')
                ->constrained('users')
                ->restrictOnDelete();

            $table->date('fecha');
            $table->string('tipo', 40);
            $table->string('estado', 40);
            $table->text('observaciones');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seguimientos_funcionario');
        Schema::dropIfExists('observaciones_instructor');
        Schema::dropIfExists('reportes_avance');
        Schema::dropIfExists('inscripciones');
        Schema::dropIfExists('programas');
        Schema::dropIfExists('detalle_ventas');
        Schema::dropIfExists('ventas');
    }
};
