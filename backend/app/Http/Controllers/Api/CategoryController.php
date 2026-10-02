<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::withCount('products')
            ->orderBy('display_order', 'asc')
            ->get()
            ->map(function ($cat) {
                return [
                    'id' => $cat->slug,
                    'label' => "{$cat->name} ({$cat->products_count})",
                    'name' => $cat->name,
                    'count' => $cat->products_count,
                    'icon' => $cat->icon ?? 'Flame',
                ];
            });

        $totalProducts = \App\Models\Product::count();

        // Prepend 'all'
        $all = [
            'id' => 'all',
            'label' => "All Crackers ({$totalProducts})",
            'name' => 'All Crackers',
            'count' => $totalProducts,
            'icon' => 'Flame',
        ];

        return response()->json([
            'status' => 'success',
            'data' => array_merge([$all], $categories->toArray()),
        ]);
    }
}
