# Valid Anagram (LeetCode 242): both strings must have the same letter counts

pairs = [("anagram", "nagaram"), ("rat", "car")]

for s, t in pairs:
    # different lengths can never be anagrams
    result = len(s) == len(t)
    counts = {}

    # count every letter of s
    if result:
        for ch in s:
            counts[ch] = counts.get(ch, 0) + 1

        # remove the letters of t; a missing letter means no anagram
        for ch in t:
            if counts.get(ch, 0) == 0:
                result = False
                break
            counts[ch] -= 1

    print(s, t, result)
