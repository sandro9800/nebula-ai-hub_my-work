# Reverse String (LeetCode 344): reverse the list in place with two pointers

s = ["h", "e", "l", "l", "o"]

# one pointer at each end
left = 0
right = len(s) - 1

# swap the outer elements and move towards the middle
while left < right:
    s[left], s[right] = s[right], s[left]
    left += 1
    right -= 1

print(s)  # ['o', 'l', 'l', 'e', 'h']
