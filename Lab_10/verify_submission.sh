#!/bin/bash
# Final verification script for Lab 10 submission

echo "╔════════════════════════════════════════════════════════╗"
echo "║         Lab 10 Submission Verification                 ║"
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

# Track issues
ISSUES=0

echo "Checking required files..."
echo "─────────────────────────────────────────────────────────"
check_file "my-server.py" "Flask server with JWT implementation" || ((ISSUES++))
check_file "my-calls.py" "Client implementation" || ((ISSUES++))
check_file "test_jwt_service.py" "Test suite" || ((ISSUES++))
check_file "requirements.txt" "Dependencies list" || ((ISSUES++))
check_file "README.md" "Instructions (how to run)" || ((ISSUES++))
check_file "IMPLEMENTATION_SUMMARY.md" "Description (what you did)" || ((ISSUES++))
check_file "demo.sh" "Demo script" || ((ISSUES++))

echo ""
echo "Checking submission package..."
echo "─────────────────────────────────────────────────────────"
check_file "Lab10_JWT_Submission.zip" "Submission ZIP file" || echo -e "${YELLOW}⚠${NC} Run ./package_submission.sh to create it"

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

if python3 -m py_compile test_jwt_service.py 2>/dev/null; then
    echo -e "${GREEN}✓${NC} test_jwt_service.py syntax OK"
else
    echo -e "${RED}✗${NC} test_jwt_service.py has syntax errors"
    ((ISSUES++))
fi

echo ""
echo "Checking dependencies..."
echo "─────────────────────────────────────────────────────────"
if python3 -c "import flask" 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Flask installed"
else
    echo -e "${YELLOW}⚠${NC} Flask not installed (run: pip3 install Flask)"
fi

if python3 -c "import jwt" 2>/dev/null; then
    echo -e "${GREEN}✓${NC} PyJWT installed"
else
    echo -e "${YELLOW}⚠${NC} PyJWT not installed (run: pip3 install PyJWT)"
fi

if python3 -c "import httpx" 2>/dev/null; then
    echo -e "${GREEN}✓${NC} httpx installed"
else
    echo -e "${YELLOW}⚠${NC} httpx not installed (run: pip3 install httpx)"
fi

echo ""
echo "Running tests..."
echo "─────────────────────────────────────────────────────────"
if python3 test_jwt_service.py 2>&1 | grep -q "OK"; then
    TEST_COUNT=$(python3 test_jwt_service.py 2>&1 | grep -oP 'Ran \K\d+' || echo "?")
    echo -e "${GREEN}✓${NC} All tests passed ($TEST_COUNT tests)"
else
    echo -e "${RED}✗${NC} Some tests failed - run: python3 test_jwt_service.py"
    ((ISSUES++))
fi

echo ""
echo "Checking JWT implementation..."
echo "─────────────────────────────────────────────────────────"
if grep -q "jwt.encode" my-server.py; then
    echo -e "${GREEN}✓${NC} JWT encoding implemented"
else
    echo -e "${RED}✗${NC} JWT encoding not found"
    ((ISSUES++))
fi

if grep -q "jwt.decode" my-server.py; then
    echo -e "${GREEN}✓${NC} JWT decoding implemented"
else
    echo -e "${RED}✗${NC} JWT decoding not found"
    ((ISSUES++))
fi

if grep -q "ExpiredSignatureError" my-server.py; then
    echo -e "${GREEN}✓${NC} Expiration handling implemented"
else
    echo -e "${YELLOW}⚠${NC} Expiration handling may be missing"
fi

echo ""
echo "Checking documentation completeness..."
echo "─────────────────────────────────────────────────────────"
if grep -q "JWT" README.md; then
    echo -e "${GREEN}✓${NC} README mentions JWT"
else
    echo -e "${YELLOW}⚠${NC} README may not describe JWT"
fi

if [ $(wc -l < IMPLEMENTATION_SUMMARY.md) -gt 100 ]; then
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
    echo "  2. Submit Lab10_JWT_Submission.zip"
    echo "  3. Submit your video file"
else
    echo -e "${RED}✗ Found $ISSUES issue(s) that need attention${NC}"
    echo ""
    echo "Please fix the issues above before submitting."
fi

echo ""
echo "Submission checklist:"
echo "  [ ] Lab10_JWT_Submission.zip"
echo "  [ ] Video demonstration (2-5 minutes)"
echo ""
