<?php

namespace App\Services;

use App\Models\PriceAlertSubscription;
use App\Models\Product;
use App\Models\Setting;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

/**
 * Core price-alert logic. The two triggers are independent:
 *  - flushPending()   — the instant "on price change" path; consumes the
 *                       price_alert_dirty flag.
 *  - flushScheduled() — the daily digest; reads price_changed_at against its
 *                       own watermark, so it fires even if instant already sent.
 */
class PriceAlertNotifier
{
    public function __construct(private WebPushSender $sender)
    {
    }

    /** Instant path: alert on products flagged dirty, then clear the flags. */
    public function flushPending(): array
    {
        if (! WebPushSender::configured()) {
            return $this->empty();
        }

        $changed = Product::where('price_alert_dirty', true)
            ->where('is_published', true)
            ->get();

        // Clear every dirty flag (incl. unpublished) so they don't accumulate.
        Product::where('price_alert_dirty', true)->update(['price_alert_dirty' => false]);

        return $this->notify($changed);
    }

    /**
     * Scheduled path: alert on products whose price changed since the last
     * scheduled run, then advance the watermark. Independent of the dirty flag.
     */
    public function flushScheduled(): array
    {
        if (! WebPushSender::configured()) {
            return $this->empty();
        }

        $since = ($raw = Setting::get('push_alert_scheduled_since'))
            ? Carbon::parse($raw)
            : now()->subDay();
        $now = now();

        $changed = Product::where('is_published', true)
            ->whereNotNull('price_changed_at')
            ->where('price_changed_at', '>', $since)
            ->get();

        // Advance the watermark whether or not anything matched.
        Setting::set('push_alert_scheduled_since', $now->toDateTimeString());

        return $this->notify($changed);
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

        $this->touch($recipients);

        return ['recipients' => $recipients->count(), 'sent' => $sent];
    }

    /**
     * Push the "prices changed — visit the store" alert to every subscriber
     * whose filters match at least one of the changed products.
     *
     * @param  Collection<int,Product>  $changed
     */
    private function notify(Collection $changed): array
    {
        if ($changed->isEmpty()) {
            return $this->empty();
        }

        $recipients = PriceAlertSubscription::where('is_active', true)->get()
            ->filter(fn (PriceAlertSubscription $sub) => $changed->contains(fn (Product $p) => $sub->matches($p)))
            ->values();

        $result = ['products' => $changed->count(), 'recipients' => $recipients->count(), 'sent' => 0];

        if ($recipients->isEmpty()) {
            return $result;
        }

        $count = $changed->count();
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

        $this->touch($recipients);

        return $result;
    }

    private function touch(Collection $recipients): void
    {
        if ($recipients->isNotEmpty()) {
            PriceAlertSubscription::whereIn('id', $recipients->pluck('id'))
                ->update(['last_notified_at' => now()]);
        }
    }

    private function empty(): array
    {
        return ['products' => 0, 'recipients' => 0, 'sent' => 0];
    }
}
