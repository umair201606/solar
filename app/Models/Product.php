<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Product extends Model
{
    protected $fillable = [
        'slug', 'name', 'category', 'brand', 'price',
        'price_change', 'trend', 'unit', 'warranty', 'phase', 'power_kw',
        'whatsapp_number', 'specs', 'description', 'is_published',
    ];

    protected function casts(): array
    {
        return [
            'specs' => 'array',
            'price' => 'decimal:2',
            'power_kw' => 'decimal:2',
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

    public function priceHistories()
    {
        return $this->hasMany(ProductPriceHistory::class)->orderBy('recorded_on');
    }

    public function leads()
    {
        return $this->hasMany(ProductLead::class);
    }

    /**
     * Store a dated price point (upserts on the same date) and sync the
     * product's current price/trend from its full history.
     */
    public function recordPrice(float $price, ?string $date = null, string $source = 'manual'): void
    {
        $this->priceHistories()->updateOrCreate(
            ['recorded_on' => $date ?: now()->toDateString()],
            ['price' => $price, 'source' => $source],
        );
        $this->refreshTrend();
    }

    /**
     * Recompute current price, price_change and trend from history: the
     * latest point vs the most recent different price within the last
     * 30 days before it (so a drop stays visible while the new price
     * holds, instead of flattening to "stable" the next day).
     */
    public function refreshTrend(): void
    {
        $latestPoint = $this->priceHistories()->reorder('recorded_on', 'desc')->first();
        if (! $latestPoint) {
            return;
        }

        $latest = (float) $latestPoint->price;
        $updates = ['price' => $latest, 'trend' => 'stable', 'price_change' => null];

        $previous = $this->priceHistories()
            ->reorder('recorded_on', 'desc')
            ->where('recorded_on', '<', $latestPoint->recorded_on)
            ->where('recorded_on', '>=', $latestPoint->recorded_on->copy()->subDays(30))
            ->where('price', '!=', $latestPoint->price)
            ->first();

        if ($previous && (float) $previous->price > 0) {
            $pct = ($latest - (float) $previous->price) / (float) $previous->price * 100;
            $updates['trend'] = $pct > 0 ? 'up' : 'down';
            $updates['price_change'] = ($pct > 0 ? '+' : '').number_format($pct, 1).'%';
        }

        $this->forceFill($updates)->saveQuietly();
    }

    /** The WhatsApp number buyers should contact for this product. */
    public function contactNumber(): ?string
    {
        return $this->whatsapp_number ?: Setting::get('whatsapp_default_number');
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
