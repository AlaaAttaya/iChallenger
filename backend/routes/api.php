<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\EmailController;
Route::group(["middleware" => "auth:api"], function () {


    Route::group(["prefix" => "user"], function () {

        Route::get("search", [AuthController::class, "getAllUsers"]);
        Route::get("profile", [AuthController::class, "profile"]);
        Route::post("logout", [AuthController::class, "logout"]);
        Route::post("refresh", [AuthController::class, "refresh"]);
        Route::post('connectauth', [AuthController::class, 'connectauth']);
        Route::post('disconnectauth', [AuthController::class, 'disconnectauth']);

        Route::get("countries", [UserController::class, "getCountries"]);
        Route::get("regions", [UserController::class, "getRegions"]);

        Route::post('changeprofilepic', [UserController::class, "changeProfilePic"]);
        Route::post('changecoverpic', [UserController::class, "changeCoverPic"]);
        Route::post('editprofile', [UserController::class, "editProfile"]);
        Route::post('changepassword',  [UserController::class, "changePassword"]);
     

       

        Route::post('follow', [UserController::class, "followUser"]);
        Route::post('unfollow', [UserController::class, "unfollowUser"]);
        Route::get('followers', [UserController::class, "getUserFollowers"]);
        Route::get('following', [UserController::class, "getUserFollowing"]);

        Route::post('report', [UserController::class, 'reportUser']);


        Route::post('sendmessage', [UserController::class, 'sendMessage']);
        Route::post('sendnotification', [UserController::class, 'sendNotification']);

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
        Route::get('getuserposts', [UserController::class, 'getUserPosts']);
        Route::get('getgameforumposts', [UserController::class, 'getGameForumPosts']);

        Route::post('channel/banuser', [UserController::class, 'banUserFromChannel']);
        Route::post('channel/unbanuser', [UserController::class, 'unbanUserFromChannel']);
        Route::post('channel/addmoderator', [UserController::class, 'addModeratorToChannel']);
        Route::post('channel/removemoderator', [UserController::class, 'removeModeratorFromChannel']);


       
        Route::get('leaderboard', [UserController::class, 'getLeaderboard']);

        Route::get('tournaments', [UserController::class, 'getAllTournaments']);
        Route::get('filtertournaments', [UserController::class, 'filterTournaments']);

    });


    Route::group(["middleware" => "admin", "prefix" => "admin"], function () {

        Route::post('banuser', [AdminController::class, 'banUser']);
        Route::post('unbanuser', [AdminController::class, 'unbanUser']);
        Route::post('sendemail',[AdminController::class, 'sendEmail']);

        Route::get('getreports', [AdminController::class, 'getReports']);
        Route::get('getdatacards',[AdminController::class,'getData']);
        Route::get('tournamentsbygame', [AdminController::class, 'getTournamentsByGame']);
        Route::get('usersbycountry', [AdminController::class, 'getUsersByCountry']);

        Route::post('creategame', [AdminController::class, 'createGame']);
        Route::post('updategame', [AdminController::class, 'updateGame']);
        Route::post('updateleaderboard', [AdminController::class, 'updateLeaderboard']);

        Route::post('createtournament', [AdminController::class, 'createTournament']);
        Route::post('updatetournament', [AdminController::class, 'updateTournament']);
        Route::post('creatematch', [AdminController::class, 'createMatch']);
        Route::post('markmatchascomplete', [AdminController::class, 'markMatchAsComplete']);
        Route::post('createteam', [AdminController::class, 'createTeam']);
        Route::post('createtournamentwinner', [AdminController::class, 'createTournamentWinner']);

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