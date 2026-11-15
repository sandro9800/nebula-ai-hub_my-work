
# # ფუნქცია პარამეტრის გარეშე
# def greet():
#     print("Hello!")

# greet()


# # ფუნქცია ერთი პარამეტრით
# def greet(name):
#     print("Hello,", name)

# greet("giorgi")



# # ფუნქცია ორი პარამეტრით
# def introduce(name, age):
#     print("My name is", name)
#     print("I am", age, "years old")

# introduce("Giorgi", 16)
# introduce("Ana", 18)



# # ფუნქცია, რომელიც ორ რიცხვს კრებს
# def add(a, b):
#     print(a + b)

# add(5, 3)
# add(10, 20)


# # ფუნქცია, რომელიც ამოწმებს სრულწლოვანებას
# def check_age(age):
#     if age >= 18:
#         print("Adult")
#     else:
#         print("Minor")



# # ფუნქცია, რომელიც რიცხვის ლუწობას ამოწმებს
# def check_even(number):
#     if number % 2 == 0:
#         print("Even")
#     else:
#         print("Odd")

# check_even(8)
# check_even(13)


# return - ფუნქციიდან მნიშვნელობის დაბრუნება
# print() მხოლოდ ეკრანზე გამოაქვს შედეგი
# return კი შედეგს აბრუნებს, რათა მისი შემდგომი გამოყენება შევძლოთ

# --- RETURN -------------------


# # ფუნქცია return-ის გამოყენებით
# def add(a, b):
#     return a + b


# print(add(5, 3))


# # დაბრუნებული მნიშვნელობის ცვლადში შენახვა
# result = add(10, 20)
# print(result)


# # დაბრუნებული მნიშვნელობის გამოთვლებში გამოყენება
# result = add(5, 3)

# print(result * 2)
# print(result + 10)


# # ფუნქცია, რომელიც რიცხვის კვადრატს აბრუნებს
# def square(number):
#     return number ** 2

# print(square(5))
# print(square(10))


# # ფუნქცია, რომელიც ამოწმებს რიცხვის ლუწობას
# # თუ რიცხვი ლუწია, აბრუნებს True-ს, სხვა შემთხვევაში False-ს
# def is_even(number):
#     return number % 2 == 0

# print(is_even(8))
# print(is_even(7))


# # return-ის შედეგის გამოყენება if პირობაში
# if is_even(10):
#     print("რიცხვი ლუწია")
# else:
#     print("რიცხვი კენტია")


# # ფუნქცია, რომელიც ორი რიცხვიდან უდიდესს აბრუნებს
# def find_max(a, b):
#     if a > b:
#         return a
#     else:
#         return b

# print(find_max(30, 20))


# # return ფუნქციის მუშაობას ასრულებს
# # მის შემდეგ დაწერილი კოდი აღარ შესრულდება
# def example():
#     return "Hello"
#     print("ეს ტექსტი არ გამოჩნდება")

# print(example())


# # ფუნქციას შეუძლია რამდენიმე მნიშვნელობის დაბრუნება
# # ამ შემთხვევაში მნიშვნელობები Tuple-ში ერთიანდება
# def calculate(a, b):
#     return a + b, a * b

# result = calculate(5, 3)
# print(result)


# # დაბრუნებული მნიშვნელობების ცალ-ცალკე შენახვა
# total, product = calculate(5, 3)

# print(total)
# print(product)

# # თუ ფუნქციაში return არ არის, ის აბრუნებს None-ს
# def greet(name):
#     print("Hello", name)

# result = greet("Giorgi")
# print(result)  # None




# # default პარამეტრები -----------------~
# def greet(name = "User"):
#     print("Hello", name)

# greet("Giorgi")  # Hello Giorgi
# greet()          # Hello Guest





# Local და Global Variables
# ლოკალური და გლობალური ცვლადები


# ლოკალური ცვლადი (Local Variable)
# ფუნქციის შიგნით შექმნილი ცვლადი არის ლოკალური
# მისი გამოყენება მხოლოდ ამ ფუნქციის შიგნით შეგვიძლია

# def greet():
#     name = "Giorgi"
#     print(name)

# greet()

# print(name)  # NameError - ცვლადი ფუნქციის გარეთ არ არსებობს


# # გლობალური ცვლადი (Global Variable)
# # ფუნქციის გარეთ შექმნილი ცვლადი არის გლობალური
# # მისი მნიშვნელობის წაკითხვა ფუნქციის შიგნითაც შეგვიძლია

# name = "Giorgi"

# def greet():
#     print(name)

# greet()
# print(name)


# # ლოკალური და გლობალური ცვლადი ერთი სახელით
# # ფუნქციის შიგნით შექმნილი ცვლადი არ ცვლის გლობალურ ცვლადს

# name = "Giorgi"

# def greet():
#     name = "Nika"
#     print(name)

# greet()       # Nika
# print(name)   # Giorgi

