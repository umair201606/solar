<?php

namespace App\Jobs;

use App\Models\Setting;
use App\Services\PriceAlertNotifier;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\Middleware\WithoutOverlapping;

/**
 * Flushes the instant "on price change" alerts (see PriceAlertNotifier).
 * Idempotent: with nothing dirty it does nothing, so it is safe to run after
 * each price edit/import.
 */
class SendPriceAlerts implements ShouldQueue
{
    use Queueable;

    public function middleware(): array
    {
        // Collapse a burst (e.g. a bulk import) into a single run.
        return [(new WithoutOverlapping('price-alerts'))->dontRelease()];
    }

    public function handle(PriceAlertNotifier $notifier): void
    {
        $notifier->flushPending();
    }

    /**
     * Called after a price change. Fires the instant alert only when the
     * "notify on price change" toggle is on; the scheduled digest is a separate,
     * independent trigger (see routes/console.php). Runs after the response, so
     * no queue worker is required.
     */
    public static function afterPriceChange(): void
    {
        if (Setting::get('push_alert_on_change', '1') === '1') {
            self::dispatchAfterResponse();
        }
    }
}
