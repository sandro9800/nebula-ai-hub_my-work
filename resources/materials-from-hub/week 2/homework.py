# nums = (8, 3, 3, 8)

# most_frequent = 0
# number_of_appearence = 0
# for i in nums:
#     count = 0
#     for j in nums:
#         if j == i:
#             count  += 1
#     if count > number_of_appearence:
#         number_of_appearence = count
#         most_frequent = i
# print(most_frequent, number_of_appearence)

# n = int(input("შეიყვანეთ არაუარყოფითი მთელი რიცხვი: "))

# reverse = 0

# while n > 0:
#     digit = n % 10
#     reverse = reverse * 10 + digit
#     n //= 10

# print(reverse)




# A = {"Ana", "Nika", "Luka"}
# B = {"Nika", "Luka", "Mariam"}
# C = {"Luka", "Mariam", "Gio"}

# result = set()

# for person in A | B | C:
#     count = 0

#     if person in A:
#         count += 1
#     if person in B:
#         count += 1
#     if person in C:
#         count += 1

#     if count == 2:
#         result.add(person)

# print(result)

# text1 = "Cats and dogs"
# text2 = "Dogs and birds"
# text1_splitted = text1.lower().split(" ")
# text2_splitted = text2.lower().split(" ")

# empty = set()
# for i in text1_splitted:
#     if i in text2_splitted:
#         empty.add(i)

# print(empty)