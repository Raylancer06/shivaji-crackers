<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('users', 'transport_hub')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('transport_hub');
            });
        }

        if (Schema::hasColumn('orders', 'transport_hub')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->dropColumn('transport_hub');
            });
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('transport_hub')->nullable();
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->string('transport_hub')->nullable();
        });
    }
};
