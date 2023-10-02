<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\UserRole;

class AdminSeeder extends Seeder
{
  
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'username' => 'Admin',
            'email' => 'admin@ichallenger.com',
            'password' => Hash::make('admin111'),
            'profileimage' => '/storage/images/adminpic.png', 
            'coverimage' => '/storage/images/coverpic.png', 
            'is_banned' => false,
            'country' => 'Lebanon',
            'user_role_id' => 1, 
        ]);
    }
}
