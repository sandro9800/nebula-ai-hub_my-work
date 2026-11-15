
# Modules - მოდულები Python-ში
# მოდული არის Python-ის ფაილი, რომელიც შეიცავს კოდს,
# მაგალითად ფუნქციებს, ცვლადებს და სხვა მონაცემებს.
# მოდულების დახმარებით შეგვიძლია გამოვიყენოთ
# სხვა ფაილებში დაწერილი კოდი.

# import - მოდულის შემოტანა
# Python-ს აქვს მზა მოდულები, რომლებიც შეგვიძლია გამოვიყენოთ.

import math

# math.sqrt() - რიცხვის კვადრატული ფესვის გამოთვლა
print(math.sqrt(25))  # 5.0
print(math.sqrt(81))  # 9.0

# math.factorial() - რიცხვის ფაქტორიალის გამოთვლა
# 5! = 5 * 4 * 3 * 2 * 1
print(math.factorial(5))  # 120

# math.pi - რიცხვი პი
print(math.pi)

# math.ceil() - რიცხვის დამრგვალება ზემოთ
print(math.ceil(4.2))  # 5

# math.floor() - რიცხვის დამრგვალება ქვემოთ
print(math.floor(4.9))  # 4


# from ... import - მოდულიდან კონკრეტული ფუნქციის შემოტანა
# ამ შემთხვევაში ფუნქციის გამოძახება მოდულის სახელის გარეშე შეგვიძლია.

from math import sqrt

print(sqrt(36))  # 6.0
print(sqrt(100))  # 10.0


# import ... as - მოდულისთვის სხვა სახელის მინიჭება
# as საშუალებას გვაძლევს მოდულს მოკლე სახელი დავარქვათ.

import math as m

print(m.sqrt(49))  # 7.0
print(m.pi)


# random - შემთხვევითი მნიშვნელობების გენერირების მოდული

import random

# randint() - შემთხვევითი მთელი რიცხვი მითითებულ შუალედში
# ორივე საზღვარი შედის შუალედში
print(random.randint(1, 10))
print(random.randint(50, 100))

# random() - შემთხვევითი ათწილადი 0-დან 1-მდე
# 0 შესაძლებელია, ხოლო 1 არ შედის შუალედში
print(random.random())

# choice() - სიიდან შემთხვევითი ელემენტის არჩევა
names = ["Giorgi", "Nika", "Ana", "Mari"]

print(random.choice(names))

# shuffle() - სიის ელემენტების შემთხვევითი გადალაგება
numbers = [1, 2, 3, 4, 5]

random.shuffle(numbers)
print(numbers)


# datetime - თარიღთან და დროსთან მუშაობის მოდული

import datetime

# date.today() - დღევანდელი თარიღის მიღება
today = datetime.date.today()
print(today)

# datetime.now() - მიმდინარე თარიღისა და დროის მიღება
now = datetime.datetime.now()
print(now)

# ცალკეული ინფორმაციის მიღება
print(now.year)    # წელი
print(now.month)   # თვე
print(now.day)     # დღე
print(now.hour)    # საათი
print(now.minute)  # წუთი


# საკუთარი მოდულის შექმნა
# ჩვენ შეგვიძლია შევქმნათ Python ფაილი,
# რომელშიც შევინახავთ ფუნქციებს და შემდეგ
# სხვა ფაილიდან გამოვიყენებთ.

# მაგალითად, შევქმნათ calculator.py ფაილი
# და მასში ჩავწეროთ შემდეგი ფუნქციები:

# def add(a, b):
#     return a + b
#
# def subtract(a, b):
#     return a - b
#
# def multiply(a, b):
#     return a * b
#
# def divide(a, b):
#     return a / b

# შემდეგ იმავე საქაღალდეში შევქმნათ main.py
# და მასში შემოვიტანოთ calculator მოდული.

# import calculator
#
# print(calculator.add(5, 3))
# print(calculator.subtract(10, 4))
# print(calculator.multiply(5, 2))
# print(calculator.divide(10, 2))

# ამ შემთხვევაში ფუნქციები calculator.py-შია,
# მაგრამ მათი გამოყენება main.py-დან შეგვიძლია.


# შეგვიძლია კონკრეტული ფუნქციებიც შემოვიტანოთ

# from calculator import add, multiply
#
# print(add(10, 20))
# print(multiply(4, 5))


# მოდულების გამოყენება ფუნქციებთან ერთად

# ფუნქცია, რომელიც შემთხვევით რიცხვს აბრუნებს
def generate_number():
    return random.randint(1, 100)

print(generate_number())


# ფუნქცია, რომელიც კამათელს აგორებს
def roll_dice():
    return random.randint(1, 6)

print(roll_dice())


# ფუნქცია, რომელიც ორ კამათელს აგორებს
# და მიღებული რიცხვების ჯამს აბრუნებს
def roll_two_dice():
    dice1 = random.randint(1, 6)
    dice2 = random.randint(1, 6)

    return dice1 + dice2

print(roll_two_dice())


# ფუნქცია, რომელიც რიცხვის კვადრატულ ფესვს აბრუნებს
def square_root(number):
    return math.sqrt(number)

print(square_root(64))


# ფუნქცია, რომელიც სიიდან შემთხვევით მოსწავლეს ირჩევს
def random_student(students):
    return random.choice(students)

students = ["Giorgi", "Ana", "Nika", "Luka"]

print(random_student(students))
