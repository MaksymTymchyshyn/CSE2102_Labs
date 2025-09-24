#!/usr/bin/env python3
"""
Lab 4 Demonstration Script
Shows the factorization functionality working as specified in the lab requirements.
"""

from app import trial_division

def demonstrate_factorization():
    """Demonstrate the factorization functionality"""
    
    print("=" * 60)
    print("LAB 4: Basic HTTP with Python Flask - Factorization Demo")
    print("=" * 60)
    print()
    
    # Test cases as specified in lab requirements
    test_cases = [
        (12, "Example from lab requirements"),
        (7, "Prime number test"),
        (360, "Large composite number"),
        (17, "Another prime"),
        (100, "Perfect square"),
        (1, "Edge case"),
        (2, "Smallest prime"),
        (4, "Small composite")
    ]
    
    print("Testing factorization according to lab requirements:")
    print("- If number is prime: return [number]")
    print("- If number is composite: return [1, factor1, factor2, ...]")
    print()
    
    for number, description in test_cases:
        print(f"Testing {number} ({description}):")
        
        # Get prime factors using the AI-generated algorithm
        factors = trial_division(number)
        
        # Apply lab requirements formatting
        if number <= 1:
            result = []
            is_prime = False
        elif len(factors) == 1 and factors[0] == number:
            # It's a prime number
            result = [number]
            is_prime = True
        else:
            # It's a composite number - include 1 as first factor
            result = [1] + factors
            is_prime = False
        
        print(f"  Input: {number}")
        print(f"  Prime factors: {factors}")
        print(f"  Final result: {result}")
        print(f"  Is prime: {is_prime}")
        print()
    
    print("=" * 60)
    print("VERIFICATION: Lab requirement example")
    print("=" * 60)
    print("Lab states: 'if inINT = 12 then return [1, 2, 2, 3]'")
    
    factors_12 = trial_division(12)
    result_12 = [1] + factors_12
    print(f"Our result for 12: {result_12}")
    print(f"Expected result: [1, 2, 2, 3]")
    print(f"Match: {result_12 == [1, 2, 2, 3]}")
    print()
    
    print("=" * 60)
    print("UNIT TEST RESULTS")
    print("=" * 60)
    
    # Run a quick verification
    import subprocess
    import sys
    
    try:
        result = subprocess.run([sys.executable, '-m', 'unittest', 'test_app.py', '-v'], 
                              capture_output=True, text=True, cwd='/workspaces/CSE2102_Labs/Lab_4')
        print("Unit test output:")
        print(result.stdout)
        if result.stderr:
            print("Errors:")
            print(result.stderr)
        print(f"Exit code: {result.returncode}")
    except Exception as e:
        print(f"Could not run unit tests: {e}")

if __name__ == "__main__":
    demonstrate_factorization()