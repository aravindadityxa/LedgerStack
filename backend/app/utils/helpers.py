from datetime import datetime, date
import random
import string

def generate_invoice_number() -> str:
    timestamp = datetime.now().strftime("%Y%m%d")
    random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    return f"INV-{timestamp}-{random_str}"

def calculate_due_date(issue_date: date, days: int = 30) -> date:
    from datetime import timedelta
    return issue_date + timedelta(days=days)

def format_currency(amount: float) -> str:
    return f"${amount:,.2f}"

def get_date_range_filter(start_date: str, end_date: str):
    filters = []
    if start_date:
        filters.append(start_date)
    if end_date:
        filters.append(end_date)
    return filters