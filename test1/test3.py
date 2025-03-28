import random
from collections import Counter

def is_valid_number(number_str):
    return all(count <= 3 for count in Counter(number_str).values())

def generate_beautiful_number():
    prefixes = ['058', '051', '052', '053', '054', '055', '057', '059']
    prefix = random.choice(prefixes)

    while True:
        # Simplified beautiful patterns
        patterns = [
            lambda: f"{random.randint(100, 999)}{random.randint(1000, 9999)}",  # e.g. 7454258
            lambda: f"{random.randint(100, 999)}{str(random.randint(0,9))*3}{random.randint(0,9)}",  # e.g. 1234441
            lambda: f"{random.randint(1, 9)}{str(random.randint(0,9))*2}{random.randint(1000,9999)}",  # e.g. 5771234
            lambda: f"{str(random.randint(1,9))*2}{random.randint(100000,999999)}"  # e.g. 7798765
        ]
        number = random.choice(patterns)()[:7]
        if is_valid_number(number):
            return f"{prefix}-{number}"

# Mixed name pools: Israeli + Ashkenazi
first_names = [
    'Lior', 'Yossi', 'Daniel', 'Noa', 'Tal', 'Eli', 'Avi', 'Nadav', 'Gal', 'Tomer',
    'Moshe', 'Yaakov', 'Shlomo', 'Mendel', 'Yitzhak', 'Dovid', 'Meir', 'Hershel', 'Avrum', 'Nachman'
]

last_names = [
    'Levi', 'Cohen', 'Mizrahi', 'Avraham', 'Biton', 'Dahan', 'Shimoni', 'Sharabi', 'Halevi', 'Peretz',
    'Goldstein', 'Rosenberg', 'Katz', 'Schwartz', 'Greenberg', 'Weiss', 'Hoffman', 'Blumenfeld', 'Friedman', 'Eisenberg'
]

def generate_fake_contact():
    name = f"{random.choice(first_names)} {random.choice(last_names)}"
    phone = generate_beautiful_number()
    return {"name": name, "phone": phone}

# Generate 100 fake contacts
fake_contacts = [generate_fake_contact() for _ in range(100)]

# Example usage: print first 5
for contact in fake_contacts[:5]:
    print(f"{contact['name']}: {contact['phone']}")
