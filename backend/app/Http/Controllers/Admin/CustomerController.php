<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\View\View;

class CustomerController extends Controller
{
    public function index(Request $request): View
    {
        $query = User::withCount('orders')
            ->where('role', 'customer');

        if ($request->filled('search')) {
            $s = strtolower($request->search);
            $query->where(function ($q) use ($s) {
                $q->whereRaw('LOWER(name) LIKE ?', ["%{$s}%"])
                  ->orWhereRaw('LOWER(email) LIKE ?', ["%{$s}%"])
                  ->orWhere('phone', 'LIKE', "%{$s}%");
            });
        }

        $customers = $query->orderBy('created_at', 'desc')->paginate(20)->withQueryString();

        return view('admin.customers.index', compact('customers'));
    }
}
