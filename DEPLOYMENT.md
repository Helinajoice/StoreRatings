# StoreRatings – Deploy to GitHub & AWS (without PostgreSQL)

This guide covers:
1. Pushing the project to **GitHub**
2. Using **SQLite** instead of PostgreSQL for the live app (no separate DB server)
3. Running the app on **AWS** and configuring API keys / env vars

---

## 1. Push to GitHub

### One-time setup (if you haven’t already)

```bash
cd "c:\Users\helina joice\StoreRatings"

# Initialize git (only if this folder is not already a git repo)
git init

# Add all files (respects .gitignore)
git add .
git commit -m "Initial commit: StoreRatings app with SQLite support"
```

### Create repo on GitHub and push

1. On GitHub: **New repository** → name it e.g. `StoreRatings` → **Create** (no README/license).
2. Then in your project folder:

```bash
git remote add origin https://github.com/YOUR_USERNAME/StoreRatings.git
git branch -M main
git push -u origin main
```

Use your GitHub username and repo name. If you use SSH:

```bash
git remote add origin git@github.com:YOUR_USERNAME/StoreRatings.git
```

---

## 2. Database: Use SQLite in production (no PostgreSQL)

The app supports two modes via **environment variables**:

| Variable        | Local (PostgreSQL) | Live (SQLite)   |
|----------------|--------------------|-----------------|
| `DB_DIALECT`   | `postgres` or unset| `sqlite`        |
| `SQLITE_STORAGE` | (not used)       | Path to DB file (optional) |

**Backend `.env` for live (SQLite):**

```env
NODE_ENV=production
PORT=5000

# Database: SQLite (no PostgreSQL needed)
DB_DIALECT=sqlite
SQLITE_STORAGE=./database.sqlite

# Required: JWT secret (generate a long random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email (optional; for verification emails)
# If not set, signup may fail when sending email – you can use a placeholder or disable email in code.
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

**Important:** Do **not** commit `.env` or real secrets to GitHub. The repo’s `.gitignore` already excludes `.env`.

On first run with SQLite, the backend will create `database.sqlite` and all tables (via `sequelize.sync()`). You can then run your seed script to add stores:

```bash
cd backend
node seedStores.js
```

---

## 3. Run on AWS

You have two main options: **one server** (backend + frontend build served together) or **separate frontend/backend**.

### Option A – Single server (EC2 or Elastic Beanstalk)

Good for keeping things simple: one Node server serves the API and the built React app.

1. **Build the frontend** (locally or in CI):

   ```bash
   cd frontend
   npm ci
   npm run build
   ```

2. **Serve the build from the backend** (so the same server handles both API and React):

   - Copy `frontend/build` into `backend/public` (or a `backend/public` folder).
   - In your backend, add something like:

   ```js
   // Serve React build in production
   if (process.env.NODE_ENV === 'production') {
     app.use(express.static(path.join(__dirname, 'public')));
     app.get('*', (req, res) => {
       res.sendFile(path.join(__dirname, 'public', 'index.html'));
     });
   }
   ```

   Then your backend’s `PORT` is the only entry point (e.g. `https://your-domain.com`).

3. **Deploy that backend** to:
   - **AWS Elastic Beanstalk** (Node.js platform), or  
   - **EC2**: install Node, run `node server.js` (e.g. with PM2) and put Nginx in front if you want HTTPS.

4. **Set env vars on AWS** (no PostgreSQL; use SQLite and your API keys):
   - `NODE_ENV=production`
   - `DB_DIALECT=sqlite`
   - `JWT_SECRET=...`
   - `PORT=5000` (or whatever EB/EC2 uses)
   - Any SMTP or other API keys you use.

5. **Frontend API base URL:**  
   In your React app, use the **same host as the backend** in production (e.g. `https://your-domain.com/api/...`) so you don’t need CORS for same-origin requests. You can use `create-react-app`’s `REACT_APP_API_URL` and point it to your backend URL.

### Option B – Frontend and backend separately

- **Backend:** Deploy Node (e.g. Elastic Beanstalk or EC2). Set env vars as above (SQLite, `JWT_SECRET`, etc.). No PostgreSQL.
- **Frontend:** Build (`npm run build`), then deploy the `build` folder to **S3 + CloudFront** or **AWS Amplify Hosting**.
- **CORS:** In the backend, allow the frontend origin (e.g. `https://your-amplify-or-cloudfront-url.amazonaws.com`).
- **API URL:** In the frontend, set `REACT_APP_API_URL` (or your existing API base URL) to the backend URL (e.g. `https://api.your-domain.com`).

---

## 4. API keys and env vars checklist

Use **environment variables** only; never commit real keys to GitHub.

| Variable         | Used for              | Example / note                          |
|------------------|------------------------|----------------------------------------|
| `JWT_SECRET`     | Signing login tokens   | Long random string                     |
| `DB_DIALECT`     | Database type          | `sqlite` for live, `postgres` local    |
| `SQLITE_STORAGE` | SQLite file path       | `./database.sqlite`                    |
| `PORT`           | Backend port           | `5000` or value provided by AWS       |
| `SMTP_*`         | Email (nodemailer)     | Gmail / SendGrid / etc.               |

On **AWS**:

- **Elastic Beanstalk:** Configuration → Software → Environment properties.
- **EC2:** Export in shell or use a small `.env` file that is **not** in the repo (and not committed).
- **Amplify (if used):** Build settings → Environment variables for `REACT_APP_*`.

---

## 5. Quick local test with SQLite (no PostgreSQL)

```bash
cd backend
npm install
# Create .env with:
# DB_DIALECT=sqlite
# JWT_SECRET=test-secret-change-in-production
node server.js
```

Then open the frontend (e.g. `npm start` in `frontend`) and use the app. The DB file will be created at `backend/database.sqlite`.

---

## Summary

- **GitHub:** Push only code; no `.env`, no `node_modules`, no `database.sqlite` (all in `.gitignore`).
- **Database:** Set `DB_DIALECT=sqlite` (and optionally `SQLITE_STORAGE`) to run **without PostgreSQL** on live.
- **AWS:** Run the Node backend (with SQLite) on EB or EC2; serve the React build from the same server or from S3/Amplify; configure env vars (including `JWT_SECRET` and any API keys) in the AWS environment, not in the repo.
