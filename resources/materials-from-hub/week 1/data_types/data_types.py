# ძირითადი მონაცემთა ტიპები (Basic data types)

name = "Nino"          # str (string / text)
age = 19               # int (whole number)
height = 1.68          # float (decimal number)
is_student = True      # bool (True or False)

print(name, type(name))
print(age, type(age))
print(height, type(height))
print(is_student, type(is_student))

# კონვერტაცია ერთი ტიპიდან მეორეში
age_as_text = str(age)
price = float("12.5")
number = int("7")

print(age_as_text, type(age_as_text))
print(price, type(price))
print(number, type(number))
