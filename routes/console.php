<?php

use App\Models\Setting;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Scheduled daily digest: an independent price-alert trigger (separate from the
// instant "on price change" push). When its toggle is on, once a day at the
// configured time it alerts about every price that changed since the last run.
Schedule::call(function () {
    if (Setting::get('push_alert_scheduled', '0') === '1'
        && Setting::get('push_alert_time', '18:00') === now()->format('H:i')) {
        app(App\Services\PriceAlertNotifier::class)->flushScheduled();
    }
})->everyMinute()->name('price-alerts-scheduled')->withoutOverlapping();
