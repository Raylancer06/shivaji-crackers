<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class CustomerProfileController extends Controller
{
    /**
     * Get authenticated customer profile.
     */
    public function getProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'status' => 'success',
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'city' => $user->city,
                'state' => $user->state,
                'pincode' => $user->pincode,
                'address_line' => $user->address_line,
                'created_at' => $user->created_at,
            ],
        ]);
    }

    /**
     * Update customer profile (Full Name, Email, Mobile).
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            'phone' => [
                'required',
                'string',
                'max:20',
                Rule::unique('users')->ignore($user->id),
            ],
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'pincode' => 'nullable|string|max:10',
            'address_line' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user->update($validator->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Profile updated successfully.',
            'data' => $user,
        ]);
    }

    /**
     * Change customer password.
     */
    public function updatePassword(Request $request): JsonResponse
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Current password does not match our records.',
            ], 422);
        }

        $user->update([
            'password' => Hash::make($request->new_password),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Password changed successfully.',
        ]);
    }

    /**
     * List all customer saved addresses.
     */
    public function getAddresses(Request $request): JsonResponse
    {
        $addresses = Address::where('user_id', $request->user()->id)
            ->orderByDesc('is_default')
            ->latest()
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $addresses,
        ]);
    }

    /**
     * Add new delivery address.
     */
    public function addAddress(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'tag' => 'nullable|string|max:50', // Home, Office, Shop
            'recipient_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'address_line' => 'required|string|max:500',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'pincode' => 'required|string|max:10',
            'landmark' => 'nullable|string|max:255',
            'is_default' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $userId = $request->user()->id;
        $isDefault = (bool) $request->is_default;

        // If this is default, or the user's first address, unset others
        $hasExisting = Address::where('user_id', $userId)->exists();
        if (!$hasExisting) {
            $isDefault = true;
        } elseif ($isDefault) {
            Address::where('user_id', $userId)->update(['is_default' => false]);
        }

        $address = Address::create([
            'user_id' => $userId,
            'tag' => $request->tag ?: 'Home',
            'recipient_name' => $request->recipient_name,
            'phone' => $request->phone,
            'address_line' => $request->address_line,
            'city' => $request->city,
            'state' => $request->state,
            'pincode' => $request->pincode,
            'landmark' => $request->landmark,
            'is_default' => $isDefault,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Address saved successfully.',
            'data' => $address,
        ], 201);
    }

    /**
     * Edit existing address.
     */
    public function updateAddress(Request $request, int $id): JsonResponse
    {
        $address = Address::where('user_id', $request->user()->id)->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'tag' => 'nullable|string|max:50',
            'recipient_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'address_line' => 'required|string|max:500',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'pincode' => 'required|string|max:10',
            'landmark' => 'nullable|string|max:255',
            'is_default' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        if ($request->has('is_default') && $request->is_default) {
            Address::where('user_id', $request->user()->id)->where('id', '!=', $id)->update(['is_default' => false]);
        }

        $address->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Address updated successfully.',
            'data' => $address,
        ]);
    }

    /**
     * Delete address.
     */
    public function deleteAddress(Request $request, int $id): JsonResponse
    {
        $address = Address::where('user_id', $request->user()->id)->findOrFail($id);
        $wasDefault = $address->is_default;
        $address->delete();

        if ($wasDefault) {
            $next = Address::where('user_id', $request->user()->id)->first();
            if ($next) {
                $next->update(['is_default' => true]);
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Address deleted successfully.',
        ]);
    }

    /**
     * Set address as default.
     */
    public function setDefaultAddress(Request $request, int $id): JsonResponse
    {
        $userId = $request->user()->id;
        $address = Address::where('user_id', $userId)->findOrFail($id);

        Address::where('user_id', $userId)->update(['is_default' => false]);
        $address->update(['is_default' => true]);

        return response()->json([
            'status' => 'success',
            'message' => 'Default address set.',
            'data' => $address,
        ]);
    }
}
