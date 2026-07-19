<?php

namespace App\Http\Controllers;

use App\Models\ProductLead;
use Illuminate\Http\Request;

class LeadController extends Controller
{
    public function index(Request $request)
    {
        $query = ProductLead::query()
            ->with(['product' => fn ($q) => $q
                ->select('id', 'slug', 'name', 'category', 'brand', 'price')
                ->with('media')])
            ->latest();

        $channel = $request->string('channel')->toString();
        if (in_array($channel, ['whatsapp', 'call'], true)) {
            $query->where('channel', $channel);
        }
        if ($q = trim((string) $request->query('q'))) {
            $query->where(fn ($w) => $w
                ->where('product_name', 'like', "%{$q}%")
                ->orWhere('phone_used', 'like', "%{$q}%"));
        }
        if ($from = $request->date('from')) {
            $query->where('created_at', '>=', $from->startOfDay());
        }
        if ($to = $request->date('to')) {
            $query->where('created_at', '<=', $to->endOfDay());
        }

        $leads = $query->paginate($request->integer('per_page', 10))->appends($request->query());

        // Global stats, independent of the active filters.
        $stats = [
            'total' => ProductLead::count(),
            'whatsapp' => ProductLead::where('channel', 'whatsapp')->count(),
            'call' => ProductLead::where('channel', 'call')->count(),
            'today' => ProductLead::whereDate('created_at', today())->count(),
            'yesterday' => ProductLead::whereDate('created_at', today()->subDay())->count(),
        ];

        return response()->json(['leads' => $leads, 'stats' => $stats]);
    }

    public function destroy(ProductLead $lead)
    {
        $lead->delete();

        return response()->json(['message' => 'Lead deleted']);
    }
}
