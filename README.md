# Blood Pressure Monitoring System

Production-oriented monorepo for:

- `Client`: React + Vite frontend
- `Backend`: Express + Prisma API
- `Assistance`: FastAPI hypertension assistant service

## Runtime architecture

1. `Client` calls `Backend`
2. `Backend` handles auth, profile, BP, medication, consultation, and assistant orchestration
3. `Backend` calls `Assistance /chat` for health-assistant responses

## Environment

Create these files from the examples before deployment:

- `Backend/.env` from `Backend/.env.example`
- `Assistance/.env` from `Assistance/.env.example`

Frontend variables:

- `VITE_API_BASE_URL`: public URL for the backend API

Backend variables:

- `PORT`
- `DATABASE_URL`
- `JWT_SECRET`
- `CORS_ORIGIN`
- `ASSISTANCE_API_URL`
- `APP_API_KEY`
- `ASSISTANCE_TIMEOUT_MS`

Assistant variables:

- `GEMINI_API_KEY`
- `APP_API_KEY`
- `GEMINI_MODEL`
- `ASSISTANCE_LOG_LEVEL`
- `ASSISTANCE_MEMORY_DB`

## Local start

Backend:

```bash
cd Backend
npm install
npm run start
```

Assistant:

```bash
cd Assistance
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn api.main:app --host 0.0.0.0 --port 8000
```

Client:

```bash
cd Client
npm install
npm run build
```

## Deployment notes

- Deploy `Backend` and `Assistance` as separate services.
- Set the same `APP_API_KEY` in both services.
- Point `ASSISTANCE_API_URL` at the deployed assistant base URL.
- Point `VITE_API_BASE_URL` at the deployed backend base URL.
- Rotate any previously committed secrets before deploying.

## Health checks

- Backend: `GET /health`
- Assistant: `GET /health`
