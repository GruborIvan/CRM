# CRM — Customer Relationship Management

A full-stack CRM application with a cross-platform mobile client and a secured REST API backend.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Backend — CRMService](#backend--crmservice)
  - [Tech Stack](#tech-stack)
  - [Architecture](#architecture)
  - [Authentication](#authentication)
  - [Running Locally](#running-locally-backend)
  - [Running with Docker](#running-with-docker)
- [Mobile — crm-mobile](#mobile--crm-mobile)
  - [Tech Stack](#tech-stack-1)
  - [Architecture](#architecture-1)
  - [Running Locally](#running-locally-mobile)
- [Environment Variables](#environment-variables)

---

## Project Structure

```
CRM/
├── backend/
│   └── CRMService/         # ASP.NET Core 8 REST API
├── mobile/
│   └── crm-mobile/         # React Native / Expo mobile app
├── docker/                 # Docker configuration
└── docs/                   # Documentation
```

---

## Backend — CRMService

### Tech Stack

| Concern | Technology |
|---|---|
| Runtime | .NET 8 / ASP.NET Core |
| Database | Microsoft SQL Server 2022 |
| ORM | Entity Framework Core 8 |
| Authentication | JWT Bearer + Refresh Tokens |
| Password Hashing | BCrypt.Net |
| Logging | Serilog (rolling file) |
| API Docs | Swagger / Swashbuckle |
| Containerization | Docker + Docker Compose |

### Architecture

The backend follows **Clean Architecture** split across four projects:

```
CRMService/
├── CRMService.API/           # Entry point — controllers, middleware, DI setup
├── CRMService.Application/   # Business logic — services, use cases, DTOs
├── CRMService.Domain/        # Domain entities and core abstractions
└── CRMService.Infrastructure/# Data access — DbContext, repositories, external services
```

### Authentication

The API uses a stateless JWT-based auth flow with short-lived access tokens and long-lived refresh tokens.

| Token | Default TTL | Storage |
|---|---|---|
| Access Token | 60 minutes | Client memory |
| Refresh Token | 7 days | Client secure storage |

**Endpoints:**

```
POST /auth/register   # Create account
POST /auth/login      # Returns accessToken + refreshToken
POST /auth/refresh    # Exchange refresh token for new access token
```

Passwords are hashed with BCrypt before storage. Tokens are signed with a symmetric key configured via `appsettings.json`.

### Running Locally (Backend)

**Prerequisites:** .NET 8 SDK, SQL Server instance

```bash
cd backend/CRMService

# Update connection string in appsettings.Development.json first, then:

# Apply EF Core migrations
dotnet ef database update --project CRMService.Infrastructure --startup-project CRMService.API

# Run the API
dotnet run --project CRMService.API
```

API will be available at `http://localhost:5000`.  
Swagger UI at `http://localhost:5000/swagger`.

### Running with Docker

**Prerequisites:** Docker + Docker Compose

```bash
# From the project root
docker compose up --build
```

This starts two containers:

| Service | Image | Port |
|---|---|---|
| `db` | mcr.microsoft.com/mssql/server:2022 | 1433 |
| `api` | Built from Dockerfile | 5000 |

The API waits for the database health check to pass before starting. SQL Server data is persisted in a named Docker volume (`mssql-data`).

---

## Mobile — crm-mobile

### Tech Stack

| Concern | Technology |
|---|---|
| Framework | React Native 0.81 + Expo 54 |
| Language | TypeScript 5.9 |
| Routing | Expo Router 6 (file-based) |
| State Management | Zustand 5 |
| HTTP Client | Axios 1.15 |
| Token Storage | expo-secure-store (native) / localStorage (web) |
| Navigation | React Navigation 7 — Bottom Tabs |
| Animations | React Native Reanimated 4 |
| Platform Support | iOS, Android, Web |

### Architecture

The mobile app uses **module-based architecture** with file-based routing via Expo Router.

```
crm-mobile/
├── app/                      # Expo Router — all screens live here
│   ├── index.tsx             # Root entry — auth check and redirect
│   ├── _layout.tsx           # Root layout — navigation + theme
│   ├── (auth)/               # Unauthenticated route group
│   │   ├── login.tsx
│   │   └── register.tsx
│   └── (app)/                # Authenticated route group
│       └── (tabs)/           # Bottom tab navigator
│           ├── index.tsx     # Dashboard — navigation cards
│           └── explore.tsx
├── src/
│   ├── modules/
│   │   └── auth/             # Self-contained auth module
│   │       ├── api/          # auth.api.ts — login, register, refresh, logout
│   │       ├── store/        # auth.store.ts — Zustand store with persistence
│   │       ├── hooks/        # useLogin, useRegister, useLogout
│   │       └── types/        # TypeScript interfaces
│   ├── api/
│   │   └── client.ts         # Axios instance — token injection + auto-refresh interceptors
│   ├── constants/
│   │   └── config.ts         # API_BASE_URL
│   └── lib/
│       └── token-storage.ts  # Platform-aware secure storage abstraction
├── components/               # Reusable UI (ThemedText, ThemedView, etc.)
├── hooks/                    # useColorScheme, useThemeColor
└── assets/                   # Images, icons, splash screens
```

#### Authentication Flow

1. App launches → `index.tsx` checks `isAuthenticated` from Zustand store
2. Unauthenticated → redirected to `(auth)/login`
3. On successful login → tokens persisted via `token-storage.ts` (SecureStore on native, localStorage on web)
4. All subsequent API requests → Axios interceptor injects `Authorization: Bearer <accessToken>`
5. On 401 response → interceptor silently calls `/auth/refresh`, retries the original request
6. On logout → tokens cleared locally, session invalidated on server

### Running Locally (Mobile)

**Prerequisites:** Node.js 18+, Expo CLI, iOS Simulator / Android Emulator or physical device

```bash
cd mobile/crm-mobile

# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env
# Set EXPO_PUBLIC_API_URL to your backend address

# Start Expo dev server
npx expo start
```

Press `i` for iOS Simulator, `a` for Android Emulator, or scan the QR code with the Expo Go app on a physical device.

**For web:**
```bash
npx expo start --web
```