# Name = input("შეიყვანეთ თქვენი სახელი: ") # 1) მომხმარებლის ასაკი
# Age = int(input("შეიყვანეთ თქვენი ასაკი: ")) # 2) მომხმარებლის სახელი
# differentProductsAmount = int(input("რამდენი სხვადასხვა პროდუქტის შეძენა გსურთ?: ")) # 2) განსხვავებული პროდუქტების რაოდენობა

# totalProducts = 0 # ჯამში არსებული პროდუქტები

# totalCost = 0 # საბოლოო საფასური (მიტანისა და ფასდაკლებების გათვალისწინებით)

# originalTotalCost = 0  # პროდუქტების რეალური საფასური

# for product in range(differentProductsAmount):

#     productName = input("პროდუქტის დასახელება: ")
#     productPrice = float(input("პროდუქტის ფასი: "))
#     productAmount = int(input("პროდუქტის რაოდენობა: "))

#     productPriceTotal = productPrice * productAmount

#     originalTotalCost = originalTotalCost + productPrice * productAmount

#     if productAmount >= 5:
#         productPriceTotal = productPriceTotal * 0.9

#     totalProducts = totalProducts + productAmount

#     totalCost = totalCost + productPriceTotal

# if totalCost >= 100 and totalCost <= 200:

#     totalCost = totalCost * 0.95

# if totalCost > 200:

#     totalCost = totalCost * 0.9

# deliveryCheck = input("გსურთ სწრაფი მიწოდება? (კი/არა): ")


# if deliveryCheck == "არა":

#     deliveryCost = 5

# if deliveryCheck == "კი":

#     deliveryCost = 15

# if totalCost > 300:

#     deliveryCost = 0

# promocodeCheck = input("გაქვთ თუ არა პრომოკოდი? (კი/არა): ")

# if promocodeCheck == "კი":

#     promocode = input("შეიყვანეთ პრომოკოდი: ")

#     if promocode == "PYTHON10":
#      totalCost = totalCost * 0.9

# discountAmount = originalTotalCost - totalCost

# totalCost = totalCost + deliveryCost


# money = int(input("რამდენი თანხის გადახდა გსურთ?: "))

# if money >= totalCost:

#     change = money - totalCost

#     print(f"თქვენი ხურდა შეადგენს {change} ლარს")

#     orderStatus = "წარმატებული"

# else:
#     insufficientFunds = totalCost - money
#     print(f"თანხა არასაკმარისია, თქვენ გაკლიათ {insufficientFunds} ლარი")

#     orderStatus = "წარუმატებელი"

# print(f"მომხმარებლის სახელი: {Name}, შეძენილი პროდუქტების რაოდენობა: {totalProducts}, პროდუქტების საწყისი ჯამური ღირებულება: {originalTotalCost}, ფასდაკლების ჯამი: {discountAmount}, მიწოდების ღირებულება: {deliveryCost}, საბოლოო თანხა: {totalCost}, გადახდის სტატუსი: {orderStatus}")

# ---- String Methods ----

# upper() method



# name = "Nika"
# name1 = name.upper()
# print(name1) 

# upper() გარდაქმნის ასოებს დიდ ასოებად.
# lower() გარდაქმნის ასოებს პატარა ასოებად.

# name = "NIKA"
# print(name.lower())  

# name = "nika"
# print(name.upper())  # NIKA

# capitalize() პირველი სიმბოლოს ასოს ადიდებს, დანარჩენ ასოებს აპატარავებს.
# title() თითოეული სიტყვის საწყის ასოს ადიდებს.
# text = "heLLo WOrld"
# text = text.capitalize().title()
# print(text)  
# print(text.title())       # Hello World


# text = "gEORGIA is BEAUTIFUL"
# print(text.capitalize())  
# # print(text.title())


# strip() შლის საწყის და საბოლოო გამოტოვებებს.
# სიტყვებს შორის არსებული გამოტოვებები უცვლელი რჩება.
# replace() ანაცვლებს მითითებულ ტექსტს სხვა ტექსტით.
# text = "Georgia"
# # print(text)  
# print(text.replace("g","a"))  
#  
# ჩანაცვლებისას პირველი არგუმენტი საძიებელი ტექსტია, მეორე ახალი ტექსტი.
# text = "I love Java"
# print(text.replace("Java", "C++"))  # I like C++

# # count() ითვლის მითითებული ტექსტის რაოდენობას.
# # split() სტრიქონს ყოფს ნაწილებად და აბრუნებს სიას.
# text = "app le ban anaa pp e"
# # print(text.count("apple"))  # 2
# print(text.split())         # ['apple', 'banana', 'apple']

# # split()-ს შესაძლებელია გამყოფი სიმბოლოს გადაცემა.
# print("hello".split(""))  # ['a', 'b', 'c']

# სტრიქონი უცვლელი ტიპია: მეთოდი აბრუნებს ახალ სტრიქონს.
# მიღებული შედეგი თავდაპირველ ცვლადში ავტომატურად არ ინახება.
# name = "nika"
# name = name.upper()
# print(name)  #a nik

# name = name.upper()
# print(name)  # NIKA

# # მეთოდების მიმდევრობით გამოძახება შესაძლებელია.
# name = "   gIORGI   "
# print(name.strip().title())  # Giorgi