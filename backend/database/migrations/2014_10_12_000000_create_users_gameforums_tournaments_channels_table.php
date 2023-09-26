<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('username')->unique();
            $table->string('country');
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('profileimage')->default('/storage/images/profilepic.png');
            $table->string('coverimage')->default('/storage/images/coverpic.png'); 
            $table->string('temporary_code')->nullable();
            $table->timestamp('temporary_code_expiration')->nullable();
            $table->boolean('is_banned')->default(false);
            $table->unsignedBigInteger('user_role_id');
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('user_authentications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->string('provider');
            $table->string('auth_id');
            $table->timestamps();
        });

        Schema::create('user_roles', function (Blueprint $table) {
            $table->id();
            $table->string('role'); 
            $table->timestamps();
        });

        Schema::create('follows', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('follower_id');
            $table->unsignedBigInteger('user_id');
            $table->timestamps();

          
            $table->foreign('follower_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->unique(['follower_id', 'user_id']);
        });
       

        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('reported_user_id'); 
            $table->text('message'); 
            $table->timestamps();

            
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('reported_user_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('sender_id');
            $table->unsignedBigInteger('recipient_id');
            $table->text('content');
            $table->timestamps();
            
            
            $table->foreign('sender_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('recipient_id')->references('id')->on('users')->onDelete('cascade');
        });

      
         Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('gameimage')->default('/storage/images/UploadImage.png');
            $table->timestamps();
        });

        
        Schema::create('game_forums', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('game_id');
            $table->string('name')->unique(); 
            
            $table->timestamps();

           
            $table->foreign('game_id')->references('id')->on('games')->onDelete('cascade');
        });

       
        Schema::create('game_modes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('game_id');
            $table->string('name');
            $table->unsignedSmallInteger('max_players_per_team')->default(1); 
            $table->timestamps();

        
            $table->foreign('game_id')->references('id')->on('games')->onDelete('cascade');
        });

        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('game_forum_id'); 
            $table->text('description');
            $table->timestamps();
            $table->foreign('game_forum_id')->references('id')->on('game_forums')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::create('post_uploads', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('post_id');
            $table->string('file_path');
            $table->timestamps();

            $table->foreign('post_id')->references('id')->on('posts')->onDelete('cascade');
        });


        Schema::create('post_likes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('post_id');
            $table->boolean('is_liked')->default(true); 
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('post_id')->references('id')->on('posts')->onDelete('cascade');
        });

        Schema::create('post_comments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('post_id');
            $table->text('comment');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('post_id')->references('id')->on('posts')->onDelete('cascade');
        });


        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('type');
            $table->text('message'); 
            $table->boolean('read')->default(false); 
            $table->timestamps();
            
           
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });



        Schema::create('channels', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->unique();
            $table->string('name')->unique();
            $table->timestamps();
         
           
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
         });


         Schema::create('channel_moderators', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('channel_id');
            $table->unsignedBigInteger('user_id');
            $table->timestamps();
         
            
            $table->foreign('channel_id')->references('id')->on('channels')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
         });


         Schema::create('channel_banned_users', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('channel_id');
            $table->unsignedBigInteger('user_id');
            $table->timestamps();
         
           
            $table->foreign('channel_id')->references('id')->on('channels')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
         });
         
         Schema::create('leaderboard', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->unique();
            $table->integer('won')->default(0);
            $table->integer('lost')->default(0);
            $table->integer('points')->default(0);
            $table->timestamps();
        });
        Schema::create('tournament_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
           
            $table->timestamps();
        });
        Schema::create('tournaments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedBigInteger('game_id');
            $table->unsignedBigInteger('game_mode_id');
            $table->unsignedBigInteger('tournament_type_id');
            $table->datetime('start_date');
            $table->datetime('end_date');
            $table->boolean('is_completed')->default(false);
            $table->text('rules')->nullable();
            $table->integer('tournament_points')->default(0);
            $table->integer('tournament_size');
            $table->timestamps();
        });
        
        Schema::create('brackets', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tournament_id');
            $table->foreign('tournament_id')->references('id')->on('tournaments')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('matches', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('bracket_id');
            $table->unsignedBigInteger('team1_id');
            $table->unsignedBigInteger('team2_id'); 
            $table->date('match_date');
            $table->boolean('is_completed')->default(false);
            $table->unsignedBigInteger('winner_id')->nullable();
            $table->timestamps();
        
            $table->foreign('bracket_id')->references('id')->on('brackets')->onDelete('cascade');
            $table->foreign('team1_id')->references('id')->on('teams')->onDelete('cascade');
            $table->foreign('team2_id')->references('id')->on('teams')->onDelete('cascade');
        });


        Schema::create('teams', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedBigInteger('captain_id')->nullable();
            $table->unsignedBigInteger('tournament_id')->nullable();
            $table->foreign('tournament_id')->references('id')->on('tournaments')->onDelete('cascade');
            $table->foreign('captain_id')->references('id')->on('users')->onDelete('set null');
            $table->timestamps();
        });

    
        Schema::create('team_members', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('team_id');
            $table->unsignedBigInteger('user_id');
            $table->boolean('is_captain')->default(false);
            $table->foreign('team_id')->references('id')->on('teams')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('invitations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('team_id');
            $table->unsignedBigInteger('invited_user_id');
            $table->string('status');
            $table->timestamps();
        });

        Schema::create('tournament_winners', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tournament_id');
            $table->unsignedBigInteger('winner_id'); 
            $table->timestamps();
        
            $table->foreign('tournament_id')->references('id')->on('tournaments')->onDelete('cascade');
            $table->foreign('winner_id')->references('id')->on('teams')->onDelete('cascade');
        });
        
        Schema::create('blocked', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('blocked_user_id'); 
            $table->timestamps();

           
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('blocked_user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('user_authentications');
        Schema::dropIfExists('user_roles');
        
        Schema::dropIfExists('follows');

        Schema::dropIfExists('reports');

        Schema::dropIfExists('messages');
        Schema::dropIfExists('notifications');

        Schema::dropIfExists('games');
        Schema::dropIfExists('game_modes');
        Schema::dropIfExists('game_forums');

        Schema::dropIfExists('posts');
        Schema::dropIfExists('post_uploads');
        Schema::dropIfExists('post_likes');
        Schema::dropIfExists('post_comments');

        Schema::dropIfExists('channels');
        Schema::dropIfExists('channel_moderators');
        Schema::dropIfExists('channel_banned_users');

        Schema::dropIfExists('leaderboard');
        Schema::dropIfExists('tournaments');
        Schema::dropIfExists('brackets');
        Schema::dropIfExists('matches');
        Schema::dropIfExists('teams');
        Schema::dropIfExists('team_members');
        Schema::dropIfExists('invitations');
        Schema::dropIfExists('tournament_winners');
        Schema::dropIfExists('tournament_types');
        Schema::dropIfExists('blocked');
    }
};
