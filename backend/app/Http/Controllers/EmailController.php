<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class EmailController extends Controller
{
    public function sendEmail($from, $fromName, $to, $subject, $body, $isTransactional)
    {
        try {
           
            $from = env('MAIL_FROM_ADDRESS');
            $fromName = env('MAIL_FROM_NAME');
           
            Mail::raw($body, function ($message) use ($from, $fromName, $to, $subject) {
                $message->to($to);
                $message->subject($subject);
                $message->from($from, $fromName);
            });

            return response()->json(['message' => 'Email sent successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to send email', 'error' => $e->getMessage()], 500);
        }
    }
}


