# LedgerStack

### Manage Invoices. Track Revenue. Grow Business.

LedgerStack is a modern SaaS Billing & Invoice Management Platform built using React, FastAPI, MySQL, and SQLAlchemy. It enables freelancers, startups, agencies, consultants, and small businesses to manage customers, create professional invoices, track payments, generate PDF invoices, and monitor revenue through a clean and intuitive dashboard.

---

## Features

### Authentication

* Secure JWT Authentication
* User Registration & Login
* Password Hashing
* Protected Routes

### Dashboard Analytics

* Total Revenue Overview
* Customer Statistics
* Invoice Insights
* Payment Tracking
* Revenue Growth Visualization

### Customer Management

* Add Customers
* Edit Customer Details
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
* Automatic Tax & Total Calculation
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
* Filter by Date Range

---

## Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Router
* Axios
* Recharts

### Backend

* FastAPI
* SQLAlchemy
* JWT Authentication
* Alembic
* Pydantic

### Database

* MySQL

### Deployment

* Vercel (Frontend)
* Render (Backend)
* MySQL Cloud Database

---

## Project Structure

```text
LedgerStack/
├── backend/
├── frontend/
├── README.md
└── .gitignore
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/your-username/LedgerStack.git

cd LedgerStack
```

---

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

Run Migrations:

```bash
alembic upgrade head
```

Start Backend:

```bash
uvicorn app.main:app --reload
```

---

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## API Documentation

After starting the backend:

```text
http://localhost:8000/docs
```

Interactive API documentation is automatically generated using Swagger UI.

---

## Screens

* Splash Screen
* Login
* Register
* Dashboard
* Customers
* Services
* Invoices
* Payments
* Reports
* Settings

---

## Future Enhancements

* Email Invoice Delivery
* Multi-User Organizations
* Subscription Billing
* GST Reports
* Payment Gateway Integration
* Expense Tracking
* Dark Mode
* Mobile Application

---

## Why LedgerStack?

LedgerStack was built to provide a clean, scalable, and modern billing solution while demonstrating real-world full-stack development practices including:

* REST API Development
* Authentication & Authorization
* Database Design
* PDF Generation
* Dashboard Analytics
* Responsive UI Design
* SaaS Architecture
* Cloud Deployment

---

## Author

Aravind Adityaa

Computer Science & Engineering Student

Python Full Stack Developer

