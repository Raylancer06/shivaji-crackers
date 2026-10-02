<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::query();

        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category_slug', $request->category);
        }

        if ($request->filled('search')) {
            $search = strtolower($request->search);
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(name) LIKE ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(subtitle) LIKE ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(sku) LIKE ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(description) LIKE ?', ["%{$search}%"]);
            });
        }

        // Sorting
        $sortBy = $request->get('sort', 'popular');
        if ($sortBy === 'price-asc') {
            $query->orderBy('selling_price', 'asc');
        } elseif ($sortBy === 'price-desc') {
            $query->orderBy('selling_price', 'desc');
        } elseif ($sortBy === 'savings') {
            $query->orderByRaw('(mrp - selling_price) DESC');
        } else {
            $query->orderBy('is_bestseller', 'desc')
                  ->orderBy('is_featured', 'desc')
                  ->orderBy('id', 'asc');
        }

        $products = $query->get()->map(function ($p) {
            return [
                'id' => $p->sku,
                'name' => $p->name,
                'subtitle' => $p->subtitle,
                'category' => $p->category_slug,
                'mrp' => (float) $p->mrp,
                'price' => (float) $p->selling_price,
                'discountPercent' => $p->discount_percent,
                'boxQuantity' => $p->box_quantity,
                'quantityUnit' => $p->quantity_unit,
                'pieces' => $p->pieces,
                'soundLevel' => $p->sound_level,
                'image' => $p->image_url,
                'description' => $p->description,
                'greenCertified' => (bool) $p->green_certified,
                'featured' => (bool) $p->is_featured,
                'badge' => $p->badge,
                'stock' => $p->stock_quantity,
            ];
        });

        return response()->json([
            'status' => 'success',
            'count' => $products->count(),
            'data' => $products,
        ]);
    }

    public function show(string $id): JsonResponse
    {
        $product = Product::where('sku', $id)->orWhere('id', $id)->first();

        if (!$product) {
            return response()->json(['status' => 'error', 'message' => 'Product not found'], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'id' => $product->sku,
                'name' => $product->name,
                'subtitle' => $product->subtitle,
                'category' => $product->category_slug,
                'mrp' => (float) $product->mrp,
                'price' => (float) $product->selling_price,
                'discountPercent' => $product->discount_percent,
                'boxQuantity' => $product->box_quantity,
                'quantityUnit' => $product->quantity_unit,
                'pieces' => $product->pieces,
                'soundLevel' => $product->sound_level,
                'image' => $product->image_url,
                'description' => $product->description,
                'greenCertified' => (bool) $product->green_certified,
                'featured' => (bool) $product->is_featured,
                'badge' => $product->badge,
                'stock' => $product->stock_quantity,
            ],
        ]);
    }

    public function featured(): JsonResponse
    {
        $featured = Product::where('is_featured', true)
            ->orWhere('is_bestseller', true)
            ->limit(12)
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->sku,
                    'name' => $p->name,
                    'subtitle' => $p->subtitle,
                    'category' => $p->category_slug,
                    'mrp' => (float) $p->mrp,
                    'price' => (float) $p->selling_price,
                    'discountPercent' => $p->discount_percent,
                    'boxQuantity' => $p->box_quantity,
                    'quantityUnit' => $p->quantity_unit,
                    'pieces' => $p->pieces,
                    'soundLevel' => $p->sound_level,
                    'image' => $p->image_url,
                    'description' => $p->description,
                    'greenCertified' => (bool) $p->green_certified,
                    'featured' => (bool) $p->is_featured,
                    'badge' => $p->badge,
                    'stock' => $p->stock_quantity,
                ];
            });

        return response()->json([
            'status' => 'success',
            'data' => $featured,
        ]);
    }
}
