<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use InvalidArgumentException;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'sku',
        'name',
        'subtitle',
        'category_slug',
        'mrp',
        'selling_price',
        'discount_percent',
        'box_quantity',
        'quantity_unit',
        'pieces',
        'sound_level',
        'image_url',
        'description',
        'green_certified',
        'is_featured',
        'is_bestseller',
        'badge',
        'stock_quantity',
    ];

    protected $casts = [
        'mrp' => 'float',
        'selling_price' => 'float',
        'discount_percent' => 'integer',
        'box_quantity' => 'integer',
        'green_certified' => 'boolean',
        'is_featured' => 'boolean',
        'is_bestseller' => 'boolean',
        'stock_quantity' => 'integer',
    ];

    protected static function booted(): void
    {
        static::saving(function (Product $product) {
            // Strict 80% Maximum Discount Enforcement
            $minAllowedPrice = ceil($product->mrp * 0.20);
            if ($product->selling_price < $minAllowedPrice) {
                throw new InvalidArgumentException(
                    "Discount cannot exceed 80%. Selling price (₹{$product->selling_price}) must be at least 20% of MRP (₹{$product->mrp}), which is ₹{$minAllowedPrice}."
                );
            }

            // Calculate discount percentage
            $calculatedDiscount = (int) round((($product->mrp - $product->selling_price) / $product->mrp) * 100);
            $product->discount_percent = min(80, max(0, $calculatedDiscount));

            // Standardize piece count display
            $qty = $product->box_quantity ?: 1;
            $unit = $product->quantity_unit ?: 'Pieces';
            $product->pieces = "Box Contains: {$qty} {$unit}";
        });
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_slug', 'slug');
    }
}
