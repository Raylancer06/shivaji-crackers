<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'user_id',
        'customer_name',
        'customer_phone',
        'customer_email',
        'delivery_address',
        'city',
        'state',
        'pincode',
        'transport_hub',
        'total_mrp',
        'total_selling_price',
        'discount_amount',
        'final_amount',
        'status',
        'payment_status',
        'admin_notes',
        'customer_notes',
    ];

    protected $casts = [
        'total_mrp' => 'float',
        'total_selling_price' => 'float',
        'discount_amount' => 'float',
        'final_amount' => 'float',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function paymentConfirmation(): HasOne
    {
        return $this->hasOne(PaymentConfirmation::class);
    }
}
