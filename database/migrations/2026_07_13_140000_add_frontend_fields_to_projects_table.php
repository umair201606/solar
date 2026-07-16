<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            if (!Schema::hasColumn('projects', 'img')) {
                $table->string('img')->nullable()->after('unit');
            }
            if (!Schema::hasColumn('projects', 'tags')) {
                $table->json('tags')->nullable()->after('img');
            }
            if (!Schema::hasColumn('projects', 'delivered')) {
                $table->json('delivered')->nullable()->after('results');
            }
            if (!Schema::hasColumn('projects', 'gallery')) {
                $table->json('gallery')->nullable()->after('impact');
            }
            if (!Schema::hasColumn('projects', 'testimonial_img')) {
                $table->string('testimonial_img')->nullable()->after('testimonial_role');
            }
            if (!Schema::hasColumn('projects', 'order')) {
                $table->integer('order')->default(0)->after('is_published');
            }
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['img', 'tags', 'delivered', 'gallery', 'testimonial_img', 'order']);
        });
    }
};
