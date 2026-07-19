<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PriceHistorySeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path('seeders/data/price_history.json');
        $entries = json_decode(file_get_contents($path), true);

        if (DB::table('product_price_histories')->count() > 0) {
            $this->command?->info('Price history already seeded, skipping.');
            return;
        }

        foreach (array_chunk($entries, 500) as $chunk) {
            $rows = array_map(fn ($e) => [
                'product_id'     => $e['product_id'],
                'price'          => $e['price'],
                'internal_price' => $e['internal_price'] ?? null,
                'recorded_on'    => $e['recorded_on'],
                'source'         => $e['source'] ?? 'whatsapp',
                'created_at'     => $e['created_at'],
                'updated_at'     => $e['updated_at'],
            ], $chunk);

            DB::table('product_price_histories')->insert($rows);
        }

        $this->command?->info(count($entries).' price history entries seeded.');
    }
}
