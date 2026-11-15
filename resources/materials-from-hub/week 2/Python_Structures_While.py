# # -*- coding: utf-8 -*-
# # Python: მონაცემთა სტრუქტურები და while ციკლი.
# # გაშვება: python Python_Structures_While_GE.py

# # 2. მასივი (list)
# # ინარჩუნებს რიგს, იცვლება და უშვებს განმეორებულ მნიშვნელობებს.
# print("\n2. მასივები")

# students = ["Ana", "Nika", "Ana"]
# mixed = ["Nika", 19, True]  # სხვადასხვა ტიპის მნიშვნელობებიც შეიძლება.
# empty_array = []

# # ინდექსები იწყება 0-დან; -1 აღნიშნავს ბოლო ელემენტს.
# print(students[0])   # Ana
# print(students[-1])  # Ana
# students[0] = "Luka"
# print(students)  # ['Luka', 'Nika', 'Ana']

# # slicing: items[start:stop:step]; stop არ შედის, იქმნება ახალი მასივი.
# numbers = [10, 20, 30, 40, 50]
# print(numbers[1:4])   # [20, 30, 40]
# print(numbers[::2])   # [10, 30, 50]
# print(numbers[::-1])  # [50, 40, 30, 20, 10]
# # numbers[5] გამოიწვევს IndexError-ს: ბოლო დადებითი ინდექსია 4.

# # len() ფუნქციაა; in და not in წევრობის ოპერატორებია.
# print(len(students))           # 3
# print("Nika" in students)      # True
# print("Giorgi" not in students)  # True
# for student in students:
#     print(student)  # Luka, Nika, Ana - თითოეული ცალკე ხაზზე.

# # append(value): ბოლოში ამატებს ერთ ელემენტს; value აუცილებელია.
# fruits = ["apple"]
# fruits.append("pear")
# print(fruits)  # ['apple', 'pear']

# # insert(index, value): ამატებს მითითებულ პოზიციაზე; ორივე აუცილებელია.
# numbers = [10, 30]
# numbers.insert(1, 20)
# print(numbers)  # [10, 20, 30]

# # extend(iterable): ამატებს კოლექციის ელემენტებს ცალ-ცალკე.
# numbers = [1, 2]
# numbers.extend([3, 4])
# print(numbers)  # [1, 2, 3, 4]

# # append და extend განსხვავდება, როცა არგუმენტი თვითონ მასივია.
# first = [1, 2]
# second = [1, 2]
# first.append([3, 4])
# second.extend([3, 4])
# print(first)   # [1, 2, [3, 4]]
# print(second)  # [1, 2, 3, 4]

# # remove(value): შლის მნიშვნელობის პირველ შეხვედრას.
# # არარსებული მნიშვნელობა იწვევს ValueError-ს.
# numbers = [2, 3, 2]
# numbers.remove(2)
# print(numbers)  # [3, 2]

# # pop(index=-1): შლის და აბრუნებს ელემენტს; ინდექსი არჩევითია.
# numbers = [10, 20, 30]
# removed = numbers.pop()
# print(removed)       # 30
# print(numbers)       # [10, 20]
# print(numbers.pop(0))  # 10
# print(numbers)       # [20]
# # ცარიელ მასივზე ან არასწორ ინდექსზე pop() იწვევს IndexError-ს.

# # clear(): არგუმენტების გარეშე; შლის ყველა ელემენტს.
# names = ["Ana", "Nika"]
# names.clear()
# print(names)  # []

# # count(value): ითვლის მნიშვნელობის შეხვედრებს; აბრუნებს int-ს.
# numbers = [1, 2, 2, 3]
# print(numbers.count(2))  # 2
# print(numbers.count(9))  # 0

# # index(value, start=0, stop=...): აბრუნებს პირველ შესაბამის ინდექსს.
# # start და stop არჩევითია; stop ძებნის მონაკვეთში არ შედის.
# fruits = ["apple", "pear", "apple", "kiwi"]
# print(fruits.index("apple"))        # 0
# print(fruits.index("apple", 1, 3))  # 2
# # თუ მნიშვნელობა არ არსებობს, index() იწვევს ValueError-ს.
# if "pear" in fruits:
#     print(fruits.index("pear"))  # 1

# # sort(key=None, reverse=False): ახარისხებს უშუალოდ არსებულ მასივს.
# # key ადგენს შედარების წესს; reverse=True ნიშნავს კლებადობას.
# numbers = [3, 1, 2]
# numbers.sort()
# print(numbers)  # [1, 2, 3]
# numbers.sort(reverse=True)
# print(numbers)  # [3, 2, 1]
# words = ["pear", "fig", "banana"]
# words.sort(key=len)  # შედარების წესი: სიტყვის სიგრძე.
# print(words)  # ['fig', 'pear', 'banana']

# # reverse(): არგუმენტების გარეშე; არსებულ რიგს აბრუნებს უკუღმა.
# numbers = [5, 1, 8]
# numbers.reverse()
# print(numbers)  # [8, 1, 5] - ეს დახარისხება არ არის.

# # append/insert/extend/remove/clear/sort/reverse აბრუნებენ None-ს.
# # pop() გამონაკლისია: წაშლილ ელემენტს აბრუნებს.
# # არ დაწეროთ numbers = numbers.sort(): numbers გახდება None.


# # 3. Tuple - უცვლელი მიმდევრობა
# # ინარჩუნებს რიგს და დუბლიკატებს; ელემენტის ჩანაცვლება შეუძლებელია.
# print("\n3. Tuple")

# point = (10, 20)
# colors = ("red", "blue", "red")
# single = ("red",)  # ერთი ელემენტისთვის მძიმე აუცილებელია.
# empty_tuple = ()
# print(point[0])     # 10
# print(colors[-1])   # red
# print(colors[0:2])  # ('red', 'blue')
# # point[0] = 99 გამოიწვევს TypeError-ს.

# # count(value): ითვლის მნიშვნელობის შეხვედრებს.
# print(colors.count("red"))  # 2

# # index(value, start=0, stop=...): პირველი შესაბამისი ინდექსი.
# # საზღვრები არჩევითია; არყოფნისას წარმოიქმნება ValueError.
# values = (10, 20, 30, 20)
# print(values.index(20))        # 1
# print(values.index(20, 2, 4))  # 3

# # len(), in, not in და for tuple-ზეც მუშაობს.
# print(len(colors))             # 3
# print("blue" in colors)        # True
# print("green" not in colors)   # True
# for color in colors:
#     print(color)  # red, blue, red - ცალკე ხაზებზე.


# # 4. Set - უნიკალური ელემენტების კოლექცია
# # დუბლიკატები იშლება; რიგი გარანტირებული არ არის; ინდექსები არ აქვს.
# print("\n4. Set")

# numbers = {1, 2, 2, 3}
# print(len(numbers))  # 3
# empty_set = set()    # ცარიელი set; {} ქმნის dictionary-ს.
# # numbers[0] არ მუშაობს: set-ს ინდექსით ვერ მივმართავთ.
# # set-ის ელემენტად შეიძლება რიცხვი, სტრინგი ან შესაბამისი tuple.
# # მასივი და სხვა set პირდაპირ ელემენტებად ვერ დაემატება: ცვალებადია.

# # add(value): ამატებს ერთ ელემენტს; დუბლიკატი დამატებით არ ინახება.
# fruits = {"apple", "pear"}
# fruits.add("kiwi")
# fruits.add("apple")
# print(fruits)  # apple, pear, kiwi - რიგი შეიძლება განსხვავდებოდეს.

# # update(iterable1, iterable2, ...): ამატებს კოლექციების ელემენტებს.
# # შეუძლია მიიღოს რამდენიმე კოლექცია; არგუმენტის გარეშეც მუშაობს.
# numbers = {1, 2}
# numbers.update([2, 3], (4, 5))
# print(numbers == {1, 2, 3, 4, 5})  # True

# # remove(value): შლის ელემენტს; არარსებულზე იწვევს KeyError-ს.
# fruits.remove("pear")
# print("pear" in fruits)  # False

# # discard(value): შლის ელემენტს, თუ არსებობს; არყოფნისას არ ცდება.
# fruits.discard("banana")
# print(len(fruits))  # 2

# # pop(): არგუმენტების გარეშე; შლის და აბრუნებს ნებისმიერ ელემენტს.
# # ცარიელ set-ზე გამოიწვევს KeyError-ს.
# values = {10, 20}
# removed = values.pop()
# print(removed)      # 10 ან 20 - კონკრეტული არჩევანი გარანტირებული არ არის.
# print(len(values))  # 1

# # clear(): არგუმენტების გარეშე; ყველა ელემენტს შლის.
# values.clear()
# print(values)  # set()
# # add/update/remove/discard/clear ცვლიან set-ს და აბრუნებენ None-ს.

# # ქვემოთ მოცემული ოპერაციები ქმნიან ახალ set-ს; a და b უცვლელია.
# a = {1, 2, 3}
# b = {3, 4, 5}

# # union(*others): აერთიანებს უნიკალურ ელემენტებს; ოპერატორი |.
# # მეთოდს შეუძლია მიიღოს ნული ან რამდენიმე iterable.
# print(a.union(b) == {1, 2, 3, 4, 5})  # True
# print(a | b)  # {1, 2, 3, 4, 5} - რიგი გარანტირებული არ არის.

# # intersection(*others): საერთო ელემენტები; ოპერატორი &.
# # მეთოდს შეუძლია მიიღოს ნული ან რამდენიმე iterable.
# print(a.intersection(b))  # {3}
# print(a & b)              # {3}

# # difference(*others): პირველში არსებული, მეორეში არმყოფი; ოპერატორი -.
# # მეთოდს შეუძლია მიიღოს ნული ან რამდენიმე iterable.
# print(a.difference(b) == {1, 2})  # True
# print(a - b == {1, 2})            # True
# print(b - a == {4, 5})            # True - მიმართულებას აქვს მნიშვნელობა.

# # symmetric_difference(other): მხოლოდ ერთ-ერთში არსებული ელემენტები.
# # იღებს ერთ აუცილებელ iterable-ს; ოპერატორი ^.
# print(a.symmetric_difference(b) == {1, 2, 4, 5})  # True
# print(a ^ b == {1, 2, 4, 5})                      # True
# # მეთოდები იღებენ iterable-ს; ზემოთ ნაჩვენები ოპერატორები set-ებს მოითხოვს.

# skills = {"Python", "Git", "SQL"}
# print(len(skills))          # 3
# print("Git" in skills)      # True
# print("Java" not in skills)  # True
# for skill in skills:
#     print(skill)  # სამივე უნარი; რიგი გარანტირებული არ არის.


# # 5. While - გამეორება პირობის მიხედვით
# # სინტაქსი: while condition: შემდეგ შეწეული კოდი.
# # პირობა მოწმდება ყოველი იტერაციის წინ; False ასრულებს ციკლს.
# # while მეთოდი არ არის და არგუმენტები არ აქვს.
# print("\n5. While")

# # მთვლელი იცვლება, რათა პირობა ბოლოს False გახდეს.
# number = 1
# while number <= 5:
#     print(number)  # 1, 2, 3, 4, 5 - ცალკე ხაზებზე.
#     number += 1

# # თავიდანვე მცდარი პირობისას სხეული არც ერთხელ არ სრულდება.
# number = 10
# while number < 5:
#     print("ეს ტექსტი არ დაიბეჭდება")

# # for გამოდგება კოლექციის გასავლელად; while - პირობით გასამეორებლად.
# # მასივის გავლა while-ით: ინდექსი უნდა განახლდეს.
# students = ["Ana", "Nika", "Mariam"]
# index = 0
# while index < len(students):
#     print(students[index])
#     index += 1

# # while True: პირობა ყოველთვის ჭეშმარიტია; break წყვეტს ციკლს.
# # break ასრულებს უახლოეს იმ ციკლს, რომელშიც შესრულდა.
# number = 1
# while True:
#     print(number)  # 1, 2, 3
#     if number == 3:
#         break
#     number += 1
# print("ციკლი დასრულდა")

# # continue: გამოტოვებს მიმდინარე იტერაციის დარჩენილ კოდს.
# # შემდეგ while-ის პირობა ხელახლა მოწმდება; ციკლი მთლიანად არ წყდება.
# number = 0
# while number < 6:
#     number += 1  # განახლება continue-მდეა, რომ არ გამოგვრჩეს.
#     if number == 3:
#         continue
#     print(number)  # 1, 2, 4, 5, 6 - ცალკე ხაზებზე.

# # მონაცემთა სტრუქტურის შეცვლამაც შეიძლება დაასრულოს while.
# numbers = [10, 20, 30]
# while numbers:  # არაცარიელი მასივი True-დ ფასდება; ცარიელი - False-დ.
#     removed = numbers.pop()
#     print(removed)  # 30, 20, 10
# print(numbers)     # []
