<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('brands', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->timestamps();
        });

        Schema::create('product_price_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->decimal('price', 12, 2);
            $table->date('recorded_on');
            $table->string('source')->default('manual'); // manual | import | whatsapp
            $table->timestamps();
            $table->unique(['product_id', 'recorded_on']);
        });

        Schema::create('product_leads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            $table->string('product_name'); // snapshot in case product is deleted
            $table->string('phone_used');
            $table->string('product_url')->nullable();
            $table->string('ip')->nullable();
            $table->string('user_agent')->nullable();
            $table->string('referrer')->nullable();
            $table->timestamps();
        });

        Schema::create('store_events', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // filter | search | product_view | whatsapp_click
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            $table->json('meta')->nullable(); // e.g. {"brand":"Goodwe"} or {"category":"..."} or {"q":"..."}
            $table->string('ip')->nullable();
            $table->timestamps();
            $table->index(['type', 'created_at']);
        });

        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        Schema::table('products', function (Blueprint $table) {
            $table->string('phase')->nullable()->after('warranty');       // Single Phase | Three Phase
            $table->decimal('power_kw', 8, 2)->nullable()->after('phase'); // numeric capacity for filtering/sorting
            $table->string('whatsapp_number')->nullable()->after('power_kw'); // overrides default setting
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['phase', 'power_kw', 'whatsapp_number']);
        });
        Schema::dropIfExists('settings');
        Schema::dropIfExists('store_events');
        Schema::dropIfExists('product_leads');
        Schema::dropIfExists('product_price_histories');
        Schema::dropIfExists('brands');
        Schema::dropIfExists('categories');
    }
};
