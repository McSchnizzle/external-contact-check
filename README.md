# VE Family Contact Form Testing

Automated testing suite to validate contact forms across VE-family externally-visible websites using Playwright.

## Project Overview

This project tests contact forms across 11 VE-family websites to ensure they:
- Accept form submissions correctly
- Route messages to the right people
- Provide timely responses

### Test Data Used
- **Name**: Dustin Lao
- **Email**: dlao@vital-enterprises.com
- **Phone**: 503 329 8712
- **Message**: Custom message indicating this is a test submission

## Current Status: Phase 1

**Phase 1** includes testing for:
- ✅ Team Cinder (https://www.teamcinder.com/contact-us)

**Phase 2** will add testing for the remaining 10 companies:
- Nereus Worldwide
- Vprime
- Causeway Collaboration
- Omnia Digital Solutions
- Novus Labs
- Sift Discovery
- con10gency
- Tonsil Tech
- VE
- Marq6 Broadband

## Running the Tests

### Option 1: Using the Run Script (Recommended)
```bash
./run-tests.sh
```

This will:
1. Run all tests
2. Automatically open the HTML report when complete

### Option 2: Using npm scripts
```bash
# Run all tests
npm test

# Run only Team Cinder test
npm run test:team-cinder

# Run tests in headed mode (see browser)
npm run test:headed

# Open the HTML report
npm run show-report
```

## Creating a Desktop Shortcut (macOS)

1. Open **Automator** (found in Applications)
2. Choose **Application**
3. Add a **Run Shell Script** action
4. Paste this script:
   ```bash
   cd /Users/paulbrown/Desktop/coding-projects/external-contact-check
   ./run-tests.sh
   ```
5. Save as "Run Contact Form Tests" to your Desktop
6. (Optional) Right-click the app, Get Info, and drag a custom icon to personalize it

## Understanding the HTML Report

After tests run, an HTML report opens automatically showing:

### For Each Test:
- ✅ **Pass**: Contact form successfully filled and submitted
- ❌ **Fail**: Issue detected with the contact form

### Failure Details Include:
- **Error message**: What went wrong
- **Screenshots**: Visual evidence of the failure
  - Before filling the form
  - After filling the form
  - After submission attempt
- **Step-by-step trace**: Exact point of failure

### Common Failure Scenarios:
- Form fields have changed (different names/IDs)
- Form structure modified
- Page layout changed
- Form no longer exists at that URL
- Network/timeout issues

## Project Structure

```
external-contact-check/
├── tests/
│   ├── screenshots/          # Test screenshots organized by company
│   │   └── team-cinder/
│   └── team-cinder.spec.ts   # Team Cinder test (Phase 1)
├── test-data/
│   └── companies.csv         # List of all companies and URLs
├── playwright.config.ts      # Playwright configuration
├── run-tests.sh             # Main test execution script
├── package.json
└── README.md
```

## Screenshots

Each test captures three screenshots:
1. **01-before-filling.png**: Page state before form interaction
2. **02-after-filling.png**: Form with all fields completed
3. **03-after-submission.png**: Page state after form submission

These screenshots are:
- Saved to `tests/screenshots/{company-name}/`
- Automatically linked in the HTML report
- Full-page captures for complete context

## Troubleshooting

### Tests fail with "timeout" errors
- Website may be slow or down
- Check your internet connection
- Try running with: `npm run test:headed` to see what's happening

### Can't find form fields
- Website structure may have changed
- Check the screenshot in the HTML report
- May need to update the test selectors

### Script won't run from desktop
- Ensure the script is executable: `chmod +x run-tests.sh`
- Check the path in the Automator app matches your project location

## Next Steps (Phase 2)

Once the Team Cinder test is validated and working correctly:
1. Create individual test files for the remaining 10 companies
2. Update this README with all company statuses
3. Run full test suite across all 11 websites

## Technical Details

- **Framework**: Playwright Test
- **Language**: TypeScript
- **Browser**: Chromium (headless by default)
- **Node Version**: Requires Node.js 18+
- **Report Format**: HTML (interactive)
