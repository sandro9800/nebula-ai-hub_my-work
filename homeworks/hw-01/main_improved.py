# online store order system
print("=== Online Store Order System ===")

name = input("Enter your name: ")

# ask until the age is a positive whole number
age = 0
while age <= 0:
    try:
        age = int(input("Enter your age: "))
        if age <= 0:
            print("Age must be a positive number!")
    except ValueError:
        print("Please enter a whole number!")

# ask until the number of products is a positive whole number
product_count = 0
while product_count <= 0:
    try:
        product_count = int(input("How many different products do you want to buy? "))
        if product_count <= 0:
            print("The number of products must be greater than 0!")
    except ValueError:
        print("Please enter a whole number!")

# totals before and after the per-product discount
original_total = 0
after_product_discount = 0

for i in range(1, product_count + 1):
    print(f"\n--- Product #{i} ---")
    # read one product: name, price and quantity
    product_name = input("Product name: ")

    price = 0
    while price <= 0:
        try:
            price = float(input("Product price (GEL): "))
            if price <= 0:
                print("Price must be greater than 0!")
        except ValueError:
            print("Please enter a number!")

    quantity = 0
    while quantity <= 0:
        try:
            quantity = int(input("Product quantity: "))
            if quantity <= 0:
                print("Quantity must be greater than 0!")
        except ValueError:
            print("Please enter a whole number!")

    # 10% discount if the quantity is 5 or more
    item_total = price * quantity
    original_total += item_total

    if quantity >= 5:
        item_final = item_total * 0.90
        print(f"{product_name}: {item_total:.2f} GEL -> {item_final:.2f} GEL (10% discount)")
    else:
        item_final = item_total
        print(f"{product_name}: {item_final:.2f} GEL")

    after_product_discount += item_final

# order discount: 0% under 100, 5% up to 200, 10% above
if after_product_discount < 100:
    order_discount_percent = 0
elif after_product_discount <= 200:
    order_discount_percent = 5
else:
    order_discount_percent = 10

after_order_discount = after_product_discount * (1 - order_discount_percent / 100)

# fast delivery question (only yes or no is accepted)
fast = ""
while fast != "yes" and fast != "no":
    fast = input("\nDo you want fast delivery? (yes/no): ").strip().lower()
    if fast != "yes" and fast != "no":
        print("Please enter only yes or no!")

# promo code gives an extra 10%
promo = input("Do you have a promo code? (press Enter if not): ").strip()

if promo == "PYTHON10":
    promo_discount = after_order_discount * 0.10
    print("Promo code accepted!")
else:
    promo_discount = 0
    if promo != "":
        print("Invalid promo code, no discount applied.")

products_final = after_order_discount - promo_discount

# delivery: free over 300 GEL, otherwise 15 (fast) or 5 (regular)
if products_final > 300:
    delivery = 0
elif fast == "yes":
    delivery = 15
else:
    delivery = 5

final_total = products_final + delivery
total_discounts = original_total - products_final

# final price
print(f"\nAmount to pay: {final_total:.2f} GEL")

# ask until the payment is a positive number
payment = 0
while payment <= 0:
    try:
        payment = float(input("How much do you want to pay? "))
        if payment <= 0:
            print("Amount must be greater than 0!")
    except ValueError:
        print("Please enter a number!")

# check if the payment is enough
if payment >= final_total:
    status = "Successful"
    change = payment - final_total
    print("Order completed successfully!")
    print(f"Your change: {change:.2f} GEL")
else:
    status = "Failed"
    missing = final_total - payment
    print(f"Insufficient amount! You are short by {missing:.2f} GEL.")

# order summary
print("\n" + "=" * 40)
print("            ORDER SUMMARY")
print("=" * 40)
print(f"Customer: {name}")
print(f"Number of products purchased: {product_count}")
print(f"Initial total: {original_total:.2f} GEL")
print(f"Total discounts: {total_discounts:.2f} GEL")
print(f"Delivery cost: {delivery:.2f} GEL")
print(f"Final amount to pay: {final_total:.2f} GEL")
print(f"Payment status: {status}")
print("=" * 40)
