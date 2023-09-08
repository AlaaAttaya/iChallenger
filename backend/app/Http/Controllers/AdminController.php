<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use App\Models\User;
use App\Http\Controllers\EmailController;
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
    public function sendEmail(Request $request)
    {
        
        $request->validate([
            'to' => 'required|email',
            'subject' => 'required|string',
            'body' => 'required|string',
        ]);

        
        $to = $request->input('to');
        $subject = $request->input('subject');
        $body = $request->input('body');
        $isTransactional = true; 

        
        $from = 'ichallenger@yahoo.com';
        $fromName = 'Admin';

        
        $emailController = new EmailController();

        
        $response = $emailController->sendEmail($from, $fromName, $to, $subject, $body, $isTransactional);

       
        return response()->json(['message' => $response]);
    }
}
