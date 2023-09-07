<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;

Route::group(["middleware" => "auth:api"], function () {


    Route::group(["prefix" => "user"], function () {

        Route::get("profile", [AuthController::class, "profile"]);
        Route::post("logout", [AuthController::class, "logout"]);
        Route::post("refresh", [AuthController::class, "refresh"]);
        Route::get("search", [AuthController::class, "getAllUsers"]);
        Route::post('editprofile', [UserController::class, "editProfile"]);
        Route::post('changepassword',  [UserController::class, "changePassword"]);
    });


    Route::group(["middleware" => "admin", "prefix" => "admin"], function () {
    
    });


});


Route::group(["prefix" => "guest"], function () {
    
    Route::get("unauthorized", [AuthController::class, "unauthorized"])->name("unauthorized");
    Route::post("login", [AuthController::class, "login"]);
    Route::post("register", [AuthController::class, "register"]);

});