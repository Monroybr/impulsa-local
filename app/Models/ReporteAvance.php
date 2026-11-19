<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReporteAvance extends Model
{
    protected $table = 'reportes_avance';

    protected $fillable = [
        'inscripcion_id',
        'fecha',
        'logros',
        'dificultades',
        'apoyo_solicitado',
    ];

    protected function casts(): array
    {
        return ['fecha' => 'date'];
    }

    public function inscripcion(): BelongsTo
    {
        return $this->belongsTo(Inscripcion::class);
    }
}
