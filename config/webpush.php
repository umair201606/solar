<?php

return [
    /*
    |--------------------------------------------------------------------------
    | VAPID keys
    |--------------------------------------------------------------------------
    | Identify this application server to the browser push services. Generate a
    | pair with `php artisan webpush:vapid` and paste them into your .env. The
    | public key is also exposed to the browser so it can create subscriptions.
    */
    'vapid' => [
        'subject' => env('VAPID_SUBJECT', env('APP_URL', 'https://solarkon.com')),
        'public_key' => env('VAPID_PUBLIC_KEY'),
        'private_key' => env('VAPID_PRIVATE_KEY'),
    ],

    // Where the "visit the store" notification sends people.
    'default_url' => env('VAPID_DEFAULT_URL', '/store'),

    // Small icon/badge shown in the notification (served from /public).
    'icon' => '/brand-logos/android-chrome-192x192.png',
    'badge' => '/favicon.ico',
];
