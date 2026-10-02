<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CustomerAuthController;
use App\Http\Controllers\Api\CustomerProfileController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PasswordResetController;
use App\Http\Controllers\Api\PaymentConfirmationController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\SettingController;
use Illuminate\Support\Facades\Route;

// Public Settings & Store Configuration
Route::get('/settings', [SettingController::class, 'index']);

// Public Catalog Endpoints
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/featured', [ProductController::class, 'featured']);
Route::get('/products/{id}', [ProductController::class, 'show']);

// Public Order & Payment Endpoints
Route::post('/orders', [OrderController::class, 'store']);
Route::get('/orders/{orderNumber}', [OrderController::class, 'show']);
Route::post('/orders/{orderId}/payment-confirm', [PaymentConfirmationController::class, 'store']);

// Customer Auth & Password Recovery Endpoints
Route::post('/auth/register', [CustomerAuthController::class, 'register']);
Route::post('/auth/login', [CustomerAuthController::class, 'login']);
Route::post('/auth/forgot-password', [PasswordResetController::class, 'forgotPassword']);
Route::post('/auth/reset-password', [PasswordResetController::class, 'resetPassword']);

// Authenticated Customer Endpoints
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [CustomerAuthController::class, 'me']);
    Route::post('/auth/logout', [CustomerAuthController::class, 'logout']);

    // Customer Profile & Password
    Route::get('/customer/profile', [CustomerProfileController::class, 'getProfile']);
    Route::put('/customer/profile', [CustomerProfileController::class, 'updateProfile']);
    Route::put('/customer/password', [CustomerProfileController::class, 'updatePassword']);

    // Customer Address Book
    Route::get('/customer/addresses', [CustomerProfileController::class, 'getAddresses']);
    Route::post('/customer/addresses', [CustomerProfileController::class, 'addAddress']);
    Route::put('/customer/addresses/{id}', [CustomerProfileController::class, 'updateAddress']);
    Route::delete('/customer/addresses/{id}', [CustomerProfileController::class, 'deleteAddress']);
    Route::post('/customer/addresses/{id}/default', [CustomerProfileController::class, 'setDefaultAddress']);

    // Customer Order History
    Route::get('/customer/orders', [CustomerAuthController::class, 'orders']);
});
