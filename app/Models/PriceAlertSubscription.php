<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * A store visitor's request to be web-pushed when prices change on products
 * matching the filters they picked (mirrors the store's own filter controls).
 */
class PriceAlertSubscription extends Model
{
    protected $fillable = [
        'endpoint', 'endpoint_hash', 'public_key', 'auth_token',
        'content_encoding', 'filters', 'is_active', 'last_notified_at', 'user_agent',
    ];

    protected function casts(): array
    {
        return [
            'filters' => 'array',
            'is_active' => 'boolean',
            'last_notified_at' => 'datetime',
        ];
    }

    /**
     * Does this subscription's filter set cover the given product? An empty /
     * missing filter dimension means "any", so a subscriber with no filters
     * is alerted about every price change.
     */
    public function matches(Product $product): bool
    {
        $f = $this->filters ?? [];

        $categories = array_filter((array) ($f['categories'] ?? []));
        if ($categories && ! in_array($product->category, $categories, true)) {
            return false;
        }

        $brands = array_filter((array) ($f['brands'] ?? []));
        if ($brands && ! in_array($product->brand, $brands, true)) {
            return false;
        }

        $phase = $f['phase'] ?? null;
        if ($phase && $phase !== 'All' && $product->phase !== $phase) {
            return false;
        }

        $kw = $product->power_kw !== null ? (float) $product->power_kw : null;
        if (isset($f['kw_min']) && $f['kw_min'] !== null && ($kw === null || $kw < (float) $f['kw_min'])) {
            return false;
        }
        if (isset($f['kw_max']) && $f['kw_max'] !== null && ($kw === null || $kw > (float) $f['kw_max'])) {
            return false;
        }

        $price = $product->price !== null ? (float) $product->price : null;
        if (isset($f['price_min']) && $f['price_min'] !== null && ($price === null || $price < (float) $f['price_min'])) {
            return false;
        }
        if (isset($f['price_max']) && $f['price_max'] !== null && ($price === null || $price > (float) $f['price_max'])) {
            return false;
        }

        return true;
    }

    /** Shape the WebPush library expects for a subscription. */
    public function toPushArray(): array
    {
        return [
            'endpoint' => $this->endpoint,
            'publicKey' => $this->public_key,
            'authToken' => $this->auth_token,
            'contentEncoding' => $this->content_encoding,
        ];
    }
}
