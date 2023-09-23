<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, SerializesModels;

    public $message;
    public $recipientId;

  
    public function __construct($message, $recipientId)
    {
        $this->message = $message;
        $this->recipientId = $recipientId;
    }

    public function broadcastOn()
    {
        
        return new PrivateChannel('user.'.$this->recipientId);
    }
}

