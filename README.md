# StoreRatings

A full-stack web application where users can browse stores, rate them, and where store owners and admins manage content. It supports three roles—**User**, **Store Owner**, and **Admin**—with role-based dashboards and an approval flow for store owners.

---

## Video

**Demo / walkthrough:** [https://drive.google.com/file/d/1Y6Teq_SSWh_G_LZbkOw1uHT0VzK_Em6f/view?usp=sharing]

---

## About the Project

- **Users** can sign up, verify their email, browse stores, give ratings (1–5), and view their rating history on “My Ratings.”
- **Store owners** sign up and must be **approved by an admin** before they can log in. Once approved, they get a dashboard showing their store(s) and average ratings.
- **Admins** can add/remove users and store owners, approve pending store owners, add/remove stores, and view all store ratings in one place.

The app uses JWT for authentication, PostgreSQL for the database, and includes email verification for signup.

---

## Technologies Used

| Layer      | Technology |
|-----------|------------|
| **Frontend** | React 19, React Router 7, CSS |
| **Backend**  | Node.js, Express 5 |
| **Database** | Sequelize ORM with PostgreSQL |
| **Auth**     | JWT (jsonwebtoken), bcryptjs for passwords |
| **Email**    | Nodemailer (verification codes) |
| **API**      | REST (JSON) |

---

## How to Run Locally

### Prerequisites

- **Node.js** (v16 or newer) and **npm**
- **PostgreSQL** installed and running, with a database created (e.g. `store_ratings`)

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

Create a `.env` file in the `backend` folder (use `backend/.env.example` as reference). For **PostgreSQL**:

```env
NODE_ENV=development
PORT=5000

DB_DIALECT=postgres
DB_NAME=store_ratings
DB_USER=postgres
DB_PASSWORD=your_db_password
DB_HOST=localhost

JWT_SECRET=your-long-random-secret-at-least-32-chars
```

Start the backend:

```bash
npm start
```

The server runs at `http://localhost:5000`.

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

The app opens at `http://localhost:3000` and talks to the backend at `http://localhost:5000`.

### 4. First-time admin user

Admins are not created via signup. Create one in your database. Example for PostgreSQL:

```sql
-- Use a bcrypt hash for your chosen password (e.g. generate with Node: require('bcryptjs').hashSync('YourPassword', 10))
INSERT INTO "Users" ("name", "email", "address", "password", "role", "is_verified", "is_approved", "createdAt", "updatedAt")
VALUES ('Admin', 'admin@example.com', '', '<your-bcrypt-hash>', 'ADMIN', true, true, NOW(), NOW());
```

Then log in with that email and password (role **Admin**).

---

## Project Structure

```
StoreRatings/
├── backend/          # Node + Express API
│   ├── config/       # Database config (PostgreSQL)
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
└── README.md
```

---

## Environment Variables (Backend)

| Variable   | Description |
|------------|-------------|
| `PORT`     | Server port (default 5000) |
| `DB_DIALECT` | `postgres` for local |
| `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST` | PostgreSQL connection |
| `JWT_SECRET` | Secret for signing JWT tokens (required) |
| `SMTP_*`   | Optional; for verification emails (see `.env.example`) |

See `backend/.env.example` for a template.

---

## License

ISC
