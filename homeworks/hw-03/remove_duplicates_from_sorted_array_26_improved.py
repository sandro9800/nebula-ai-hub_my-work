# Remove Duplicates from Sorted Array (LeetCode 26): slow/fast pointers, in place

nums = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]

# slow is the place where the next unique number goes
slow = 1

for fast in range(1, len(nums)):
    # a new number differs from the one before it
    if nums[fast] != nums[fast - 1]:
        nums[slow] = nums[fast]
        slow += 1

k = slow
print(k, nums[:k])  # 5 [0, 1, 2, 3, 4]
