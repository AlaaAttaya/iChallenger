<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'profileimage',
        'coverimage',
        'is_banned',
        'user_role_id',
        'country',
        'temporary_code', 
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];



       /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }
    public function authentications()
    {
        return $this->hasMany(UserAuthentication::class);
    }

    public function role()
    {
        return $this->belongsTo(UserRole::class, 'user_role_id'); 
    }
        public function isAdmin()
    {
        return $this->user_role_id === 1;
    }
    public function followers()
    {
        return $this->hasMany(Follower::class, 'user_id');
    }

    public function following()
    {
        return $this->hasMany(Follower::class, 'follower_id');
    }
    
    public function channel()
    {
        return $this->hasOne(Channel::class, 'user_id');
    }

    public function channelModerators()
    {
        return $this->hasMany(ChannelModerator::class, 'user_id');
    }

    public function channelBannedUsers()
    {
        return $this->hasMany(ChannelBannedUser::class, 'user_id');
    }
    public function notifications()
    {
        return $this->hasMany(Notification::class, 'user_id');
    }

        public function sentMessages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function receivedMessages()
    {
        return $this->hasMany(Message::class, 'recipient_id');
    }
    public function leaderboard()
    {
        return $this->hasOne(Leaderboard::class, 'user_id');
    }
        public function teams()
    {
        return $this->belongsToMany(Team::class, 'team_members', 'user_id', 'team_id')
            ->withPivot('is_captain');
    }
        public function teamInvitations()
    {
        return $this->hasMany(TeamInvitation::class, 'invited_user_id');
    }
}
