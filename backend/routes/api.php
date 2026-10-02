<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CustomerAuthController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PaymentConfirmationController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;

// Public Catalog Endpoints
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/featured', [ProductController::class, 'featured']);
Route::get('/products/{id}', [ProductController::class, 'show']);

// Public Order & Payment Endpoints
Route::post('/orders', [OrderController::class, 'store']);
Route::get('/orders/{orderNumber}', [OrderController::class, 'show']);
Route::post('/orders/{orderId}/payment-confirm', [PaymentConfirmationController::class, 'store']);

// Customer Auth Endpoints
Route::post('/auth/register', [CustomerAuthController::class, 'register']);
Route::post('/auth/login', [CustomerAuthController::class, 'login']);

// Authenticated Customer Endpoints
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [CustomerAuthController::class, 'me']);
    Route::put('/auth/profile', [CustomerAuthController::class, 'updateProfile']);
    Route::get('/customer/orders', [CustomerAuthController::class, 'orders']);
});
