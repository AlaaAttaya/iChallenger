<?php
namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use App\Models\User;
use App\Models\Country;
use App\Models\Region;

use Illuminate\Support\Facades\Log; 

class UserController extends Controller
{
   
    public function editProfile(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username,' . $user->id,
            'email' => 'required|string|max:255|unique:users,email,' . $user->id,
            'country' => 'required|string',
        ]);


        $user->name = $request->name;
        $user->username = $request->username;
        $user->email = $request->email;
        $user->country = $request->country;
        $user->save();

        return response()->json([
            'status' => 'Success',
            'data' => $user
        ]);
    }
        //changecover/profilepic
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
    

    //Follow

    public function followUser(Request $request)
    {    $userId=$request->input('user_id');
        $user = Auth::user();
        $targetUser = User::find($userId);

        if (!$targetUser) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if ($user->id === $targetUser->id) {
            return response()->json(['message' => 'You cannot follow yourself'], 400);
        }

       
        if (!$user->isFollowing($targetUser)) {
            $user->follow($targetUser);
            return response()->json(['message' => 'You are now following ' . $targetUser->username]);
        }

        return response()->json(['message' => 'You are already following ' . $targetUser->username]);
    }

    public function unfollowUser(Request $request)
    {   $userId=$request->input('user_id');
        $user = Auth::user();
        $targetUser = User::find($userId);

        if (!$targetUser) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if ($user->id === $targetUser->id) {
            return response()->json(['message' => 'You cannot unfollow yourself'], 400);
        }

        
        if ($user->isFollowing($targetUser)) {
            $user->unfollow($targetUser);
            return response()->json(['message' => 'You have unfollowed ' . $targetUser->username]);
        }

        return response()->json(['message' => 'You are not following ' . $targetUser->username]);
    }

    public function getUserFollowers()
    {
        $user = Auth::user();
    
        $followersCount = $user->followers->count();
        $followers = $user->followers;
    
        return response()->json(['followers_count' => $followersCount, 'followers' => $followers]);
    }
    
    public function getUserFollowing()
    {
        $user = Auth::user();
    
        $followingCount = $user->following->count();
        $following = $user->following;
    
        return response()->json(['following_count' => $followingCount, 'following' => $following]);
    }
   
}
