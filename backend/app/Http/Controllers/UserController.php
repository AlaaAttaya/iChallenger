<?php
namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log; 
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
use App\Models\BlockedUser;
use App\Events\MessageSent;
use GuzzleHttp\Client;
class UserController extends Controller
{
   
    public function editProfile(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username,' . $user->id,
            
            'country' => 'required|string',
        ]);


        $user->name = $request->name;
        $user->username = $request->username;
        $user->country = $request->country;
        $user->save();
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
        
    public function changeProfilePic(Request $request)
    {
        $user = Auth::user();
    
       
        $request->validate([
            'profileimage' => 'nullable|image|mimes:jpeg,png,jpg,gif,ico|max:2048',
        ]);
    
        if ($request->hasFile('profileimage')) {
           
            $imagePath = $request->file('profileimage')->store('public/users/u_' . $user->id . '_' . $user->username . '/profile/');
            $imagePath = "/storage" . str_replace('public', '', $imagePath);
    
        
            $user->profileimage = $imagePath;
            $user->save();
            $user->followers = $user->followers;
            $user->following = $user->following;
            $user->followers_count = $user->followers->count();
            $user->following_count = $user->following->count();
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
            
            $imagePath =  $request->file('coverimage')->store('public/users/u_' . $user->id . '_' . $user->username . '/cover/');
            $imagePath = "/storage" . str_replace('public', '', $imagePath);
    
           
            $user->coverimage = $imagePath;
            $user->save();
            $user->followers = $user->followers;
            $user->following = $user->following;
            $user->followers_count = $user->followers->count();
            $user->following_count = $user->following->count();
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

 
    

    //Follow

    public function followUser(Request $request)
    {
        $username = $request->input('username');
        $user = Auth::user();
        $targetUser = User::where('username', $username)->first();
    
        if (!$targetUser) {
            return response()->json(['message' => 'User not found'], 404);
        }
    
        if ($user->username === $targetUser->username) {
            return response()->json(['message' => 'You cannot follow yourself'], 400);
        }
        $user->followers = $user->followers;
        $user->following = $user->following;
        $user->followers_count = $user->followers->count();
        $user->following_count = $user->following->count();
        $user->leaderboard = $user->leaderboard;

        if (!$user->isFollowing($targetUser)) {
    
            $follower = new Follower();
            $follower->user_id = $targetUser->id;
            $follower->follower_id = $user->id;
            $follower->save();
    
            return response()->json(['message' => 'You are now following ' . $targetUser->username, 'user' => $user]);
        }
    
        return response()->json(['message' => 'You are already following ' . $targetUser->username, 'user' => $user]);
    }
    
    public function unfollowUser(Request $request)
    {
        $username = $request->input('username');
        $user = Auth::user();
        $targetUser = User::where('username', $username)->first();
    
        if (!$targetUser) {
            return response()->json(['message' => 'User not found'], 404);
        }
    
        if ($user->username === $targetUser->username) {
            return response()->json(['message' => 'You cannot unfollow yourself'], 400);
        }

        $user->followers = $user->followers;
        $user->following = $user->following;
        $user->followers_count = $user->followers->count();
        $user->following_count = $user->following->count();
        $user->leaderboard = $user->leaderboard;

        if ($user->isFollowing($targetUser)) {
    
            $follower = Follower::where('user_id', $targetUser->id)->where('follower_id', $user->id)->first();
            if ($follower) {
                $follower->delete();
            }
    
            return response()->json(['message' => 'You have unfollowed ' . $targetUser->username, 'user' => $user]);
        }
    
        return response()->json(['message' => 'You are not following ' . $targetUser->username, 'user' => $user]);
    }
    

    public function getUserFollowers()
    {
        $user = Auth::user();
    
        $followersCount = $user->followers;
        $followers = $user->followers;
    
        return response()->json(['followers_count' => $followersCount, 'followers' => $followers]);
    }
    
    public function getUserFollowing()
    {
        $user = Auth::user();
    
        $followingCount = $user->following;
        $following = $user->following;
    
        return response()->json(['following_count' => $followingCount, 'following' => $following]);
    }

    
    public function reportUser(Request $request)
{
    $user = Auth::user();

    $request->validate([
        'reported_user' => 'required|string', 
        'message' => 'required|string|max:255',
    ]);

   
    $reportedUser = User::where('username', $request->input('reported_user'))
        ->orWhere('email', $request->input('reported_user'))
        ->first();

    if (!$reportedUser) {
        return response()->json([
            'status' => 'Error',
            'message' => 'User not found.',
        ], 404);
    }

    $report = new Report();
    $report->user_id = $user->id;
    $report->reported_user_id = $reportedUser->id;
    $report->message = $request->input('message');
    $report->save();

    return response()->json([
        'status' => 'Success',
        'message' => 'User reported successfully',
        'data' => $report,
    ]);
}



    public function storeMessage(Request $request)
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

    
      

        event(new MessageSent($message, $request->recipient_id,$sender));

        return response()->json([
            'status' => 'Success',
            'message' => 'Message sent successfully',
            'data' => $message,
        ]);
    }
   
    public function getMessages(Request $request)
    {
        $username = $request->input('username');
        $user = Auth::user();
    
        $otherUser = User::where('username', $username)->first();
    
        if (!$otherUser) {
            return response()->json([
                'status' => 'Error',
                'message' => 'User not found.',
            ], 404);
        }
    
     
        $isBlocked = $user->blockedUsers->contains($otherUser);
    
     
        $sentMessages = $user->sentMessages()
            ->where('recipient_id', $otherUser->id)
            ->get();
    
      
        $receivedMessages = $user->receivedMessages()
            ->where('sender_id', $otherUser->id)
            ->get();
    
   
        $response = [
            'status' => 'Success',
            'sentMessages' => $sentMessages,
            'receivedMessages' => $receivedMessages,
            'blocked' => $isBlocked,
        ];
    
        return response()->json($response);
    }
    
    public function getLatestMessagesUsers()
    {
        $user = Auth::user();
    
       
        $uniqueSenders = $user->receivedMessages()
            ->groupBy('sender_id')
            ->pluck('sender_id');
    
      
        $latestMessages = Message::whereIn('sender_id', $uniqueSenders)
            ->where('recipient_id', $user->id)
            ->oldest('created_at')
            ->get();
    
       
        $blockedUserIds = $user->blockedUsers()->pluck('blocked_user_id')->toArray();
    
      
        $senders = User::whereIn('id', $uniqueSenders)->get();
    
      
        $latestMessagesBySender = [];
        foreach ($latestMessages as $message) {
            $senderId = $message->sender_id;
            $latestMessagesBySender[$senderId] = $message;
        }
    
   
        $sendersWithLatestMessages = [];
        foreach ($senders as $sender) {
            $message = $latestMessagesBySender[$sender->id] ?? null;
    
            $isBlocked = in_array($sender->id, $blockedUserIds);
    
            $sendersWithLatestMessages[] = [
                'sender' => $sender,
                'latestMessage' => $message,
                'blocked' => $isBlocked,
            ];
        }
    
        return response()->json([
            'status' => 'Success',
            'sendersWithLatestMessages' => $sendersWithLatestMessages,
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
     $user=Auth::user();
        $request->validate([
            'description' => 'required|string|max:255',
            'game_forum_id' => 'required|exists:game_forums,id',
            'uploads' => 'array',
            'uploads.*' => 'file|mimes:jpeg,png,jpg,gif,mp4,mov,avi,wmv|max:409600', 
        ]);

    
        $post = new Post([
            'user_id' => $user->id,
            'game_forum_id' => $request->input('game_forum_id'),
            'description' => $request->input('description'),
        ]);

        $post->save();

        
        if ($request->hasFile('uploads')) {
            foreach ($request->file('uploads') as $upload) {
                
                $filePath = $upload->store('public/users/u_' . $user->id . '_' . $user->username . '/posts/');
                $filePath = "/storage" . str_replace('public', '', $filePath);

                $postUpload = new PostUpload([
                    'file_path' => $filePath,
                ]);
                $post->postUploads()->save($postUpload);
              
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
    {   $user = Auth::user();
        $postId = $request->input('postId');
     

        $post = Post::find($postId);

        if (!$post) {
            return response()->json([
                'status' => 'Error',
                'message' => 'Post not found.',
            ], 404);
        }

       
        $existingLike = PostLike::where('user_id', $user->id)
            ->where('post_id', $postId)
            ->first();

        if (!$existingLike) {
            $like = new PostLike([
                'user_id' => $user->id,
                'post_id' => $postId,
            ]);

            $like->save();
        } else {
        
            $existingLike->is_liked = true;
            $existingLike->save();
        }

        return response()->json([
            'status' => 'Success',
            'message' => 'Post liked successfully',
        ]);
    }

        public function dislikePost(Request $request)
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

      
        $existingLike = PostLike::where('user_id', $user->id)
            ->where('post_id', $postId)
            ->first();

        if (!$existingLike) {
            $like = new PostLike([
                'user_id' => $user->id,
                'post_id' => $postId,
                'is_liked' => false, 
            ]);

            $like->save();
        } else {
           
            $existingLike->is_liked = false; 
            $existingLike->save();
        }

        return response()->json([
            'status' => 'Success',
            'message' => 'Post disliked successfully',
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
            'message' => 'Like or dislike removed successfully',
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
    
        if (!$user) {
            return response()->json([
                'status' => 'Error',
                'message' => 'User not authenticated',
            ], 401);
        }
    
      
        $notification = new Notification([
            'user_id' => $user->id,
            'type' => $type,
            'message' => $message,
        ]);
    
        
        $notification->save();
    
        event(new NotificationSentEvent($notification));
    
        return response()->json([
            'status' => 'Success',
            'message' => 'Notification sent successfully',
            'data' => $notification,
        ]);
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

    public function getUserLeaderboard(Request $request)
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

  
    public function getFollowingPosts(Request $request)
    {
      
        $user = Auth::user();
    
       
        $followingUsers = $user->following;
    
       
        $followingPosts = Post::whereIn('user_id', $followingUsers->pluck('id'))
            ->with([
                'user',
                'postLikes',
                'postComments.user',
                'postUploads',
                'gameForum',
            ])
            ->get();
    
     
        $followingPosts->each(function ($post) {
            $likedCount = $post->postLikes->where('is_liked', 1)->count();
            $dislikedCount = $post->postLikes->where('is_liked', 0)->count();
            $post->like_count = $likedCount - $dislikedCount;
            $post->comment_count = $post->postComments->count();
        });
    
        return response()->json([
            'status' => 'Success',
            'message' => 'Following posts retrieved successfully.',
            'data' => $followingPosts,
        ]);
    }

  
        public function blockUser(Request $request)
    {
        $user = Auth::user();

        
        $request->validate([
            'username' => 'required|string',
        ]);

        $usernameToBlock = $request->input('username');

    
        $userToBlock = User::where('username', $usernameToBlock)->first();

    
        if ($user->id === $userToBlock->id) {
            return response()->json(['error' => 'You cannot block yourself.'], 400);
        }


        if ($user->blockedUsers->contains($userToBlock->id)) {
            return response()->json(['error' => 'User is already blocked.'], 400);
        }

    
        $user->blockedUsers()->attach($userToBlock->id);

        return response()->json(['message' => 'User blocked successfully.']);
    }
    public function getBlockedUsers()
    {
        $user = Auth::user();
        $blockedUsers = $user->blockedUsers;
    
        return response()->json([
            'status' => 'Success',
            'message' => 'Blocked users retrieved successfully.',
            'data' => $blockedUsers,
        ]);
    }
        public function unblockUser(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'username' => 'required|string',
        ]);

        $usernameToUnblock = $request->input('username');

        $userToUnblock = User::where('username', $usernameToUnblock)->first();

        if (!$userToUnblock) {
            return response()->json(['error' => 'User not found.'], 404);
        }

        if (!$user->blockedUsers->contains($userToUnblock->id)) {
            return response()->json(['error' => 'User is not blocked.'], 400);
        }

        
        $user->blockedUsers()->detach($userToUnblock->id);

        return response()->json(['message' => 'User unblocked successfully.']);
    }
    public function generateResponse(Request $request)
    {  
        $user=Auth::user();
        $userMessage = $request->input('user_message', '');
        $maxTokenCount = 70; 
        $temperature = 0.2;
    
        $messages = [
            [
                'role' => 'system',
                'content' => 'You are a gaming tournament expert.',
            ],
            [
                'role' => 'user',
                'content' => $userMessage,
            ],
        ];
    
        $client = new Client();
    
        $response = $client->post('https://api.openai.com/v1/engines/text-davinci-002/completions', [
         
            'headers' => [
                'Content-Type' => 'application/json',
                'Authorization' => 'Bearer ' . env('OPENAI_API_KEY'),
            ],
            'json' => [
                'prompt' => implode("\n", array_column($messages, 'content')),
                'max_tokens' => $maxTokenCount, 
                'temperature' => $temperature, 
            ],
         
        ]);
    
        $responseData = json_decode($response->getBody(), true);
    
        $generatedText = $responseData['choices'][0]['text'];
        $tokenCount = $responseData['usage']['total_tokens'];
    
        return response()->json([
            'generated_text' => $generatedText,
            'token_count' => $tokenCount,
        ]);
    }
    

}
