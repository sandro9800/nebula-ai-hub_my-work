# Valid Palindrome (LeetCode 125): ignore case and non-alphanumeric characters

tests = ["A man, a plan, a canal: Panama", "race a car", " "]

for s in tests:
    left = 0
    right = len(s) - 1
    result = True

    while left < right:
        # skip characters that are not letters or digits
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1

        # compare the two characters ignoring case
        if s[left].lower() != s[right].lower():
            result = False
            break

        left += 1
        right -= 1

    print(repr(s), result)
