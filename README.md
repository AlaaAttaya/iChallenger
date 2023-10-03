<img src="./readme/title1.svg"/>
<div style="text-align:center">

</div>
<br><br>
<img src="./readme/title2.svg"/>

<div>

- [PROJECT PHILOSOPHY](https://github.com/alaa-attaya/iChallenger#project-philosophy)
  - [User Types](https://github.com/alaa-attaya/iChallenger#usertypes)
- [PROTOTYPES](https://github.com/alaa-attaya/iChallenger#prototypes)
- [TECH STACK](https://github.com/alaa-attaya/iChallenger#tech-stack)
- [DEMO](https://github.com/alaa-attaya/iChallenger#demo)
- [PERFORMANCE](https://github.com/alaa-attaya/iChallenger#performance)
- [HOW TO RUN](https://github.com/alaa-attaya/iChallenger#how-to-run)
  - [Prerequisites](https://github.com/alaa-attaya/iChallenger#prerequisites)
  - [Installation](https://github.com/alaa-attaya/iChallenger#installation)

</div>
<br><br>

<!-- project philosophy -->
<img  id="project-philosophy" src="./readme/title3.svg"/>

> iChallenger is a social gaming community and tournament platform that aims to provide players with a dynamic and interactive
> gaming experience where they can compete with others, showcase their skills, earn points and rise up the leaderboards.

### User Types

1. Admin
2. Users (Players)

### User Stories

- As a Player, I want to find and participate in tournaments, so that I can progress in the leaderboards.
- As a Player, I want to upload content in the forums, so that I can showcase my skills to the community.
- As a Player, I want to communicate with other players, so that I can coordinate gameplay, and share valuable gaming tips.

### Admin Stories

- As an Admin, I want to manage players on the platform, so that I can take necessary actions against misconduct.
- As an Admin, I want to add games to the platform, so that users can have forums dedicated to those games.
- As an Admin, I want to create and manage tournaments, so that users can participate in organized competitions and enjoy a competitive gaming experience on the platform.

<br><br>

<!-- Prototyping -->

<img id="prototypes" src="./readme/title4.svg"/>

> The design was crafted using the Figma app, providing a solid foundation for the project.

| Landing                                 |
| --------------------------------------- |
| ![fsdaf](./readme/demo/LandingPage.png) |

| Tournaments                                    | Leaderboard                              |
| ---------------------------------------------- | ---------------------------------------- |
| ![Landing](./readme/demo/TournamentSearch.png) | ![fsdaf](./readme/demo/Leaderboards.png) |

| Tournament Page                            | Profile Page                            |
| ------------------------------------------ | --------------------------------------- |
| ![fsdaf](./readme/demo/TournamentPage.png) | ![fsdaf](./readme/demo/ProfilePage.png) |

<br><br>

<!-- Tech stack -->

<img id="tech-stack" src="./readme/title5.svg"/>

### iChallenger is built using the following technologies:

- This project uses [React](https://react.dev/). React aims to allow developers to create fast user interfaces for websites and applications alike easily.
- This project uses [Electron](https://www.electronjs.org/). Electron simplifies cross-platform desktop app development by leveraging JavaScript, HTML, CSS, and embedded Chromium and Node.js.
- This project uses [Laravel](https://laravel.com/). Laravel is PHP web application framework that is used for developing web applications and APIs.
- To send messages and notifications, the project uses [Pusher](https://pusher.com/). Pusher provides realtime communication between servers, apps and devices.
- To send emails, the project uses [ElasticEmail](https://elasticemail.com/). Elastic Email offers a simple full service platform for Email Marketing and transactional emails.
- This project uses [ChatGPT](https://platform.openai.com/). ChatGPT is employed for user interactions related to games, enhancing interactive conversations and providing intelligent responses specifically in that context.
- For persistent storage (database), the project uses [MySQL](https://www.mysql.com/). The world's most popular open source database.
<br><br>
<!-- Demo -->

<img id="demo" src="./readme/title6.svg"/>

| Landing                               |
| ------------------------------------- |
| ![Landing](./readme/demo/Landing.gif) |

| Admin: Add Game                        | Admin: Create Tournament                                 |
| -------------------------------------- | -------------------------------------------------------- |
| ![Add Game](./readme/demo/AddGame.gif) | ![Create Tournament](./readme/demo/CreateTournament.gif) |

| Admin: User Management                      |
| ------------------------------------------- |
| ![Forgot Password](./readme/demo/Admin.gif) |

| Forgot Password                                        |
| ------------------------------------------------------ |
| ![Forgot Password](./readme/demo/CodeVerification.gif) |

| Posts                                      |
| ------------------------------------------ |
| ![Posts](./readme/demo/GameForumPosts.gif) |

| Follow                              |
| ----------------------------------- |
| ![Follow](./readme/demo/Follow.gif) |

| Messages                                |
| --------------------------------------- |
| ![Messages](./readme/demo/Messages.gif) |

| Tournament Invitations                                            |
| ----------------------------------------------------------------- |
| ![Tournament Invitations](./readme/demo/TournamentInvitation.gif) |

| Tournament Completed                                            |
| --------------------------------------------------------------- |
| ![Tournament Completed ](./readme/demo/TournamentCompleted.gif) |

<!-- Performance -->
<img id="performance" src="./readme/title7.svg"/>

> The following tests were conducted in Postman to assess the functionality of my application's primary APIs

<br>
URL: http://52.212.245.205:80/api/guest/getgameforum

```sh
PASS: Response time is within acceptable range //1205 ms
PASS: Response content type is JSON
PASS: Response schema is valid

```

<br>
URL: http://52.212.245.205:80/api/guest/getgameforumposts

```sh
PASS: Response time is within acceptable range //1410 ms
PASS: Response content type is JSON
PASS: Response schema is valid

```

<br>
URL: http://52.212.245.205:80/api/guest/getopentournaments

```sh
PASS: Response time is within acceptable range //1004 ms
PASS: Response content type is JSON
PASS: Response schema is valid

```

<br>
URL: http://52.212.245.205:80/api/guest/getusersstats

```sh
PASS: Response time is within acceptable range //947 ms
PASS: Response content type is JSON
PASS: Response schema is valid

```

<br>
<br><br>

<!-- How to run -->
<img id="how-to-run" src="./readme/title8.svg"/>

> To set up iChallenger locally, follow these steps:

### Prerequisites

- **Git**: You will need Git for version control and to clone the project repository. If you don't have Git installed, you can download and install it from [https://git-scm.com/](https://git-scm.com/).

  Once Git is installed, you'll be able to use Git commands to work with the project repository.

- **XAMPP** (or similar): If your project involves PHP development and requires a web server, you may need XAMPP or a similar web server solution like MAMP or WAMP to set up a local development environment. You can download XAMPP from https://www.apachefriends.org/.

- **npm**: You will need npm (Node Package Manager) to manage project dependencies. If you don't have npm installed, you can install it by running the following command:

  ```sh
  npm install npm@latest -g
  ```

- **Electron**: Make sure you have Electron.js installed globally. You can install it via npm:

  ```sh
  Copy code
  npm install -g electron
  ```

### Installation

1. Get a OpenAI API Key at [https://platform.openai.com/](https://platform.openai.com/)
2. Get a Pusher API Key at [https://pusher.com/](https://platform.openai.com/)
3. Get a ElasticEmail API Key at [https://app.elasticemail.com/](https://app.elasticemail.com/)
4. Clone the repo

   ```sh
   git clone https://github.com/alaa-attaya/iChallenger.git
   ```

5. Install Composer packages
   ```sh
   composer install
   ```
6. Install NPM packages

   ```sh
   npm install
   ```

7. Enter your API in `.env`
   ```env
   OPENAI_API_KEY = ENTER_YOUR_OPENAI_API_KEY;
   PUSHER_API_KEY = ENTER_YOUR_PUSHER_API_KEY;
   ELASTICEMAIL_API_KEY = ENTER_YOUR_ELASTICEMAIL_API_KEY;
   ```
   Now, you should be able to run iChallenger locally and explore its features.
