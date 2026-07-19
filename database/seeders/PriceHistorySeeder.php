<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductPriceHistory;
use Illuminate\Database\Seeder;

class PriceHistorySeeder extends Seeder
{
    /**
     * Loads dated price points extracted from the Solarkon WhatsApp
     * channel (database/seeders/data/price_history.json) and refreshes
     * each product's current price / trend from its history.
     */
    public function run(): void
    {
        $path = database_path('seeders/data/price_history.json');
        $entries = json_decode(file_get_contents($path), true);

        $products = Product::query()->pluck('id', 'slug');
        $missing = [];
        $rows = [];
        $now = now();

        foreach ($entries as $entry) {
            $productId = $products[$entry['slug']] ?? null;
            if (! $productId) {
                $missing[$entry['slug']] = true;
                continue;
            }
            $rows[] = [
                'product_id' => $productId,
                'price' => $entry['price'],
                'recorded_on' => $entry['date'],
                'source' => 'whatsapp',
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        foreach (array_chunk($rows, 500) as $chunk) {
            ProductPriceHistory::query()->upsert(
                $chunk,
                ['product_id', 'recorded_on'],
                ['price', 'source', 'updated_at'],
            );
        }

        Product::query()->whereIn('slug', array_keys($products->all()))
            ->get()
            ->each(fn (Product $product) => $product->refreshTrend());

        if ($missing) {
            $this->command?->warn('No product for slugs: '.implode(', ', array_keys($missing)));
        }
        $this->command?->info(count($rows).' price points loaded.');
    }
}
