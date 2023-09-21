<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'game_forum_id',
        'description',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function gameForum()
    {
        return $this->belongsTo(GameForum::class);
    }

    public function postUploads()
    {
        return $this->hasMany(PostUpload::class);
    }

    public function postLikes()
    {
        return $this->hasMany(PostLike::class);
    }

    public function postComments()
    {
        return $this->hasMany(PostComment::class);
    }
}
