# LedgerStack

### Manage Invoices. Track Revenue. Grow Business.

LedgerStack is a multi-tenant SaaS Billing & Invoice Management Platform built using React, FastAPI, MySQL, and SQLAlchemy. It enables businesses to manage customers, services, invoices, payments, and revenue analytics through secure organization-based workspaces.

The platform is designed for freelancers, agencies, consultants, startups, and small businesses that need a centralized solution for billing operations, invoice generation, payment tracking, and business reporting.

---

## Features

### Multi-Tenant SaaS Architecture

* Organization-Based Workspaces
* Data Isolation Between Organizations
* Role-Based Access Control
* Secure Multi-User Environment

### Authentication & Security

* JWT Authentication
* User Registration & Login
* Password Hashing
* Protected Routes
* Secure API Access

### Dashboard Analytics

* Revenue Overview
* Customer Statistics
* Invoice Insights
* Payment Tracking
* Monthly Revenue Trends
* Business Performance Monitoring

### Customer Management

* Add Customers
* Edit Customer Information
* Delete Customers
* Search Customers
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
* Real-Time Total Calculation
* PDF Invoice Generation

### Payment Tracking

* Record Payments
* Mark Invoices as Paid
* Outstanding Payment Monitoring
* Payment History

### Reports & Analytics

* Revenue Reports
* Customer Reports
* Invoice Reports
* Date Range Filtering
* Business Insights Dashboard

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

## Key SaaS Features

### Organization Management

Each company operates in its own isolated workspace.

Example:

```text
Organization A
├── Customers
├── Services
├── Invoices
└── Payments

Organization B
├── Customers
├── Services
├── Invoices
└── Payments
```

Users can only access data belonging to their organization.

---

### Role-Based Access Control

Supported Roles:

* Owner
* Admin
* Staff

Permissions can be customized based on business requirements.

---

### Data Isolation

All business data is scoped to an organization.

This ensures:

* Security
* Privacy
* Multi-Tenant Scalability

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
* Invoice Statistics
* Customer Insights
* Activity Feed

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

* Subscription Plans
* Email Invoice Delivery
* GST Reports
* Payment Gateway Integration
* Expense Tracking
* Mobile Application
* Advanced Analytics
* Audit Logs

---

## Learning Outcomes

This project demonstrates:

* Full-Stack Development
* Multi-Tenant SaaS Architecture
* REST API Development
* Authentication & Authorization
* Role-Based Access Control
* Database Design
* SQLAlchemy ORM
* MySQL Integration
* PDF Generation
* Dashboard Analytics
* Cloud Deployment

---

## Author

**Aravind Adityaa**

Computer Science & Engineering Student

Python Full Stack Developer

LinkedIn: https://linkedin.com/in/aravindadityaa

---

### LedgerStack

**Manage Invoices. Track Revenue. Grow Business.**
