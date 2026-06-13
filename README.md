# LedgerStack

### Manage Invoices. Track Revenue. Grow Business.

LedgerStack is a modern Billing & Invoice Management Platform built using React, FastAPI, MySQL, and SQLAlchemy. It helps businesses manage customers, services, invoices, payments, and revenue analytics through a centralized dashboard.

The platform streamlines billing workflows by providing secure authentication, customer management, invoice generation, PDF exports, payment tracking, and business insights in a clean and responsive interface.

---

## Features

### Authentication

* JWT Authentication
* User Registration & Login
* Password Hashing
* Protected Routes

### Dashboard Analytics

* Revenue Overview
* Customer Statistics
* Invoice Insights
* Payment Tracking
* Revenue Analytics

### Customer Management

* Add Customers
* Edit Customer Information
* Delete Customers
* Search & Filter Customers
* Pagination Support

### Service Management

* Create Services
* Update Service Pricing
* Delete Services
* Service Catalog Management

### Invoice Management

* Create Professional Invoices
* Edit Existing Invoices
* Duplicate Invoices
* Invoice Status Tracking
* Automatic Tax Calculation
* PDF Invoice Generation

### Payment Tracking

* Record Payments
* Mark Invoices as Paid
* Outstanding Payment Monitoring
* Payment History

### Reports

* Revenue Reports
* Invoice Reports
* Customer Reports
* Date Range Filtering

---

## Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Router DOM
* Axios
* React Hook Form
* Recharts
* Lucide React Icons

### Backend

* FastAPI
* SQLAlchemy ORM
* Pydantic
* JWT Authentication
* Alembic

### Database

* MySQL

### Deployment

* Vercel (Frontend)
* Render (Backend)
* Cloud MySQL Database

---

## System Architecture

```text
React Frontend
       │
       ▼
FastAPI Backend
       │
       ▼
SQLAlchemy ORM
       │
       ▼
MySQL Database
```

---

## Core Modules

### Dashboard

* Revenue Metrics
* Customer Insights
* Invoice Statistics
* Activity Monitoring

### Customers

* Customer CRUD Operations
* Search & Filtering

### Services

* Service Management
* Pricing Configuration

### Invoices

* Invoice Creation
* PDF Generation
* Status Tracking

### Payments

* Payment Recording
* Outstanding Balance Tracking

### Reports

* Revenue Analytics
* Customer Reports
* Invoice Reports

---

## Installation

### Clone Repository

```bash
git clone https://github.com/your-username/LedgerStack.git

cd LedgerStack
```

### Backend Setup

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt
```

Create a `.env` file:

```env
DATABASE_URL=mysql+pymysql://username:password@localhost/ledgerstack

SECRET_KEY=your_secret_key

ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Run migrations:

```bash
alembic upgrade head
```

Start backend:

```bash
uvicorn app.main:app --reload
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## API Documentation

Swagger UI:

```text
http://localhost:8000/docs
```

ReDoc:

```text
http://localhost:8000/redoc
```

---

## Future Enhancements

* Email Invoice Delivery
* GST Reports
* Payment Gateway Integration
* Expense Tracking
* Multi-Currency Support
* Mobile Application
* Advanced Analytics

---

## Learning Outcomes

This project demonstrates:

* Full-Stack Development
* REST API Development
* Authentication & Authorization
* Database Design
* SQLAlchemy ORM
* MySQL Integration
* PDF Generation
* Dashboard Analytics
* Responsive UI Design
* Cloud Deployment

---

## Author

**Aravind Adityaa**

Computer Science & Engineering Student

Python Full Stack Developer

---

### LedgerStack

**Manage Invoices. Track Revenue. Grow Business.**
