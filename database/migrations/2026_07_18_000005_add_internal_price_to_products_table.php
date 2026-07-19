<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Splits pricing into two columns:
     *  - `price` (and the whole price history) — the displayed price, used
     *    across the store and admin. Inflated by /0.95 so that a 5% discount
     *    on it lands exactly on the previously listed price.
     *  - `internal_price` — internal-use-only column, seeded with the real
     *    (pre-inflation) price. Never shown on the store; reserved for later.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->decimal('internal_price', 12, 2)->nullable()->after('price');
        });

        DB::transaction(function () {
            DB::table('products')->whereNotNull('price')
                ->update(['internal_price' => DB::raw('price')]);
            DB::table('products')->whereNotNull('price')
                ->update(['price' => DB::raw('ROUND(price / 0.95, 2)')]);
            DB::table('product_price_histories')
                ->update(['price' => DB::raw('ROUND(price / 0.95, 2)')]);
        });
    }

    public function down(): void
    {
        DB::transaction(function () {
            DB::table('products')->whereNotNull('price')
                ->update(['price' => DB::raw('ROUND(price * 0.95, 2)')]);
            DB::table('product_price_histories')
                ->update(['price' => DB::raw('ROUND(price * 0.95, 2)')]);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('internal_price');
        });
    }
};
