# TicTacToe

This is a real-time multiplayer game built with [Next.js](https://nextjs.org/) on the client side and Node.js with [Socket.IO](https://socket.io/) on the server side. The game state is managed using [Firebase](https://firebase.google.com).


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/): 

- [npm](https://www.npmjs.com/): 


## Environment Variables

The project uses environment variables for configuration. These are stored in a `.env` file at the root of the project. You can create this file manually, or rename the provided `.env.example` file to `.env`.

Here's what each variable is for:

- `FIREBASE_API_KEY`: Your Firebase project's API key.
- `FIREBASE_AUTH_DOMAIN`: Your Firebase project's Auth domain.
- `FIREBASE_DATABASE_URL`: Your Firebase project's Database URL.
- `FIREBASE_PROJECT_ID`: Your Firebase project's ID.
- `FIREBASE_STORAGE_BUCKET`: Your Firebase project's Storage bucket.
- `FIREBASE_MESSAGING_SENDER_ID`: Your Firebase project's Messaging sender ID.
- `FIREBASE_APP_ID`: Your Firebase project's App ID.
- `FIREBASE_MEASUREMENT_ID`: Your Firebase project's Measurement ID.

You can find these values in your Firebase project settings.

**Note:** Never commit your `.env` file. It contains sensitive information that should not be shared publicly. The `.env` file is included in the `.gitignore` file by default to prevent it from being committed.

### Installing

1. Clone the repository
```sh
git clone https://github.com/erentaskiran/tictactoe
```

2. Install the dependencies for the client and server
```sh
cd Client
npm install
cd ../Server
npm install
```

3. Start the development server for the client
```sh
cd Client
npm run dev
```

4. Start the Server
```sh
cd Server
node index.js
```

Open http://localhost:3000 with your browser to see the result.

