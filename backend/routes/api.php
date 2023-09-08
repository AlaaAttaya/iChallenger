<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\EmailController;
Route::group(["middleware" => "auth:api"], function () {


    Route::group(["prefix" => "user"], function () {

        Route::get("profile", [AuthController::class, "profile"]);
        Route::post("logout", [AuthController::class, "logout"]);
        Route::post("refresh", [AuthController::class, "refresh"]);
        Route::get("search", [AuthController::class, "getAllUsers"]);
        Route::post('editprofile', [UserController::class, "editProfile"]);
        Route::post('changepassword',  [UserController::class, "changePassword"]);
        Route::get("countries", [UserController::class, "getCountries"]);
        Route::get("regions", [UserController::class, "getRegions"]);
        Route::post('connectauth', [AuthController::class, 'connectauth']);
        Route::post('disconnectauth', [AuthController::class, 'disconnectauth']);
    });


    Route::group(["middleware" => "admin", "prefix" => "admin"], function () {
        Route::post('banuser', [AdminController::class, 'banUser']);
        Route::post('unbanuser', [AdminController::class, 'unbanUser']);
        Route::post('sendemail',[AdminController::class, 'sendEmail']);
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