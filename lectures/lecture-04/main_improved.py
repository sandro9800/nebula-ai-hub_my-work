# password check with 3 attempts
secret = "secret"

for attempt in range(1, 4):
    password = input(f"Enter the password ({attempt}/3): ")
    if password == secret:
        print("სწორია.")
        break
    print("არასწორია.")
else:
    print("არიცი ძამი.")

# make a new dict where every price is doubled
products = {
    "fish": 8,
    "apple": 9,
    "orange": 7
}
empty = {}

for product, price in products.items():
    empty[product] = price * 2

print(empty)

# check if a person is an adult (int() because input() returns text)
age = int(input("Enter age: "))
if age > 18:
    print("adult.")
else:
    print("MINION.")

# check if a number is even
number = int(input("Enter a number: "))
if number % 2 == 0:
    print("even")
else:
    print("odd")

# add two numbers
a = 5
b = 6
print(a + b)

# count the items of a list without len()
nums = [5, 10, 3, 8, 2]
count = 0
for num in nums:
    count += 1
print(count)
