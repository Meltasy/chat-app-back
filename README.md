# chat-app-back

[![License ISC](https://img.shields.io/github/license/Meltasy/chat-app-back)](https://opensource.org/license/isc-license-txt)
[![ECMAScript](https://img.shields.io/badge/ECMAScript-2025-blue.svg)](https://ecma-international.org/publications-and-standards/standards/ecma-262/)
[![Node.js](https://img.shields.io/badge/Node.js-v22.12.0-brightgreen.svg)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-v11.7.0-red.svg)](https://www.npmjs.com/)
[![Repo Size](https://img.shields.io/github/repo-size/Meltasy/chat-app-back)](https://github.com/Meltasy/chat-app-back)
[![Website shields.io](https://img.shields.io/website-up-down-green-red/http/shields.io.svg)]()

**Add web address above**

A full-stack real-time chat app supporting direct messages and group chats, with live message delivery powered by Socket.IO.

Check out my [Chat App]()!

See the frontend source code [here](https://github.com/Meltasy/chat-app-front).

**Add web address above**

## Features

* 💬 **Real-time messaging:** Instant message delivery using Socket.IO — no refresh needed
* 📱 **Responsive design:** Optimized layout that adapts easily to mobile and desktop screens
* 👥 **Flexible chat types:** Create direct messages with one person or group chats with multiple members
* 🛠️ **Full message lifecycle:** Send, edit, and delete your own messages with live updates for all members
* 👮 **Role-based access control:** Admins can rename their groups, add and remove members, and delete the chat
* 🔒 **Enhanced security:** Protected routes and authenticated sessions throughout

## Future Improvements

* Typing indicators to show when another user is composing a message
* Read receipts so users know when their messages have been seen
* User presence indicators showing online/offline status
* Image and file uploads in messages
* Push notifications for new messages

## Tech Stack

* TypeScript
* Node.js with Express.js framework
* Socket.IO for real-time WebSocket communication
* Prisma ORM with PostgreSQL database
* JSON Web Tokens (JWT) for authentication
* bcrypt for password hashing
* CORS for cross-origin resource sharing

## Local Installation

Prerequisite: Node.js v22.12.0

1. Clone the repository: `git clone git@github.com:Meltasy/chat-app-back.git`
2. Set up the backend: `cd chat-app-back` and `npm install`
3. Configure environment variables with an `.env` file in the root directory:
    * `DATABASE_PUBLIC_URL="your-database-url"`
    * `JWT_SECRET="your-secret-key"`
    * `PORT="your-backend-port"`
    * `FRONTEND_URL="your-frontend-url"`
4. Set up the database: `npx prisma migrate dev`
5. Start the backend server: `npm run dev`

## License

This entire project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.