<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invitation extends Model
{
    use HasFactory;

    protected $fillable = [
        'team_name',
        'tournament_id',
        'sender_id',
        'invited_user_id',
        'status',
    ];

    public function invitedUser()
    {
        return $this->belongsTo(User::class, 'invited_user_id');
    }
    
    public function tournament()
    {
        return $this->belongsTo(Tournament::class, 'tournament_id');
    }
}
