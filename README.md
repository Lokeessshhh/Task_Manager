# Production-Grade Task Manager

A minimal, high-performance Task Management application built with a focus on speed, design precision, and production-ready architecture.

## Tech Stack

### Backend
- **FastAPI**: Modern, fast web framework for building APIs with Python 3.8+ based on standard Python type hints.
- **asyncpg + databases**: Direct async PostgreSQL access for maximum performance, bypassing the overhead of traditional ORMs while maintaining type safety.
- **NeonDB**: Serverless Postgres for reliable, scalable data storage.
- **JWT Auth**: Secure authentication using `bcrypt` and `python-jose`.

### Frontend
- **React 18 + Vite**: Lightning-fast development and optimized production builds.
- **Zustand**: Lightweight, hook-based state management.
- **CSS Modules**: Pure CSS scoping for total design control without the overhead of utility frameworks.
- **Axios**: Custom-configured API client with interceptors for auth and error handling.
- **React Hot Toast**: Minimal, non-intrusive notifications.

## Project Structure

```text
├── backend/
│   ├── main.py          # FastAPI entry point & middleware
│   ├── database.py      # asyncpg connection & schema setup
│   ├── auth.py          # Security utilities (JWT, Hashing)
│   ├── models.py        # Pydantic v2 schemas
│   └── routers/         # Auth and Task CRUD routes
├── src/                 # React source code
├── public/              # Static assets
├── package.json         # Frontend dependencies
└── vercel.json          # Deployment configuration
```

## Local Setup

### Backend
1. `cd backend`
2. Create a virtual environment: `python -m venv venv`
3. Activate: `source venv/bin/activate` (or `venv\Scripts\activate` on Windows)
4. Install dependencies: `pip install -r requirements.txt`
5. Create `.env` from `.env.example` and add your `DATABASE_URL`.
6. Start server: `uvicorn main:app --reload`

### Frontend (Root)
1. Install dependencies: `npm install`
2. Create `.env` and set `VITE_API_URL=http://localhost:8000`.
3. Start dev server: `npm run dev`

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Create new account | No |
| POST | `/auth/login` | Sign in & get JWT | No |
| GET | `/tasks` | List user tasks (supports `?stage=`) | Yes |
| POST | `/tasks` | Create new task | Yes |
| PUT | `/tasks/{id}` | Update task title/desc/stage | Yes |
| DELETE | `/tasks/{id}` | Delete task | Yes |

## Design Philosophy
The UI follows a **"White Minimal, Human"** aesthetic.
- **Typography**: Instrument Serif for warmth, DM Sans for clarity, JetBrains Mono for technical precision.
- **Spacing**: Surgical precision with a 4px grid base.
- **Feedback**: Optimistic UI updates and subtle CSS transitions for a "live" feel.

## Assumptions & Tradeoffs
- **Raw SQL over ORM**: Chose `asyncpg` + `databases` for maximum performance and lower memory footprint compared to SQLAlchemy. This requires manual schema management but ensures the fastest possible execution for a production task manager.
- **JWT Expiration**: Set to 7 days for developer convenience in this version. In a high-security production environment, this should be reduced with refresh token rotation.
- **Stateless Backend**: The backend is completely stateless, making it trivial to scale horizontally behind a load balancer.
- **CSS Modules**: Opted for CSS Modules over Tailwind to maintain absolute control over the design system and avoid the "utility-first" visual footprint, aligning with the "design-aware" requirement.

## AI Usage Disclosure
This project was scaffolded and accelerated using AI (Gemini CLI), ensuring best practices in async Python and React state management were followed from the first line of code.
