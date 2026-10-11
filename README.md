# Playwright automation — ACME form

Script that opens [https://test.netlify.app/], fills the orange contact form, takes a screenshot of the filled page, and only then clicks **Request a call back**.

## Requirements

- [Node.js](https://nodejs.org/) (version 18 or later)

## How to install and run

From the project folder:

```bash
npm install
npx playwright install chromium
npm run fill-form
```

1. `npm install` installs the Playwright library.
2. `npx playwright install chromium` downloads the Chromium browser used by the automation.
3. `npm run fill-form` runs [`src/fill-form.js`].

Chromium opens visibly so you can watch the form being filled. After the screenshot, `form-filled.png` is saved in the project root. When the Thank You page appears, the terminal prints `Done`.