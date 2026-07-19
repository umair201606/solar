<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Brand;
use App\Models\PriceAlertSubscription;
use App\Models\Product;
use App\Models\Setting;
use App\Services\PriceAlertNotifier;
use App\Services\WebPushSender;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * Public endpoints for store visitors to opt into price-change web pushes and
 * choose which products they care about (same filters as the store listing).
 */
class PriceAlertController extends Controller
{
    /** Public VAPID key + the filter options the store offers, for the opt-in UI. */
    public function config()
    {
        return response()->json([
            'enabled' => WebPushSender::configured(),
            'public_key' => config('webpush.vapid.public_key'),
            'categories' => Category::orderBy('sort_order')->pluck('name'),
            'brands' => Brand::orderBy('name')->pluck('name'),
        ]);
    }

    public function subscribe(Request $request)
    {
        if (! WebPushSender::configured()) {
            return response()->json(['message' => 'Push notifications are not configured.'], 503);
        }

        $data = $request->validate([
            'endpoint' => 'required|string',
            'keys.p256dh' => 'required|string',
            'keys.auth' => 'required|string',
            'contentEncoding' => 'nullable|string',
            'filters' => 'nullable|array',
            'filters.categories' => 'nullable|array',
            'filters.categories.*' => 'string',
            'filters.brands' => 'nullable|array',
            'filters.brands.*' => 'string',
            'filters.phase' => ['nullable', Rule::in(['All', 'Single Phase', 'Three Phase'])],
            'filters.kw_min' => 'nullable|numeric|min:0',
            'filters.kw_max' => 'nullable|numeric|min:0',
            'filters.price_min' => 'nullable|numeric|min:0',
            'filters.price_max' => 'nullable|numeric|min:0',
        ]);

        // Upsert on the endpoint so re-subscribing just refreshes filters/keys.
        $subscription = PriceAlertSubscription::updateOrCreate(
            ['endpoint_hash' => hash('sha256', $data['endpoint'])],
            [
                'endpoint' => $data['endpoint'],
                'public_key' => $data['keys']['p256dh'],
                'auth_token' => $data['keys']['auth'],
                'content_encoding' => $data['contentEncoding'] ?? 'aes128gcm',
                'filters' => $this->normaliseFilters($data['filters'] ?? []),
                'is_active' => true,
                'user_agent' => substr((string) $request->userAgent(), 0, 255),
            ],
        );

        return response()->json(['ok' => true, 'id' => $subscription->id]);
    }

    public function unsubscribe(Request $request)
    {
        $data = $request->validate(['endpoint' => 'required|string']);

        PriceAlertSubscription::where('endpoint_hash', hash('sha256', $data['endpoint']))
            ->update(['is_active' => false]);

        return response()->json(['ok' => true]);
    }

    // ------------------------------------------------------------------
    // Admin (auth) — schedule settings, subscriber stats, manual send.
    // ------------------------------------------------------------------

    /** Push settings, subscriber count, and how many price changes are pending. */
    public function adminIndex()
    {
        return response()->json([
            'configured' => WebPushSender::configured(),
            'on_change' => Setting::get('push_alert_on_change', '1') === '1',
            'scheduled' => Setting::get('push_alert_scheduled', '0') === '1',
            'time' => Setting::get('push_alert_time', '18:00'),
            'subscribers' => PriceAlertSubscription::where('is_active', true)->count(),
            'pending' => Product::where('price_alert_dirty', true)->where('is_published', true)->count(),
            'last_sent_at' => optional(
                PriceAlertSubscription::whereNotNull('last_notified_at')->max('last_notified_at')
            ),
        ]);
    }

    /**
     * Two independent triggers, each on/off:
     *  - on_change: push instantly whenever a price changes
     *  - scheduled: push a daily digest at `time`
     * Both can be on at once, both off, or either one.
     */
    public function adminUpdate(Request $request)
    {
        $data = $request->validate([
            'on_change' => ['required', 'boolean'],
            'scheduled' => ['required', 'boolean'],
            'time' => ['nullable', 'date_format:H:i'],
        ]);

        Setting::set('push_alert_on_change', $data['on_change'] ? '1' : '0');
        Setting::set('push_alert_scheduled', $data['scheduled'] ? '1' : '0');
        if (! empty($data['time'])) {
            Setting::set('push_alert_time', $data['time']);
        }

        return response()->json(['ok' => true]);
    }

    /**
     * Push now. `pending` sends the accumulated price changes; `broadcast`
     * sends a custom one-off message to every subscriber.
     */
    public function adminSend(Request $request, PriceAlertNotifier $notifier)
    {
        if (! WebPushSender::configured()) {
            return response()->json(['message' => 'Push notifications are not configured.'], 503);
        }

        $data = $request->validate([
            'type' => ['nullable', Rule::in(['pending', 'broadcast'])],
            'title' => 'required_if:type,broadcast|nullable|string|max:80',
            'body' => 'required_if:type,broadcast|nullable|string|max:180',
            'url' => 'nullable|string|max:255',
        ]);

        $result = ($data['type'] ?? 'pending') === 'broadcast'
            ? $notifier->broadcast($data['title'], $data['body'], $data['url'] ?? null)
            : $notifier->flushPending();

        return response()->json(['ok' => true] + $result);
    }

    /** Drop empty/"All" values so matching treats missing dimensions as "any". */
    private function normaliseFilters(array $filters): array
    {
        $clean = [];

        foreach (['categories', 'brands'] as $key) {
            $values = array_values(array_filter(array_map('trim', (array) ($filters[$key] ?? []))));
            if ($values) {
                $clean[$key] = $values;
            }
        }

        if (! empty($filters['phase']) && $filters['phase'] !== 'All') {
            $clean['phase'] = $filters['phase'];
        }

        foreach (['kw_min', 'kw_max', 'price_min', 'price_max'] as $key) {
            if (isset($filters[$key]) && $filters[$key] !== '' && $filters[$key] !== null) {
                $clean[$key] = (float) $filters[$key];
            }
        }

        return $clean;
    }
}
