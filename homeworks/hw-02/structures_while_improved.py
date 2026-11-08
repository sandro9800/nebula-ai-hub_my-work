# lists, tuples, sets and while loops

# ---- lists ----

students = ["Ana", "Nika", "Ana"]
mixed = ["Nika", 19, True]
empty_list = []

# indexes start at 0, -1 is the last element
print(students[0])
print(students[-1])
students[0] = "Luka"
print(students)

# slicing: items[start:stop:step], stop is not included
numbers = [10, 20, 30, 40, 50]
print(numbers[1:4])
print(numbers[::2])
print(numbers[::-1])

# len(), in and not in, and looping over a list
print(len(students))
print("Nika" in students)
print("Giorgi" not in students)
for student in students:
    print(student)

# append() adds one element at the end
fruits = ["apple"]
fruits.append("pear")
print(fruits)

# insert(index, value) adds an element at a position
numbers = [10, 30]
numbers.insert(1, 20)
print(numbers)

# extend() adds the elements of another collection one by one
numbers = [1, 2]
numbers.extend([3, 4])
print(numbers)

# append() with a list adds it as one element, extend() adds its items
first = [1, 2]
second = [1, 2]
first.append([3, 4])
second.extend([3, 4])
print(first)
print(second)

# remove(value) deletes the first match only
numbers = [2, 3, 2]
numbers.remove(2)
print(numbers)

# pop() deletes and returns an element, the last one by default
numbers = [10, 20, 30]
removed = numbers.pop()
print(removed)
print(numbers)
print(numbers.pop(0))
print(numbers)

# clear() removes every element
names = ["Ana", "Nika"]
names.clear()
print(names)

# count(value) counts matches
numbers = [1, 2, 2, 3]
print(numbers.count(2))
print(numbers.count(9))

# index(value, start, stop) gives the first matching position
fruits = ["apple", "pear", "apple", "kiwi"]
print(fruits.index("apple"))
print(fruits.index("apple", 1, 3))
if "pear" in fruits:
    print(fruits.index("pear"))

# sort() sorts the list itself, reverse=True sorts from biggest, key sets the rule
numbers = [3, 1, 2]
numbers.sort()
print(numbers)
numbers.sort(reverse=True)
print(numbers)
words = ["pear", "fig", "banana"]
words.sort(key=len)
print(words)

# reverse() flips the order, it is not sorting
numbers = [5, 1, 8]
numbers.reverse()
print(numbers)

# these methods return None, so do not write numbers = numbers.sort()
numbers = [3, 1, 2]
numbers.sort()
print(numbers)

# ---- tuples ----

point = (10, 20)
colors = ("red", "blue", "red")
single = ("red",)
empty_tuple = ()
print(point[0])
print(colors[-1])
print(colors[0:2])

# tuples only have count() and index(), and cannot be changed
print(colors.count("red"))
values = (10, 20, 30, 20)
print(values.index(20))
print(values.index(20, 2, 4))

# len(), in, not in and for work on tuples too
print(len(colors))
print("blue" in colors)
print("green" not in colors)
for color in colors:
    print(color)

# ---- sets ----

# a set keeps only unique elements and has no indexes
numbers = {1, 2, 2, 3}
print(len(numbers))
empty_set = set()

# add() adds one element, duplicates are ignored
fruits = {"apple", "pear"}
fruits.add("kiwi")
fruits.add("apple")
print(sorted(fruits))

# update() adds the elements of one or more collections
numbers = {1, 2}
numbers.update([2, 3], (4, 5))
print(sorted(numbers))

# remove() raises an error if the element is missing, discard() does not
fruits.remove("pear")
print("pear" in fruits)
fruits.discard("banana")
print(len(fruits))

# pop() removes and returns any element, clear() removes all
values = {10, 20}
removed = values.pop()
print(len(values))
values.clear()
print(values)

# set operations create a new set
a = {1, 2, 3}
b = {3, 4, 5}
print(sorted(a.union(b)))
print(sorted(a | b))
print(sorted(a.intersection(b)))
print(sorted(a & b))
print(sorted(a.difference(b)))
print(sorted(b - a))
print(sorted(a.symmetric_difference(b)))
print(sorted(a ^ b))

skills = {"Python", "Git", "SQL"}
print(len(skills))
print("Git" in skills)
print("Java" not in skills)
for skill in sorted(skills):
    print(skill)

# ---- while loop ----

# the condition is checked before every round, the counter makes it False in the end
number = 1
while number <= 5:
    print(number)
    number += 1

# a false condition at the start means the body never runs
number = 10
while number < 5:
    print("this is never printed")

# going through a list with while, the index must be updated
students = ["Ana", "Nika", "Mariam"]
index = 0
while index < len(students):
    print(students[index])
    index += 1

# while True runs forever until break stops it
number = 1
while True:
    print(number)
    if number == 3:
        break
    number += 1
print("loop finished")

# continue skips the rest of this round, the counter changes before it
number = 0
while number < 6:
    number += 1
    if number == 3:
        continue
    print(number)

# a non-empty list is True, an empty list is False
numbers = [10, 20, 30]
while numbers:
    print(numbers.pop())
print(numbers)
