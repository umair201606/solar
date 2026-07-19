<?php

namespace App\Services;

use App\Models\PriceAlertSubscription;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Minishlink\WebPush\Subscription;
use Minishlink\WebPush\WebPush;

/**
 * Thin wrapper around minishlink/web-push: sends one JSON payload to a batch
 * of subscriptions and prunes any the push service reports as gone (410/404).
 */
class WebPushSender
{
    private WebPush $webPush;

    public function __construct()
    {
        $config = config('webpush.vapid');

        $this->webPush = new WebPush([
            'VAPID' => [
                'subject' => $config['subject'],
                'publicKey' => $config['public_key'],
                'privateKey' => $config['private_key'],
            ],
        ]);
        $this->webPush->setReuseVAPIDHeaders(true);
    }

    public static function configured(): bool
    {
        return filled(config('webpush.vapid.public_key'))
            && filled(config('webpush.vapid.private_key'));
    }

    /**
     * Queue the payload for every subscription, flush, then deactivate any
     * expired endpoints. Returns the number of successful deliveries.
     *
     * @param  Collection<int,PriceAlertSubscription>  $subscriptions
     */
    public function send(Collection $subscriptions, array $payload): int
    {
        if ($subscriptions->isEmpty()) {
            return 0;
        }

        $byEndpoint = $subscriptions->keyBy('endpoint');
        $json = json_encode($payload);

        foreach ($subscriptions as $sub) {
            $this->webPush->queueNotification(
                Subscription::create($sub->toPushArray()),
                $json,
            );
        }

        $sent = 0;
        $expired = [];

        foreach ($this->webPush->flush() as $report) {
            if ($report->isSuccess()) {
                $sent++;
                continue;
            }

            // 404/410 mean the browser dropped the subscription — stop trying it.
            if ($report->isSubscriptionExpired()) {
                if ($sub = $byEndpoint->get($report->getEndpoint())) {
                    $expired[] = $sub->id;
                }
            } else {
                Log::warning('Web push failed', [
                    'endpoint' => $report->getEndpoint(),
                    'reason' => $report->getReason(),
                ]);
            }
        }

        if ($expired) {
            PriceAlertSubscription::whereIn('id', $expired)->update(['is_active' => false]);
        }

        return $sent;
    }
}
