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
    public $sender;
  
    public function __construct($message, $recipientId,$sender)
    {
        $this->message = $message;
        $this->recipientId = $recipientId;
        $this->sender=$sender;
    }

    public function broadcastOn()
    {
        
        return new Channel('user.'.$this->recipientId);
    }
}

