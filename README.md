# Cricket Prediction Game

A full-stack MERN app for running cricket match prediction contests with friends.

## Features

- Register/login with JWT authentication.
- Admin approval required before users can play.
- Admin dashboard for approving users and publishing API-backed match contests.
- Per-match lock time, configurable win/loss points, and auto result syncing.
- User dashboard with open contests, submitted predictions, score cards, and leaderboard.
- CricketData/CricAPI integration with mock fallback when no API key is configured.

## Setup

1. Install dependencies:

   ```bash
   npm run install:all
   ```

2. Copy server environment variables:

   ```bash
   copy server\.env.example server\.env
   ```

3. Update `server/.env` with your MongoDB URI and CricketData/CricAPI key.

4. Run the app:

   ```bash
   npm run dev
   ```

The client runs on `http://localhost:5173` and the API runs on `http://localhost:5000`.

## Admin Login

On server start, the app creates or updates the admin from:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_NAME`

Use that account to approve registrations and manage contests.
