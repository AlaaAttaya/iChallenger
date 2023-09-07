<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use App\Models\User;
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
        

        if ($request->hasFile('profile_image')) {
            $imagePath = $request->file('image')->store('public/u_'.$user->id.'_'.$request->username.'/profile');
            $image_path  = "/storage".str_replace('public', '', $imagePath);
        }else {
            
            $image_path = '/storage/images/profilepic.png';
            
        }
        if ($request->hasFile('cover_image')) {
            $imagePath = $request->file('image')->store('public/users/u_'.$user->id.'_'.$request->username.'/profile');
            $cover_path  = "/storage".str_replace('public', '', $imagePath);
        }else {
            
            $cover_path = '/storage/images/coverpic.png';
            
        }

        $user->name = $request->name;
        $user->username = $request->username;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->profileimage=$image_path;
        $user->coverimage=$cover_path;
        $user->user_role_id=2;
        $user->country;
        $user->save();

    

      
    
        $token = Auth::login($user);
        $user->token = $token;
        

        return response()->json([
            'status' => 'Success',
            'data' => $user
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
        $searchUsername = $request->username;
        $query = User::query();
    
        if ($searchUsername !== null) {
            $query->where('username', 'like', '%' . $searchUsername . '%');
        }

        $query->where('user_role_id', '!=', 1);
    
        $users = $query->get();
    
        return response()->json([
            'status' => 'Success',
            'data' => $users,
        ]);
    }
    
    

        public function editProfile(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username,' . $user->id,
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,ico|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('public/images/u_'.$user->id.'_'.$request->username);
            $image_path = "/storage".str_replace('public', '', $imagePath);
        } else {
            $image_path = $user->image; 
        }

        $user->name = $request->name;
        $user->username = $request->username;
        $user->profileimage = $image_path;

        $user->save();

        return response()->json([
            'status' => 'Success',
            'data' => $user
        ]);
    }

    public function changePassword(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'oldpassword' => 'required|string',
            'newpassword' => 'required|string|min:8',
        ]);

        if (!Hash::check($request->oldpassword, $user->password)) {
            return response()->json(['message' => 'Incorrect old password']);
        }

        $user->password = Hash::make($request->newpassword);
        $user->save();

        return response()->json([
        
            'message' => 'Password changed successfully'
        ]);
    }


   
  

}
