<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\EmailController;
Route::group(["middleware" => "auth:api"], function () {


    Route::group(["prefix" => "user"], function () {

        Route::get("countries", [UserController::class, "getCountries"]);
        Route::get("regions", [UserController::class, "getRegions"]);

        Route::get("search", [AuthController::class, "getAllUsers"]);
        Route::get("profile", [AuthController::class, "profile"]);
        Route::post("logout", [AuthController::class, "logout"]);
        Route::post("refresh", [AuthController::class, "refresh"]);

        Route::post('changeprofilepic', [UserController::class, "changeProfilePic"]);
        Route::post('changecoverpic', [UserController::class, "changeCoverPic"]);
        Route::post('editprofile', [UserController::class, "editProfile"]);
        Route::post('changepassword',  [UserController::class, "changePassword"]);
     

        Route::post('connectauth', [AuthController::class, 'connectauth']);
        Route::post('disconnectauth', [AuthController::class, 'disconnectauth']);

        Route::post('follow', [UserController::class, "followUser"]);
        Route::post('unfollow', [UserController::class, "unfollowUser"]);
        Route::get('followers', [UserController::class, "getUserFollowers"]);
        Route::get('following', [UserController::class, "getUserFollowing"]);

        Route::post('report', [UserController::class, 'reportUser']);


        Route::post('sendmessage', [UserController::class, 'sendMessage']);
       
        Route::get('getgames', [UserController::class, 'getGames']);

        Route::post('createpost', [UserController::class, 'createPost']);
        Route::delete('deletepost', [UserController::class, 'deletePost']);
        Route::get('getallposts', [UserController::class, 'getAllPosts']);
        Route::post('likepost', [UserController::class, 'likePost']);
        Route::post('unlikepost', [UserController::class, 'unlikePost']);
        Route::post('createcomment', [UserController::class, 'createComment']);
        Route::delete('deletecomment', [UserController::class, 'deleteComment']);
        Route::get('getpostcomments', [UserController::class, 'getPostComments']);
        Route::get('getpostlikes', [UserController::class, 'getPostLikes']);
    });


    Route::group(["middleware" => "admin", "prefix" => "admin"], function () {
        Route::post('banuser', [AdminController::class, 'banUser']);
        Route::post('unbanuser', [AdminController::class, 'unbanUser']);
        Route::post('sendemail',[AdminController::class, 'sendEmail']);
        Route::get('getreports', [AdminController::class, 'getReports']);

        
        Route::post('creategame', [AdminController::class, 'createGame']);
        Route::post('updategame', [AdminController::class, 'updateGame']);


    });


});


Route::group(["prefix" => "guest"], function () {
    
    Route::get("unauthorized", [AuthController::class, "unauthorized"])->name("unauthorized");
    Route::post("login", [AuthController::class, "login"]);
    Route::post("register", [AuthController::class, "register"]);

    Route::post("submitcontactus", [AuthController::class, "submitContactus"]);
    Route::get("contactus", [AuthController::class, "getContactus"]);

    Route::post("resetpasswordcode", [AuthController::class, "resetPasswordCode"]); 
    Route::post("verifycode", [AuthController::class, "verifyCode"]); 
    Route::post("resetpassword", [AuthController::class, "resetPassword"]);
});