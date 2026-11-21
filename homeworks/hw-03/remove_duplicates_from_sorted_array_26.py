class Solution:
    def removeDuplicates(self, nums):
        slow = 1
        for fast in range(1, len(nums)):
            if nums[fast] != nums[fast - 1]:
                nums[slow] = nums[fast]
                slow += 1
        return slow


nums = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]
k = Solution().removeDuplicates(nums)
print(k, nums[:k])
