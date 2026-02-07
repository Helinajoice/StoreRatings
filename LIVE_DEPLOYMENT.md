# StoreRatings – Step-by-Step: Run on a Live URL

This guide walks you through putting your app on a **live URL** so anyone can access it. It assumes you’ve already pushed to GitHub and use SQLite in production (see [DEPLOYMENT.md](./DEPLOYMENT.md)).

---

## Two ways to run it live

| Option | What it means | When to use |
|--------|----------------|-------------|
| **Option A – Single server** | One server runs the Node backend and serves the built React app. One URL for everything. | Simplest; good for small projects and demos. |
| **Option B – Split** | Backend on one host (e.g. Elastic Beanstalk), frontend on another (e.g. S3 + CloudFront or Amplify). Two URLs. | When you want to scale or host frontend/backend separately. |

---

## Option A – Single server (one URL)

**Idea:** Build the React app, put the build inside the backend’s `public` folder, then run the Node server. The same server serves both the API and the React app. No CORS issues; one domain.

### Step 1: Build the frontend

From the project root:

```bash
cd frontend
npm ci
npm run build
```

This creates `frontend/build` with the production React app.

### Step 2: Copy the build into the backend

Copy everything from `frontend/build` into `backend/public` so the backend can serve it:

**Windows (PowerShell):**
```powershell
cd "c:\Users\helina joice\StoreRatings"
if (-not (Test-Path backend\public)) { New-Item -ItemType Directory -Path backend\public }
Copy-Item -Path frontend\build\* -Destination backend\public -Recurse -Force
```

**Mac/Linux:**
```bash
mkdir -p backend/public
cp -r frontend/build/* backend/public/
```

### Step 3: Set environment variables for production

In the **backend** folder, use a `.env` file (or set env vars on your host) with at least:

```env
NODE_ENV=production
PORT=5000

DB_DIALECT=sqlite
SQLITE_STORAGE=./database.sqlite

JWT_SECRET=your-long-random-secret-change-this
```

Add SMTP vars if you use email (see DEPLOYMENT.md). **Do not commit `.env` to GitHub.**

### Step 4: `REACT_APP_API_URL` for Option A

For Option A, the frontend is served from the **same origin** as the API (e.g. `https://your-app.com`). The app uses `API_BASE` from `frontend/src/config.js`:

- If you **don’t set** `REACT_APP_API_URL` when building and `NODE_ENV` is `production`, the app uses **same-origin** (empty string), so all API calls go to `/api/...` on the same domain. That’s correct for Option A.
- If you prefer to set it explicitly, set `REACT_APP_API_URL` to your live URL (e.g. `https://your-app.com`) when building. No trailing slash.

**So for Option A you can simply build without setting `REACT_APP_API_URL`** (ensure your build runs with `NODE_ENV=production`, which `npm run build` does). The built app will call the same host for `/api/...`.

### Step 5: Run the backend (this serves the app)

```bash
cd backend
node server.js
```

The backend already serves `backend/public` in production and sends `index.html` for non-API routes (see `server.js`). Your app is available at `http://localhost:5000` (or whatever `PORT` you set).

### Step 6: Deploy that backend to a host

- **Render:** Create a **Web Service**, connect your GitHub repo, set root directory to `backend` (or the folder that has `server.js`). In the build step, you can run a script that first builds the frontend and copies it into `backend/public` (see below), then start with `node server.js`.
- **Railway / Heroku / similar:** Same idea: build step that produces the React build and copies it into `backend/public`, then start command `node server.js`. Set all env vars in the host’s dashboard.
- **AWS EC2:** Install Node on the server, clone your repo, run the build + copy steps above, set `.env`, then run `node server.js` (e.g. with PM2). Point a domain or Elastic IP to the server.
- **AWS Elastic Beanstalk:** Deploy the backend (with `public` already filled). Set env vars in EB Configuration → Software → Environment properties.

**Example build script for a host that runs from repo root (e.g. Render):**

In `package.json` at the **root** of the repo you could add:

```json
"scripts": {
  "build:frontend": "cd frontend && npm ci && npm run build",
  "copy:frontend": "node -e \"const fs=require('fs'); const path=require('path'); const p='backend/public'; if(!fs.existsSync(p)) fs.mkdirSync(p, {recursive:true}); require('child_process').execSync('xcopy /E /Y frontend\\\\build\\\\* backend\\\\public\\\\', {shell:true});\"",
  "start": "cd backend && node server.js"
}
```

Or use a simple Node script that copies `frontend/build` to `backend/public` so the host can run it in the build phase. The important part is: after build, `backend/public` contains the React app, and the start command is `node server.js` (from the `backend` directory).

---

## Option B – Split (backend and frontend on different hosts)

**Idea:** Backend runs on one URL (e.g. `https://api.yourdomain.com`), frontend on another (e.g. `https://yourdomain.com` or an Amplify/CloudFront URL). The React app calls the backend URL; you must set CORS and `REACT_APP_API_URL`.

### Step 1: Deploy the backend

- Use **AWS Elastic Beanstalk** or **EC2** (or Render/Railway as a separate service). Deploy only the **backend** (no need to put the React build in `backend/public`).
- Set env vars: `NODE_ENV=production`, `DB_DIALECT=sqlite`, `JWT_SECRET`, `PORT`, etc. (see DEPLOYMENT.md).
- Note the backend URL, e.g. `https://your-backend.elasticbeanstalk.com` or `https://api.yourdomain.com`.

### Step 2: Enable CORS for the frontend origin

In the backend, allow requests from the frontend origin. In `server.js` you have `app.use(cors())`. For production you can restrict it:

```js
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
```

Set env var `FRONTEND_URL` to your frontend URL (e.g. `https://your-app.amplifyapp.com`). If you don’t set it, the default allows `http://localhost:3000` for local dev.

### Step 3: Build the frontend with the backend URL

Set `REACT_APP_API_URL` to your **backend** URL (no trailing slash), then build:

```bash
cd frontend
set REACT_APP_API_URL=https://your-backend.elasticbeanstalk.com
npm ci
npm run build
```

The built app will call `https://your-backend.elasticbeanstalk.com/api/...` for all requests (because `config.js` uses `API_BASE` from `REACT_APP_API_URL`).

### Step 4: Deploy the frontend

- **AWS Amplify:** Connect repo, set build directory to `frontend`, build command `npm ci && npm run build`, output directory `build`. In Amplify environment variables, set `REACT_APP_API_URL` to your backend URL.
- **S3 + CloudFront:** Upload the contents of `frontend/build` to an S3 bucket, enable static hosting, optionally put CloudFront in front. Users open the CloudFront or S3 website URL.
- **Vercel / Netlify:** Point to the frontend folder, set build command and `REACT_APP_API_URL` in the dashboard.

Users open the **frontend** URL; the frontend then talks to the **backend** URL you set in `REACT_APP_API_URL`.

---

## Where to set environment variables

| Where you run the app | Where to set env vars |
|-----------------------|------------------------|
| **Backend (Node)**    | `JWT_SECRET`, `DB_DIALECT`, `SQLITE_STORAGE`, `PORT`, `SMTP_*`, `FRONTEND_URL` (if CORS). On AWS: Elastic Beanstalk → Configuration → Software → Environment properties; EC2: `.env` file (not in repo) or shell `export`. |
| **Frontend (React build)** | Only `REACT_APP_API_URL` (and any other `REACT_APP_*`). Set when **building** (e.g. in host’s “Environment variables” for the build step). On Amplify: Build settings → Environment variables. |

---

## Summary

- **Option A (single server):** Build React → copy `frontend/build` to `backend/public` → run Node with `NODE_ENV=production`. Set `REACT_APP_API_URL` to your live URL when building so the built app calls the right host. One URL for app and API.
- **Option B (split):** Backend on one host, frontend on another. Set CORS (`FRONTEND_URL`) on the backend. Set `REACT_APP_API_URL` to the backend URL when building the frontend. Two URLs; frontend URL is what you share with users.

All API keys and secrets go in **environment variables** on the server or in the host’s dashboard; never in the repo. For more on SQLite and GitHub, see [DEPLOYMENT.md](./DEPLOYMENT.md).
