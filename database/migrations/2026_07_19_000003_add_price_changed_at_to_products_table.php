<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // When the price last changed. The instant-alert path consumes the
            // price_alert_dirty flag; the scheduled digest reads this timestamp
            // against its own watermark, so the two run independently.
            $table->timestamp('price_changed_at')->nullable()->index();
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('price_changed_at');
        });
    }
};
