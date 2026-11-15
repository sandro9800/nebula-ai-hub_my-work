
# Nested Dictionary - Dictionary სხვა Dictionary-ის შიგნით

students = {
    "student1": {
        "name": "Giorgi",
        "age": 16,
        "grade": {
            "name": {
                "age": 19
            }
        }
    },
    "student2": {
        "name": [1,2,3,4],
        "age": (18,12,3),
        "grade": 85
    },
    "student3": {
        "name": "Ana",
        "age": 17,
        "grade": 95
    }
}


# # მთლიანი Dictionary-ის გამოტანა
# print(students)

# # კონკრეტული მოსწავლის მონაცემების მიღება
# print(students["student1"])

# # კონკრეტული მოსწავლის სახელის მიღება
# print(students["student1"]["grade"]["name"]["age"])

# # არსებული მნიშვნელობის შეცვლა
# students["student1"]["age"] = 17
# print(students)

# students['student1'] = 1
# print(students)

# # ახალი მონაცემის დამატება კონკრეტულ მოსწავლესთან
# students["student2"]["city"] = "Tbilisi"
# print(students)

# # ახალი მოსწავლის დამატება
# students["student4"] = {
#     "name": "Luka",
#     "age": 19,
#     "grade": 88
# }
# print(students)


# # კონკრეტული მოსწავლის წაშლა
# students.pop("student3")
# print(students)


# for ციკლით ყველა მოსწავლის მონაცემების გამოტანა
for key, student in students.items():
    print(key, student)


# # for ციკლით მხოლოდ მოსწავლეების სახელების გამოტანა
# for student in students.values():
#     print(student["name"])


# # for ციკლით მოსწავლეების სახელებისა და ასაკების გამოტანა
# for student in students.values():
#     print(student["name"], student["age"])


# # for ციკლით მხოლოდ სრულწლოვანი მოსწავლეების გამოტანა
# for student in students.values():
#     if student["age"] >= 18:
#         print(student["name"])


# # for ციკლით იმ მოსწავლეების გამოტანა,
# # რომელთა ქულაც 85-ზე მეტია
# for student in students.values():
#     if student["grade"] > 85:
#         print(student["name"], student["grade"])


# # for ციკლით ყველა მოსწავლის ქულის 5-ით გაზრდა
# for student in students.values():
#     student["grade"] += 5

# print(students)
