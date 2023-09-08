<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
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
            $table->string('name');
            $table->timestamps();
        });

        
        Schema::create('game_forums', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('game_id');
            $table->string('name'); 
            
            $table->timestamps();

           
            $table->foreign('game_id')->references('id')->on('games')->onDelete('cascade');
        });

       
        Schema::create('game_modes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('game_id');
            $table->string('name');
          
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
    }

    /**
     * Reverse the migrations.
     */
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
    }
};
