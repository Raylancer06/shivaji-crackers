<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = ['key', 'value'];

    /**
     * Get a setting value by key with optional fallback.
     */
    public static function get(string $key, $default = null)
    {
        $setting = static::where('key', $key)->first();
        return $setting ? $setting->value : $default;
    }

    /**
     * Set a setting value by key.
     */
    public static function set(string $key, $value): static
    {
        return static::updateOrCreate(['key' => $key], ['value' => $value]);
    }

    /**
     * Get all public settings as key-value array.
     */
    public static function getPublicSettings(): array
    {
        $keys = [
            'business_name',
            'business_city',
            'business_phone',
            'business_email',
            'minimum_cart_value',
            'upi_id',
            'upi_payee_name',
            'currency_symbol',
        ];

        $settings = static::whereIn('key', $keys)->pluck('value', 'key')->toArray();

        return [
            'business_name' => $settings['business_name'] ?? 'Sivaji Firecracker',
            'business_city' => $settings['business_city'] ?? 'Hyderabad',
            'business_phone' => $settings['business_phone'] ?? '+91 83740 44445',
            'business_email' => $settings['business_email'] ?? 'orders@sivajifirecracker.com',
            'minimum_cart_value' => (float) ($settings['minimum_cart_value'] ?? 2000),
            'upi_id' => $settings['upi_id'] ?? 'sivajiduddempudi422@axl',
            'upi_payee_name' => $settings['upi_payee_name'] ?? 'Sivaji Duddempudi',
            'currency_symbol' => $settings['currency_symbol'] ?? '₹',
        ];
    }
}
