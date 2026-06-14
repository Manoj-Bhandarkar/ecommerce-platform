# 🛒 E-Commerce Platform

A full-stack E-Commerce application built with **FastAPI**, **Next.js**, **PostgreSQL**, **Redis**, **Celery**, and **Docker**. The platform provides a complete shopping experience with secure authentication, product management, order processing, payment integration, shipping tracking, and an admin dashboard.

---

## 🚀 Features

### 👤 Authentication & Authorization

* JWT Authentication
* Refresh Token Support
* Email Verification
* Password Reset via Email
* Role-Based Access Control (Admin/User)
* Protected Routes

---

### 📦 Product Management

* Create Products
* Update Products
* Delete Products
* Product Search
* Pagination
* Product Image Upload
* Inventory Management
* Low Stock Monitoring
* Multiple Categories per Product

---

### 📂 Category Management

* Create Categories
* Delete Categories
* Product Count Per Category

---

### 🛒 Shopping Cart

* Add Products to Cart
* Update Quantity
* Remove Products
* View Cart Summary
* Automatic Total Calculation

---

### 📋 Order Management

* Place Orders
* View Order History
* Cancel Orders
* Order Status Tracking

---

### 🚚 Shipping Management

* Shipping Address Management
* Shipping Status Updates
* Admin Shipping Control Panel
* Delivery Tracking

---

### 💳 Payment Integration

* Razorpay Integration
* Secure Payment Verification
* Payment History
* Transaction Tracking

---

### 📊 Admin Dashboard

* Revenue Analytics
* Total Products
* Total Orders
* Total Users
* Pending Orders
* Low Stock Alerts
* Recent Orders Tracker

---

### ⚙️ Backend Features

* FastAPI REST API
* SQLAlchemy 2.0 ORM
* PostgreSQL Database
* Alembic Migrations
* Pydantic Validation
* Redis Caching
* Celery Background Tasks
* Email Services
* Dockerized Deployment
* Nginx Reverse Proxy
* Automated Testing with 100% Green Assertions
* Production-Ready GitHub Actions CI/CD Pipeline

---

### 🎨 Frontend Features

* Next.js 15 App Router
* Tailwind CSS
* Axios API Integration
* Context API State Management
* Responsive Design
* Protected Pages
* Admin Dashboard UI

---

# 🏗️ System Architecture

```text
┌──────────────────────┐
│      Next.js UI      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│      FastAPI API     │
└───────┬───────┬──────┘
        │       │
        │       ▼
        │   Redis Cache
        │
        ▼
 PostgreSQL Database

        │
        ▼
 Celery Background Tasks
        │
        ▼
 Email Service
```

---

# 🗄️ Database Design

## Main Entities

### User

```text
User
├── id
├── email
├── password
├── is_verified
├── role
└── created_at
```

### Product

```text
Product
├── id
├── title
├── slug
├── description
├── sku
├── price
├── stock_quantity
└── image_url
```

### Category

```text
Category
├── id
└── name
```

### Order

```text
Order
├── id
├── user_id
├── total_price
├── status
└── created_at
```

### Payment

```text
Payment
├── id
├── order_id
├── amount
├── gateway
├── is_paid
└── status
```

---

# ER Diagram

```text
User
 │
 ├───────────────┐
 │               │
 ▼               ▼
Cart           Order
 │               │
 │               ├───────────┐
 ▼               ▼           ▼
CartItem      OrderItem   Payment
                  │
                  ▼
               Product
                  ▲
                  │
         ProductCategory
                  │
                  ▼
               Category
```
<img width="1536" height="1024" alt="E-R Diagram" src="https://github.com/user-attachments/assets/0dc66943-441b-4b12-bb02-805b3e5877c0" />

---

# 🛠️ Tech Stack

## Backend

* FastAPI
* SQLAlchemy 2.0
* PostgreSQL
* Alembic
* Redis
* Celery
* JWT
* Pydantic
* Razorpay

## Frontend

* Next.js 15
* React
* Tailwind CSS
* Axios
* Context API

## DevOps & Testing
* Docker & Docker Compose
* Nginx (Reverse Proxy & SSL Integration)
* GitHub Actions (Automated CI/CD Pipeline)
* Pytest & Pytest-Cov (Automated Testing Suite)

---

# 📂 Project Structure

```text
ecommerce-app/
│
├── backend/
│   ├── app/
│   │   ├── auth/
│   │   ├── user/
│   │   ├── product/
│   │   ├── category/
│   │   ├── cart/
│   │   ├── order/
│   │   ├── payment/
│   │   ├── shipping/
│   │   └── admin/
│   │
│   ├── alembic/
│   ├── requirements.txt
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── context/
│   ├── utils/
│   └── package.json
│
├── screenshots/
│
└── README.md
```

---

# ⚡ Installation

## Backend

```bash
git clone https://github.com/yourusername/ecommerce-app.git

cd backend

python -m venv venv

source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run migrations:

```bash
alembic upgrade head
```

Start server:

```bash
uvicorn app.main:app --reload
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# 🐳 Docker Setup

Run complete application:

```bash
docker compose up --build
```

---

# API Documentation

After starting the backend:

Swagger UI

```text
http://localhost:8000/docs
```

ReDoc

```text
http://localhost:8000/redoc
```

---

# Environment Variables

Backend `.env`

```env
DATABASE_URL=
SECRET_KEY=
REDIS_URL=

SMTP_HOST=
SMTP_PORT=
SMTP_USERNAME=
SMTP_PASSWORD=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

Frontend `.env.local`

```env
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_RAZORPAY_KEY=
```

---

# Future Improvements

* Product Reviews & Ratings
* Wishlist
* Coupons & Discounts
* Sales Reports
* Multi-Vendor Marketplace
* Product Recommendations
* Elasticsearch Integration
* Real-Time Notifications

---

# Resume Highlights

* Developed a production-style E-Commerce platform using FastAPI and Next.js.
* Implemented JWT authentication and role-based authorization.
* Integrated Razorpay payment gateway.
* Designed scalable PostgreSQL database architecture.
* Implemented Redis and Celery for asynchronous task processing.
* Containerized services using Docker and Docker Compose.
* Built responsive admin dashboard and customer-facing UI.
* Architected a robust CI/CD pipeline using **GitHub Actions** to automate production test suites against isolated multi-container environments (**PostgreSQL + Redis**), enabling automated deployment to AWS EC2 on successful builds.
* Achieved full unit-testing coverage across core e-commerce workflows (Auth, Cart, Orders, Products, and Shipping) using **Pytest** with dynamic mock seeding and safe transaction isolation.


---

# Author

**Manoj Bhandarkar**

Full Stack Developer | Python Developer

---

# License

This project is licensed under the MIT License.
