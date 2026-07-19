<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CrmProject extends Model
{
    public const STATUSES = ['starting-soon', 'in-progress', 'delayed', 'called-off', 'completed'];

    /** Statuses that count as "continuing" work in dashboards. */
    public const CONTINUING = ['in-progress', 'delayed'];

    protected $fillable = [
        'client_id', 'title', 'status', 'description', 'location',
        'start_date', 'expected_end_date', 'ticker',
    ];

    protected $appends = ['total_progress'];

    protected function casts(): array
    {
        return [
            'ticker' => 'array',
            'start_date' => 'date:Y-m-d',
            'expected_end_date' => 'date:Y-m-d',
        ];
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function stages()
    {
        return $this->hasMany(CrmProjectStage::class)->orderBy('sort_order');
    }

    /**
     * Overall completion: each stage contributes its weight share of the
     * total, so a 20%-weight stage at 50% progress adds 10% overall.
     */
    public function getTotalProgressAttribute(): int
    {
        $stages = $this->relationLoaded('stages') ? $this->stages : $this->stages()->get();
        $totalWeight = $stages->sum('weight');

        if ($totalWeight <= 0) {
            return $this->status === 'completed' ? 100 : 0;
        }

        $weighted = $stages->sum(fn ($s) => $s->weight * min($s->progress, 100));

        return (int) round($weighted / $totalWeight);
    }
}
