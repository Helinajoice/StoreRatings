# StoreRatings

A full-stack web application where users can browse stores, rate them, and where store owners and admins manage content. It supports three roles—**User**, **Store Owner**, and **Admin**—with role-based dashboards and an approval flow for store owners.

---

## Live Demo

**View the project:** [Add your deployed URL here]

*(Replace the link above with your live URL once the app is deployed, e.g. on Vercel, Netlify, or AWS.)*

---

## About the Project

- **Users** can sign up, verify their email, browse stores, give ratings (1–5), and view their rating history on “My Ratings.”
- **Store owners** sign up and must be **approved by an admin** before they can log in. Once approved, they get a dashboard showing their store(s) and average ratings.
- **Admins** can add/remove users and store owners, approve pending store owners, add/remove stores, and view all store ratings in one place.

The app uses JWT for authentication, supports both **PostgreSQL** (local) and **SQLite** (e.g. for deployment without a separate database server), and includes email verification for signup.

---

## Technologies Used

| Layer      | Technology |
|-----------|------------|
| **Frontend** | React 19, React Router 7, CSS |
| **Backend**  | Node.js, Express 5 |
| **Database** | Sequelize ORM with PostgreSQL or SQLite |
| **Auth**     | JWT (jsonwebtoken), bcryptjs for passwords |
| **Email**    | Nodemailer (verification codes) |
| **API**      | REST (JSON) |

---

## How to Run the Project

### Prerequisites

- **Node.js** (v16 or newer) and **npm**
- For **PostgreSQL**: a running Postgres server and a database (optional; you can use SQLite instead)

### 1. Clone the repository

```bash
git clone https://github.com/Helinajoice/StoreRatings.git
cd StoreRatings
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder (see `backend/.env.example`). Minimum for **SQLite** (no PostgreSQL):

```env
NODE_ENV=development
PORT=5000
DB_DIALECT=sqlite
SQLITE_STORAGE=./database.sqlite
JWT_SECRET=your-long-random-secret-at-least-32-chars
```

For **PostgreSQL**, use:

```env
NODE_ENV=development
PORT=5000
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
JWT_SECRET=your-long-random-secret
```

Start the backend:

```bash
npm start
```

The server runs at `http://localhost:5000`. On first run with SQLite, `database.sqlite` and tables are created automatically.

**Optional – seed stores and store owners:**

```bash
node seedStores.js
```

Default store-owner password for seeded accounts: `Owner@123`. Approve them from the admin panel.

### 3. Frontend setup

Open a **new terminal**:

```bash
cd StoreRatings/frontend
npm install
npm start
```

The app opens at `http://localhost:3000`. The frontend talks to the backend at `http://localhost:5000` by default.

### 4. First-time admin user

Admins are not created via signup. Create one in your database (e.g. in PostgreSQL or by inserting into SQLite). Example for PostgreSQL:

```sql
-- Use a bcrypt hash for your chosen password (e.g. generate with Node: require('bcryptjs').hashSync('YourPassword', 10))
INSERT INTO "Users" ("name", "email", "address", "password", "role", "is_verified", "is_approved", "createdAt", "updatedAt")
VALUES ('Admin', 'admin@example.com', '', '<your-bcrypt-hash>', 'ADMIN', true, true, NOW(), NOW());
```

Then log in on the app with that email, password, and role **Admin**.

---

## Project Structure

```
StoreRatings/
├── backend/          # Node + Express API
│   ├── config/       # Database config (PostgreSQL / SQLite)
│   ├── controllers/  # Auth, admin, user, store, rating logic
│   ├── middleware/   # JWT auth, role-based authorize
│   ├── models/       # User, Store, Rating (Sequelize)
│   ├── routes/       # API routes
│   ├── utils/        # Email (verification)
│   ├── server.js     # Entry point
│   └── seedStores.js # Optional seed script
├── frontend/         # React app
│   └── src/
│       ├── components/  # Navbar, Footer
│       ├── pages/       # Login, Signup, Dashboards, Store list, etc.
│       └── styles/      # CSS per page
├── DEPLOYMENT.md     # GitHub + AWS / SQLite deployment notes
└── README.md         # This file
```

---

## Environment Variables (Backend)

| Variable        | Description |
|----------------|-------------|
| `PORT`         | Server port (default 5000) |
| `DB_DIALECT`   | `sqlite` or `postgres` |
| `SQLITE_STORAGE` | Path to SQLite file (when using SQLite) |
| `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST` | Used when `DB_DIALECT=postgres` |
| `JWT_SECRET`   | Secret for signing JWT tokens (required) |
| `EMAIL_USER`, `EMAIL_PASS` | Optional; for sending verification emails |

See `backend/.env.example` for a template.

---

## License

ISC
