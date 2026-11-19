<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ObservacionInstructor extends Model
{
    protected $table = 'observaciones_instructor';

    protected $fillable = [
        'inscripcion_id',
        'instructor_id',
        'fecha',
        'tipo',
        'comentario',
        'estado',
    ];

    protected function casts(): array
    {
        return ['fecha' => 'date'];
    }

    public function inscripcion(): BelongsTo
    {
        return $this->belongsTo(Inscripcion::class);
    }

    public function instructor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }
}
