<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TournamentWinner extends Model
{
    use HasFactory;

    protected $fillable = ['tournament_id', 'winner_id'];

    public function tournament()
    {
        return $this->belongsTo(Tournament::class);
    }

    public function winner()
    {
        return $this->belongsTo(Team::class, 'winner_id');
    }
}
