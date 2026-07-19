<?php

namespace App\Services;

use App\Models\PriceAlertSubscription;
use App\Models\Product;

/**
 * Core price-alert logic, shared by the automatic job and the admin
 * "Send now" button so both report the same result counts.
 */
class PriceAlertNotifier
{
    public function __construct(private WebPushSender $sender)
    {
    }

    /**
     * Push a "prices changed — visit the store" alert to every subscriber whose
     * filters match at least one product flagged price_alert_dirty, then clear
     * the flags. Returns ['products' => n, 'recipients' => n, 'sent' => n].
     */
    public function flushPending(): array
    {
        $result = ['products' => 0, 'recipients' => 0, 'sent' => 0];

        if (! WebPushSender::configured()) {
            return $result;
        }

        $dirty = Product::where('price_alert_dirty', true)
            ->where('is_published', true)
            ->get();

        // Clear every dirty flag (incl. unpublished) so they don't accumulate.
        Product::where('price_alert_dirty', true)->update(['price_alert_dirty' => false]);

        if ($dirty->isEmpty()) {
            return $result;
        }

        $result['products'] = $dirty->count();

        $recipients = PriceAlertSubscription::where('is_active', true)->get()
            ->filter(fn (PriceAlertSubscription $sub) => $dirty->contains(fn (Product $p) => $sub->matches($p)))
            ->values();

        $result['recipients'] = $recipients->count();

        if ($recipients->isEmpty()) {
            return $result;
        }

        $count = $dirty->count();
        $result['sent'] = $this->sender->send($recipients, [
            'title' => 'Solarkon — prices updated',
            'body' => $count === 1
                ? 'A product you\'re watching just changed price. Tap to see the latest.'
                : "Prices changed on {$count} products matching your alerts. Tap to view.",
            'url' => config('webpush.default_url', '/store'),
            'icon' => config('webpush.icon'),
            'badge' => config('webpush.badge'),
            'tag' => 'solarkon-price-alert',
        ]);

        PriceAlertSubscription::whereIn('id', $recipients->pluck('id'))
            ->update(['last_notified_at' => now()]);

        return $result;
    }

    /** Send an ad-hoc message to every active subscriber, ignoring filters. */
    public function broadcast(string $title, string $body, ?string $url = null): array
    {
        if (! WebPushSender::configured()) {
            return ['recipients' => 0, 'sent' => 0];
        }

        $recipients = PriceAlertSubscription::where('is_active', true)->get();

        $sent = $this->sender->send($recipients, [
            'title' => $title,
            'body' => $body,
            'url' => $url ?: config('webpush.default_url', '/store'),
            'icon' => config('webpush.icon'),
            'badge' => config('webpush.badge'),
            'tag' => 'solarkon-announcement',
        ]);

        if ($recipients->isNotEmpty()) {
            PriceAlertSubscription::whereIn('id', $recipients->pluck('id'))
                ->update(['last_notified_at' => now()]);
        }

        return ['recipients' => $recipients->count(), 'sent' => $sent];
    }
}
