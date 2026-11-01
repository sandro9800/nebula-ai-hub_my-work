# x = 5 #integer full number
# y = 6.5 #float number with decimal in it
# z = "name" 

# true = False #boolian true or false

# name = input("Enter a name: ") #input is fnction that lets you interact directly in code and input things when code is runing

# print(name) #now with input function we can use inputed characters to get printed like name we asked
# if x == y # if is function taht in this examle what its given is true it will print whats under it
#     print('x is equal to y')


# for index in range(10):
#     if index == 5:
#         print("i am 5")

# total_sum = 0

# for number in range(1, 101):
#     total_sum += number

# print("The total sum is:", total_sum)

# import random

# number = random.randint(1,5)

# number2 = input("your number: ")

# if number == number2:
#     print("number is correct!")
#     print(number)
# else:
#     print("number is incorect try again...")
#     number2 = input("your number: ")
    
# max_attempts = 3

# for attempt in range(max_attempts):
#     username = input("your username: ")
#     password = input("your password: ")
    
#     # Check if BOTH are correct
#     if username == "sandro" and password == "123123":
#         print("login was sucsesful")
#         break  # Exit the loop immediately because they succeeded
#     else:
#         print("username or password was incorrect.")
#         attempts_left = max_attempts - (attempt + 1)
        
#         if attempts_left > 0:
#             print(f"Try again. You have {attempts_left} attempts left.\n")
#         else:
#                 print("Too many failed attempts. Access denied.")