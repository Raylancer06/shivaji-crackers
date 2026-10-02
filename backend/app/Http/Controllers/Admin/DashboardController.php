<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\View\View;

class DashboardController extends Controller
{
    public function index(): View
    {
        $totalOrders = Order::count();
        $totalRevenue = Order::whereNotIn('status', ['cancelled'])->sum('final_amount');
        $pendingPayments = Order::where('status', 'pending_verification')->count();
        $totalProducts = Product::count();
        $lowStockProducts = Product::where('stock_quantity', '<=', 20)->count();

        $recentOrders = Order::with(['items', 'paymentConfirmation'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return view('admin.dashboard', compact(
            'totalOrders',
            'totalRevenue',
            'pendingPayments',
            'totalProducts',
            'lowStockProducts',
            'recentOrders'
        ));
    }
}
