<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('certificate_type')->default('Building Fitness Certificate');
            $table->string('reference')->nullable();
            $table->date('issue_date');
            $table->string('client_name');
            $table->text('address')->nullable();
            $table->unsignedSmallInteger('valid_years')->default(2);
            $table->string('status')->default('valid'); // valid | revoked
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('certificates');
    }
};
