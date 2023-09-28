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
        Route::post('connectauth', [AuthController::class, 'connectauth']);
        Route::post('disconnectauth', [AuthController::class, 'disconnectauth']);

      

        Route::post('changeprofilepic', [UserController::class, "changeProfilePic"]);
        Route::post('changecoverpic', [UserController::class, "changeCoverPic"]);
        Route::post('editprofile', [UserController::class, "editProfile"]);
        Route::post('changepassword',  [UserController::class, "changePassword"]);
     

       

        Route::post('follow', [UserController::class, "followUser"]);
        Route::post('unfollow', [UserController::class, "unfollowUser"]);
        Route::get('followers', [UserController::class, "getUserFollowers"]);
        Route::get('following', [UserController::class, "getUserFollowing"]);
        Route::get('getfollowingposts', [UserController::class, 'getFollowingPosts']);
        Route::post('report', [UserController::class, 'reportUser']);


        Route::post('storemessage', [UserController::class, 'storeMessage']);
        Route::post('sendnotification', [UserController::class, 'sendNotification']);
        Route::get('getmessages', [UserController::class, 'getMessages']);
        Route::get('getlatestmessagesusers', [UserController::class, 'getLatestMessagesUsers']);
        Route::get('getgames', [UserController::class, 'getGames']);

        Route::post('createpost', [UserController::class, 'createPost']);
        Route::delete('deletepost', [UserController::class, 'deletePost']);
        Route::get('getallposts', [UserController::class, 'getAllPosts']);

        Route::post('likepost', [UserController::class, 'likePost']);
        Route::post('unlikepost', [UserController::class, 'unlikePost']);
        Route::post('dislikepost', [UserController::class, 'dislikePost']);

        Route::post('createcomment', [UserController::class, 'createComment']);
        Route::delete('deletecomment', [UserController::class, 'deleteComment']);
        Route::get('getpostcomments', [UserController::class, 'getPostComments']);
        Route::get('getpostlikes', [UserController::class, 'getPostLikes']);
     
       
       
        Route::post('channel/banuser', [UserController::class, 'banUserFromChannel']);
        Route::post('channel/unbanuser', [UserController::class, 'unbanUserFromChannel']);
        Route::post('channel/addmoderator', [UserController::class, 'addModeratorToChannel']);
        Route::post('channel/removemoderator', [UserController::class, 'removeModeratorFromChannel']);


       
        Route::get('userleaderboard', [UserController::class, 'getUserLeaderboard']);

       
        Route::post('checktournament', [UserController::class, 'checkTournament']);

        Route::post('createteam', [UserController::class, 'createTeam']);
        Route::delete('deleteteam', [UserController::class, 'deleteTeam']);

        Route::post('blockuser', [UserController::class, 'blockUser']);
        Route::get('getblockedusers', [UserController::class, 'getBlockedUsers']);
        Route::post('unblockuser', [UserController::class, 'unblockUser']);


        Route::post('generateresponse',[UserController::class,'generateResponse']);

        Route::post('sendinvitation', [UserController::class, 'sendInvitation']);
        Route::get('getinvitations', [UserController::class, 'getInvitations']);
        Route::post('acceptinvitation', [UserController::class, 'acceptInvitation']);
        Route::post('cancelinvitation', [UserController::class, 'cancelInvitation']);

    });


    Route::group(["middleware" => "admin", "prefix" => "admin"], function () {

        Route::post('banuser', [AdminController::class, 'banUser']);
        Route::post('unbanuser', [AdminController::class, 'unbanUser']);
        Route::post('sendemail',[AdminController::class, 'sendEmail']);

        Route::get("contactus", [AdminController::class, "getContactus"]);
        Route::get('getreports', [AdminController::class, 'getReports']);
        Route::get('getdatacards',[AdminController::class,'getData']);

        Route::get('tournamentsbygame', [AdminController::class, 'getTournamentsByGame']);
        Route::get('usersbycountry', [AdminController::class, 'getUsersByCountry']);
        Route::get('searchentities', [AdminController::class, 'searchEntities']);
        Route::post('creategame', [AdminController::class, 'createGame']);
        Route::post('updategame', [AdminController::class, 'updateGame']);
        Route::post('updateleaderboard', [AdminController::class, 'updateLeaderboard']);

        Route::post('createtournament', [AdminController::class, 'createTournament']);
        Route::post('updatetournament', [AdminController::class, 'updateTournament']);
        Route::post('creatematch', [AdminController::class, 'createMatch']);
        Route::post('markmatchascomplete', [AdminController::class, 'markMatchAsComplete']);
        Route::post('createteam', [AdminController::class, 'createTeam']);
        Route::post('createtournamentwinner', [AdminController::class, 'createTournamentWinner']);

        Route::get("fetchtournamentdata", [AdminController::class, "fetchTournamentData"]);
        
       

    });


});


Route::group(["prefix" => "guest"], function () {
    
    Route::get("unauthorized", [AuthController::class, "unauthorized"])->name("unauthorized");
    Route::post("login", [AuthController::class, "login"]);
    Route::post("register", [AuthController::class, "register"]);

    Route::post("submitcontactus", [AuthController::class, "submitContactus"]);
    
    Route::get("countries", [AuthController::class, "getCountries"]);
    Route::get("regions", [AuthController::class, "getRegions"]);

    Route::post("resetpasswordcode", [AuthController::class, "resetPasswordCode"]); 
    Route::post("verifycode", [AuthController::class, "verifyCode"]); 
    Route::post("resetpassword", [AuthController::class, "resetPassword"]);

    Route::get("search", [AuthController::class, "getAllUsers"]);
    
 

    Route::get('getgames', [AuthController::class, 'getGames']);
    Route::get('getgameforum', [AuthController::class, 'getGameForum']);
    Route::get('getgameforumposts', [AuthController::class, 'getGameForumPosts']);

    Route::get('getpost', [AuthController::class, 'getPost']);
    Route::get('getuserposts', [AuthController::class, 'getUserPosts']);
    Route::get('getleaderboard', [AuthController::class, 'getLeaderboard']);
    Route::get('gettournaments', [AuthController::class, 'getAllTournaments']);
    Route::get('getopentournaments', [AuthController::class, 'getOpenTournaments']);
    Route::get('gettournamentpage', [AuthController::class, 'getTournamentPage']);

    Route::get('getusersstats',[AuthController::class,'getUsersStats']);
});