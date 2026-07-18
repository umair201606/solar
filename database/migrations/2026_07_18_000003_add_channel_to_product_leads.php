<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('product_leads', function (Blueprint $table) {
            $table->string('channel')->default('whatsapp')->after('phone_used'); // whatsapp | call
        });
    }

    public function down(): void
    {
        Schema::table('product_leads', function (Blueprint $table) {
            $table->dropColumn('channel');
        });
    }
};
