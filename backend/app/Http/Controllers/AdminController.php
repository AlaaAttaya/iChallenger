<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use App\Models\User;
use Illuminate\Support\Facades\Log; 

class AdminController extends Controller
{
    public function banUser(Request $request)
    {   
        $identifier=$request->input('user_id');
        $user = User::find($identifier);
    
        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }
    
        $user->is_banned = 1;
        $user->save();
    
        return response()->json(['message' => 'User has been banned.']);
    }
    public function unbanUser(Request $request)
    {   
        $identifier=$request->input('user_id');
        $user = User::find($identifier);
    
        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }
    
        $user->is_banned = 0;
        $user->save();
    
        return response()->json(['message' => 'User has been unbanned.']);
    }
}
