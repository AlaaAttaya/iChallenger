<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Follower extends Model
{
    use HasFactory;
    protected $table = 'follows';

    public function followerUser()
    {
        return $this->belongsTo(User::class, 'follower_id');
    }

    public function userBeingFollowed()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    
}
