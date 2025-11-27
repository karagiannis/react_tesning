#!/usr/bin/env python3
"""Test regex pattern on actual file content."""

import re

test_content = """
              // Submit to backend with onboarding_id query parameter
              const response = await fetch(
                `https://celestial.se/tic-tac-toe-api/api/onboarding/risk-assessment?onboarding_id=${onboardingId}`,
                {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(requestBody)
                }
              );
"""

# Test pattern
pattern = r"(\s*)fetch\(\s*\n?\s*([^,]+),\s*\n?\s*(\{(?:[^{}]|\{[^{}]*\})*\})\s*\)"
matches = re.findall(pattern, test_content, flags=re.DOTALL)

print(f"Pattern: {pattern}")
print(f"Matches found: {len(matches)}")
for i, match in enumerate(matches):
    print(f"\nMatch {i+1}:")
    print(f"  Indent: '{match[0]}'")
    print(f"  URL: {match[1][:50]}...")
    print(f"  Options: {match[2][:100]}...")
