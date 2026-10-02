<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class OrderController extends Controller
{
    public function index(Request $request): View
    {
        $query = Order::with(['items', 'paymentConfirmation']);

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $s = strtolower($request->search);
            $query->where(function ($q) use ($s) {
                $q->whereRaw('LOWER(order_number) LIKE ?', ["%{$s}%"])
                  ->orWhereRaw('LOWER(customer_name) LIKE ?', ["%{$s}%"])
                  ->orWhere('customer_phone', 'LIKE', "%{$s}%");
            });
        }

        $orders = $query->orderBy('created_at', 'desc')->paginate(15)->withQueryString();

        $statusCounts = [
            'all' => Order::count(),
            'pending_verification' => Order::where('status', 'pending_verification')->count(),
            'confirmed' => Order::where('status', 'confirmed')->count(),
            'packed' => Order::where('status', 'packed')->count(),
            'dispatched' => Order::where('status', 'dispatched')->count(),
            'delivered' => Order::where('status', 'delivered')->count(),
        ];

        return view('admin.orders.index', compact('orders', 'statusCounts'));
    }

    public function show(Order $order): View
    {
        $order->load(['items', 'paymentConfirmation', 'user']);
        return view('admin.orders.show', compact('order'));
    }

    public function updateStatus(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:pending_verification,confirmed,packed,dispatched,delivered,cancelled',
            'payment_status' => 'nullable|in:pending,submitted,verified,rejected',
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        $order->update([
            'status' => $validated['status'],
            'payment_status' => $validated['payment_status'] ?? $order->payment_status,
            'admin_notes' => $validated['admin_notes'] ?? $order->admin_notes,
        ]);

        if ($order->paymentConfirmation && $validated['status'] === 'confirmed') {
            $order->paymentConfirmation->update([
                'verified_at' => now(),
                'verified_by' => Auth::id(),
            ]);
            $order->update(['payment_status' => 'verified']);
        }

        return back()->with('success', "Order {$order->order_number} status updated to " . strtoupper(str_replace('_', ' ', $order->status)));
    }
}
