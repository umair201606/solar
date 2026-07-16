<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('detail_title')->nullable();
            $table->string('location')->nullable();
            $table->text('description')->nullable();
            $table->string('completion_date')->nullable();
            $table->string('capacity')->nullable();
            $table->string('unit')->nullable();
            $table->string('img')->nullable();
            $table->json('tags')->nullable();
            $table->text('overview')->nullable();
            $table->text('objectives')->nullable();
            $table->json('objectives_list')->nullable();
            $table->json('results')->nullable();
            $table->json('delivered')->nullable();
            $table->text('impact')->nullable();
            $table->json('gallery')->nullable();
            $table->string('testimonial_quote', 1000)->nullable();
            $table->string('testimonial_name')->nullable();
            $table->string('testimonial_role')->nullable();
            $table->string('testimonial_img')->nullable();
            $table->boolean('is_published')->default(true);
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
