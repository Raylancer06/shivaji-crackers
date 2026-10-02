<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class SettingController extends Controller
{
    /**
     * Show settings configuration page.
     */
    public function index(): View
    {
        $settings = Setting::getPublicSettings();

        return view('admin.settings.index', compact('settings'));
    }

    /**
     * Update settings.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'business_name' => 'required|string|max:255',
            'business_city' => 'required|string|max:100',
            'business_phone' => 'required|string|max:30',
            'business_email' => 'required|email|max:255',
            'minimum_cart_value' => 'required|numeric|min:0',
            'upi_id' => 'required|string|max:100',
            'upi_payee_name' => 'required|string|max:255',
            'currency_symbol' => 'required|string|max:10',
        ]);

        foreach ($validated as $key => $value) {
            Setting::set($key, (string) $value);
        }

        return redirect()->route('admin.settings.index')->with('success', 'Settings updated successfully.');
    }
}
