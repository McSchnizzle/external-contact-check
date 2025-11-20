import { test, expect } from '@playwright/test';
import * as path from 'path';

test.describe('Team Cinder Contact Form', () => {
  const testData = {
    name: 'Dustin Lao',
    email: 'dlao@vital-enterprises.com',
    phone: '503 329 8712',
    company: 'Team Cinder',
    url: 'https://www.teamcinder.com/contact-us'
  };

  const message = `I'm testing that contact forms posted on our VE-family externally-visible websites get to the right people and get a timely response. This is a test of ${testData.company} website contact form. Please reply to this contact form submission when you receive it`;

  test('should successfully fill and submit Team Cinder contact form', async ({ page }) => {
    const screenshotDir = path.join(__dirname, 'screenshots', 'team-cinder');

    // Navigate to the contact page
    await test.step('Navigate to contact page', async () => {
      await page.goto(testData.url);
      await expect(page).toHaveTitle(/.*Team Cinder.*/i);
      // Wait for the contact form to be visible instead of networkidle
      // (networkidle doesn't work with interactive elements like Google Maps)
      await page.locator('input[placeholder*="name" i]').first().waitFor({ state: 'visible', timeout: 10000 });
    });

    // Take screenshot before filling the form
    await test.step('Take screenshot before filling form', async () => {
      await page.screenshot({
        path: path.join(screenshotDir, '01-before-filling.png'),
        fullPage: true
      });
    });

    // Fill out the contact form
    await test.step('Fill contact form fields', async () => {
      // Look for name field - try common selectors
      const nameField = page.locator('input[name*="name" i], input[id*="name" i], input[placeholder*="name" i]').first();
      await expect(nameField).toBeVisible({ timeout: 10000 });
      await nameField.fill(testData.name);

      // Look for email field
      const emailField = page.locator('input[type="email"], input[name*="email" i], input[id*="email" i]').first();
      await expect(emailField).toBeVisible();
      await emailField.fill(testData.email);

      // Look for phone field
      const phoneField = page.locator('input[type="tel"], input[name*="phone" i], input[id*="phone" i], input[placeholder*="phone" i]').first();
      if (await phoneField.count() > 0) {
        await phoneField.fill(testData.phone);
      }

      // Look for message/comment field
      const messageField = page.locator('textarea, input[name*="message" i], input[name*="comment" i]').first();
      await expect(messageField).toBeVisible();
      await messageField.fill(message);
    });

    // Take screenshot after filling the form
    await test.step('Take screenshot after filling form', async () => {
      await page.screenshot({
        path: path.join(screenshotDir, '02-after-filling.png'),
        fullPage: true
      });
    });

    // Submit the form
    await test.step('Submit the form', async () => {
      const submitButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("submit"), button:has-text("send")').first();
      await expect(submitButton).toBeVisible();
      await submitButton.click();
    });

    // Wait for submission to complete (look for success message or redirect)
    await test.step('Verify submission completed', async () => {
      // Wait a bit for the form to process
      await page.waitForTimeout(3000);

      // Take screenshot after submission
      await page.screenshot({
        path: path.join(screenshotDir, '03-after-submission.png'),
        fullPage: true
      });

      // Look for success indicators (adjust based on actual behavior)
      // This might be a success message, a redirect, or form disappearing
      const possibleSuccessIndicators = [
        page.locator('text=/thank you/i'),
        page.locator('text=/success/i'),
        page.locator('text=/received/i'),
        page.locator('text=/submitted/i'),
      ];

      let foundSuccess = false;
      for (const indicator of possibleSuccessIndicators) {
        if (await indicator.count() > 0) {
          foundSuccess = true;
          break;
        }
      }

      // If no success message found, at least verify we're not on an error page
      if (!foundSuccess) {
        const errorIndicators = page.locator('text=/error/i, text=/failed/i');
        await expect(errorIndicators).toHaveCount(0);
      }
    });
  });
});
