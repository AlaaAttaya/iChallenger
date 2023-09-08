<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Channel extends Model
{
    use HasFactory;
    protected $fillable = ['user_id', 'name'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function moderators()
    {
        return $this->hasMany(ChannelModeration::class);
    }

    public function bannedUsers()
    {
        return $this->hasMany(ChannelBannedUser::class);
    }
}
