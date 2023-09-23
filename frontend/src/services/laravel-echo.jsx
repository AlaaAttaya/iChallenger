import Echo from "laravel-echo";
import Pusher from "pusher-js";

const echo = new Echo({
  broadcaster: "pusher",
  key: "527edb0870fce1976587",
  cluster: "eu",
  encrypted: true,
});

export default echo;
