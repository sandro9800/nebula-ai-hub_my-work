# Dictionary ინახავს მონაცემებს key:value წყვილების სახით

student = {
    "name": "Giorgi",
    "age": 16,
    "city": "Tbilisi"
}

# # Dictionary-ის გამოტანა
# print(student)

# # კონკრეტული მნიშვნელობის მიღება
# print(student["name"])
# print(student["age"])

# # get() - მნიშვნელობის მიღება
# print(student.get("city"))

# # თუ გასაღები არ არსებობს, აბრუნებს None-ს
# print(student.get("grade"))

# # ახალი მონაცემის დამატება
# student["grade"] = 10
# print(student)

# # არსებული მნიშვნელობის შეცვლა
# student["age"] = 17
# print(student)

# update() - რამდენიმე მონაცემის დამატება ან შეცვლა
student.update({"age": 18, "city": "Batumi","grade":20})
print(student)

# # keys() - ყველა გასაღების მიღება
# print(student.keys())

# # values() - ყველა მნიშვნელობის მიღება
# print(student.values())

# # items() - ყველა გასაღებისა და მნიშვნელობის მიღება
# print(student.items())

# # len() - წყვილების რაოდენობა
# print(len(student))


# # pop() - გასაღებისა და მისი მნიშვნელობის წაშლა
# student.pop("Tbilisi")
# print(student)


# # copy() - Dictionary-ის ასლის შექმნა
# new_student = student.copy()
# print(new_student)

# # clear() - ყველა ელემენტის წაშლა
# student.clear()
# print(student)



# # Booleans ------------------------

# print("name" in student)   # True
# print("grade" in student)  # False


# print("grade" not in student)  # True
# print("age" not in student)    # False
