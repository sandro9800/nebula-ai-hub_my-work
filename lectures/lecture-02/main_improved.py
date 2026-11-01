from datetime import date
from dateutil.relativedelta import relativedelta

# basic variables and an f-string
name = "sandro"
age = 15
height = 1.77
student_status = True
print(f"My name is {name}, I am {age} years old, my height is {height} meters.")

# convert minutes to hours and minutes
minutes = input("Enter the number of minutes: ")
hours = int(minutes) // 60
remaining_minutes = int(minutes) % 60
print(f"{minutes} minutes is equal to {hours} hours and {remaining_minutes} minutes.")

# cinema ticket calculator
name = input("Enter your name: ")
age = input("Enter your age: ")

ticket_count = int(input("Enter the number of tickets you want to buy: "))

total_price = 0

# the price depends on the age of each person
for i in range(ticket_count):
    ticket_age = int(input(f"Enter the age of person {i + 1}: "))
    if ticket_age < 12:
        price = 5
    elif ticket_age < 17:
        price = 8
    elif ticket_age < 59:
        price = 12
    else:
        price = 6

    total_price += price

initial_price = total_price

# group discount: 10% for 3-5 tickets, 20% for more than 5
if 3 <= ticket_count <= 5:
    total_price *= 0.9
elif ticket_count > 5:
    discount = total_price * 0.20
    total_price -= discount

vip_discount = 0

vip = input("Are you VIP member? (yes/no): ").lower()

# keep asking until the answer is yes or no
while vip != "yes" and vip != "no":
    print("Invalid input. Please enter 'yes' or 'no'.")
    vip = input("Are you VIP member? (yes/no): ").lower()

# VIP members get 50% off
if vip == "yes":
    vip_discount = total_price * 0.5
    total_price -= vip_discount

print(f"Total amount: ${total_price:.2f} GEL")

payment = float(input("How much would you like to pay? "))

# check if the payment covers the price
if payment >= total_price:
    change = payment - total_price
    print("Payment successful.")
    print(f"Your change is: ${change:.2f} GEL")
else:
    missing = total_price - payment
    print(f"Insufficient funds. You are short by ${missing:.2f} GEL.")

# purchase summary
print("\nPurchase Summary:")
print(f"Name: {name}")
print(f"Age: {age}")
print(f"Total Tickets: {ticket_count}")
print(f"Total Price: ${initial_price:.2f} GEL")
if ticket_count >= 3:
    print(f"Group Discount: ${initial_price - total_price - vip_discount:.2f} GEL")
if vip == "yes":
    print(f"VIP Discount: ${vip_discount:.2f} GEL")
print(f"Final Price: ${total_price:.2f} GEL")

# positive, negative or zero
number = int(input("Enter a number: "))

if number > 0:
    print("The number is positive.")
elif number < 0:
    print("The number is negative.")
else:
    print("The number is zero.")

# exact age from the birth date (uses the real calendar)
year = int(input("Enter your birth year: "))
month = int(input("Enter your birth month: "))
day = int(input("Enter your birth day: "))

birth_date = date(year, month, day)

today = date.today()

if birth_date > today:
    print("You haven't been born yet xdd")

else:
    age = relativedelta(today, birth_date)
    weekday = birth_date.strftime("%A")

    total_days = (today - birth_date).days

    print("\n===== YOUR BIRTHDAY DETAILS =====")
    print("date of birth:", birth_date)
    print("day of the week:", weekday)
    print(f"you are {age.years} years, {age.months} months and {age.days} days old.")
    print(f"total days since birth: {total_days} days")

# the same age calculation by hand (every year = 360 days, every month = 30 days)
year = int(input("Enter your birth year: "))
month = int(input("Enter your birth month: "))
day = int(input("Enter your birth day: "))

current_year = int(input("Enter today's year: "))
current_month = int(input("Enter today's month: "))
current_day = int(input("Enter today's day: "))

birth_total_days = (year * 360) + (month * 30) + day
today_total_days = (current_year * 360) + (current_month * 30) + current_day

if birth_total_days > today_total_days:
    print("You haven't been born yet 😂😂")

else:
    total_days = today_total_days - birth_total_days

    age_years = total_days // 360
    remaining_days = total_days % 360

    age_months = remaining_days // 30
    age_days = remaining_days % 30

    print("\n===== YOUR BIRTHDAY DETAILS =====")
    print(f"Date of birth: {day}/{month}/{year}")
    print(f"You are {age_years} years, {age_months} months and {age_days} days old.")
    print(f"Total days since birth: {total_days} days")

# simple ATM withdrawal
balance = 1000

print("Welcome to the ATM!")
print("Your balance is:", balance)

withdraw = float(input("Enter amount to withdraw: "))

if withdraw <= 0:
    print("Invalid amount!")

elif withdraw <= balance:
    balance = balance - withdraw
    print("Withdrawal successful!")
    print("Remaining balance:", balance)

else:
    print("Insufficient balance!")
    print("Your balance is:", balance)
