# LeetCode 242. Valid Anagram
# Idea: count letters of s up, letters of t down; all counts must end at zero.


class Solution:
    def isAnagram(self, s, t):
        if len(s) != len(t):
            return False
        counts = {}
        for ch in s:
            counts[ch] = counts.get(ch, 0) + 1
        for ch in t:
            if counts.get(ch, 0) == 0:
                return False
            counts[ch] -= 1
        return True


# quick check
print(Solution().isAnagram("anagram", "nagaram"))  # True
print(Solution().isAnagram("rat", "car"))  # False
