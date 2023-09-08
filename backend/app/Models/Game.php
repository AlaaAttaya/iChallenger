<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    use HasFactory;
    protected $fillable = ['name'];

    public function gameModes()
    {
        return $this->hasMany(GameMode::class);
    }

    public function forum()
    {
        return $this->hasOne(GameForum::class);
    }

    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    public function tournaments()
    {
        return $this->hasMany(Tournament::class);
    }
}
