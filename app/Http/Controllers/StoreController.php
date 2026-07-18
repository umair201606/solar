<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductLead;
use App\Models\Setting;
use App\Models\StoreEvent;
use App\Models\Brand;
use App\Models\Category;
use Illuminate\Http\Request;

/**
 * Public (visitor-facing) store endpoints.
 */
class StoreController extends Controller
{
    public function products()
    {
        $products = Product::query()
            ->where('is_published', true)
            ->with(['media', 'priceHistories'])
            ->orderBy('category')
            ->orderBy('brand')
            ->orderBy('power_kw')
            ->get()
            ->map(function (Product $product) {
                $main = $product->media->firstWhere('pivot.type', 'main');

                return [
                    'id' => $product->id,
                    'slug' => $product->slug,
                    'name' => $product->name,
                    'category' => $product->category,
                    'brand' => $product->brand,
                    'price' => $product->price !== null ? (float) $product->price : null,
                    'price_change' => $product->price_change,
                    'trend' => $product->trend,
                    'unit' => $product->unit,
                    'warranty' => $product->warranty,
                    'phase' => $product->phase,
                    'power_kw' => $product->power_kw !== null ? (float) $product->power_kw : null,
                    'specs' => $product->specs ?: [],
                    'description' => $product->description,
                    'image' => $main?->url,
                    'gallery' => $product->media
                        ->where('pivot.type', 'gallery')
                        ->map(fn ($m) => $m->url)->values(),
                    'history' => $product->priceHistories
                        ->map(fn ($h) => [$h->recorded_on->format('Y-m-d'), (float) $h->price])
                        ->values(),
                ];
            });

        return response()->json([
            'products' => $products,
            'categories' => Category::orderBy('sort_order')->pluck('name'),
            'brands' => Brand::orderBy('name')->pluck('name'),
            'defaults' => [
                'description' => Setting::get('default_product_description'),
                'image' => Setting::get('default_product_image'),
            ],
            'announcements' => array_values(array_filter(array_map(
                'trim',
                explode("\n", (string) Setting::get('store_announcements', ''))
            ))),
        ]);
    }

    /**
     * Visitor tapped "WhatsApp" or "Call" on a product: log the lead
     * (with the product link, so the admin panel shows which item the
     * enquiry was about) and hand back the link to open — wa.me with a
     * prefilled message, or tel: for a phone call. Uses the product's
     * own number when set, else the default from settings.
     */
    public function contactClick(Request $request, Product $product)
    {
        $channel = $request->input('channel') === 'call' ? 'call' : 'whatsapp';

        $number = $product->contactNumber();
        if (! $number) {
            return response()->json(['message' => 'No contact number configured.'], 422);
        }

        $url = $request->input('product_url') ?: url('/store?product='.$product->slug);

        ProductLead::create([
            'product_id' => $product->id,
            'product_name' => $product->name,
            'phone_used' => $number,
            'channel' => $channel,
            'product_url' => $url,
            'ip' => $request->ip(),
            'user_agent' => substr((string) $request->userAgent(), 0, 255),
            'referrer' => substr((string) $request->headers->get('referer'), 0, 255),
        ]);

        StoreEvent::create([
            'type' => $channel === 'call' ? 'call_click' : 'whatsapp_click',
            'product_id' => $product->id,
            'ip' => $request->ip(),
        ]);

        $intl = preg_replace('/\D/', '', $number);
        if (str_starts_with($intl, '0')) {
            $intl = '92'.substr($intl, 1); // PK local format -> international
        }

        $text = "Hi SEB Solar! I'm interested in: {$product->name}"
            .($product->price ? ' (Rs. '.number_format((float) $product->price).')' : '')
            ."\n{$url}";

        return response()->json([
            'wa_url' => 'https://wa.me/'.$intl.'?text='.rawurlencode($text),
            'tel_url' => 'tel:+'.$intl,
            'number' => $number,
        ]);
    }

    /** Lightweight behaviour tracking: filters, searches, product views. */
    public function track(Request $request)
    {
        $data = $request->validate([
            'type' => 'required|in:filter,search,product_view,call_click',
            'product_id' => 'nullable|exists:products,id',
            'meta' => 'nullable|array',
        ]);

        StoreEvent::create($data + ['ip' => $request->ip()]);

        return response()->json(['ok' => true]);
    }
}
