# Milking Tracker with Music

A full-stack, mobile-first tracker that records milking sessions while playing calming music for the herd.

## Tech Stack

- **Frontend:** Next.js (React)
- **Backend:** Node.js + Express
- **Database:** MongoDB (via Mongoose)

## Getting Started

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

The API runs on `http://localhost:4000` by default.

### 2. Frontend

```bash
cd client
npm install
cp .env.local.example .env.local
npm run dev
```

The Next.js app runs on `http://localhost:3000`.

## API Endpoints

- `POST /sessions` - Save a milking session
- `GET /sessions` - Retrieve all sessions

## Notes

- Music playback uses a hosted audio URL. Set `NEXT_PUBLIC_AUDIO_URL` to your preferred file when hosting.
- Update `NEXT_PUBLIC_API_BASE_URL` to point to your deployed backend when hosting.
