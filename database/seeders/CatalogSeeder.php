<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Lithium Batteries',
            'Solar Panels',
            'On-Grid Inverters',
            'Off-Grid Inverters',
            'Hybrid Inverters',
            'Accessories',
        ];
        foreach ($categories as $i => $name) {
            Category::updateOrCreate(['name' => $name], ['sort_order' => $i + 1]);
        }

        // Any category present on products but not in the fixed list.
        Product::query()->whereNotNull('category')->distinct()->pluck('category')
            ->diff($categories)
            ->each(fn ($name, $i) => Category::updateOrCreate(['name' => $name], ['sort_order' => 100 + $i]));

        // "GoodWe" and "Goodwe" are the same brand; keep one spelling.
        Product::query()->where('brand', 'GoodWe')->update(['brand' => 'Goodwe']);

        Product::query()->whereNotNull('brand')->distinct()->orderBy('brand')->pluck('brand')
            ->unique(fn ($name) => Str::slug($name))
            ->each(fn ($name) => Brand::firstOrCreate(['slug' => Str::slug($name)], ['name' => $name]));
    }
}
