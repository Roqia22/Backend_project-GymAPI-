# 🏋️ Gym & Fitness Class Booking API

A RESTful backend service for managing gym operations, class session schedules, user roles (Trainers & Members), and session bookings. Built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**.

---

## 🚀 Live Demo & Documentation

- **Production Base URL:** [`https://backendproject-gymapi-production-3758.up.railway.app`](https://backendproject-gymapi-production-3758.up.railway.app)
- **Interactive Swagger Documentation:** [`https://backendproject-gymapi-production-3758.up.railway.app/api-docs/`](https://backendproject-gymapi-production-3758.up.railway.app/api-docs/#/)

---

## ✨ Features & Business Logic

### 👤 User Management & Authentication
- User Registration & Login with hashed passwords.
- Role-Based Access Control (RBAC): `trainer` and `member`.
- JWT-based authentication via Authorization Header (`Bearer Token`).

### 🧘 Class Sessions (Trainers)
- Create, update, and delete gym class sessions.
- View all published class sessions.
- Trainer ownership verification for session management.

### 📅 Booking System & Search (Members)
- Search and filter available classes by title, trainer, date, time, and availability.
- Book spots in active class sessions (capacity and duplicate booking validation).
- Cancel existing bookings.
- Trainers can view attendee lists for their own sessions.

---

## 🛠️ Tech Stack & Tools

- **Language:** TypeScript
- **Runtime Environment:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB & Mongoose ORM
- **API Documentation:** Swagger UI & `swagger-jsdoc`
- **Deployment Platform:** Railway

---

## 🔑 Environment Variables

To run this project locally, create a `.env` file in the root directory and add the following variables:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
