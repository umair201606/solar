<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Project extends Model
{
    protected $fillable = [
        'slug', 'title', 'detail_title', 'location', 'description',
        'completion_date', 'capacity', 'unit', 'img', 'tags',
        'overview', 'objectives', 'objectives_list', 'results', 'delivered',
        'impact', 'gallery',
        'testimonial_quote', 'testimonial_name', 'testimonial_role', 'testimonial_img',
        'is_published', 'order',
    ];

    protected function casts(): array
    {
        return [
            'tags' => 'array',
            'objectives_list' => 'array',
            'results' => 'array',
            'delivered' => 'array',
            'gallery' => 'array',
            'is_published' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Project $project) {
            if (empty($project->slug)) {
                $project->slug = Str::slug($project->title);
            }
        });
    }

    /**
     * Shape a project into the exact structure the public frontend expects
     * (matches the old projectsData.js objects, icons resolved client-side).
     */
    public function toFrontend(): array
    {
        return [
            'slug' => $this->slug,
            'img' => $this->img,
            'title' => $this->title,
            'detailTitle' => $this->detail_title,
            'loc' => $this->location,
            'desc' => $this->description,
            'completionDate' => $this->completion_date,
            'tags' => $this->tags ?? [],
            'overview' => $this->overview,
            'objectives' => $this->objectives,
            'objectivesList' => $this->objectives_list ?? [],
            'results' => $this->results ?? [],
            'delivered' => $this->delivered ?? [],
            'impact' => $this->impact,
            'gallery' => $this->gallery ?? [],
            'testimonial' => [
                'quote' => $this->testimonial_quote,
                'name' => $this->testimonial_name,
                'role' => $this->testimonial_role,
                'img' => $this->testimonial_img,
            ],
        ];
    }
}
