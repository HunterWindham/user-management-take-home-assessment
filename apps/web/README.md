# Web App

A React + TypeScript + Vite application for managing users. This frontend application provides a user interface for creating, reading, updating, and deleting users through a RESTful API.

## Tech Stack

- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Material-UI (MUI)** - Component library
- **Tailwind CSS** - Utility-first CSS framework

## Project Structure

```
src/
├── App.tsx                    # Root application component
├── index.tsx                  # Application entry point
├── index.css                  # Global styles
│
├── components/               # Shared reusable components
│   ├── DataTable.tsx
│   ├── DialogForm.tsx
│   ├── EmptyState.tsx
│   ├── ErrorState.tsx
│   └── LoadingState.tsx
│
├── config/                   # Configuration files
│   └── api.ts                # API endpoints and base URL configuration
│
├── services/                 # Shared services
│   └── apiService.ts         # Base API service
│
├── types/                    # Shared TypeScript types
│   └── index.ts
│
└── features/                  # Feature-based modules
    └── user-management/       # User management feature
        ├── components/        # Feature-specific components
        │   ├── UserManagement.tsx    # Main feature component
        │   ├── UsersTable.tsx
        │   ├── CreateUserDialog.tsx
        │   ├── EditUserDialog.tsx
        │   ├── DeleteUserDialog.tsx
        │   └── UserFormFields.tsx
        ├── services/          # Feature-specific services
        │   └── userService.ts # User API service
        ├── types/             # Feature-specific types
        │   └── index.ts      # User-related type definitions
        ├── utils/             # Feature-specific utilities
        │   └── validation.ts # Form validation utilities
        └── index.ts          # Feature export
```

## Development

```bash
npm run start
```

Starts the development server with hot module replacement.

## Build

```bash
npm run build
```

Builds the application for production. The output will be in the `dist` directory.

## Preview

```bash
npm run preview
```

Preview the production build locally.

## Environment Variables

The application expects the following environment variable:

- `VITE_API_BASE_URL` - Base URL for the backend API (defaults to `http://localhost:8080`)

Create a `.env` file in the root of the `apps/web` directory to configure these values.
