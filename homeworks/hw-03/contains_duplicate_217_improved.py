# Contains Duplicate (LeetCode 217): a set remembers the numbers we have seen

tests = [[1, 2, 3, 1], [1, 2, 3, 4]]

for nums in tests:
    seen = set()
    result = False

    for n in nums:
        # if the number is already in the set, it is a duplicate
        if n in seen:
            result = True
            break
        seen.add(n)

    print(nums, result)
