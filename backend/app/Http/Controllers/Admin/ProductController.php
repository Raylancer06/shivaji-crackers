<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class ProductController extends Controller
{
    public function index(Request $request): View
    {
        $query = Product::with(['category', 'images']);

        if ($request->filled('category')) {
            $query->where('category_slug', $request->category);
        }

        if ($request->filled('search')) {
            $s = strtolower($request->search);
            $query->where(function ($q) use ($s) {
                $q->whereRaw('LOWER(name) LIKE ?', ["%{$s}%"])
                  ->orWhereRaw('LOWER(sku) LIKE ?', ["%{$s}%"]);
            });
        }

        $products = $query->orderBy('id', 'asc')->paginate(20)->withQueryString();
        $categories = Category::orderBy('name')->get();

        return view('admin.products.index', compact('products', 'categories'));
    }

    public function create(): View
    {
        $categories = Category::orderBy('name')->get();
        return view('admin.products.create', compact('categories'));
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'sku' => 'required|string|unique:products,sku|max:50',
            'name' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'category_slug' => 'required|string|exists:categories,slug',
            'mrp' => 'required|numeric|min:1',
            'selling_price' => 'required|numeric|min:1',
            'box_quantity' => 'required|integer|min:1',
            'quantity_unit' => 'required|string|max:50',
            'sound_level' => 'required|string|max:50',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'image_url' => 'nullable|string',
            'gallery_images.*' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'description' => 'nullable|string',
            'green_certified' => 'boolean',
            'is_featured' => 'boolean',
            'is_bestseller' => 'boolean',
            'badge' => 'nullable|string|max:50',
            'stock_quantity' => 'required|integer|min:0',
        ]);

        // Strict 80% Max Discount Validation
        $minPrice = ceil($validated['mrp'] * 0.20);
        if ($validated['selling_price'] < $minPrice) {
            return back()->withErrors([
                'selling_price' => "Maximum allowed discount is 80%. For MRP ₹{$validated['mrp']}, selling price must be at least ₹{$minPrice}.",
            ])->withInput();
        }

        $imageUrl = $validated['image_url'] ?? 'https://admin.kcrcrackers.com/media/image/uploads/1789895740_0d5b1c4c7f720f698946c7f6ab08f687.jpg';
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $imageUrl = asset('storage/' . $path);
        }

        $discountPercent = min(80, (int) round((($validated['mrp'] - $validated['selling_price']) / $validated['mrp']) * 100));

        $product = Product::create([
            'sku' => strtoupper($validated['sku']),
            'name' => $validated['name'],
            'subtitle' => $validated['subtitle'] ?? '',
            'category_slug' => $validated['category_slug'],
            'mrp' => $validated['mrp'],
            'selling_price' => $validated['selling_price'],
            'discount_percent' => $discountPercent,
            'box_quantity' => $validated['box_quantity'],
            'quantity_unit' => $validated['quantity_unit'],
            'pieces' => "Box Contains: {$validated['box_quantity']} {$validated['quantity_unit']}",
            'sound_level' => $validated['sound_level'],
            'image_url' => $imageUrl,
            'description' => $validated['description'] ?? '',
            'green_certified' => $request->has('green_certified'),
            'is_featured' => $request->has('is_featured'),
            'is_bestseller' => $request->has('is_bestseller'),
            'badge' => $validated['badge'] ?? null,
            'stock_quantity' => $validated['stock_quantity'],
        ]);

        if ($request->hasFile('gallery_images')) {
            foreach ($request->file('gallery_images') as $idx => $gFile) {
                $gPath = $gFile->store('products', 'public');
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => asset('storage/' . $gPath),
                    'sort_order' => $idx + 1,
                    'is_primary' => false,
                ]);
            }
        }

        return redirect()->route('admin.products.index')->with('success', 'Product created successfully with verified box quantities and discount.');
    }

    public function edit(Product $product): View
    {
        $categories = Category::orderBy('name')->get();
        $product->load('images');
        return view('admin.products.edit', compact('product', 'categories'));
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'category_slug' => 'required|string|exists:categories,slug',
            'mrp' => 'required|numeric|min:1',
            'selling_price' => 'required|numeric|min:1',
            'box_quantity' => 'required|integer|min:1',
            'quantity_unit' => 'required|string|max:50',
            'sound_level' => 'required|string|max:50',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'image_url' => 'nullable|string',
            'gallery_images.*' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'description' => 'nullable|string',
            'badge' => 'nullable|string|max:50',
            'stock_quantity' => 'required|integer|min:0',
        ]);

        // Strict 80% Max Discount Validation
        $minPrice = ceil($validated['mrp'] * 0.20);
        if ($validated['selling_price'] < $minPrice) {
            return back()->withErrors([
                'selling_price' => "Maximum allowed discount is 80%. For MRP ₹{$validated['mrp']}, selling price must be at least ₹{$minPrice}.",
            ])->withInput();
        }

        $imageUrl = $product->image_url;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $imageUrl = asset('storage/' . $path);
        } elseif ($request->filled('image_url')) {
            $imageUrl = $request->image_url;
        }

        $discountPercent = min(80, (int) round((($validated['mrp'] - $validated['selling_price']) / $validated['mrp']) * 100));

        $product->update([
            'name' => $validated['name'],
            'subtitle' => $validated['subtitle'] ?? '',
            'category_slug' => $validated['category_slug'],
            'mrp' => $validated['mrp'],
            'selling_price' => $validated['selling_price'],
            'discount_percent' => $discountPercent,
            'box_quantity' => $validated['box_quantity'],
            'quantity_unit' => $validated['quantity_unit'],
            'pieces' => "Box Contains: {$validated['box_quantity']} {$validated['quantity_unit']}",
            'sound_level' => $validated['sound_level'],
            'image_url' => $imageUrl,
            'description' => $validated['description'] ?? '',
            'green_certified' => $request->has('green_certified'),
            'is_featured' => $request->has('is_featured'),
            'is_bestseller' => $request->has('is_bestseller'),
            'badge' => $validated['badge'] ?? null,
            'stock_quantity' => $validated['stock_quantity'],
        ]);

        if ($request->hasFile('gallery_images')) {
            $existingCount = $product->images()->count();
            foreach ($request->file('gallery_images') as $idx => $gFile) {
                $gPath = $gFile->store('products', 'public');
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => asset('storage/' . $gPath),
                    'sort_order' => $existingCount + $idx + 1,
                    'is_primary' => false,
                ]);
            }
        }

        return redirect()->route('admin.products.index')->with('success', 'Product updated successfully.');
    }

    public function deleteImage(Product $product, ProductImage $image): RedirectResponse
    {
        if ($image->product_id === $product->id) {
            $image->delete();
        }
        return back()->with('success', 'Gallery image deleted.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();
        return redirect()->route('admin.products.index')->with('success', 'Product deleted.');
    }
}
