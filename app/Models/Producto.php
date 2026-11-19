<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Producto extends Model
{
    protected $table = 'productos';

    protected $fillable = [
        'user_id',
        'codigo',
        'nombre',
        'categoria',
        'compra',
        'venta',
        'stock',
    ];

    protected function casts(): array
    {
        return [
            'compra' => 'decimal:2',
            'venta' => 'decimal:2',
            'stock' => 'integer',
        ];
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
