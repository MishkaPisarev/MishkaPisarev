import time

def loading_dots():
    for i in range(1, 4):
        print("." * i)
        time.sleep(1)

# Nationality dictionary (country code → country name + flag) #
nationality_dict = {
    "ru": "Russia 🇷🇺", "il": "Israel 🇮🇱", "us": "United States 🇺🇸", 
    "uk": "United Kingdom 🇬🇧", "de": "Germany 🇩🇪", "fr": "France 🇫🇷", 
    "in": "India 🇮🇳", "cn": "China 🇨🇳", "jp": "Japan 🇯🇵"
}

# Inputs
firstName = input("What is your first name? ").strip()
lastName = input("What is your last name? ").strip()

# Age input with validation
while True:
    currentAge = input("How old are you? ").strip()
    if currentAge.isdigit():
        currentAge = int(currentAge)
        break
    else:
        print("Please enter a number only.")

# Ask for country code
nation_input = input("Enter your country code (e.g., ru, il, us): ").strip().lower()
nation = nationality_dict.get(nation_input, "Anonymous")

# Gender input with validation
while True:
    gender_input = input("What is your gender? (male/female or m/f): ").strip().lower()
    if gender_input in ["male", "m"]:
        isMale = True
        break
    elif gender_input in ["female", "f"]:
        isMale = False
        break
    else:
        print("Please enter 'male' or 'female' (or 'm' / 'f').")

gender = "male" if isMale else "female"

# Outputs with loading animation
print(f"\nNice to meet you, {firstName.title()} {lastName.title()}!")
loading_dots()

print(f"You are a {gender} from {nation}.")
loading_dots()

print(f"Next year you will be {currentAge + 1} years old.")
