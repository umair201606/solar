<?php

namespace App\Http\Controllers;

use App\Models\ProductLead;
use App\Models\StoreEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Store KPIs for the admin dashboard: what visitors filter/search,
 * which products they view and which they call about on WhatsApp.
 */
class AnalyticsController extends Controller
{
    public function store(Request $request)
    {
        $days = min(max($request->integer('days', 30), 1), 365);
        $since = now()->subDays($days)->startOfDay();

        $events = StoreEvent::query()->where('created_at', '>=', $since);

        $totals = [
            'product_views' => (clone $events)->where('type', 'product_view')->count(),
            'whatsapp_clicks' => (clone $events)->where('type', 'whatsapp_click')->count(),
            'call_clicks' => (clone $events)->where('type', 'call_click')->count(),
            'searches' => (clone $events)->where('type', 'search')->count(),
            'filter_uses' => (clone $events)->where('type', 'filter')->count(),
            'leads_total' => ProductLead::query()->where('created_at', '>=', $since)->count(),
        ];

        // Same window immediately before, for "vs previous period" chips.
        $prevSince = now()->subDays($days * 2)->startOfDay();
        $prevEvents = StoreEvent::query()
            ->where('created_at', '>=', $prevSince)
            ->where('created_at', '<', $since);

        $prevTotals = [
            'product_views' => (clone $prevEvents)->where('type', 'product_view')->count(),
            'whatsapp_clicks' => (clone $prevEvents)->where('type', 'whatsapp_click')->count(),
            'call_clicks' => (clone $prevEvents)->where('type', 'call_click')->count(),
            'searches' => (clone $prevEvents)->where('type', 'search')->count(),
            'filter_uses' => (clone $prevEvents)->where('type', 'filter')->count(),
            'leads_total' => ProductLead::query()
                ->where('created_at', '>=', $prevSince)->where('created_at', '<', $since)->count(),
        ];

        $metaCounts = function (string $type, string $key) use ($since) {
            return StoreEvent::query()
                ->where('created_at', '>=', $since)
                ->where('type', $type)
                ->whereNotNull('meta->'.$key)
                ->select(DB::raw("json_extract(meta, '$.\"{$key}\"') as value"), DB::raw('count(*) as n'))
                ->groupBy('value')
                ->orderByDesc('n')
                ->limit(10)
                ->get()
                ->map(fn ($r) => ['value' => trim((string) $r->value, '"'), 'count' => (int) $r->n]);
        };

        $topProducts = function (array $types) use ($since) {
            return StoreEvent::query()
                ->where('store_events.created_at', '>=', $since)
                ->whereIn('type', $types)
                ->whereNotNull('product_id')
                ->join('products', 'products.id', '=', 'store_events.product_id')
                ->select('products.id', 'products.name', 'products.brand', 'products.category', DB::raw('count(*) as n'))
                ->groupBy('products.id', 'products.name', 'products.brand', 'products.category')
                ->orderByDesc('n')
                ->limit(10)
                ->get();
        };

        $daily = StoreEvent::query()
            ->where('created_at', '>=', $since)
            ->whereIn('type', ['product_view', 'whatsapp_click', 'call_click'])
            ->select(DB::raw('date(created_at) as day'), 'type', DB::raw('count(*) as n'))
            ->groupBy('day', 'type')
            ->orderBy('day')
            ->get()
            ->groupBy('day')
            ->map(fn ($rows, $day) => [
                'day' => $day,
                'views' => (int) ($rows->firstWhere('type', 'product_view')->n ?? 0),
                'calls' => (int) ($rows->firstWhere('type', 'whatsapp_click')->n ?? 0)
                    + (int) ($rows->firstWhere('type', 'call_click')->n ?? 0),
            ])->values();

        return response()->json([
            'days' => $days,
            'totals' => $totals,
            'prev_totals' => $prevTotals,
            'top_filtered_brands' => $metaCounts('filter', 'brand'),
            'top_filtered_categories' => $metaCounts('filter', 'category'),
            'top_searches' => $metaCounts('search', 'q'),
            'top_viewed_products' => $topProducts(['product_view']),
            'top_called_products' => $topProducts(['whatsapp_click', 'call_click']),
            'daily' => $daily,
        ]);
    }
}
