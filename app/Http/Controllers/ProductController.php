<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    private const RULES = [
        'name' => 'required|string|max:255',
        'category' => 'required|string|max:255',
        'brand' => 'nullable|string|max:255',
        'price' => 'nullable|numeric|min:0',
        'internal_price' => 'nullable|numeric|min:0',
        'price_date' => 'nullable|date',
        'unit' => 'nullable|string|max:255',
        'warranty' => 'nullable|string|max:255',
        'phase' => 'nullable|in:Single Phase,Three Phase',
        'power_kw' => 'nullable|numeric|min:0',
        'whatsapp_number' => 'nullable|string|max:30',
        'specs' => 'nullable|array',
        'description' => 'nullable|string',
        'tagline' => 'nullable|string|max:255',
        'is_published' => 'boolean',
        'main_image_id' => 'nullable|exists:media,id',
        'gallery_ids' => 'nullable|array',
        'gallery_ids.*' => 'exists:media,id',
    ];

    public function index()
    {
        return response()->json(
            Product::with(['media', 'priceHistories:id,product_id,price,internal_price,recorded_on'])->latest()->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate(self::RULES + [
            'slug' => 'nullable|string|max:255|unique:products',
        ]);

        $product = Product::create(collect($data)->except(['price_date', 'main_image_id', 'gallery_ids'])->all());

        if ($data['price'] ?? null) {
            $product->recordPrice((float) $data['price'], $data['price_date'] ?? null, 'manual', isset($data['internal_price']) ? (float) $data['internal_price'] : null);
        }

        $this->syncMedia($product, $data);

        return response()->json($product->load('media'), 201);
    }

    public function show(Product $product)
    {
        $data = $product->load('media', 'priceHistories')->toArray();
        $data['category_default_image'] = (new StoreController)->categoryImage($product->category);

        return response()->json($data);
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate(self::RULES + [
            'slug' => 'nullable|string|max:255|unique:products,slug,'.$product->id,
        ]);

        $newPrice = isset($data['price']) ? (float) $data['price'] : null;
        $priceChanged = $newPrice !== null && (float) $product->price !== $newPrice;

        $product->update(collect($data)->except(['price_date', 'main_image_id', 'gallery_ids'])->all());

        if ($priceChanged) {
            $product->recordPrice($newPrice, $data['price_date'] ?? null, 'manual', isset($data['internal_price']) ? (float) $data['internal_price'] : null);
        }

        $product->media()->detach();
        $this->syncMedia($product, $data);

        return response()->json($product->load('media', 'priceHistories'));
    }

    public function destroy(Product $product)
    {
        $product->media()->detach();
        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }

    // ---- price history ----

    public function prices(Product $product)
    {
        return response()->json($product->priceHistories()->get());
    }

    public function addPrice(Request $request, Product $product)
    {
        $data = $request->validate([
            'price' => 'required|numeric|min:0',
            'internal_price' => 'nullable|numeric|min:0',
            'recorded_on' => 'nullable|date',
        ]);

        $product->recordPrice((float) $data['price'], $data['recorded_on'] ?? null, 'manual', isset($data['internal_price']) ? (float) $data['internal_price'] : null);

        return response()->json($product->priceHistories()->get(), 201);
    }

    public function updatePrice(Request $request, Product $product, int $priceId)
    {
        $data = $request->validate([
            'price' => 'required|numeric|min:0',
            'internal_price' => 'nullable|numeric|min:0',
            'recorded_on' => 'nullable|date',
        ]);

        $product->priceHistories()->whereKey($priceId)->update([
            'price' => $data['price'],
            'internal_price' => $data['internal_price'] ?? null,
            'recorded_on' => $data['recorded_on'] ?? now(),
        ]);

        $product->refreshTrend();

        return response()->json($product->priceHistories()->get());
    }

    public function deletePrice(Product $product, int $priceId)
    {
        $product->priceHistories()->whereKey($priceId)->delete();
        $product->refreshTrend();

        return response()->json($product->priceHistories()->get());
    }

    private function syncMedia(Product $product, array $data): void
    {
        if (! empty($data['main_image_id'])) {
            $product->media()->attach($data['main_image_id'], ['type' => 'main', 'order' => 0]);
        }
        if (! empty($data['gallery_ids'])) {
            foreach ($data['gallery_ids'] as $i => $id) {
                $product->media()->attach($id, ['type' => 'gallery', 'order' => $i]);
            }
        }
    }
}
