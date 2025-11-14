# BizMate SA

Simple SME management app (backend: Node/Express + SQLite, frontend: static HTML/JS/CSS).

## Run locally

1. Install dependencies

```powershell
npm install
```

2. Start the server

```powershell
npm start
```

This will start the backend on http://localhost:5000 and serve the frontend files. Open http://localhost:5000/index.html in your browser.

## Notes
- Database: `bizmate.db` (SQLite) is created automatically by the backend when run.
- If you prefer to open the frontend files directly, you can open `frontend/index.html` in your browser, but serving via the backend avoids CORS issues.
- JWT is stored in `localStorage` by the frontend.

## Seed data (demo credentials)
The repo includes a seeder to create a demo user and sample data.

- Demo user email: `demo@bizmate.local`
- Demo user password: `password123`

To run the seeder:

```powershell
npm run seed
```

After seeding, start the server and login with the demo credentials.

## Files changed by the helper
- `package.json` - fixed scripts and metadata.
- `beckend/server.js` - added static serving for `frontend`.
- `frontend/index.html` - included Chart.js and `frontend.js`.
- `frontend/frontend.js` - fixed previewInvoice bugs.
- `.gitignore`, `README.md` added.

