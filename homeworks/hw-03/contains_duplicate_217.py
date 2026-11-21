# LeetCode 217. Contains Duplicate
# Idea: remember seen numbers in a set; if we meet one again, there is a duplicate.


class Solution:
    def containsDuplicate(self, nums):
        seen = set()
        for n in nums:
            if n in seen:
                return True
            seen.add(n)
        return False


# quick check
print(Solution().containsDuplicate([1, 2, 3, 1]))  # True
print(Solution().containsDuplicate([1, 2, 3, 4]))  # False
