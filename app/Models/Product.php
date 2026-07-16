<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Product extends Model
{
    protected $fillable = [
        'slug', 'name', 'category', 'brand', 'price',
        'price_change', 'trend', 'unit', 'specs', 'description',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'specs' => 'array',
            'price' => 'decimal:2',
            'is_published' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Product $product) {
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->name);
            }
        });
    }

    public function media()
    {
        return $this->belongsToMany(Media::class, 'product_media')
            ->withPivot('type', 'order')
            ->withTimestamps()
            ->orderByPivot('order');
    }

    public function mainImage()
    {
        return $this->belongsToMany(Media::class, 'product_media')
            ->withPivot('type', 'order')
            ->wherePivot('type', 'main');
    }

    public function galleryImages()
    {
        return $this->belongsToMany(Media::class, 'product_media')
            ->withPivot('type', 'order')
            ->wherePivot('type', 'gallery')
            ->orderByPivot('order');
    }
}
