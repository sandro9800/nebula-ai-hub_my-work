# LeetCode 344. Reverse String
# Idea: two pointers swap characters from both ends, in place, O(n) time, O(1) memory.


class Solution:
    def reverseString(self, s):
        left, right = 0, len(s) - 1
        while left < right:
            s[left], s[right] = s[right], s[left]
            left += 1
            right -= 1


# quick check
s = ["h", "e", "l", "l", "o"]
Solution().reverseString(s)
print(s)  # ['o', 'l', 'l', 'e', 'h']
