<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tournament extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'game_id', 'game_mode_id', 'tournament_type_id',
        'start_date', 'end_date', 'is_completed', 'tournament_size','rules'
    ];

    public function game()
    {
        return $this->belongsTo(Game::class);
    }

    public function gameMode()
    {
        return $this->belongsTo(GameMode::class);
    }

    public function tournamentType()
    {
        return $this->belongsTo(TournamentType::class);
    }

    public function brackets()
    {
        return $this->hasMany(Bracket::class);
    }

    public function winners()
    {
        return $this->hasOne(TournamentWinner::class);
    }
        public function teams()
    {
        return $this->hasMany(Team::class);
    }

  
}
