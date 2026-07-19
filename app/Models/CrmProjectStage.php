<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CrmProjectStage extends Model
{
    protected $fillable = ['crm_project_id', 'name', 'weight', 'progress', 'sort_order', 'note'];

    protected function casts(): array
    {
        return [
            'weight' => 'integer',
            'progress' => 'integer',
            'sort_order' => 'integer',
        ];
    }

    public function project()
    {
        return $this->belongsTo(CrmProject::class, 'crm_project_id');
    }
}
