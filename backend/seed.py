from app.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.customer import Customer
from app.models.service import Service
from app.models.invoice import Invoice, InvoiceItem, InvoiceStatus
from app.models.payment import Payment
from app.utils.auth import hash_password
from datetime import datetime, timedelta
import random

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    if db.query(User).first():
        print("Database already seeded")
        return
    
    # Create demo user
    user = User(
        full_name="John Doe",
        company_name="Acme Solutions Inc.",
        email="demo@ledgerstack.com",
        password_hash=hash_password("demo123"),
        phone="+1 (555) 123-4567",
        address="123 Business Ave, San Francisco, CA 94107"
    )
    db.add(user)
    db.flush()
    
    # Create customers
    customers_data = [
        {"name": "Sarah Johnson", "company_name": "TechStart Inc.", "email": "sarah@techstart.com", "phone": "+1-555-0101"},
        {"name": "Michael Chen", "company_name": "Digital Dynamics", "email": "michael@digitaldynamics.com", "phone": "+1-555-0102"},
        {"name": "Emily Davis", "company_name": "Creative Studios", "email": "emily@creativestudios.com", "phone": "+1-555-0103"},
        {"name": "Robert Wilson", "company_name": "Wilson Consulting", "email": "robert@wilsonconsulting.com", "phone": "+1-555-0104"},
        {"name": "Lisa Anderson", "company_name": "Anderson Marketing", "email": "lisa@andersonmarketing.com", "phone": "+1-555-0105"},
    ]
    
    customers = []
    for data in customers_data:
        customer = Customer(user_id=user.id, **data)
        db.add(customer)
        customers.append(customer)
    
    db.flush()
    
    # Create services
    services_data = [
        {"name": "Web Development", "description": "Full-stack web application development", "price": 5000.00, "category": "Development"},
        {"name": "UI/UX Design", "description": "User interface and experience design", "price": 3000.00, "category": "Design"},
        {"name": "SEO Optimization", "description": "Search engine optimization services", "price": 1500.00, "category": "Marketing"},
        {"name": "Mobile App Development", "description": "iOS and Android app development", "price": 8000.00, "category": "Development"},
        {"name": "Content Writing", "description": "Professional content creation", "price": 1000.00, "category": "Content"},
        {"name": "Cloud Consulting", "description": "Cloud infrastructure setup and management", "price": 2500.00, "category": "Consulting"},
    ]
    
    services = []
    for data in services_data:
        service = Service(user_id=user.id, **data)
        db.add(service)
        services.append(service)
    
    db.flush()
    
    # Create invoices
    statuses = list(InvoiceStatus)
    for i in range(10):
        customer = random.choice(customers)
        invoice_date = datetime.utcnow() - timedelta(days=random.randint(1, 60))
        due_date = invoice_date + timedelta(days=30)
        
        num_items = random.randint(1, 3)
        items = []
        subtotal = 0
        
        for _ in range(num_items):
            service = random.choice(services)
            quantity = random.randint(1, 3)
            unit_price = service.price
            total = quantity * unit_price
            subtotal += total
            items.append(InvoiceItem(
                description=service.name,
                quantity=quantity,
                unit_price=unit_price,
                total=total
            ))
        
        tax_rate = random.choice([0, 5, 10, 15])
        tax_amount = subtotal * (tax_rate / 100)
        total = subtotal + tax_amount
        
        status = random.choice(statuses[:3])  # draft, pending, paid
        
        invoice = Invoice(
            user_id=user.id,
            customer_id=customer.id,
            invoice_number=f"INV-{invoice_date.strftime('%Y%m%d')}-{random.randint(1000, 9999)}",
            issue_date=invoice_date,
            due_date=due_date,
            status=status,
            notes="Thank you for your business!",
            subtotal=subtotal,
            tax_rate=tax_rate,
            tax_amount=tax_amount,
            total=total
        )
        db.add(invoice)
        db.flush()
        
        for item in items:
            item.invoice_id = invoice.id
            db.add(item)
        
        if status == InvoiceStatus.PAID:
            payment = Payment(
                invoice_id=invoice.id,
                amount=total,
                payment_method=random.choice(["Credit Card", "Bank Transfer", "PayPal"]),
                transaction_id=f"TXN-{random.randint(100000, 999999)}",
                payment_date=invoice_date + timedelta(days=random.randint(1, 15)),
                status="completed"
            )
            db.add(payment)
            invoice.amount_paid = total
            invoice.balance_due = 0
    
    db.commit()
    db.close()
    print("Database seeded successfully!")

if __name__ == "__main__":
    seed_database()