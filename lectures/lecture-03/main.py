# n = int(input("Enter n: "))

# i = 1
# total = 0

# while i <= n:
#     if i % 2 != 0:
#         total += i

#     i += 1

# print("Odd numbers sum:", total)



# total = 0

# while True:
#     number = int(input("Enter a number: "))

#     if number == 0:
#         break

#     if number < 0:
#         continue

#     total += number

# print("Total:", total)




# attempts = 0

# while attempts < 3:
#     password = input("Enter password: ").strip().lower()
#     attempts += 1

#     if password == "python123":
#         print("Access granted")
#         break
# else:
#     print("Access denied")




# number = 1

# while number <= 30:
#     if number == 18:
#         break

#     if number % 4 == 0:
#         number += 1
#         continue

#     print(number)
#     number += 1


# count = 0

# while True:
#     text = input("Enter text: ")
#     cleaned_text = text.strip()
    
#     if cleaned_text == "":
#         continue
    
#     if cleaned_text.lower() == "stop":
#         break
    
#     print(cleaned_text.upper())
#     count += 1

# print(f"Processed texts: {count}")



# num = int(input("Enter number: "))
# digits_sum = 0

# while num > 0:
#     last_digit = num % 10
#     digits_sum += last_digit
#     num = num // 10

# print(f"Digits sum: {digits_sum}")



# text = input("Enter text: ")
# length = 0

# for char in text:
#     length += 1

# print(f"Text length: {length}")



# attempts = 3

# while attempts > 0:
#     username = input("Enter username: ").strip().lower()
#     password = input("Enter password: ").strip()
    
#     if username == "admin" and password == "secret123":
#         print("Welcome!")
#         break
#     else:
#         attempts -= 1
#         if attempts > 0:
#             print(f"Incorrect! Attempts left: {attempts}")

# if attempts == 0:
#     print("Account locked")



# numbers_1 = [2,5,1]
# result_1 = [x * 2 for x in numbers_1]
# print(result_1)

# numbers_2 = [5,2,0,8,1]
# result_2 = [x for x in numbers_2 if x > 0]
# print(result_2)

# words = ["hello" , "python" , "world" ]
# result_3 = [w.upper() for w in words]
# print(result_3)

# tuple_04 = (2, 5, 8, 3, 4)
# result_04 = sum(1 for x in tuple_04 if x % 2 == 0)
# print(result_04)


# tuple_05 = (5, 3, 8, 0)
# result_05 = sum(x for x in tuple_05 if x > 0)
# print(result_05)


# tuple_06 = ("cat", "elephant", "dog")
# result_06 = max(tuple_06, key=len)
# print(result_06)


# set_A_07 = {1, 2, 3}
# set_B_07 = {2, 3, 4}
# result_07 = set_A_07 & set_B_07
# print(result_07)


# set_A_08 = {1, 2, 3, 4}
# set_B_08 = {2, 4}
# result_08 = set_A_08 - set_B_08
# print(result_08)


# words_09 = ["Python", "python", "JAVA", "Java"]
# result_09 = {w.lower() for w in words_09}
# print(result_09)
