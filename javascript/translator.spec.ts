import { test, expect, Page } from '@playwright/test';

/**
 * Helper: Type singlish and verify expected Sinhala keyword(s) appear.
 * We check BODY text because output box is not a textarea on this site.
 * IMPORTANT: Use keywords that do NOT already exist on the page.
 */
async function typeAndCheck(page: Page, inputText: string, expectedSinhalaRegex: RegExp) {
  await page.goto('https://www.swifttranslator.com/', { waitUntil: 'domcontentloaded' });

  const singlishInput = page.locator('textarea').first();
  await singlishInput.fill(inputText);

  await expect(page.locator('body')).toContainText(expectedSinhalaRegex, { timeout: 15000 });
}

/**
 * Helper for NEGATIVE tests:
 * Expectation is NOT “correct translation”, it is “system should not crash”.
 * So we just type and confirm page is still responsive + input still contains our text.
 */
async function typeAndCheckNoCrash(page: Page, inputText: string) {
  await page.goto('https://www.swifttranslator.com/', { waitUntil: 'domcontentloaded' });

  const singlishInput = page.locator('textarea').first();
  await singlishInput.fill(inputText);

  // Page still works + input kept text
  await expect(singlishInput).toHaveValue(inputText, { timeout: 5000 });
  await expect(page).toHaveURL(/swifttranslator\.com/);
}

test.describe('Swift Translator Tests', () => {
  // ✅ 1 UI test (required)
  test('Pos_UI_0001 - Output updates automatically', async ({ page }) => {
    await typeAndCheck(page, 'mama gedhara yanavaa', /මම|මන්/);
  });

  // ✅ Positive Functional Tests (add up to 24)
  const positiveCases: { id: string; input: string; expect: RegExp }[] = [
    { id: 'Pos_Fun_0001', input: 'mama gedhara yanavaa', expect: /මම|මන්/ },
    { id: 'Pos_Fun_0002', input: 'aayuboovan', expect: /ආයුබෝවන්/ },
    { id: 'Pos_Fun_0003', input: 'oyaata kohomadha?', expect: /ඔයා|ඔබ/ },
    { id: 'Pos_Fun_0004', input: 'mata bath kanna one', expect: /මට|බත්|කන්න/ },

    // ✅ Your sentence (compound + negative)
    {
      id: 'Pos_Fun_0005',
      input: 'mama gedhara yanavaa, haebaeyi vahina nisaa dhaenma yannee naee.',
      expect: /වැහි|වැසි|නෑ|යන්න/
    },

    // Add more like this until Pos_Fun_0024
    // { id: 'Pos_Fun_0006', input: '...', expect: /.../ },
  ];

  for (const c of positiveCases) {
    test(`${c.id} - Positive functional`, async ({ page }) => {
      await typeAndCheck(page, c.input, c.expect);
    });
  }

  // ❌ Negative Functional Tests (need 10)
  // These should PASS if system behaves safely (no crash / keeps input / doesn’t break UI)
  const negativeCases: { id: string; input: string }[] = [
    { id: 'Neg_Fun_0001', input: '%%%%%#####@@@@@' },
    { id: 'Neg_Fun_0002', input: '     ' }, // spaces only
    { id: 'Neg_Fun_0003', input: '1234567890' },
    { id: 'Neg_Fun_0004', input: 'm@ma g3dh@ra y@n@v@' },
    { id: 'Neg_Fun_0005', input: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' }, // long repeated
    { id: 'Neg_Fun_0006', input: '😀😀😀😀😀' },
    { id: 'Neg_Fun_0007', input: '\n\n\n\n' },
    { id: 'Neg_Fun_0008', input: '[]{}()<>/\\|~`' },
    { id: 'Neg_Fun_0009', input: 'machan ela supiri kiyala dapan' }, // slang
    { id: 'Neg_Fun_0010', input: 'http://example.com test email zoom whatsapp' },
  ];

  for (const c of negativeCases) {
    test(`${c.id} - Negative functional (no crash)`, async ({ page }) => {
      await typeAndCheckNoCrash(page, c.input);
    });
  }
});
