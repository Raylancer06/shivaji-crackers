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
        // 1. Add fields to users table
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->index();
            $table->string('role')->default('customer')->index(); // 'admin' or 'customer'
            $table->string('address_line')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->default('Telangana');
            $table->string('pincode')->nullable();
            $table->string('transport_hub')->nullable();
        });

        // 2. Categories table
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('icon')->nullable();
            $table->integer('display_order')->default(0);
            $table->timestamps();
        });

        // 3. Products table
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('sku')->unique();
            $table->string('name');
            $table->string('subtitle')->nullable();
            $table->string('category_slug')->index();
            $table->decimal('mrp', 10, 2);
            $table->decimal('selling_price', 10, 2);
            $table->integer('discount_percent')->default(75);
            $table->integer('box_quantity')->default(1);
            $table->string('quantity_unit')->default('Pieces');
            $table->string('pieces')->nullable(); // "Box Contains: 5 Pieces"
            $table->string('sound_level')->default('Festival Sound');
            $table->text('image_url');
            $table->text('description')->nullable();
            $table->boolean('green_certified')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_bestseller')->default(false);
            $table->string('badge')->nullable();
            $table->integer('stock_quantity')->default(100);
            $table->timestamps();
        });

        // 4. Orders table
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('customer_name');
            $table->string('customer_phone');
            $table->string('customer_email')->nullable();
            $table->text('delivery_address');
            $table->string('city')->default('Hyderabad');
            $table->string('state')->default('Telangana');
            $table->string('pincode')->nullable();
            $table->string('transport_hub')->nullable();
            $table->decimal('total_mrp', 12, 2)->default(0);
            $table->decimal('total_selling_price', 12, 2)->default(0);
            $table->decimal('discount_amount', 12, 2)->default(0);
            $table->decimal('final_amount', 12, 2)->default(0);
            $table->string('status')->default('pending_verification'); // pending_verification, confirmed, packed, dispatched, delivered, cancelled
            $table->string('payment_status')->default('submitted'); // pending, submitted, verified, rejected
            $table->text('admin_notes')->nullable();
            $table->text('customer_notes')->nullable();
            $table->timestamps();
        });

        // 5. Order Items table
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();
            $table->string('product_sku');
            $table->string('product_name');
            $table->integer('box_quantity')->default(1);
            $table->string('quantity_unit')->default('Pieces');
            $table->decimal('unit_mrp', 10, 2);
            $table->decimal('unit_price', 10, 2);
            $table->integer('quantity'); // number of boxes ordered
            $table->decimal('subtotal', 12, 2);
            $table->timestamps();
        });

        // 6. Payment Confirmations table
        Schema::create('payment_confirmations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->string('upi_id')->default('sivajiduddempudi422@axl');
            $table->string('utr_number');
            $table->text('screenshot_path');
            $table->text('notes')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->foreignId('verified_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        // 7. Customer Saved Addresses table
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('tag')->default('Home'); // Home, Shop, Office
            $table->string('recipient_name');
            $table->string('phone');
            $table->text('address_line');
            $table->string('city')->default('Hyderabad');
            $table->string('state')->default('Telangana');
            $table->string('pincode');
            $table->string('transport_hub')->nullable();
            $table->boolean('is_default')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('addresses');
        Schema::dropIfExists('payment_confirmations');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('products');
        Schema::dropIfExists('categories');

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone', 'role', 'address_line', 'city', 'state', 'pincode', 'transport_hub']);
        });
    }
};
