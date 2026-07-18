<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

/**
 * Admin management of categories and brands. Renames cascade to the
 * denormalized strings on products.
 */
class CatalogController extends Controller
{
    public function index()
    {
        $categoryCounts = Product::query()->selectRaw('category, count(*) as n')
            ->groupBy('category')->pluck('n', 'category');
        $brandCounts = Product::query()->selectRaw('brand, count(*) as n')
            ->groupBy('brand')->pluck('n', 'brand');

        return response()->json([
            'categories' => Category::orderBy('sort_order')->get()
                ->map(fn ($c) => $c->toArray() + ['products_count' => $categoryCounts[$c->name] ?? 0]),
            'brands' => Brand::orderBy('name')->get()
                ->map(fn ($b) => $b->toArray() + ['products_count' => $brandCounts[$b->name] ?? 0]),
        ]);
    }

    public function storeCategory(Request $request)
    {
        $data = $request->validate(['name' => 'required|string|max:255|unique:categories,name']);
        $max = (int) Category::max('sort_order');

        return response()->json(Category::create($data + ['sort_order' => $max + 1]), 201);
    }

    public function updateCategory(Request $request, Category $category)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,'.$category->id,
            'sort_order' => 'nullable|integer',
        ]);

        if ($data['name'] !== $category->name) {
            Product::query()->where('category', $category->name)->update(['category' => $data['name']]);
        }
        $category->update($data);

        return response()->json($category);
    }

    public function destroyCategory(Category $category)
    {
        $inUse = Product::query()->where('category', $category->name)->count();
        if ($inUse > 0) {
            return response()->json(['message' => "Category is used by {$inUse} product(s). Move them first."], 422);
        }
        $category->delete();

        return response()->json(['message' => 'Category deleted']);
    }

    public function storeBrand(Request $request)
    {
        $data = $request->validate(['name' => 'required|string|max:255|unique:brands,name']);

        return response()->json(Brand::create($data), 201);
    }

    public function updateBrand(Request $request, Brand $brand)
    {
        $data = $request->validate(['name' => 'required|string|max:255|unique:brands,name,'.$brand->id]);

        if ($data['name'] !== $brand->name) {
            Product::query()->where('brand', $brand->name)->update(['brand' => $data['name']]);
        }
        $brand->update($data);

        return response()->json($brand);
    }

    public function destroyBrand(Brand $brand)
    {
        $inUse = Product::query()->where('brand', $brand->name)->count();
        if ($inUse > 0) {
            return response()->json(['message' => "Brand is used by {$inUse} product(s). Move them first."], 422);
        }
        $brand->delete();

        return response()->json(['message' => 'Brand deleted']);
    }
}
