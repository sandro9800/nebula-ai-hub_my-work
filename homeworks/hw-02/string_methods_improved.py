# string methods

# upper() makes every letter uppercase, lower() makes every letter lowercase
name = "Nika"
print(name.upper())
print(name.lower())

# capitalize() changes only the first character, title() changes every word
text = "heLLo WOrld"
print(text.capitalize())
print(text.title())

text = "gEORGIA is BEAUTIFUL"
print(text.capitalize())
print(text.title())

# strip() removes spaces at the start and end, spaces between words stay
answer = "   gIORGI   "
print(f"[{answer.strip()}]")

# replace(old, new) swaps every old text for the new one
text = "Georgia"
print(text.replace("g", "a"))
text = "I love Java"
print(text.replace("Java", "Python"))

# count() counts how many times a text appears
text = "apple banana apple"
print(text.count("apple"))

# split() cuts a string into a list, with spaces or with a given separator
print(text.split())
print("a-b-c".split("-"))

# strings are immutable: the result must be saved back into the variable
name = "nika"
name.upper()
print(name)
name = name.upper()
print(name)

# methods can be chained
name = "   gIORGI   "
print(name.strip().title())
