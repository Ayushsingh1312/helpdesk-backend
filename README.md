# HelpDesk Backend API 🎫

A production-ready REST API for a Help Desk / Support Ticket System built with Node.js, Express, and MongoDB.

## 🔗 Live API
`https://helpdesk-backend-pn7r.onrender.com/api`

## 🛠️ Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT + bcrypt
- **File Upload:** Multer
- **Logging:** Morgan

## ✨ Features
- JWT-based Authentication with Role-based Access Control (User/Admin)
- Full Ticket CRUD with ownership-based authorization
- File attachment upload (JPEG, PNG, PDF — max 5MB)
- Comments system on tickets
- Search, Filter & Pagination on ticket listing
- Admin Dashboard Stats API
- Protected routes with custom middleware

## 📁 Folder Structure
```
src/
├── config/         # DB connection, Multer config
├── controllers/    # Business logic
├── middleware/     # Auth & role middleware
├── models/         # Mongoose schemas
├── routes/         # Express routers
└── utils/          # Helper functions (JWT)
```

## 🚀 Local Setup
```bash
git clone https://github.com/Ayushsingh1312/helpdesk-backend
cd helpdesk-backend
npm install
```

Create `.env` file:
```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev
```

## 📡 API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Private |

### Tickets
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/tickets` | Private |
| POST | `/api/tickets` | Private |
| GET | `/api/tickets/:id` | Private |
| PUT | `/api/tickets/:id` | Private |
| DELETE | `/api/tickets/:id` | Private |

### Comments
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/tickets/:id/comments` | Private |
| POST | `/api/tickets/:id/comments` | Private |

### Dashboard
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/dashboard/stats` | Admin Only |
