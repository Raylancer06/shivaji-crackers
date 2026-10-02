<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'customer_email' => 'nullable|email|max:255',
            'delivery_address' => 'required|string|max:1000',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'pincode' => 'nullable|string|max:10',
            'customer_notes' => 'nullable|string|max:1000',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            return DB::transaction(function () use ($request) {
                $totalMRP = 0;
                $totalSellingPrice = 0;
                $validatedItems = [];

                foreach ($request->items as $itemData) {
                    $product = Product::where('sku', $itemData['product_id'])
                        ->orWhere('id', $itemData['product_id'])
                        ->first();

                    if (!$product) {
                        continue;
                    }

                    $qty = (int) $itemData['quantity'];
                    $lineMRP = $product->mrp * $qty;
                    $lineSelling = $product->selling_price * $qty;

                    $totalMRP += $lineMRP;
                    $totalSellingPrice += $lineSelling;

                    $validatedItems[] = [
                        'product_id' => $product->id,
                        'product_sku' => $product->sku,
                        'product_name' => $product->name,
                        'box_quantity' => $product->box_quantity,
                        'quantity_unit' => $product->quantity_unit,
                        'unit_mrp' => $product->mrp,
                        'unit_price' => $product->selling_price,
                        'quantity' => $qty,
                        'subtotal' => $lineSelling,
                    ];
                }

                if (empty($validatedItems)) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'No valid products found in order',
                    ], 400);
                }

                // Minimum Cart Value Server-Side Validation
                $minCartValue = (float) Setting::get('minimum_cart_value', 2000);
                if ($minCartValue > 0 && $totalSellingPrice < $minCartValue) {
                    $diff = $minCartValue - $totalSellingPrice;
                    return response()->json([
                        'status' => 'error',
                        'message' => "Minimum order value is ₹" . number_format($minCartValue) . ". Please add ₹" . number_format($diff) . " more to continue.",
                        'minimum_cart_value' => $minCartValue,
                        'current_total' => $totalSellingPrice,
                        'shortfall' => $diff,
                    ], 422);
                }

                $discountAmount = $totalMRP - $totalSellingPrice;
                $orderNumber = 'SIV-' . mt_rand(100000, 999999);

                $userId = auth('sanctum')->id() ?: $request->user_id;

                $order = Order::create([
                    'order_number' => $orderNumber,
                    'user_id' => $userId,
                    'customer_name' => $request->customer_name,
                    'customer_phone' => $request->customer_phone,
                    'customer_email' => $request->customer_email,
                    'delivery_address' => $request->delivery_address,
                    'city' => $request->city ?: 'Hyderabad',
                    'state' => $request->state ?: 'Telangana',
                    'pincode' => $request->pincode ?: '500034',
                    'landmark' => $request->landmark,
                    'total_mrp' => $totalMRP,
                    'total_selling_price' => $totalSellingPrice,
                    'discount_amount' => $discountAmount,
                    'final_amount' => $totalSellingPrice,
                    'status' => 'pending_verification',
                    'payment_status' => 'submitted',
                    'customer_notes' => $request->customer_notes,
                ]);

                foreach ($validatedItems as $item) {
                    $item['order_id'] = $order->id;
                    OrderItem::create($item);
                }

                $publicSettings = Setting::getPublicSettings();

                return response()->json([
                    'status' => 'success',
                    'message' => 'Order created successfully. Please submit payment confirmation.',
                    'data' => [
                        'id' => $order->id,
                        'order_number' => $order->order_number,
                        'total_mrp' => $order->total_mrp,
                        'total_selling_price' => $order->total_selling_price,
                        'discount_amount' => $order->discount_amount,
                        'final_amount' => $order->final_amount,
                        'status' => $order->status,
                        'upi_instructions' => [
                            'upi_id' => $publicSettings['upi_id'],
                            'recipient_name' => $publicSettings['upi_payee_name'],
                            'amount' => $order->final_amount,
                            'admin_whatsapp' => $publicSettings['business_phone'],
                        ],
                    ],
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Could not create order: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function show(string $orderNumber): JsonResponse
    {
        $order = Order::with(['items', 'paymentConfirmation'])
            ->where('order_number', $orderNumber)
            ->orWhere('id', $orderNumber)
            ->first();

        if (!$order) {
            return response()->json(['status' => 'error', 'message' => 'Order not found'], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $order,
        ]);
    }
}
