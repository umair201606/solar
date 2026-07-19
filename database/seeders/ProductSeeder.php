<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        if (DB::table('products')->count() > 0) {
            $this->command?->info('Products already seeded, skipping.');
            return;
        }

        $path = database_path('seeders/data/products.json');
        $products = json_decode(file_get_contents($path), true);

        DB::statement('SET FOREIGN_KEY_CHECKS=0');

        foreach (array_chunk($products, 100) as $chunk) {
            $rows = array_map(fn ($p) => [
                'name'            => $p['name'],
                'slug'            => $p['slug'],
                'category'        => $p['category'],
                'brand'           => $p['brand'],
                'price'           => $p['price'],
                'internal_price'  => $p['internal_price'],
                'price_change'    => $p['price_change'],
                'trend'           => $p['trend'],
                'unit'            => $p['unit'],
                'warranty'        => $p['warranty'],
                'phase'           => $p['phase'],
                'power_kw'        => $p['power_kw'],
                'whatsapp_number' => $p['whatsapp_number'],
                'specs'           => is_string($p['specs']) ? $p['specs'] : json_encode($p['specs']),
                'description'     => $p['description'],
                'tagline'         => $p['tagline'],
                'is_published'    => $p['is_published'],
                'created_at'      => $p['created_at'],
                'updated_at'      => $p['updated_at'],
            ], $chunk);

            DB::table('products')->insert($rows);
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $this->command?->info(count($products).' products seeded.');
    }
}
