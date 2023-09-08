<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log; 
use Illuminate\Support\Carbon;
use App\Http\Controllers\EmailController;
use App\Models\Report;
use App\Models\User;
use App\Models\Game;
use App\Models\GameForum;
use App\Models\GameMode;

class AdminController extends Controller
{
    public function banUser(Request $request)
    {   
        $identifier=$request->input('user_id');
        $user = User::find($identifier);
    
        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }
    
        $user->is_banned = 1;
        $user->save();
    
        return response()->json(['message' => 'User has been banned.']);
    }
    public function unbanUser(Request $request)
    {   
        $identifier=$request->input('user_id');
        $user = User::find($identifier);
    
        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }
    
        $user->is_banned = 0;
        $user->save();
    
        return response()->json(['message' => 'User has been unbanned.']);
    }
    public function sendEmail(Request $request)
    {
        
        $request->validate([
            'to' => 'required|email',
            'subject' => 'required|string',
            'body' => 'required|string',
        ]);

        
        $to = $request->input('to');
        $subject = $request->input('subject');
        $body = $request->input('body');
        $isTransactional = true; 

        
        $from = 'ichallenger@zohomail.com';
        $fromName = 'Admin';

        
        $emailController = new EmailController();

        
        $response = $emailController->sendEmail($from, $fromName, $to, $subject, $body, $isTransactional);

       
        return response()->json(['message' => $response]);
    }
    
    public function getReports(Request $request)
    {
        $user = Auth::user();
    
        $reports = Report::with('reportedUser');
    
        if ($request->has('search_username')) {
            $reports->whereHas('reportedUser', 'like', '%' . $request->input('search_username') . '%');
        }
    
        return response()->json([
            'status' => 'Success',
            'data' => $reports->get(),
        ]);
    }

    //Create Game
    public function createGame(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:games',
            'game_modes' => 'required|array',
            'game_modes.*.name' => 'required|string',
            'game_modes.*.max_players_per_team' => 'required|integer',
        ]);
    
        
        $game = Game::create([
            'name' => $request->input('name'),
        ]);
    
        
        foreach ($request->input('game_modes') as $mode) {
            $game->gameModes()->create($mode);
        }
    
        
        GameForum::create([
            'game_id' => $game->id,
            'name' => $game->name,
        ]);
    
        return response()->json(['status' => 'Success', 'message' => 'Game created successfully', 'data' => $game]);
    }

   

    
    public function updateGame(Request $request)
    {   
        $id=$request->input('id');

        $request->validate([
            'name' => 'required|string|unique:games,name,' . $id,
            'game_modes' => 'required|array',
            'game_modes.*.name' => 'required|string',
            'game_modes.*.max_players_per_team' => 'required|integer',
        ]);

        $game = Game::find($id);

        if (!$game) {
            return response()->json(['status' => 'Error', 'message' => 'Game not found'], 404);
        }

       
        $game->name = $request->input('name');
        $game->save();

        
        foreach ($request->input('game_modes') as $modeData) {
            $gameMode = $game->gameModes->firstWhere('name', $modeData['name']);

            if ($gameMode) {
               
                $gameMode->update($modeData);
            } else {
                
                $game->gameModes()->create($modeData);
            }
        }

        return response()->json(['status' => 'Success', 'message' => 'Game updated successfully', 'data' => $game]);
    }



    
}
