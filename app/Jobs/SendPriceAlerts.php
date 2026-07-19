<?php

namespace App\Jobs;

use App\Models\Setting;
use App\Services\PriceAlertNotifier;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\Middleware\WithoutOverlapping;

/**
 * Flushes pending price-change alerts (see PriceAlertNotifier). Idempotent:
 * with nothing dirty it does nothing, so it is safe to run after each price
 * edit/import and on the schedule.
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
     * Called after a price change. In the default "immediate" mode the alert
     * goes out right away (after the response is sent, so no queue worker is
     * required); in "scheduled"/"manual" modes the change waits for the timed
     * run or the admin's Send-now button.
     */
    public static function afterPriceChange(): void
    {
        if (Setting::get('push_alert_mode', 'immediate') === 'immediate') {
            self::dispatchAfterResponse();
        }
    }
}
