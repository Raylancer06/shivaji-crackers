<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\PaymentConfirmation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class PaymentConfirmationController extends Controller
{
    public function store(Request $request, $orderId): JsonResponse
    {
        $order = Order::with('items')
            ->where('id', $orderId)
            ->orWhere('order_number', $orderId)
            ->first();

        if (!$order) {
            return response()->json([
                'status' => 'error',
                'message' => 'Order not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'utr_number' => 'required|string|min:4|max:50',
            'screenshot' => 'nullable|file|image|mimes:jpeg,png,jpg,webp|max:10240',
            'screenshot_url' => 'nullable|string',
            'notes' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $screenshotPath = '';

        if ($request->hasFile('screenshot')) {
            $path = $request->file('screenshot')->store('payments', 'public');
            $screenshotPath = $path;
        } elseif ($request->filled('screenshot_url')) {
            $screenshotPath = $request->screenshot_url;
        } else {
            $screenshotPath = 'payments/default_receipt.png';
        }

        $confirmation = PaymentConfirmation::updateOrCreate(
            ['order_id' => $order->id],
            [
                'upi_id' => 'sivajiduddempudi422@axl',
                'utr_number' => $request->utr_number,
                'screenshot_path' => $screenshotPath,
                'notes' => $request->notes,
            ]
        );

        $order->update([
            'status' => 'pending_verification',
            'payment_status' => 'submitted',
        ]);

        // Build itemized WhatsApp message for Admin
        $waMessage = "*DIWALI 2025 CONFIRMED FACTORY ORDER - SHIVAJI CRACKERS*\n";
        $waMessage .= "*Order ID:* {$order->order_number}\n";
        $waMessage .= "*Date:* " . now()->format('d M Y, h:i A') . "\n\n";
        $waMessage .= "*CUSTOMER DETAILS:*\n";
        $waMessage .= "*Name:* {$order->customer_name}\n";
        $waMessage .= "*Phone:* {$order->customer_phone}\n";
        $waMessage .= "*Address:* {$order->delivery_address}, {$order->city}, {$order->state} - {$order->pincode}\n";
        $waMessage .= "*Preferred Transport:* {$order->transport_hub}\n";
        if ($order->customer_notes) {
            $waMessage .= "*Notes:* {$order->customer_notes}\n";
        }
        $waMessage .= "\n*PAYMENT VERIFICATION:*\n";
        $waMessage .= "*UPI ID Paid:* sivajiduddempudi422@axl\n";
        $waMessage .= "*UTR / Ref Number:* {$confirmation->utr_number}\n";
        $waMessage .= "*Payment Proof:* Uploaded to Sivaji Admin Panel\n";
        $waMessage .= "\n*ORDERED CRACKERS:*\n";
        foreach ($order->items as $idx => $item) {
            $num = $idx + 1;
            $waMessage .= "{$num}. {$item->product_name} (Box: {$item->box_quantity} {$item->quantity_unit}) x {$item->quantity} boxes = ₹{$item->subtotal}\n";
        }
        $waMessage .= "\n*Total MRP:* ₹" . number_format($order->total_mrp) . "\n";
        $waMessage .= "*Factory Direct Price:* ₹" . number_format($order->final_amount) . "\n";
        $waMessage .= "*Direct Savings:* ₹" . number_format($order->discount_amount) . "\n\n";
        $waMessage .= "Please verify the payment in admin portal and issue lorry transport LR booking.";

        $waLink = "https://wa.me/918374044445?text=" . urlencode($waMessage);

        return response()->json([
            'status' => 'success',
            'message' => 'Payment confirmation submitted successfully. Status is Payment Verification Pending.',
            'data' => [
                'order_number' => $order->order_number,
                'status' => 'pending_verification',
                'utr_number' => $confirmation->utr_number,
                'screenshot_url' => asset('storage/' . $screenshotPath),
                'admin_whatsapp_link' => $waLink,
                'admin_phone' => '+91 83740 44445',
            ],
        ]);
    }
}
