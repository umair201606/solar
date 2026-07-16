<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Media;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        return response()->json(Product::with('media')->latest()->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:products',
            'category' => 'required|string|max:255',
            'brand' => 'nullable|string|max:255',
            'price' => 'nullable|numeric',
            'price_change' => 'nullable|string|max:255',
            'trend' => 'nullable|in:up,down,stable',
            'unit' => 'nullable|string|max:255',
            'specs' => 'nullable|array',
            'description' => 'nullable|string',
            'is_published' => 'boolean',
            'main_image_id' => 'nullable|exists:media,id',
            'gallery_ids' => 'nullable|array',
            'gallery_ids.*' => 'exists:media,id',
        ]);

        $product = Product::create($data);

        if (!empty($data['main_image_id'])) {
            $product->media()->attach($data['main_image_id'], ['type' => 'main', 'order' => 0]);
        }

        if (!empty($data['gallery_ids'])) {
            foreach ($data['gallery_ids'] as $i => $id) {
                $product->media()->attach($id, ['type' => 'gallery', 'order' => $i]);
            }
        }

        return response()->json($product->load('media'), 201);
    }

    public function show(Product $product)
    {
        return response()->json($product->load('media'));
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:products,slug,' . $product->id,
            'category' => 'required|string|max:255',
            'brand' => 'nullable|string|max:255',
            'price' => 'nullable|numeric',
            'price_change' => 'nullable|string|max:255',
            'trend' => 'nullable|in:up,down,stable',
            'unit' => 'nullable|string|max:255',
            'specs' => 'nullable|array',
            'description' => 'nullable|string',
            'is_published' => 'boolean',
            'main_image_id' => 'nullable|exists:media,id',
            'gallery_ids' => 'nullable|array',
            'gallery_ids.*' => 'exists:media,id',
        ]);

        $product->update($data);

        $product->media()->detach();
        if (!empty($data['main_image_id'])) {
            $product->media()->attach($data['main_image_id'], ['type' => 'main', 'order' => 0]);
        }
        if (!empty($data['gallery_ids'])) {
            foreach ($data['gallery_ids'] as $i => $id) {
                $product->media()->attach($id, ['type' => 'gallery', 'order' => $i]);
            }
        }

        return response()->json($product->load('media'));
    }

    public function destroy(Product $product)
    {
        $product->media()->detach();
        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }
}
