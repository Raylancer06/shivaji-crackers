<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class PasswordResetController extends Controller
{
    /**
     * Send password reset token / link.
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'The provided email is not registered with us.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $token = Str::random(32);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            [
                'token' => Hash::make($token),
                'created_at' => now(),
            ]
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Password reset verification code has been generated. Use the token to reset your password.',
            'reset_token' => $token, // Provided for direct verification
            'reset_url' => url("/reset-password?token={$token}&email=" . urlencode($request->email)),
        ]);
    }

    /**
     * Reset password using token.
     */
    public function resetPassword(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'token' => 'required|string',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $record = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$record) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid or expired password reset request.',
            ], 400);
        }

        // Check if token matches (or plaintext fallback if needed)
        $tokenValid = Hash::check($request->token, $record->token) || $request->token === $record->token;

        if (!$tokenValid) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid password reset token.',
            ], 400);
        }

        // Update User Password
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Customer account not found.',
            ], 404);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        // Invalidate Token
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Password has been successfully reset. Please log in with your new password.',
        ]);
    }
}
