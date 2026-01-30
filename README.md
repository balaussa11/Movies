

# 🎬 MovieDB — Assignment 4

**Web Technologies 2 | Assignment 4**

This project is an extension of **Assignment 3** and demonstrates a secure, well-structured REST API using the **MVC architecture**, **JWT authentication**, and **Role-Based Access Control (RBAC)**.
A simple frontend is included to demonstrate real interaction between users and the API.

---

## 📌 Project Overview

MovieDB is a web application where:

* **Admins** can manage movies (create, update, delete)
* **Users** can browse movies, add them to favorites, and leave reviews with ratings
* All data is stored in **MongoDB**
* Access is protected using **JWT authentication**

The project follows industry practices such as separation of concerns and secure password handling.

---

## 🧱 Project Architecture (MVC)

The project follows the **Model–View–Controller (MVC)** pattern:

```
assignment-4/
│
├── models/        # Mongoose schemas (MongoDB)
├── controllers/   # Business logic
├── routes/        # API endpoints
├── middleware/    # Authentication & authorization
├── public/        # Frontend (HTML, CSS, JS)
├── index.js       # App entry point
└── README.md
```

---

## 📦 Main Objects (Models)

### 1️⃣ Movie (Primary Object)

Represents movies, series, and cartoons.

**Fields:**

* `name` — movie title
* `genre` — genre (Action, Drama, etc.)
* `year` — release year
* `director` — director name
* `description` — short description
* `type` — `movie | series | cartoon`

**CRUD Operations:**

* Create → **Admin only**
* Read → **Public**
* Update → **Admin only**
* Delete → **Admin only**

---

### 2️⃣ Review (Secondary Object)

Represents user reviews and ratings for movies.

**Fields:**

* `text` — review content
* `rating` — number from 1 to 5
* `movie` — reference to Movie
* `user` — reference to User

**CRUD Operations:**

* Create → **Authenticated users**
* Read → **Public**
* Update → **Admin only**
* Delete → **Admin only**

---

## 👤 User Roles & RBAC

The system uses **Role-Based Access Control (RBAC)** with two roles:

### 🔑 User

* Can register and log in
* Can browse movies
* Can add movies to favorites
* Can leave reviews and ratings
* Cannot modify or delete movies

### 👑 Admin

* All user permissions
* Can **add, update, and delete movies**
* Can **edit or delete any review**
* Has access to **Admin Panel (admin.html)**

Role is stored in the JWT token and checked using middleware.

---

## 🔐 Authentication & Security

* Passwords are **hashed using bcrypt**
* Authentication is implemented using **JWT (JSON Web Tokens)**
* Protected routes require a valid token:

  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
* Middleware:

  * `authMiddleware` — checks JWT
  * `roleMiddleware` — checks admin role

---

## 🌐 Frontend Pages

The frontend is intentionally simple but functional.

### Pages:

* **index.html** — Login & Registration
* **browse.html** — Browse movies, filter by type, favorites
* **profile.html** — User profile (favorites & reviews)
* **admin.html** — Admin panel (add/manage movies)

Admin features are hidden from regular users.

---

## ⚙️ Setup Instructions

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Create `.env` file

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 3️⃣ Run the server

```bash
npm run dev
```

Server will start at:

```
http://localhost:3000
```

---

## 🧪 API Testing (Postman)

A Postman collection is provided to demonstrate:

* Successful admin actions (POST/PUT/DELETE)
* Failed access attempts by regular users
* Authentication and token usage



---

## 🏁 Conclusion

This project demonstrates how to build a secure, scalable REST API with proper authentication and authorization, combined with a simple frontend for real-world interaction.
It reflects real industry practices used in modern web applications such as IMDb or Kinopoisk.

---



Ты уже **очень сильную работу сделала**, это видно 💙
