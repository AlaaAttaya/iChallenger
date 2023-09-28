<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'captain_id' , 'tournament_id'];

    public function captain()
    {
        return $this->belongsTo(User::class, 'captain_id');
    }

    public function members()
    {
        return $this->hasMany(TeamMember::class);
    }


    public function tournaments()
    {
        return $this->hasMany(TournamentWinner::class);
    }
        public function tournament()
    {
        return $this->belongsTo(Tournament::class);
    }
}
