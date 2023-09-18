<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use App\Models\User;
use App\Models\ContactUs;
use App\Models\UserAuthentication;
use App\Http\Controllers\EmailController;
use Illuminate\Support\Facades\Log; 
class AuthController extends Controller
{

    //User

    public function unauthorized(Request $request)
    {
        return response()->json([
            'status' => 'Error',
            'message' => 'Unauthorized',
        ], 401);
    }

    public function profile(Request $request)
    {
        $user = Auth::user();
    
    
        return response()->json([
            'status' => 'Success',
            'data' => $user,
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'identifier' => 'required|string', 
            'password' => 'required|string',
        ]);

        $field = filter_var($request->identifier, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
        $credentials = [
            'password' => $request->password,
            $field => $request->identifier,
        ];

        $token = Auth::attempt($credentials);

        if (!$token) {
        return $this->unauthorized(); 
        }

        $user = Auth::user();
        $user->token = $token;

        return response()->json([
            'status' => 'Success',
            'data' => $user
        ]);
    }


    public function register(Request $request)
    {
        $request->validate([
        'name' => 'required|string|max:255',
        'username' => 'required|string|max:255|unique:users',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:8',
        'country' => 'required|string',
        'profileimage' => 'nullable|image|mimes:jpeg,png,jpg,gif,ico|max:2048',
        'coverimage' => 'nullable|image|mimes:jpeg,png,jpg,gif,ico|max:2048',
        ]);

        $user = new User;
        $user->name = $request->name;
        $user->username = $request->username;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->user_role_id = 2;
        $user->country = $request->country;
        $user->save();


        


        if ($request->hasFile('profileimage')) {
        $profileImagePath = $request->file('profileimage')->store('public/users/u_' . $user->id . '_' . $request->username . '/profile/');
        $user->profileimage = "/storage" . str_replace('public', '', $profileImagePath);
        } else {
        $user->profileimage = '/storage/images/profilepic.png';
        }


        if ($request->hasFile('coverimage')) {
        $coverImagePath = $request->file('coverimage')->store('public/users/u_' . $user->id . '_' . $request->username . '/cover/');
        $user->coverimage = "/storage" . str_replace('public', '', $coverImagePath);
        } else {
        $user->coverimage = '/storage/images/coverpic.png';
        }

        $user->save();


        $token = Auth::login($user);
        $user->token = $token;

        return response()->json([
        'status' => 'Success',
        'data' => $user,
        ]);
    }


    public function logout()
    {
        Auth::logout();
        return response()->json([
            'status' => 'success',
            'message' => 'Successfully logged out',
        ]);
    }

    public function refresh()
    {
        $user = Auth::user();
        $user->token = Auth::refresh();

        return response()->json([
            'status' => 'success',
            'data' => $user
        ]);
    }
    
    
    public function getAllUsers(Request $request)
    {
        $searchUsername = $request->input('username','');
        $query = User::query();
        $users = [];
        if ($searchUsername !== null) {
            $query->where('username', 'like', '%' . $searchUsername . '%');
            $query->where('user_role_id', '!=', 1);
            $users = $query->get();
        }
    
        return response()->json([
            'status' => 'Success',
            'data' => $users,
        ]);
    }
    
    //Contact us

  

    public function submitContactUs(Request $request)
    {
       
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject'=> 'required|string',
            'message' => 'required|string',
        ]);
    
        
        $contactUs = new ContactUs();
        $contactUs->name = $request->name;
        $contactUs->email = $request->email;
        $contactUs->subject=$request->subject;
        $contactUs->message = $request->message;
    
        
        $contactUs->save();
    
       
        return response()->json(['message' => 'Contact us message submitted successfully']);
    }

    //Authentication

    public function connectauth(Request $request)
    {   $user = Auth::user();
        $request->validate([
            'provider' => 'required|string',
            'auth_id' => 'required|string',
        ]);
    
        
    
        $user->authentications()->create([
            'provider' => $request->provider,
            'auth_id' => $request->auth_id,
            'user_id' => $user->id,
        ]);
    
        return response()->json(['message' => 'User authentication connected successfully'], 201);
    }
    
    public function disconnectauth(Request $request)
    {
        $user = Auth::user();
    
        $request->validate([
            'provider' => 'required|string',
            'auth_id' => 'required|string',
        ]);
    
        $user->authentications()
             ->where('provider', $request->provider)
             ->where('auth_id', $request->auth_id)
             ->delete();
    
        return response()->json(['message' => 'User authentication disconnected successfully'], 200);
    }


    //Forgot Password

    public function resetPasswordCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $code = str_pad(random_int(0, 99999), 6, '0', STR_PAD_LEFT);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        
        $emailController = new EmailController();

        $user->temporary_code = $code;
        $user->temporary_code_expiration = now()->addMinutes(15);
        $user->save();

        $from = 'ichallenger@zohomail.com';
        $fromName = 'iChallenger';
        $to = $user->email;
        $subject = 'Password Reset Code';
        $body = 'Your password reset code is: ' . $code;
        $isTransactional = true;
    

        $emailController->sendEmail($from, $fromName, $to, $subject, $body, $isTransactional);

        return response()->json(['message' => 'Reset code sent successfully']);
    }

    public function verifyCode(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'code' => 'required|digits:5',
        ]);

       
        if (!$user->temporary_code || $user->temporary_code !== $request->code) {
            return response()->json(['message' => 'Invalid code'], 400);
        }

    
        if ($user->temporary_code_expiration <= now()) {
            return response()->json(['message' => 'Code has expired'], 400);
        }

      

        return response()->json(['message' => 'Code verified successfully']);
    }
 

    public function resetPassword(Request $request)
    {
        
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'new_password' => 'required|string|min:8',
        ]);

       
        $user = User::where('email', $request->email)->first();

       
        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json(['message' => 'Password reset successfully']);
    }

    public function getCountries()
    {
        $countries = Country::all();

        return response()->json([
            'status' => 'Success',
            'data' => $countries,
        ]);
    }

    public function getRegions()
    {
        $regions = Region::all();

        return response()->json([
            'status' => 'Success',
            'data' => $regions,
        ]);
    }

}
