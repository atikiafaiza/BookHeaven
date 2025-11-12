# 🛍️ BookHeaven – MERN E-Commerce Platform

BookHeaven is a fully-featured **MERN stack e-commerce application** built for scalability and user-friendliness.  
It allows users to browse products, manage carts, create wishlists, and place orders — all with real-time updates and robust authentication.

---

## 🚀 Features

### 🧑‍💻 User

#### **Product Reviews**
- Write, edit, and delete reviews.
- Instantly update overall ratings and star percentages.

#### **Wishlist**
- Add and remove products.
- Annotate products with personalized notes.

#### **Order Management**
- Create new orders.
- View complete order history.

#### **Profile Management**
- Manage email, username, and multiple addresses.

#### **Shopping Cart**
- Add products, adjust quantities, and view real-time subtotals.

---

### 🧑‍🔧 Admin

#### **Product Management**
- Add, edit, delete, and soft-delete products.
- Manage product attributes such as name, price, and stock.

#### **Order Management**
- View and update order details and statuses.

---

### 🔒 Security & User Experience

#### **Secure Authentication**
- Login, signup, OTP verification, password reset, and logout.

#### **Intuitive Interface**
- Powered by **Material UI** for a visually appealing, user-friendly experience.

---

### ⚙️ Scalability

#### **Built for Growth**
- Scalable architecture designed to handle increasing user demands efficiently.

---

## 🧩 Project Setup

### 🧱 Prerequisites

- **Node.js** (v21.1.0 or later)
- **MongoDB** installed and running locally

---

### 🪄 Clone the Project

```bash
git clone https://github.com/atikiafaiza/BookHeaven.git
cd mern-ecommerce
```

---

### 📦 Install Dependencies

> 💡 Tip: To install dependencies for both frontend and backend efficiently, open two terminals or use a split terminal.

#### Frontend

```bash
cd frontend
npm install
```

#### Backend

```bash
cd backend
npm install
```

---

## ⚙️ Environment Variables

### Backend

Create a `.env` file inside the **backend** directory and add the following:

```bash
# Database connection string
MONGO_URI="mongodb://localhost:27017/your-database-name"

# Frontend URL (adjust if needed)
ORIGIN="http://localhost:3000"

# Email credentials (for reset and OTP)
EMAIL="your-email@example.com"
PASSWORD="your-email-password"

# Token and cookie expiration
LOGIN_TOKEN_EXPIRATION="30d"
OTP_EXPIRATION_TIME="120000"
PASSWORD_RESET_TOKEN_EXPIRATION="2m"
COOKIE_EXPIRATION_DAYS="30"

# Secret key (JWT)
SECRET_KEY="your-secret-key"

# Environment (production/development)
PRODUCTION="false"
```

### Frontend

Create a `.env` file inside the **frontend** directory and add:

```bash
# Backend URL (adjust if needed)
REACT_APP_BASE_URL="http://localhost:8000"
```

> ⚠️ **Important:**  
> Replace placeholders (e.g., `your-database-name`, `your-email`) with actual values.  
> Exclude `.env` from version control to protect sensitive data.

---

## 🌱 Data Seeding

Quickly get started with sample data (users, products, reviews, carts).

### Steps:

```bash
# Open new terminal
cd backend
npm run seed
```

This runs `seed/seed.js` and populates your database with sample data.

---

## 🏃 Running Development Servers

### Important Notes
- Use **separate terminals** for backend and frontend.
- **Nodemon** is required for backend live reloads.

Install globally (if not already):

```bash
npm install -g nodemon
```

### Start the Backend Server

```bash
cd backend
npm run dev
```

Server default: **http://localhost:8000**

### Start the Frontend Server

```bash
cd frontend
npm start
```

App default: **http://localhost:3000**

---

## 🔑 Demo Account (Optional)

After seeding, you can log in with the sample user:

```
Email: demo@gmail.com
Password: helloWorld@123
```

### Limitations:
- Password reset and OTP verification **do not work** for the demo account (no real email).
- To test these flows, create a new account with a valid email.

---

## 🌐 Accessing the Application

- **Backend:** [http://localhost:8000](http://localhost:8000)
- **Frontend:** [http://localhost:3000](http://localhost:3000)

---

## 💡 Summary

BookHeaven delivers a full e-commerce experience with:
- Secure authentication and scalable design.
- Powerful admin module and interactive UI.
- Streamlined code organization for ease of development.

---

✨ **Happy Coding!** ✨

---

