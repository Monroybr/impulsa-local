<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Inscripcion extends Model
{
    // Nombre real de la tabla en SQLite
    protected $table = 'inscripciones';

    protected $fillable = [
        'programa_id',
        'emprendedor_id',
        'progreso',
        'estado',
        'fecha_inscripcion',
    ];

    protected function casts(): array
    {
        return [
            'progreso' => 'integer',
            'fecha_inscripcion' => 'datetime',
        ];
    }

    public function programa(): BelongsTo
    {
        return $this->belongsTo(
            Programa::class,
            'programa_id'
        );
    }

    public function emprendedor(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'emprendedor_id'
        );
    }

    public function reportes(): HasMany
    {
        return $this->hasMany(
            ReporteAvance::class,
            'inscripcion_id'
        );
    }

    public function observaciones(): HasMany
    {
        return $this->hasMany(
            ObservacionInstructor::class,
            'inscripcion_id'
        );
    }
}
