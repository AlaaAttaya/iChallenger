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
use App\Models\Follower; 
use App\Models\Report; 
use App\Models\Message;
use App\Models\Post;
use App\Models\PostLike;
use App\Models\PostComment;
use App\Models\PostUpload;
use App\Models\Notification;
use App\Models\Channel;
use App\Models\ChannelBannedUser;
use App\Models\ChannelModerator;
use App\Models\Game;
use App\Models\GameForum;
use App\Models\GameMode;
use App\Models\Leadboard;
use App\Models\Team;
use App\Models\TeamMember;
use App\Models\Tournament;
use App\Models\TournamentType;
use App\Models\TournamentWinner;

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
        
    public function changeProfilePic(Request $request)
    {
        $user = Auth::user();
    
       
        $request->validate([
            'profileimage' => 'nullable|image|mimes:jpeg,png,jpg,gif,ico|max:2048',
        ]);
    
        if ($request->hasFile('profileimage')) {
           
            $imagePath = $request->file('profileimage')->store('public/users/u_' . $user->id . '_' . $request->username . '/profile/');
            $imagePath = "/storage" . str_replace('public', '', $imagePath);
    
        
            $user->profileimage = $imagePath;
            $user->save();
    
            return response()->json([
                'status' => 'Success',
                'message' => 'Profile picture changed successfully',
                'data' => $user,
            ]);
        }
    
        return response()->json([
            'status' => 'Error',
            'message' => 'No new profile picture uploaded',
        ]);
    }
    
    public function changeCoverPic(Request $request)
    {
        $user = Auth::user();
    
       
        $request->validate([
            'coverimage' => 'nullable|image|mimes:jpeg,png,jpg,gif,ico|max:2048',
        ]);
    
        if ($request->hasFile('coverimage')) {
            
            $imagePath =  $request->file('coverimage')->store('public/users/u_' . $user->id . '_' . $request->username . '/cover/');
            $imagePath = "/storage" . str_replace('public', '', $imagePath);
    
           
            $user->coverimage = $imagePath;
            $user->save();
    
            return response()->json([
                'status' => 'Success',
                'message' => 'Cover picture changed successfully',
                'data' => $user,
            ]);
        }
    
        return response()->json([
            'status' => 'Error',
            'message' => 'No new cover picture uploaded',
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

    
    public function reportUser(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'reported_user_id' => 'required|exists:users,id', 
            'message' => 'required|string|max:255', 
        ]);

        
        $report = new Report();
        $report->user_id = $user->id; 
        $report->reported_user_id = $request->input('reported_user_id'); 
        $report->message = $request->input('message'); 
        $report->save();

        return response()->json([
            'status' => 'Success',
            'message' => 'User reported successfully',
            'data' => $report,
        ]);
    }


    public function sendMessage(Request $request)
    {
        $request->validate([
            'recipient_id' => 'required|exists:users,id',
            'content' => 'required|string',
        ]);

    
        $sender = Auth::user();

        
        $message = new Message([
            'sender_id' => $sender->id,
            'recipient_id' => $request->recipient_id,
            'content' => $request->content,
        ]);

        $message->save();

        return response()->json([
            'status' => 'Success',
            'message' => 'Message sent successfully',
            'data' => $message,
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

        public function createPost(Request $request)
    {   
    
        $request->validate([
            'description' => 'required|string|max:255',
            'game_forum_id' => 'required|exists:game_forums,id',
            'uploads' => 'array',
            'uploads.*' => 'file|mimes:jpeg,png,jpg,gif,mp4,mov,avi,wmv|max:204800', 
        ]);

    
        $post = new Post([
            'user_id' => Auth::user()->id,
            'game_forum_id' => $request->input('game_forum_id'),
            'description' => $request->input('description'),
        ]);

        $post->save();

        
        if ($request->hasFile('uploads')) {
            foreach ($request->file('uploads') as $upload) {
                
                $filePath = $upload->store('public/users/u_' . $user->id . '_' . $request->username . '/posts/');
                $filePath = "/storage" . str_replace('public', '', $filePath);

                $postUpload = new PostUpload([
                    'post_id' => $post->id,
                    'file_path' => $filePath,
                ]);

                $postUpload->save();
            }
        }

        return response()->json([
            'status' => 'Success',
            'message' => 'Post created successfully',
            'data' => $post,
        ]);
    }

        public function deletePost(Request $request)
    {   $postId = $request->input('postId');
        $user=Auth::user();
        $post = Post::find($postId);

        
        if (!$post) {
            return response()->json([
                'status' => 'Error',
                'message' => 'Post not found.',
            ], 404); 
        }

        $post->delete();

        return response()->json([
            'status' => 'Success',
            'message' => 'Post and associated data deleted successfully.',
        ]);
    }

    public function getAllPosts()
    {   
        $user=Auth::user();
        $posts = Post::withCount('postLikes', 'postComments')
                    ->orderBy('created_at', 'desc')
                    ->get();
    
        return response()->json([
            'status' => 'Success',
            'message' => 'Posts retrieved successfully',
            'data' => $posts,
        ]);
    }
    
    public function likePost(Request $request)
    {
        $postId = $request->input('postId');
        $user = Auth::user();

        $post = Post::find($postId);

        if (!$post) {
            return response()->json([
                'status' => 'Error',
                'message' => 'Post not found.',
            ], 404);
        }

        $like = new PostLike([
            'user_id' => $user->id,
            'post_id' => $postId,
        ]);

        $like->save();

        return response()->json([
            'status' => 'Success',
            'message' => 'Post liked successfully',
        ]);
    }

        public function unlikePost(Request $request)
    {
        $postId = $request->input('postId');
        $user = Auth::user();

        $like = PostLike::where('user_id', $user->id)
            ->where('post_id', $postId)
            ->first();

        if (!$like) {
            return response()->json([
                'status' => 'Error',
                'message' => 'Like not found.',
            ], 404);
        }

        $like->delete();

        return response()->json([
            'status' => 'Success',
            'message' => 'Post unliked successfully',
        ]);
    }


        public function createComment(Request $request)
    {
        $postId = $request->input('postId');
        $comment = $request->input('comment');
        $user = Auth::user();

        $post = Post::find($postId);

        if (!$post) {
            return response()->json([
                'status' => 'Error',
                'message' => 'Post not found.',
            ], 404);
        }

        $postComment = new PostComment([
            'user_id' => $user->id,
            'post_id' => $postId,
            'comment' => $comment,
        ]);

        $postComment->save();

        return response()->json([
            'status' => 'Success',
            'message' => 'Comment created successfully',
        ]);
    }


        public function deleteComment(Request $request)
    {
        $commentId = $request->input('commentId');
        $user = Auth::user();

        $comment = PostComment::find($commentId);

        if (!$comment) {
            return response()->json([
                'status' => 'Error',
                'message' => 'Comment not found.',
            ], 404);
        }

        if ($comment->user_id !== $user->id) {
            return response()->json([
                'status' => 'Error',
                'message' => 'You are not authorized to delete this comment.',
            ], 403);
        }

        $comment->delete();

        return response()->json([
            'status' => 'Success',
            'message' => 'Comment deleted successfully',
        ]);
    }

    public function getPostComments(Request $request)
    {  
        $postId = $request->input('postId');
        $user = Auth::user();
        $post = Post::find($postId);
    
        if (!$post) {
            return response()->json([
                'status' => 'Error',
                'message' => 'Post not found.',
            ], 404);
        }
    
        $comments = $post->postComments;
    
        return response()->json([
            'status' => 'Success',
            'message' => 'Comments retrieved successfully',
            'data' => $comments,
        ]);
    }

    public function getPostLikes(Request $request)
    {
        $postId = $request->input('postId');
        $user = Auth::user();
        $post = Post::find($postId);
    
        if (!$post) {
            return response()->json([
                'status' => 'Error',
                'message' => 'Post not found.',
            ], 404);
        }
    
        $likes = $post->postLikes;
    
        return response()->json([
            'status' => 'Success',
            'message' => 'Post likes retrieved successfully',
            'data' => $likes,
        ]);
    }
    
        public function sendNotification($type, $message)
    {
        $user = Auth::user();

        if ($user) {
            $notification = new Notification([
                'user_id' => $user->id,
                'type' => $type,
                'message' => $message,
            ]);

            $notification->save();

            return response()->json([
                'status' => 'Success',
                'message' => 'Notification sent successfully',
                'data' => $notification,
            ]);
        } else {
            return response()->json([
                'status' => 'Error',
                'message' => 'User not authenticated',
            ], 401);
        }
    }

        public function banUserFromChannel(Request $request)
    {
        $userId = $request->input('userId');
        $channelId = $request->input('channelId');
        $user = Auth::user();

        
        $channel = Channel::find($channelId);
        if (!$channel || $channel->user_id !== $user->id) {
            return response()->json([
                'status' => 'Error',
                'message' => 'You are not authorized to perform this action.',
            ], 403);
        }

        
        $existingBan = ChannelBannedUser::where('user_id', $userId)
            ->where('channel_id', $channelId)
            ->first();

        if ($existingBan) {
            return response()->json([
                'status' => 'Error',
                'message' => 'User is already banned from the channel.',
            ]);
        }

        
        $ban = new ChannelBannedUser([
            'user_id' => $userId,
            'channel_id' => $channelId,
        ]);

        $ban->save();

        return response()->json([
            'status' => 'Success',
            'message' => 'User banned from the channel successfully.',
        ]);
    }
    
        public function unbanUserFromChannel(Request $request)
    {
        $userId = $request->input('userId');
        $channelId = $request->input('channelId');
        $user = Auth::user();

        
        $channel = Channel::find($channelId);
        if (!$channel || $channel->user_id !== $user->id) {
            return response()->json([
                'status' => 'Error',
                'message' => 'You are not authorized to perform this action.',
            ], 403);
        }

        
        $existingBan = ChannelBannedUser::where('user_id', $userId)
            ->where('channel_id', $channelId)
            ->first();

        if (!$existingBan) {
            return response()->json([
                'status' => 'Error',
                'message' => 'User is not banned from the channel.',
            ]);
        }

       
        $existingBan->delete();

        return response()->json([
            'status' => 'Success',
            'message' => 'User unbanned from the channel successfully.',
        ]);
    }


        public function addModeratorToChannel(Request $request)
    {
        $userId = $request->input('userId');
        $channelId = $request->input('channelId');
        $user = Auth::user();

        
        $channel = Channel::find($channelId);
        if (!$channel || $channel->user_id !== $user->id) {
            return response()->json([
                'status' => 'Error',
                'message' => 'You are not authorized to perform this action.',
            ], 403);
        }

        
        $existingModerator = ChannelModerator::where('user_id', $userId)
            ->where('channel_id', $channelId)
            ->first();

        if ($existingModerator) {
            return response()->json([
                'status' => 'Error',
                'message' => 'User is already a moderator of the channel.',
            ]);
        }

       
        $moderator = new ChannelModerator([
            'user_id' => $userId,
            'channel_id' => $channelId,
        ]);

        $moderator->save();

        return response()->json([
            'status' => 'Success',
            'message' => 'User added as a moderator to the channel successfully.',
        ]);
    }

        public function removeModeratorFromChannel(Request $request)
    {
        $userId = $request->input('userId');
        $channelId = $request->input('channelId');
        $user = Auth::user();

        
        $channel = Channel::find($channelId);
        if (!$channel || $channel->user_id !== $user->id) {
            return response()->json([
                'status' => 'Error',
                'message' => 'You are not authorized to perform this action.',
            ], 403);
        }

        
        $existingModerator = ChannelModerator::where('user_id', $userId)
            ->where('channel_id', $channelId)
            ->first();

        if (!$existingModerator) {
            return response()->json([
                'status' => 'Error',
                'message' => 'User is not a moderator of the channel.',
            ]);
        }

       
        $existingModerator->delete();

        return response()->json([
            'status' => 'Success',
            'message' => 'User removed as a moderator from the channel successfully.',
        ]);
    }

    public function getLeaderboard(Request $request)
    {
        $searchUsername = $request->input('search');
    
        
        if ($searchUsername) {
            $user = User::where('username', $searchUsername)->first();
    
            if (!$user) {
                return response()->json([
                    'status' => 'Error',
                    'message' => 'User not found.',
                ], 404);
            }
    
            $leaderboardEntry = Leaderboard::where('user_id', $user->id)->first();
    
            if (!$leaderboardEntry) {
                return response()->json([
                    'status' => 'Error',
                    'message' => 'User not found in the leaderboard.',
                ], 404);
            }
    
            return response()->json([
                'status' => 'Success',
                'message' => 'User found in the leaderboard.',
                'data' => [
                    'user' => $user,
                    'leaderboard_entry' => $leaderboardEntry,
                ],
            ]);
        }
    
        
        $leaderboard = Leaderboard::with('user:id,name')
            ->orderByDesc('points')
            ->get();
    
        return response()->json([
            'status' => 'Success',
            'message' => 'Leaderboard rankings retrieved successfully.',
            'data' => $leaderboard,
        ]);
    }
        public function getAllTournaments()
    {
        $tournaments = Tournament::all();

        return response()->json([
            'status' => 'Success',
            'message' => 'All tournaments retrieved successfully.',
            'data' => $tournaments,
        ]);
    }
        public function filterTournaments(Request $request)
    {
       
        $query = Tournament::query();

        if ($request->has('game_id')) {
            $query->where('game_id', $request->input('game_id'));
        }

        if ($request->has('start_date')) {
            $query->where('start_date', '>=', $request->input('start_date'));
        }

        if ($request->has('end_date')) {
            $query->where('end_date', '<=', $request->input('end_date'));
        }

        if ($request->has('game_mode_id')) {
            $query->where('game_mode_id', $request->input('game_mode_id'));
        }

        $filteredTournaments = $query->get();

        return response()->json([
            'status' => 'Success',
            'message' => 'Tournaments filtered successfully.',
            'data' => $filteredTournaments,
        ]);
    }


    public function getUserPosts(Request $request)
    {
        
        $username = $request->input('username');
    
        
        $user = User::where('username', $username)
            ->with('userPosts.userLikes', 'userPosts.userComments')
            ->first();
    
        if (!$user) {
            return response()->json([
                'status' => 'Error',
                'message' => 'User not found.',
            ], 404);
        }
    
       
        $userPosts = $user->userPosts;
    
        
        foreach ($userPosts as $post) {
            $post->like_count = $post->userLikes->count();
            $post->comment_count = $post->userComments->count();
        }
    
        return response()->json([
            'status' => 'Success',
            'message' => 'User posts retrieved successfully.',
            'data' => $userPosts,
        ]);
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
            ->with(['user', 'userLikes', 'userComments'])
            ->get();
    
        
        foreach ($posts as $post) {
            $post->user->like_count = $post->userLikes->count();
            $post->user->comment_count = $post->userComments->count();
        }
    
        return response()->json([
            'status' => 'Success',
            'message' => 'Game forum posts retrieved successfully.',
            'data' => $posts,
        ]);
    }
    
    
    
}
