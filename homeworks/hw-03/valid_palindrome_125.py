# LeetCode 125. Valid Palindrome
# Idea: two pointers, skip non-alphanumeric characters, compare lowercase letters.


class Solution:
    def isPalindrome(self, s):
        left, right = 0, len(s) - 1
        while left < right:
            while left < right and not s[left].isalnum():
                left += 1
            while left < right and not s[right].isalnum():
                right -= 1
            if s[left].lower() != s[right].lower():
                return False
            left += 1
            right -= 1
        return True


# quick check
print(Solution().isPalindrome("A man, a plan, a canal: Panama"))  # True
print(Solution().isPalindrome("race a car"))  # False
