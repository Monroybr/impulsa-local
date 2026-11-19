<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Programa extends Model
{
    protected $fillable = [
        'nombre',
        'tematica',
        'descripcion',
        'instructor_id',
        'duracion_semanas',
        'cupos',
        'fecha_inicio',
        'estado',
    ];

    protected function casts(): array
    {
        return [
            'duracion_semanas' => 'integer',
            'cupos' => 'integer',
            'fecha_inicio' => 'date',
        ];
    }

    public function instructor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function inscripciones(): HasMany
    {
        return $this->hasMany(Inscripcion::class);
    }
}
