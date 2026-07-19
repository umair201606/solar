<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Web-push subscriptions from anonymous store visitors who want to be
        // notified when prices change on products matching their chosen filters.
        Schema::create('price_alert_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->text('endpoint');                 // push service URL (may be long)
            $table->string('endpoint_hash', 64)->unique(); // sha256(endpoint) for dedupe
            $table->string('public_key');             // client p256dh key
            $table->string('auth_token');             // client auth secret
            $table->string('content_encoding')->default('aes128gcm');
            $table->json('filters');                  // category/brands/phase/kw/price ranges
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_notified_at')->nullable();
            $table->string('user_agent', 255)->nullable();
            $table->timestamps();
        });

        // Marks products whose latest price just changed, so the alert job can
        // find exactly what moved without diffing the whole catalogue.
        Schema::table('products', function (Blueprint $table) {
            $table->boolean('price_alert_dirty')->default(false)->index();
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('price_alert_dirty');
        });
        Schema::dropIfExists('price_alert_subscriptions');
    }
};
