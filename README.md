# message-app

[![License ISC](https://img.shields.io/github/license/Meltasy/blog-api)](https://opensource.org/license/isc-license-txt)
[![ECMAScript](https://img.shields.io/badge/ECMAScript-2025-blue.svg)](https://ecma-international.org/publications-and-standards/standards/ecma-262/)
[![Node.js](https://img.shields.io/badge/Node.js-v22.12.0-brightgreen.svg)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-v11.7.0-red.svg)](https://www.npmjs.com/)
[![Repo Size](https://img.shields.io/github/repo-size/Meltasy/blog-api)](https://github.com/Meltasy/chat-app-back)
[![Website shields.io](https://img.shields.io/website-up-down-green-red/http/shields.io.svg)]()

**Add web address above**

A messaging app ...

Check out my [Chat App]()!

**Add web address above**

## Features

* 🔒 **Enhanced security:** Protected routes and authenticated sessions throughout
* **What else?** Add 4-5 features

## Future Improvements

* What next?

## Tech Stack

* TypeScript

### Backend

* Node.js with Express.js framework
* Prisma ORM with PostgreSQL database
* JSON Web Tokens (JWT) for authentication
* bcrypt for password hashing
* CORS for cross-origin resource sharing

### Frontends

* React 18 with modern hooks
* Vite for fast development and building
* React Router for client-side routing
* CSS modules for styling

## Local Installation

Prerequisite: Node.js v22.12.0

1. Clone the repository: `git clone git@github.com:Meltasy/message-app-back.git`
2. Set up the backend: `cd message-app-back` and `npm install`
3. Configure environment variables with an `.env` file in the root directory:
    * `DATABASE_PUBLIC_URL="your-database-url"`
    * `JWT_SECRET="your-secret-key"`
    * `PORT="your-backend-port"`
4. Set up the database: `npx prisma migrate dev`
5. Set up the reader frontend: `cd ../message-app-front` and `npm install`
6. Configure environment variable with an `.env` file in the root directory:
    * `VITE_API_URL="your-backend-port"`
7. Start the backend and frontend servers: `npm run dev`

## License

This entire project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.