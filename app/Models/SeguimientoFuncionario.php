<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SeguimientoFuncionario extends Model
{
    protected $table = 'seguimientos_funcionario';

    protected $fillable = [
        'emprendedor_id',
        'funcionario_id',
        'fecha',
        'tipo',
        'estado',
        'observaciones',
    ];

    protected function casts(): array
    {
        return ['fecha' => 'date'];
    }

    public function emprendedor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'emprendedor_id');
    }

    public function funcionario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'funcionario_id');
    }
}
