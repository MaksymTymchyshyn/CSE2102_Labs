#!/bin/bash
# Final verification script for Lab 09 submission

echo "╔════════════════════════════════════════════════════════╗"
echo "║         Lab 09 Submission Verification                 ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check functions
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        return 0
    else
        echo -e "${RED}✗${NC} $2 - MISSING"
        return 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        return 0
    else
        echo -e "${RED}✗${NC} $2 - MISSING"
        return 1
    fi
}

# Track issues
ISSUES=0

echo "Checking required files..."
echo "─────────────────────────────────────────────────────────"
check_file "my-server.py" "Flask server implementation" || ((ISSUES++))
check_file "my-calls.py" "Client implementation" || ((ISSUES++))
check_file "test_token_service.py" "Test suite" || ((ISSUES++))
check_file "requirements.txt" "Dependencies list" || ((ISSUES++))
check_file "README.md" "Instructions (how to run)" || ((ISSUES++))
check_file "IMPLEMENTATION_SUMMARY.md" "Description (what you did)" || ((ISSUES++))
check_file "demo.sh" "Demo script" || ((ISSUES++))

echo ""
echo "Checking submission package..."
echo "─────────────────────────────────────────────────────────"
check_file "Lab09_WebTokens_Submission.zip" "Submission ZIP file" || ((ISSUES++))

echo ""
echo "Verifying Python syntax..."
echo "─────────────────────────────────────────────────────────"
if python3 -m py_compile my-server.py 2>/dev/null; then
    echo -e "${GREEN}✓${NC} my-server.py syntax OK"
else
    echo -e "${RED}✗${NC} my-server.py has syntax errors"
    ((ISSUES++))
fi

if python3 -m py_compile my-calls.py 2>/dev/null; then
    echo -e "${GREEN}✓${NC} my-calls.py syntax OK"
else
    echo -e "${RED}✗${NC} my-calls.py has syntax errors"
    ((ISSUES++))
fi

if python3 -m py_compile test_token_service.py 2>/dev/null; then
    echo -e "${GREEN}✓${NC} test_token_service.py syntax OK"
else
    echo -e "${RED}✗${NC} test_token_service.py has syntax errors"
    ((ISSUES++))
fi

echo ""
echo "Running tests..."
echo "─────────────────────────────────────────────────────────"
if python3 test_token_service.py 2>&1 | grep -q "OK"; then
    TEST_COUNT=$(python3 test_token_service.py 2>&1 | grep -oP 'Ran \K\d+' || echo "?")
    echo -e "${GREEN}✓${NC} All tests passed ($TEST_COUNT tests)"
else
    echo -e "${RED}✗${NC} Some tests failed"
    ((ISSUES++))
fi

echo ""
echo "Checking documentation completeness..."
echo "─────────────────────────────────────────────────────────"

# Check if README has installation instructions
if grep -q "Installation" README.md; then
    echo -e "${GREEN}✓${NC} README has installation instructions"
else
    echo -e "${YELLOW}⚠${NC} README missing installation section"
fi

# Check if README has run instructions
if grep -q -i "running\|how to run" README.md; then
    echo -e "${GREEN}✓${NC} README has running instructions"
else
    echo -e "${YELLOW}⚠${NC} README missing running instructions"
fi

# Check if IMPLEMENTATION_SUMMARY describes what was done
if [ $(wc -l < IMPLEMENTATION_SUMMARY.md) -gt 50 ]; then
    echo -e "${GREEN}✓${NC} IMPLEMENTATION_SUMMARY is comprehensive"
else
    echo -e "${YELLOW}⚠${NC} IMPLEMENTATION_SUMMARY may be too brief"
fi

echo ""
echo "Checking for video demonstration..."
echo "─────────────────────────────────────────────────────────"
if ls *.mp4 *.avi *.mov 2>/dev/null | grep -q .; then
    echo -e "${GREEN}✓${NC} Video file found: $(ls *.mp4 *.avi *.mov 2>/dev/null)"
else
    echo -e "${YELLOW}⚠${NC} No video file found (.mp4, .avi, or .mov)"
    echo "    You still need to create a video demonstration!"
fi

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║                 VERIFICATION SUMMARY                   ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

if [ $ISSUES -eq 0 ]; then
    echo -e "${GREEN}✓ All critical checks passed!${NC}"
    echo ""
    echo "Your lab is ready for submission (except video)."
    echo ""
    echo "To submit:"
    echo "  1. Record a video of the demo (run ./demo.sh)"
    echo "  2. Submit Lab09_WebTokens_Submission.zip"
    echo "  3. Submit your video file"
else
    echo -e "${RED}✗ Found $ISSUES issue(s) that need attention${NC}"
    echo ""
    echo "Please fix the issues above before submitting."
fi

echo ""
echo "Submission checklist:"
echo "  [ ] Lab09_WebTokens_Submission.zip"
echo "  [ ] Video demonstration (2-5 minutes)"
echo ""
