# LakayMarket Demo Backend

This project adds a Node/Express backend for the LakayMarket frontend. It provides:

- Google OAuth 2.0 and email/password authentication
- JWT-based sessions
- Seller and product APIs
- Admin endpoints (protected) for listing, banning, removing sellers
- Data persisted using lowdb (JSON file) for simplicity

> **Security note:** This demo uses local JSON storage and simple secrets. Replace with a real database (PostgreSQL, MongoDB, etc.) and secure configuration in production.

## Setup

1. **Install dependencies**

```bash
cd "c:/Users/47emi/Desktop/Lakay Market/server"
npm install
```

2. **Environment variables**

Create a `.env` file or set environment variables:

```
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
JWT_SECRET=super-secret-string-change-me
PORT=3000
```

You can obtain a Google client ID from the Google Cloud Console under **APIs & Services > Credentials**. Add your frontend origin (e.g., `http://localhost:8000`) to the OAuth consent screen and authorized JavaScript origins.

3. **Run the server**

```bash
npm run dev   # uses nodemon
# or
npm start
```

The server will listen on `http://localhost:3000` by default.

## Endpoints

### Authentication

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Body `{name,email,password}` – create new user |
| POST | `/auth/login` | Body `{email,password}` – login returns token |
| POST | `/auth/google` | Body `{id_token}` – verify Google ID token |

Response: `{ token, user }` where token is a JWT. Include it in subsequent requests as `Authorization: Bearer <token>`.

### Products

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/products` | No | list all products |
| POST | `/products` | Yes | create product (body: `title,price,description,category,image`) |

### Sellers (Admin only)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/sellers` | return all sellers |
| POST | `/sellers/:id/ban` | toggle ban, body `{reason}` |
| DELETE | `/sellers/:id` | remove seller and their products |

## Integration with frontend

- Replace the client-side simulated authentication with real API calls. After login or Google sign-in, save returned `token` and send it in `Authorization` header.
- Adjust product creation to POST to `/products` when a seller uploads an item.
- Use `/sellers` endpoints via fetch for admin panel rather than localStorage.

## Deployment

- Deploy this Node app to a hosting provider (Heroku, Vercel with serverless functions, DigitalOcean, etc.)
- Make sure to set environment variables on the server
- Serve the static frontend from the same host or a CDN; update CORS origins accordingly

## Next Steps

- Replace lowdb with a real database
- Hash passwords (already done) and enable refresh tokens or sessions
- Add rate limiting, input validation, and sanitization
- Use HTTPS and secure cookies in production

---

This scaffold provides a starting point for a secure, integrated system ready to go online.