import random

# integer, a whole number
x = 5
# float, a number with a decimal
y = 6.5
# string, text
z = "name"
# boolean, True or False
is_true = False

# input lets the user type something while the code is running
name = input("Enter a name: ")
print(name)

# if checks a condition, the code under it runs only when the condition is true
if x == y:
    print("x is equal to y")
else:
    print("x is not equal to y")

# for loop, repeats the code for every number from 0 to 9
for index in range(10):
    if index == 5:
        print("i am 5")

# sum of all numbers from 1 to 100
total_sum = 0
for number in range(1, 101):
    total_sum += number

print("The total sum is:", total_sum)

# number guessing game
number = random.randint(1, 5)
guess = int(input("your number: "))

if number == guess:
    print("number is correct!")
    print(number)
else:
    print("number is incorrect, it was", number)

# login with 3 attempts
max_attempts = 3

for attempt in range(max_attempts):
    username = input("your username: ")
    password = input("your password: ")

    # both username and password must be correct
    if username == "sandro" and password == "123123":
        print("login was successful")
        break  # exit the loop immediately because they succeeded
    else:
        print("username or password was incorrect.")
        attempts_left = max_attempts - (attempt + 1)

        if attempts_left > 0:
            print(f"Try again. You have {attempts_left} attempts left.\n")
        else:
            print("Too many failed attempts. Access denied.")
