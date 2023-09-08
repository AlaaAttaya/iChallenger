<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Matching extends Model
{
    use HasFactory;
    protected $fillable = ['bracket_id', 'match_date', 'is_completed', 'winner_id'];

    public function bracket()
    {
        return $this->belongsTo(Bracket::class);
    }

    public function winner()
    {
        return $this->belongsTo(Team::class, 'winner_id');
    }
}
