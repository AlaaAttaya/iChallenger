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
use App\Models\Country;
use App\Models\Region;
use App\Models\Game;
use App\Models\GameForum;
use App\Models\Post;
use App\Models\Leaderboard;
use App\Models\TournamentType;
use App\Models\Tournament;
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
        
     
        $user->followers = $user->followers;
        $user->following = $user->following;
        $user->followers_count = $user->followers->count();
        $user->following_count = $user->following->count();
        $user->leaderboard = $user->leaderboard;
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
        $user->followers = $user->followers;
        $user->following = $user->following;
        $user->followers_count = $user->followers->count();
        $user->following_count = $user->following->count();
        $user->leaderboard = $user->leaderboard;
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
        $profileImagePath = $request->file('profileimage')->store('public/users/u_' . $user->id . '_' . $user->username . '/profile/');
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

       Leaderboard::firstOrCreate(['user_id' => $user->id]);
        
        

        $token = Auth::login($user);
        $user->token = $token;
        $user->followers = $user->followers;
        $user->following = $user->following;
        $user->followers_count = $user->followers->count();
        $user->following_count = $user->following->count();
        $user->leaderboard = $user->leaderboard;
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
        $searchUsername = $request->input('username', '');
        $query = User::query();
    
        if ($searchUsername !== null) {
            $query->where('username', 'like',  $searchUsername . '%');
            $query->where('user_role_id', '!=', 1);
        }
    
        $users = $query->get();
    
        foreach ($users as $user) {
            $user->followers = $user->followers;
            $user->following = $user->following;
            $user->followers_count = $user->followers->count();
            $user->following_count = $user->following->count();
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
        $hashedCode = bcrypt($code);
        $user->temporary_code = $hashedCode;
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
        $request->validate([
            'code' => 'required|digits:6',
            'email' => 'required|email|exists:users,email',
        ]);
    
        $user = User::where('email', $request->email)->first();
    
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
    
        if (!password_verify($request->code, $user->temporary_code)) {
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

    public function getGames(Request $request)
    {
        $search = $request->input('search');

        $games = Game::query();

        if (!empty($search)) {
            
            $games->where('name', 'like', $search . '%');
        }
        $games->with('gameModes');
        $games = $games->get();

        return response()->json(['status' => 'Success', 'data' => $games]);
    }
    public function getGameForum(Request $request)
    {   $forumName=$request->input('name');
        $gameForum = GameForum::where('name', $forumName)
            ->with('game')
            ->with('forumPosts') 
            ->first();

        if (!$gameForum) {
           
            return response()->json(['message' => 'Gameforum not found'], 404);
        }

        return response()->json(['data' => $gameForum], 200);
    }
    public function getGameForumPosts(Request $request)
    {
        $forumId = $request->input('ForumId');
    
        $forum = GameForum::find($forumId);
    
        if (!$forum) {
            return response()->json([
                'status' => 'Error',
                'message' => 'Game forum not found.',
            ], 404);
        }
    
        $posts = $forum->forumPosts()
            ->with([
                'user',
                'postLikes',
                'postComments.user', 
                'postUploads'
            ])
            ->get();
    
        foreach ($posts as $post) {
            $likedCount = $post->postLikes->where('is_liked', 1)->count();
            $dislikedCount = $post->postLikes->where('is_liked', 0)->count();
            $post->like_count = $likedCount - $dislikedCount;
            $post->comment_count = $post->postComments->count();
        }
    
        return response()->json([
            'status' => 'Success',
            'message' => 'Game forum posts retrieved successfully.',
            'data' => $posts,
        ]);
    }
    

    public function getPost(Request $request)
    {
        $postId = $request->input('postId');
    
        $post = Post::with([
            'user',
            'postLikes',
            'postComments.user', 
            'postUploads'
        ])->find($postId);
    
        if (!$post) {
            return response()->json([
                'status' => 'Error',
                'message' => 'Post not found.',
            ], 404);
        }
    
        $likedCount = $post->postLikes->where('is_liked', 1)->count();
        $dislikedCount = $post->postLikes->where('is_liked', 0)->count();
        $post->like_count = $likedCount - $dislikedCount;
        $post->comment_count = $post->postComments->count();
    
        return response()->json([
            'status' => 'Success',
            'message' => 'Post retrieved successfully.',
            'data' => $post,
        ]);
    }
    
    
    
    public function getUserPosts(Request $request)
    {
        $username = $request->input('username');
    
       
        $user = User::where('username', $username)
            ->with([
                'userPosts.user',
                'userPosts.postLikes',
                'userPosts.postComments.user',
                'userPosts.postUploads',
                'userPosts.gameForum'
            ])
            ->first();
    
        if (!$user) {
            return response()->json([
                'status' => 'Error',
                'message' => 'User not found.',
            ], 404);
        }
    
      
        $userPosts = $user->userPosts;
    
       
        foreach ($userPosts as $post) {
            $likedCount = $post->postLikes->where('is_liked', 1)->count();
            $dislikedCount = $post->postLikes->where('is_liked', 0)->count();
            $post->like_count = $likedCount - $dislikedCount;
            $post->comment_count = $post->postComments->count();
        }
    
        return response()->json([
            'status' => 'Success',
            'message' => 'User posts retrieved successfully.',
            'data' => $userPosts,
        ]);
    }

    public function getLeaderboard(Request $request)
    {
        $searchQuery = $request->input('searchQuery');
        
        $query = Leaderboard::with('user')
            ->orderByDesc('points');
    
        $leaderboardData = $query->get();
    
        $leaderboardData->map(function ($entry, $index) {
            $entry->user->position = $index + 1;
            return $entry;
        });
    
        if ($searchQuery !== null) {
    
            $filteredData = $leaderboardData->filter(function ($entry) use ($searchQuery) {
                return str_starts_with($entry->user->username, $searchQuery);
            })->values(); 
    
            return response()->json([
                'status' => 'Success',
                'data' => $filteredData->isEmpty() ? [] : $filteredData->toArray(),
            ]);
        }
    
        if ($leaderboardData->isEmpty()) {
            return response()->json([
                'status' => 'Success',
                'data' => [],
            ]);
        }
    
        return response()->json([
            'status' => 'Success',
            'data' => $leaderboardData,
        ]);
    }
    

   
    
    public function getAllTournaments(Request $request)
    {
        $searchQuery = $request->input('searchQuery');
        $query = Tournament::query();
    
        if (!is_null($searchQuery)) {
            $query->where('name', 'LIKE', "$searchQuery%");
        }
    
        $tournaments = $query
            ->with('game', 'gameMode', 'brackets', 'teams.members', 'winners')
            ->get();
    
        return response()->json([
            'status' => 'Success',
            'message' => 'Tournaments retrieved successfully.',
            'data' => $tournaments,
        ]);
    }

    
}
