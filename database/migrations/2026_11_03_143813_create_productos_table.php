
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('productos', function (Blueprint $table) {
            $table->id();

            // Emprendedor propietario del producto
            $table->foreignId('user_id')
                ->constrained('users')
                ->restrictOnDelete();

            $table->string('codigo', 30);
            $table->string('nombre', 100);
            $table->string('categoria', 100);

            $table->decimal('compra', 12, 2);
            $table->decimal('venta', 12, 2);

            $table->unsignedInteger('stock')->default(0);

            $table->timestamps();

            // El código debe ser único para cada emprendedor.
            $table->unique(['user_id', 'codigo']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};
