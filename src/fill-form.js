/**
 * ACME landing-page form automation.
 * Opens https://test.netlify.app/, fills every field on the form,
 * captures a screenshot, clicks "Request a call back", and logs
 * a message once the Thank You page is visible.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

// Resolve the screenshot path relative to this file so the PNG always lands in the project root.
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const screenshotPath = path.join(projectRoot, 'form-filled.png');

// Dummy values
const formData = {
  name: 'Jones da Silva',
  email: 'jones@example.com',
  phone: '+55 73 98888-0000',
  company: 'Jones Software',
  website: 'https://jones.example.com',
  employees: '51-500',
};

async function fillAcmeForm() {
  // headless opens a visible Chromium window so the user can watch each step.
  // slowMo inserts a short delay after every Playwright action.
  const browser = await chromium.launch({
    headless: false,
    slowMo: 450,
  });

  const page = await browser.newPage();

  try {
    // Navigate to the landing page and wait until the network is idle.
    await page.goto('https://test.netlify.app/', {
      waitUntil: 'networkidle',
    });

    // Wait until the first required field is in the DOM before typing.
    const nameInput = page.getByRole('textbox', { name: 'Name *' });
    await nameInput.waitFor({ state: 'visible' });

    // fill() focuses the control, clears any existing value, and types
    // the new text, firing the native input events the page expects.
    await nameInput.fill(formData.name);
    await page.getByRole('textbox', { name: 'Email *' }).fill(formData.email);
    await page.getByRole('textbox', { name: 'Phone *' }).fill(formData.phone);
    await page.getByRole('textbox', { name: 'Company' }).fill(formData.company);
    await page.getByRole('textbox', { name: 'Website' }).fill(formData.website);

    // Native <select>: pick the option by its visible value/label.
    await page.getByLabel('Number of Employees').selectOption(formData.employees);

    // Capture the filled form before submitting, so the PNG shows every field.
    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
    });
    console.log(`Screenshot saved to ${screenshotPath}`);

    // Submit only after the screenshot has been saved.
    await page.getByRole('button', { name: 'Request a call back' }).click();

    // Wait for the Thank You page instead of a fixed timeout, so a message
    // is logged only after the form has been submitted.
    await page.getByRole('heading', { name: /thank you/i }).waitFor({
      state: 'visible',
    });
    console.log('Done');

    // Brief pause so the Thank You page is visible before shutdown.
    await page.waitForTimeout(2000);
  } finally {
    await browser.close();
  }
}

fillAcmeForm().catch((error) => {
  console.error('Form automation failed:', error);
  process.exitCode = 1;
});
