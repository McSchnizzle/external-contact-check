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
    await test.step('Submit the form and verify submission', async () => {
      const submitButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("submit"), button:has-text("send")').first();
      await expect(submitButton).toBeVisible();

      // Wait for either navigation or response after clicking submit
      const [response] = await Promise.all([
        page.waitForResponse(response => response.request().method() === 'POST', { timeout: 30000 }).catch(() => null),
        submitButton.click()
      ]);

      console.log('Form submitted, response received:', response?.status());
    });

    // Wait for submission to complete (look for success message or redirect)
    await test.step('Verify submission completed', async () => {
      // Wait a moment for page to update
      await page.waitForTimeout(3000);

      // Check if page is still available (might have redirected)
      const pageStillExists = !page.isClosed();

      if (pageStillExists) {
        // Take screenshot after submission
        await page.screenshot({
          path: path.join(screenshotDir, '03-after-submission.png'),
          fullPage: true
        }).catch(() => console.log('Could not take screenshot - page may have navigated'));

        // Check for success indicators
        const url = page.url();
        const urlChanged = !url.includes('/contact');

        // Look for success messages
        const successMessage = await page.locator('text=/thank you/i, text=/success/i, text=/received/i, text=/submitted/i, text=/sent/i').count();

        // Check if form was cleared
        const messageField = page.locator('textarea').first();
        const messageFieldExists = await messageField.count() > 0;
        let formCleared = false;

        if (messageFieldExists) {
          const messageValue = await messageField.inputValue();
          formCleared = messageValue === '';
        }

        // Check for errors
        const hasErrors = await page.locator('text=/error/i, text=/failed/i').count() > 0;

        console.log({
          urlChanged,
          successMessage: successMessage > 0,
          formCleared,
          hasErrors,
          currentUrl: url
        });

        // Verify submission succeeded
        const submissionSucceeded = urlChanged || successMessage > 0 || (formCleared && !hasErrors);

        if (!submissionSucceeded) {
          throw new Error(`Form submission could not be verified. URL: ${url}`);
        }
      } else {
        console.log('Page closed/navigated - likely successful submission');
        // Page closed is actually a sign of successful redirect
      }
    });
  });
});
