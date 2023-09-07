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
