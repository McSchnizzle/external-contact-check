#!/bin/bash

# Contact Form Testing Script
# This script runs all contact form tests and opens the HTML report

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Change to the project directory
cd "$SCRIPT_DIR"

# Clear terminal
clear

echo "================================================"
echo "  VE Family Contact Form Testing"
echo "================================================"
echo ""
echo "Starting tests..."
echo ""

# Run the tests
npm test

# Capture the exit code
TEST_EXIT_CODE=$?

echo ""
echo "================================================"
echo "  Tests completed!"
echo "================================================"
echo ""

# Always open the HTML report
echo "Opening HTML report..."
npm run show-report

# Wait for user to press any key (optional)
# Uncomment the next line if you want the terminal to stay open
# read -n 1 -s -r -p "Press any key to close..."

exit $TEST_EXIT_CODE
