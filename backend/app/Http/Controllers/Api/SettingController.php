<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;

class SettingController extends Controller
{
    /**
     * Get public application settings (business name, min cart, UPI, contact).
     */
    public function index(): JsonResponse
    {
        $settings = Setting::getPublicSettings();

        return response()->json([
            'status' => 'success',
            'data' => $settings,
        ]);
    }
}
