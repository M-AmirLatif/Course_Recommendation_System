# Deployment Guide

## Architecture

- Frontend: deploy the static degree recommendation frontend to Vercel from the repository root.
- Backend API: deploy the `backend` service to Railway.
- Database: host production data on MongoDB Atlas.

## Backend on Railway

1. Create a Railway service from the `backend` directory.
2. Set the start command to `npm start`.
3. Add the environment variables from [backend/.env.example](../backend/.env.example).
4. Set `CORS_ORIGINS` to your Vercel frontend URL and any allowed local origins.
5. If you want external alerting, set `ALERT_WEBHOOK_URL` to your webhook endpoint.
6. Confirm the health endpoint responds at `/health` before connecting the frontend.

## Database on MongoDB Atlas

1. Create a MongoDB Atlas cluster.
2. Create a database user with least-privilege access.
3. Add the required network access rule for Railway.
4. Copy the Atlas connection string into `MONGO_URI`.
5. Seed degree and course data only after the first successful backend connection.
6. Prefer `npm run seed:degrees` for safe merge mode. Use `npm run seed:degrees:replace` only for an intentional full catalog reset.

## Frontend on Vercel

1. Import the repository in Vercel.
2. Deploy from the repository root.
3. Update [frontend/js/runtime-config.js](../frontend/js/runtime-config.js) with your Railway API base URL:

```js
window.RUNTIME_CONFIG = {
  API_BASE_URL: 'https://your-railway-service.up.railway.app',
}
```

4. Alternatively, set `localStorage.apiBaseUrlOverride` during testing.
5. The frontend now authenticates with credentialed cookie requests, so keep browser third-party cookie restrictions in mind when testing across domains.

## Production Checklist

- Use a strong `JWT_SECRET` with at least 32 characters.
- Set `LOG_LEVEL=info` in production unless you are actively debugging.
- Use the cookie-based auth flow. Do not reintroduce token storage in `localStorage`.
- Verify `/health` returns `database: connected`.
- Confirm `CORS_ORIGINS` matches your real frontend domains.
- Verify `Set-Cookie` is present on login and registration responses in the browser network panel.
- Verify student registration, login, profile loading, and degree recommendations.
- Verify degree feedback actions: like, dislike, and clear.
- Verify degree enrollments, unenrollment, and admin enrollment status updates.
- Verify admin CRUD for degrees and courses after deployment.
- Verify audit log visibility at `/api/admin/audit-logs`.
- Optionally run `E2E_API_URL=https://your-backend-url npm run test:e2e` from the repo root for deployment smoke coverage.
