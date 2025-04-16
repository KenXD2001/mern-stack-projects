# 👤 User Registration & Login - MERN Stack Project

This is a basic MERN stack project for user registration and login with JWT-based authentication.

---

## 🚀 Features

- User Sign Up
- User Log In
- Password hashing using `bcrypt`
- JSON Web Token (JWT) authentication
- Protected API routes
- Token storage in `localStorage`
- React frontend with form handling and auth context

---

## 🛠️ Tech Stack

### 🔹 Frontend (client)

- React.js (Vite or CRA)
- Axios
- React Router DOM
- Tailwind CSS or Bootstrap (Optional)

### 🔹 Backend (server)

- Node.js
- Express.js
- MongoDB + Mongoose
- bcrypt
- jsonwebtoken
- dotenv
- CORS

---

## 📟 Folder Structure

```
user-auth-app/
│
├── client/       # React frontend
├── server/       # Express backend
└── README.md     # Project info
```

---

## 💾 Local Setup Instructions

### 1. Clone this project inside your main folder

```bash
mkdir "MERN Stack Projects"
cd "MERN Stack Projects"
git clone <repo-url> user-auth-app
cd user-auth-app
```

### 2. Backend Setup (`server`)

```bash
cd server
npm init -y
npm install express mongoose cors dotenv bcrypt jsonwebtoken
```

- Create `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

- Create `server.js` and start building your API routes.

```bash
node server.js
```

---

### 3. Frontend Setup (`client`)

```bash
cd ../client
npm create vite@latest
# OR use create-react-app: npx create-react-app client

cd client
npm install axios react-router-dom
```

- Start frontend:

```bash
npm run dev
```

---

## 🔐 How JWT Auth Works in This Project

1. **Signup**:

   - User submits `name`, `email`, `password`
   - Password is hashed and stored in MongoDB

2. **Login**:

   - Email and password are validated
   - If valid, a JWT token is returned

3. **Frontend**:

   - Token is saved in `localStorage`
   - On protected routes, token is sent in `Authorization` header

4. **Protected Backend Routes**:
   - Middleware checks for valid JWT
   - Access is granted if token is valid

---

## 📂 Future Improvements

- Forgot Password functionality
- Email verification
- Admin roles
- Rate limiting / Brute force protection

---

## 👨‍💻 Author

Made by [Your Name] — part of my personal MERN Stack project series.

---

## 📸 Screenshots

_(You can add screenshots here after building your UI)_

---
