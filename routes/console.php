<?php

use App\Jobs\SendPriceAlerts;
use App\Models\Setting;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// "Scheduled" push mode: once a day at the admin-configured time, send the
// batched price-change alerts. Runs every minute but only fires on the match.
Schedule::call(function () {
    if (Setting::get('push_alert_mode', 'immediate') === 'scheduled'
        && Setting::get('push_alert_time', '18:00') === now()->format('H:i')) {
        SendPriceAlerts::dispatchSync();
    }
})->everyMinute()->name('price-alerts-scheduled')->withoutOverlapping();
