# 🛒 E-Commerce Platform

🚀 A production-ready, full-stack E-Commerce application built with FastAPI, Next.js 15, PostgreSQL, Redis, Docker, and AWS.

### 🔗 Live Links

🌐 **Store Front:** [https://manojbhandarkar.cloud](https://manojbhandarkar.cloud)  
📘 **API Documentation:** [https://manojbhandarkar.cloud](https://manojbhandarkar.cloud)  
💻 **GitHub Repository:** [https://github.com](https://github.com)

---

## 🚀 Features

### 👤 Authentication & Authorization
* 🔑 JWT Authentication with Refresh Token Support
* 📧 Email Verification & Secure Password Reset via Email
* 🛡️ Protected Routes & Role-Based Access Control (Admin/User)

### 📦 Product Management
* ➕ Full CRUD operations (Create, Read, Update, Delete) for Products
* 🔍 Full-text Product Search & Server-side Pagination
* 🖼️ Product Image Upload & Live Inventory Management
* ⚠️ Low Stock Monitoring & Support for Multiple Categories per Product

### 📂 Category Management
* 🏷️ Create and Delete Categories
* 📊 Real-time Product Count Per Category

### 🛒 Shopping Cart
* 🛒 Interactive Cart (Add/Remove Products, Dynamic Quantity Updates)
* 🧮 Cart Summary with Automatic Total Pricing Calculation

### 📋 Order Management
* 📦 Seamless Order Placement & Cancellation
* ⏳ Order History tracking with Live Status Updates

### 🚚 Shipping Management
* 📍 Delivery Address Management
* 🚚 Dynamic Shipping Status Updates & Tracking
* ⚙️ Admin Shipping Control Panel

### 💳 Payment Integration
* 💳 Secure Razorpay Gateway Integration
* 📑 Automated Payment Verification & Transaction Tracking

### 📊 Admin Dashboard
* 📈 Live Revenue Analytics
* 📊 Total Products, Orders, and Registered Users Metrics
* 🚨 Real-time Pending Orders & Low Stock Alerts

### ⚙️ Backend Engineering
* ⚡ High-performance FastAPI REST API powered by SQLAlchemy 2.0 ORM
* 🗄️ Robust PostgreSQL Database layer with Alembic Migrations
* 🛡️ Data validation via Pydantic & Performance Optimization via Redis Caching
* ⚙️ Async Background Tasks handling using Celery and Redis broker
* 🐳 Complete Dockerized Setup with Nginx acting as a Reverse Proxy
* 🧪 100% Automated Unit Testing Suite with Pytest
* 🔄 Production-grade CI/CD pipeline using GitHub Actions

### 🎨 Frontend Design
* 🚀 Next.js 15 App Router architecture with Tailwind CSS
* 🔄 Axios API client configuration & Context API global state management
* 📱 100% Responsive layout for Mobile, Tablet, and Desktop displays

---

# 📸 Application Screenshots

## 🏠 Home Page
<img width="1588" alt="Store Home Page" src="https://github.com" />

---

## 🛒 Admin Dashboard
<img width="1378" alt="Admin Dashboard" src="https://github.com" />

---

## 📘 API Documentation
<img width="1588" alt="API Documentation" src="https://github.com" />

---

## ⚙️ CI/CD Pipeline
<img width="1378" alt="CI/CD Pipeline" src="https://github.com" />

---

# 🏗️ System Architecture

```mermaid
graph TD
    %% Nodes Definition
    UI["💻 Next.js UI"]
    API["⚡ FastAPI API"]
    Redis[("🛑 Redis Cache")]
    DB[("🐘 PostgreSQL Database")]
    Celery["⚙️ Celery Background Tasks"]
    Email["📧 Email Service"]

    %% Flow/Connections
    UI --> API
    API --> Redis
    API --> DB
    DB --> Celery
    Celery --> Email

    %% Styling
    style UI fill:#000,stroke:#fff,stroke-width:2px,color:#fff
    style API fill:#009688,stroke:#fff,stroke-width:2px,color:#fff
    style Redis fill:#dc3545,stroke:#fff,stroke-width:2px,color:#fff
    style DB fill:#336791,stroke:#fff,stroke-width:2px,color:#fff
    style Celery fill:#3776AB,stroke:#fff,stroke-width:2px,color:#fff
    style Email fill:#ffc107,stroke:#333,stroke-width:2px,color:#333
```

---

# 🗄️ Database Design

## Main Entities

<table>
  <tr>
    <!-- USER TABLE -->
    <td valign="top" width="20%">
      <strong>👤 User</strong>
      <ul>
        <li>id</li>
        <li>email</li>
        <li>password</li>
        <li>is_verified</li>
        <li>role</li>
        <li>created_at</li>
      </ul>
    </td>
    
    <!-- PRODUCT TABLE -->
    <td valign="top" width="20%">
      <strong>📦 Product</strong>
      <ul>
        <li>id</li>
        <li>title</li>
        <li>slug</li>
        <li>description</li>
        <li>sku</li>
        <li>price</li>
        <li>stock_quantity</li>
        <li>image_url</li>
      </ul>
    </td>

    <!-- CATEGORY TABLE -->
    <td valign="top" width="20%">
      <strong>🏷️ Category</strong>
      <ul>
        <li>id</li>
        <li>name</li>
      </ul>
    </td>

    <!-- ORDER TABLE -->
    <td valign="top" width="20%">
      <strong>🛒 Order</strong>
      <ul>
        <li>id</li>
        <li>user_id</li>
        <li>total_price</li>
        <li>status</li>
        <li>created_at</li>
      </ul>
    </td>

    <!-- PAYMENT TABLE -->
    <td valign="top" width="20%">
      <strong>💳 Payment</strong>
      <ul>
        <li>id</li>
        <li>order_id</li>
        <li>amount</li>
        <li>gateway</li>
        <li>is_paid</li>
        <li>status</li>
      </ul>
    </td>
  </tr>
</table>

---

## ER Diagram

<img width="1536" alt="E-R Diagram" src="https://github.com" />

---

# 🛠️ Tech Stack

### Backend
* FastAPI | SQLAlchemy 2.0 | PostgreSQL | Alembic | Redis | Celery | JWT | Pydantic | Razorpay

### Frontend
* Next.js 15 | React | Tailwind CSS | Axios | Context API

### DevOps & Testing
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
│   │   ├── api/
│   │   ├── core/
│   │   ├── db/
│   │   ├── dependencies/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── tasks/
│   │   ├── tests/
│   │   ├── utils/
│   │   └── admin/
│   ├── alembic/
│   ├── requirements.txt
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── frontend/
│   ├── app/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── login/
│   │   ├── product/
│   │   ├── register/
│   │   ├── user/
│   │   │   ├── address/
│   │   │   ├── category/
│   │   │   ├── dashboard/
│   │   │   ├── order/
│   │   │   ├── payments/
│   │   │   ├── product/
│   │   │   └── shippingstatus/
│   ├── components/
│   ├── context/
│   ├── utils/
│   └── package.json
├── screenshots/
└── README.md
```

---

# ⚡ Local Installation

### Backend Setup
```bash
# Clone the repository
git clone https://github.com.git
cd ecommerce-platform/backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start the development server
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

---

# 🐳 Docker Setup

Spin up the entire ecosystem (Backend, Frontend, PostgreSQL, Redis, Celery) with a single command:

```bash
docker compose up --build
```

---

# 📘 API Documentation Links

Once your local backend instance is running, you can interact with the API endpoints here:
* **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
* **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

# 🔑 Environment Variables

### Backend Configurations (`backend/.env`)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
SECRET_KEY=your_super_secret_key
REDIS_URL=redis://localhost:6373/0

SMTP_HOST=
SMTP_PORT=
SMTP_USERNAME=
SMTP_PASSWORD=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

### Frontend Configurations (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_RAZORPAY_KEY=
```

---

# 🔮 Future Roadmaps
* ⭐ Product Reviews & Advanced Rating Engine
* 📑 User Wishlist Management Module
* 🏷️ Intelligent Coupons, Promotions, & Discount Management
* 📊 Comprehensive Financial Sales & Tax Analytical Reports
