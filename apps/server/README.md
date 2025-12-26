# Server

An Express.js + TypeScript REST API for managing users. This backend application provides RESTful endpoints for creating, reading, updating, and deleting users, with data persistence using Firebase Realtime Database.

## Tech Stack

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Firebase Admin SDK** - Realtime Database
- **Express Validator** - Request validation
- **CORS** - Cross-origin resource sharing
- **Axios** - HTTP client for external APIs

## Project Structure

```
src/
├── index.ts                    # Application entry point and server startup
├── app.ts                      # Express app configuration and middleware setup
│
├── config/                     # Configuration files
│   └── firebase.ts             # Firebase Admin SDK initialization
│
├── controllers/                # Request handlers
│   └── userController.ts       # User CRUD operations
│
├── middleware/                 # Express middleware
│   ├── errorHandler.ts         # Global error handling middleware
│   └── validation.ts           # Request validation middleware
│
├── models/                     # Data models
│   └── user.ts                 # User model class
│
├── routes/                     # API route definitions
│   └── userRoutes.ts           # User endpoints
│
├── services/                   # Business logic layer
│   ├── userService.ts          # User business logic
│   └── locationService.ts      # Location/zip code service
│
├── types/                      # TypeScript type definitions
│   └── index.ts                # Shared types and interfaces
│
└── validations/                # Request validation schemas
    └── user.validation.ts      # User validation rules
```

## Development

```bash
npm run start
```

Starts the development server with hot reload using nodemon. The server will run on port 8080 by default (or the port specified in the `PORT` environment variable).

## API Endpoints

### Users

- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create a new user
- `PUT /users/:id` - Update a user
- `DELETE /users/:id` - Delete a user

### Root

- `GET /` - Welcome endpoint

## Environment Variables

The application expects the following environment variables:

- `PORT` - Server port number (defaults to `8080`)
- `DB_URL` - Firebase Realtime Database URL (required)
- `FIREBASE_PROJECT_ID` - Firebase project ID (required)
- `FIREBASE_PRIVATE_KEY_ID` - Firebase private key ID (required)
- `FIREBASE_PRIVATE_KEY` - Firebase private key with `\n` for newlines (required)
- `FIREBASE_CLIENT_EMAIL` - Firebase service account email (required)
- `FIREBASE_CLIENT_ID` - Firebase client ID (required)
- `FIREBASE_AUTH_URI` - OAuth2 auth URI (optional, defaults to Google's)
- `FIREBASE_TOKEN_URI` - OAuth2 token URI (optional, defaults to Google's)
- `FIREBASE_AUTH_PROVIDER_X509_CERT_URL` - Auth provider cert URL (optional)
- `FIREBASE_CLIENT_X509_CERT_URL` - Client cert URL (optional)
- `FIREBASE_UNIVERSE_DOMAIN` - Universe domain (optional, defaults to `googleapis.com`)

Create a `.env` file in the root of the `apps/server` directory to configure these values. You can copy `.env.example` as a starting point.

**Note:** The `FIREBASE_PRIVATE_KEY` should include the full key with `\n` characters to represent newlines. The key will be automatically converted to proper newlines when loaded.
