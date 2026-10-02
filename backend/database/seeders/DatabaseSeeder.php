<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\PaymentConfirmation;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Admin User
        $admin = User::firstOrCreate(
            ['email' => 'admin@sivajicrackers.com'],
            [
                'name' => 'Sivaji Crackers Admin',
                'phone' => '+918374044445',
                'password' => Hash::make('Sivaji@2025!'),
                'role' => 'admin',
                'city' => 'Hyderabad',
                'state' => 'Telangana',
            ]
        );

        // 2. Seed Sample Customer User
        $customer = User::firstOrCreate(
            ['email' => 'customer@sivajicrackers.com'],
            [
                'name' => 'Hyderabad Customer',
                'phone' => '+919876543210',
                'password' => Hash::make('Customer@2025!'),
                'role' => 'customer',
                'address_line' => 'Plot 42, Jubilee Hills Road No. 36',
                'city' => 'Hyderabad',
                'state' => 'Telangana',
                'pincode' => '500033',
            ]
        );

        // 3. Seed Categories
        $categories = [
            ['slug' => 'one_sound', 'name' => 'One Sound Crackers', 'icon' => 'Volume2', 'display_order' => 1],
            ['slug' => 'sparklers', 'name' => 'Sparklers & Chakkars', 'icon' => 'Sparkles', 'display_order' => 2],
            ['slug' => 'bombs', 'name' => 'Bomb Items', 'icon' => 'Flame', 'display_order' => 3],
            ['slug' => 'flower_pots', 'name' => 'Flower Pots (Anar)', 'icon' => 'Flower', 'display_order' => 4],
            ['slug' => 'cartoon_varieties', 'name' => 'Kids Cartoon Varieties', 'icon' => 'Smile', 'display_order' => 5],
            ['slug' => 'sky_night_fancy', 'name' => 'Sky Night Aerial Repeaters', 'icon' => 'Rocket', 'display_order' => 6],
            ['slug' => 'night_fancy', 'name' => 'Night Fancy Fountains', 'icon' => 'Sun', 'display_order' => 7],
            ['slug' => 'ground_chakkar', 'name' => 'Ground Chakkars', 'icon' => 'Disc', 'display_order' => 8],
            ['slug' => 'paper_bomb', 'name' => 'Paper Bombs', 'icon' => 'Zap', 'display_order' => 9],
            ['slug' => 'special_item', 'name' => 'Special Diwali Items', 'icon' => 'Star', 'display_order' => 10],
            ['slug' => 'twinkling_star', 'name' => 'Twinkling Star', 'icon' => 'Sparkles', 'display_order' => 11],
            ['slug' => 'gift_boxes', 'name' => 'Family Gift Boxes', 'icon' => 'Gift', 'display_order' => 12],
            ['slug' => 'magic_wala', 'name' => 'Magic Wala', 'icon' => 'Wand', 'display_order' => 13],
            ['slug' => 'wala', 'name' => 'Wala Garlands (100 to 10K)', 'icon' => 'Layers', 'display_order' => 14],
            ['slug' => 'children_roll_cap', 'name' => 'Children Roll Cap & Guns', 'icon' => 'Crosshair', 'display_order' => 15],
            ['slug' => 'rocket', 'name' => 'Rockets & Missiles', 'icon' => 'ArrowUpRight', 'display_order' => 16],
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate(['slug' => $cat['slug']], $cat);
        }

        // 4. Seed 157 Normalized Products
        $jsonPath = database_path('seeders/products_seed.json');
        if (file_exists($jsonPath)) {
            $productsData = json_decode(file_get_contents($jsonPath), true);
            foreach ($productsData as $item) {
                // Ensure selling price adheres strictly to <= 80% discount
                $mrp = (float) $item['mrp'];
                $price = (float) $item['price'];
                if ($price < ceil($mrp * 0.20)) {
                    $price = ceil($mrp * 0.20);
                }

                Product::updateOrCreate(
                    ['sku' => $item['id']],
                    [
                        'name' => $item['name'],
                        'subtitle' => $item['subtitle'] ?? 'Diwali Celebration Cracker',
                        'category_slug' => $item['category'],
                        'mrp' => $mrp,
                        'selling_price' => $price,
                        'box_quantity' => (int) ($item['boxQuantity'] ?? 1),
                        'quantity_unit' => $item['quantityUnit'] ?? 'Pieces',
                        'pieces' => $item['pieces'] ?? "Box Contains: " . ($item['boxQuantity'] ?? 1) . " " . ($item['quantityUnit'] ?? 'Pieces'),
                        'sound_level' => $item['soundLevel'] ?? 'Festival Sound',
                        'image_url' => $item['image'],
                        'description' => $item['description'] ?? 'Authentic Sivakasi direct factory allocation. 100% CSIR-NEERI Green Certified.',
                        'green_certified' => true,
                        'is_featured' => !empty($item['featured']),
                        'is_bestseller' => ($item['badge'] ?? '') === 'Bestseller',
                        'badge' => $item['badge'] ?? null,
                        'stock_quantity' => 200,
                    ]
                );
            }
        }

        // 5. Seed a Sample Demo Order with Payment Confirmation for Immediate Verification
        $sampleOrder = Order::firstOrCreate(
            ['order_number' => 'SIV-849201'],
            [
                'user_id' => $customer->id,
                'customer_name' => 'Hyderabad Wholesale Retailer',
                'customer_phone' => '+919876543210',
                'customer_email' => 'customer@sivajicrackers.com',
                'delivery_address' => 'Plot 42, Jubilee Hills Road No. 36',
                'city' => 'Hyderabad',
                'state' => 'Telangana',
                'pincode' => '500033',
                'total_mrp' => 4500.00,
                'total_selling_price' => 1125.00,
                'discount_amount' => 3375.00,
                'final_amount' => 1125.00,
                'status' => 'pending_verification',
                'payment_status' => 'submitted',
                'customer_notes' => 'Please confirm order dispatch.',
            ]
        );

        $prod1 = Product::where('sku', 'PROD-001')->first();
        if ($prod1) {
            OrderItem::firstOrCreate(
                ['order_id' => $sampleOrder->id, 'product_id' => $prod1->id],
                [
                    'product_sku' => $prod1->sku,
                    'product_name' => $prod1->name,
                    'box_quantity' => $prod1->box_quantity,
                    'quantity_unit' => $prod1->quantity_unit,
                    'unit_mrp' => $prod1->mrp,
                    'unit_price' => $prod1->selling_price,
                    'quantity' => 10,
                    'subtotal' => $prod1->selling_price * 10,
                ]
            );
        }

        PaymentConfirmation::firstOrCreate(
            ['order_id' => $sampleOrder->id],
            [
                'upi_id' => 'sivajiduddempudi422@axl',
                'utr_number' => '428901847291',
                'screenshot_path' => 'https://images.unsplash.com/photo-1556742049-0a67e5572293?w=600&auto=format&fit=crop',
                'notes' => 'Paid ₹1125 via Google Pay UPI to sivajiduddempudi422@axl',
            ]
        );
    }
}
