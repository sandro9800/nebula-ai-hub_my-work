# import the whole module and use it with a prefix
import math_functions as mf
# import only the names we need
from math_functions import add, pi

# call functions from our module
print(mf.add(5, 7))
print(mf.sub(7, 5))
# print the pi constant from our module
print(mf.pi)
