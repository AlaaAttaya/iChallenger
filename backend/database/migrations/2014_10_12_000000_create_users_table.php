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
            $table->string('profileimage');
            $table->string('coverimage');
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
    }
};
