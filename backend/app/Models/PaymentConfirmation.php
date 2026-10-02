<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentConfirmation extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'upi_id',
        'utr_number',
        'screenshot_path',
        'notes',
        'verified_at',
        'verified_by',
    ];

    protected $casts = [
        'verified_at' => 'datetime',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function verifiedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function getScreenshotUrlAttribute(): string
    {
        if (str_starts_with($this->screenshot_path, 'http')) {
            return $this->screenshot_path;
        }
        return asset('storage/' . $this->screenshot_path);
    }
}
