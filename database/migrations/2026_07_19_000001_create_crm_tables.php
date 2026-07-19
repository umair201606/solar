<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('phone')->nullable();
            $table->string('company')->nullable();
            $table->text('notes')->nullable();
            $table->boolean('is_active')->default(true);
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('crm_projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->nullable()->constrained('clients')->nullOnDelete();
            $table->string('title');
            $table->string('status')->default('starting-soon');
            $table->text('description')->nullable();
            $table->string('location')->nullable();
            $table->date('start_date')->nullable();
            $table->date('expected_end_date')->nullable();
            $table->json('ticker')->nullable();
            $table->timestamps();
        });

        Schema::create('crm_project_stages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('crm_project_id')->constrained('crm_projects')->cascadeOnDelete();
            $table->string('name');
            $table->unsignedInteger('weight')->default(0);
            $table->unsignedInteger('progress')->default(0);
            $table->unsignedInteger('sort_order')->default(0);
            $table->string('note')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('crm_project_stages');
        Schema::dropIfExists('crm_projects');
        Schema::dropIfExists('clients');
    }
};
