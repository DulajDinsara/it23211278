import { test, expect, Page } from '@playwright/test';

const URL = 'https://www.swifttranslator.com/';

/**
 * POSITIVE helper:
 * Type Singlish and confirm Sinhala keyword(s) appear somewhere on the page.
 * (Output panel is not a textarea, so we check body text.)
 */
async function typeAndCheck(page: Page, inputText: string, expectedSinhalaRegex: RegExp) {
  await page.goto(URL, { waitUntil: 'domcontentloaded' });

  const singlishInput = page.locator('textarea').first();
  await expect(singlishInput).toBeVisible({ timeout: 15000 });

  await singlishInput.fill(inputText);

  // Confirm the expected Sinhala keyword(s) appear after typing
  await expect(page.locator('body')).toContainText(expectedSinhalaRegex, { timeout: 15000 });
}

/**
 * NEGATIVE helper:
 * For negative tests, we don't expect "correct translation"—we expect "no crash".
 * So we confirm input accepts text and page stays responsive.
 */
async function typeAndCheckNoCrash(page: Page, inputText: string) {
  await page.goto(URL, { waitUntil: 'domcontentloaded' });

  const singlishInput = page.locator('textarea').first();
  await expect(singlishInput).toBeVisible({ timeout: 15000 });

  await singlishInput.fill(inputText);

  // Confirm the input still has what we typed (page didn't break)
  await expect(singlishInput).toHaveValue(inputText, { timeout: 5000 });

  // Confirm we are still on the correct site
  await expect(page).toHaveURL(/swifttranslator\.com/i);
}

test.describe('SwiftTranslator - Singlish to Sinhala Automated Tests', () => {
  //  ONE Positive UI test (as assignment asks)
  test('Pos_UI_0001 - Output updates automatically', async ({ page }) => {
    await typeAndCheck(page, 'eka poddak amaaruyi vagee', /අමාරු|පොඩ්ඩක්|වගේ/);
  });

  //  ONE Negative UI test (as assignment asks)
 test('Neg_UI_0001 - Translate with invalid symbols input (no crash)', async ({ page }) => {
  await page.goto(URL, { waitUntil: 'domcontentloaded' });

  const singlishInput = page.locator('textarea').first();
  await singlishInput.fill('%%%%%#####@@@@@');

  const translateBtn = page.getByRole('button', { name: /translate/i });
  await translateBtn.click();

  // UI should remain stable and responsive
  await expect(page).toHaveURL(/swifttranslator\.com/i);
});


  //  25 POSITIVE FUNCTIONAL TESTS
  const positiveCases: { id: string; name: string; input: string; expect: RegExp }[] = [
    // 1–6: Simple / Daily language
    { id: 'Pos_Fun_0001', name: 'Simple sentence', input: 'mama gedhara yanavaa', expect: /මම|මං|මන්|ගෙදර/ },
    { id: 'Pos_Fun_0002', name: 'Need something', input: 'mata bath oonee', expect: /මට|බත්/ },
    { id: 'Pos_Fun_0003', name: 'Plural pronoun', input: 'api paasal yanavaa', expect: /අපි|පාසල්/ },
    { id: 'Pos_Fun_0004', name: 'Staying at home', input: 'mama gedhara inne', expect: /ගෙදර|ඉන්න/ },
    { id: 'Pos_Fun_0005', name: 'Feeling sleepy', input: 'mata nidhimathayi', expect: /නිදි|මට/ },
    { id: 'Pos_Fun_0006', name: 'Weather', input: 'dhaen vahinavaa', expect: /වැහි|වහින/ },

    // 7–10: Questions & Commands
    { id: 'Pos_Fun_0007', name: 'Question 1', input: 'oyaata kohomadha?', expect: /ඔයා|ඔබ|කොහොම/ },
    { id: 'Pos_Fun_0008', name: 'Question 2', input: 'oyaa kavadhdha enne?', expect: /කවදා|ඔයා|එන/ },
    { id: 'Pos_Fun_0009', name: 'Command 1', input: 'issarahata yanna', expect: /යන්න/ },
    { id: 'Pos_Fun_0010', name: 'Command 2', input: 'mata kiyanna', expect: /කියන්න/ },

    // 11–14: Tenses
    { id: 'Pos_Fun_0011', name: 'Past tense', input: 'mama iiyee gedhara giyaa', expect: /ඊයේ|ගියා|ගෙදර/ },
    { id: 'Pos_Fun_0012', name: 'Present tense', input: 'mama dhaen vaeda karanavaa', expect: /දැන්|වැඩ/ },
    { id: 'Pos_Fun_0013', name: 'Future tense', input: 'mama heta enavaa', expect: /හෙට|එනවා/ },
    { id: 'Pos_Fun_0014', name: 'Next week plan', input: 'api ilaga sathiyee yamu', expect: /සතිය|යමු/ },

    // 15–17: Polite vs Informal
    { id: 'Pos_Fun_0015', name: 'Polite request', input: 'karuNaakaralaa mata udhavvak karanna puluvandha?', expect: /කරුණා|උදව්|කරන්න/ },
    { id: 'Pos_Fun_0016', name: 'Apology', input: 'samaavenna eeka athvaeradhiimak', expect: /සමාවෙන්න/ },
    { id: 'Pos_Fun_0017', name: 'Informal', input: 'ehema karapan', expect: /කරපන්|කරන්න/ },

    // 18–20: Compound / Complex sentences
    { id: 'Pos_Fun_0018', name: 'Compound with and', input: 'api kaeema kanna yanavaa saha passe film ekak balanavaa', expect: /කෑම|කන්න|බලනවා|චිත්‍රපට/ },
    { id: 'Pos_Fun_0019', name: 'Conditional', input: 'oya enavaanam mama balan innavaa', expect: /ඔයා|ඉන්නවා|බලන්/ },
    { id: 'Pos_Fun_0020', name: 'Compound + negation', input: 'mama gedhara yanavaa, haebaeyi vahina nisaa dhaenma yannee naee.', expect: /වැහි|වැසි|නෑ|යන්න/ },

    // 21–24: Mixed English / Names / Formatting
    { id: 'Pos_Fun_0021', name: 'Mixed English 1', input: 'mama office yanna late wennee traffic nisaa', expect: /office|traffic|අපමාද|පරක්කු|නිසා/ },
    { id: 'Pos_Fun_0022', name: 'Zoom meeting', input: 'Zoom meeting ekak thiyennee', expect: /Zoom|meeting|මීටින්/ },
    { id: 'Pos_Fun_0023', name: 'Email request', input: 'Documents tika email karanna puluvandha?', expect: /email|ලියවිලි|කරන්න/ },
    { id: 'Pos_Fun_0024', name: 'New lines', input: 'mama gedhara yanavaa.\noyaa enne kawadha?', expect: /ගෙදර|කවදා|එන/ },

    // 25: Long paragraph style
    {
      id: 'Pos_Fun_0025',
      name: 'Long news-style sentence (stress test)',
      input:
        'dhitvaa suLi kuNaatuva samaGa aethi vuu gQQvathura saha naayayaeem heethuven maarga sQQvarDhana aDhikaariya sathu maarga kotas 430k vinaashayata pathva aethi athara, ehi samastha dhiga pramaaNaya kiloomiitar 300k pamaNa vana bava pravaahana,mahaamaarga saha naagarika sQQvarDhana amaathYA bimal rathnaayaka saDHahan kaLeeya',
      expect: /[අ-ෆ]/,
    },
  ];

  for (const c of positiveCases) {
    test(`${c.id} - ${c.name}`, async ({ page }) => {
      await typeAndCheck(page, c.input, c.expect);
    });
  }

  //  10 NEGATIVE FUNCTIONAL TESTS (expected weaknesses / robustness)
  const negativeCases: { id: string; name: string; input: string }[] = [
    { id: 'Neg_Fun_0001', name: 'Symbols only', input: '%%%%%#####@@@@@' },
    { id: 'Neg_Fun_0002', name: 'Spaces only', input: '          ' },
    { id: 'Neg_Fun_0003', name: 'Numbers only', input: '1234567890' },
    { id: 'Neg_Fun_0004', name: 'Mixed symbols + letters', input: 'm@ma g3dh@ra y@n@v@' },
    { id: 'Neg_Fun_0005', name: 'Very long repeated letters', input: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
    { id: 'Neg_Fun_0006', name: 'Emoji input', input: '😀😀😀😀😀' },
    { id: 'Neg_Fun_0007', name: 'Line breaks only', input: '\n\n\n\n' },
    { id: 'Neg_Fun_0008', name: 'Special characters set', input: '[]{}()<>/\\|~`' },
    { id: 'Neg_Fun_0009', name: 'Slang', input: 'ela machan supiri' },
    { id: 'Neg_Fun_0010', name: 'URL + English words', input: 'http://example.com test email zoom whatsapp' },
  ];

  for (const c of negativeCases) {
    test(`${c.id} - ${c.name}`, async ({ page }) => {
      await typeAndCheckNoCrash(page, c.input);
    });
  }
});

// Run:
// npx playwright test --headed --project=chromium
