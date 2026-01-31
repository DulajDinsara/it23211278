import { test, expect, Page } from '@playwright/test';

const URL = 'https://www.swifttranslator.com/';

/**
 * POSITIVE helper:
 * Type Singlish and confirm Sinhala keyword(s) appear somewhere on the page.
 */
async function typeAndCheck(page: Page, inputText: string, expectedSinhalaRegex: RegExp) {
  await page.goto(URL, { waitUntil: 'domcontentloaded' });

  const singlishInput = page.locator('textarea').first();
  await expect(singlishInput).toBeVisible({ timeout: 15000 });

  await singlishInput.fill(inputText);

  // Output panel is not a textarea, so we check the body text.
  await expect(page.locator('body')).toContainText(expectedSinhalaRegex, { timeout: 15000 });
}

/**
 * NEGATIVE helper (same logic as before):
 * Inputs should NOT produce Sinhala output, and page should remain stable.
 */
async function typeAndExpectFail(page: Page, inputText: string) {
  await page.goto(URL, { waitUntil: 'domcontentloaded' });

  const singlishInput = page.locator('textarea').first();
  await expect(singlishInput).toBeVisible({ timeout: 15000 });

  await singlishInput.fill(inputText);

  await expect(page).toHaveURL(/swifttranslator\.com/i);

  // "Fail" condition: should NOT produce Sinhala output for invalid input
  await expect(page.locator('body')).not.toContainText(/[අ-ෆ]/, { timeout: 5000 });
}

test.describe('SwiftTranslator - Singlish to Sinhala Automated Tests', () => {
  // ✅ ONE Positive UI test
  test('Pos_UI_0001 - Output updates automatically', async ({ page }) => {
    await typeAndCheck(page, 'mama gedara yanawa', /මම|ගෙදර|යනවා/);
  });

  // ✅ ONE Negative UI test
  test('Neg_UI_0001 - Invalid symbols input should NOT produce Sinhala output', async ({ page }) => {
    await typeAndExpectFail(page, '%%%%%#####@@@@@');
  });

  // ✅ 25 NEW POSITIVE FUNCTIONAL TESTS (same old logic)
  const positiveCases: { id: string; name: string; input: string; expect: RegExp }[] = [
    { id: 'Pos_Fun_0001', name: 'Greeting', input: 'suba udasanak', expect: /සුබ|උදෑසන/ },
    { id: 'Pos_Fun_0002', name: 'How are you', input: 'oyata kohomada', expect: /ඔයා|කොහොමද/ },
    { id: 'Pos_Fun_0003', name: 'I am fine', input: 'mama hondin inne', expect: /හොඳින්|ඉන්න/ },
    { id: 'Pos_Fun_0004', name: 'Thank you', input: 'istuti', expect: /ස්තුති/ },
    { id: 'Pos_Fun_0005', name: 'Sorry', input: 'samaavenna', expect: /සමාවෙන්න/ },

    { id: 'Pos_Fun_0006', name: 'Going home', input: 'mama gedara yanawa', expect: /ගෙදර|යනවා|මම/ },
    { id: 'Pos_Fun_0007', name: 'Come here', input: 'meheta enna', expect: /එන්න|මෙහෙට/ },
    { id: 'Pos_Fun_0008', name: 'Sit down', input: 'indaganna', expect: /ඉඳගන්න/ },
    { id: 'Pos_Fun_0009', name: 'Eat food', input: 'kema kanna', expect: /කෑම|කන්න/ },
    { id: 'Pos_Fun_0010', name: 'Drink water', input: 'watura bonna', expect: /වතුර|බොන්න/ },

    { id: 'Pos_Fun_0011', name: 'Today', input: 'ada hari lassanai', expect: /අද|ලස්සන/ },
    { id: 'Pos_Fun_0012', name: 'Tomorrow', input: 'heta api yamu', expect: /හෙට|යමු|අපි/ },
    { id: 'Pos_Fun_0013', name: 'Yesterday', input: 'iiye mama paasal giya', expect: /ඊයේ|පාසල්|ගියා/ },
    { id: 'Pos_Fun_0014', name: 'Now', input: 'dan mama wada karanawa', expect: /දැන්|වැඩ|කරනවා/ },

    { id: 'Pos_Fun_0015', name: 'Where are you', input: 'oya koheda inne', expect: /කොහෙද|ඉන්නෙ|ඔයා/ },
    { id: 'Pos_Fun_0016', name: 'What are you doing', input: 'oya monawada karanne', expect: /මොනවද|කරන්නේ|ඔයා/ },
    { id: 'Pos_Fun_0017', name: 'Do you like it', input: 'oyata eka kamathi da', expect: /කැමති|ද/ },

    { id: 'Pos_Fun_0018', name: 'Simple request', input: 'karuna karala mata udaw karanna', expect: /කරුණා|උදව්|කරන්න/ },
    { id: 'Pos_Fun_0019', name: 'Call me', input: 'mata call ekak danna', expect: /කෝල්|දන්න|මට/ },
    { id: 'Pos_Fun_0020', name: 'Send message', input: 'msg ekak yawanna', expect: /පණිවිඩ|යවන්න|msg|message/ },

    { id: 'Pos_Fun_0021', name: 'Meeting', input: 'ada meeting ekak thiyenawa', expect: /මීටින්|meeting|අද/ },
    { id: 'Pos_Fun_0022', name: 'Zoom class', input: 'heta zoom class ekak', expect: /Zoom|class|හෙට/ },
    { id: 'Pos_Fun_0023', name: 'Email', input: 'eka email karanna puluwan da', expect: /email|ඊමේල්|කරන්න/ },
    { id: 'Pos_Fun_0024', name: 'Two lines', input: 'mama enawa\noya innawada', expect: /එනවා|ඉන්නවද|ඔයා/ },

    {
      id: 'Pos_Fun_0025',
      name: 'Long paragraph (stress)',
      input:
        'mama ada gedara inne nisa passe tikak yanna hithanawa. oyata puluwan nam mata kiyanna monawada karanne kiyala, mama danma reply karannam.',
      expect: /[අ-ෆ]/,
    },
  ];

  for (const c of positiveCases) {
    test(`${c.id} - ${c.name}`, async ({ page }) => {
      await typeAndCheck(page, c.input, c.expect);
    });
  }

  // ❌ 10 NEW NEGATIVE FUNCTIONAL TESTS (same old logic)
  const negativeCases: { id: string; name: string; input: string }[] = [
    { id: 'Neg_Fun_0001', name: 'Only punctuation', input: '!!!???...,,,' },
    { id: 'Neg_Fun_0002', name: 'Only spaces', input: '                 ' },
    { id: 'Neg_Fun_0003', name: 'Only numbers', input: '000001111122223333' },
    { id: 'Neg_Fun_0004', name: 'Symbols + numbers', input: '@@@###$$$12345' },
    { id: 'Neg_Fun_0005', name: 'Math operators', input: '+++++-----*****/////' },
    { id: 'Neg_Fun_0006', name: 'Emoji spam', input: '😂🔥💯😂🔥💯' },
    { id: 'Neg_Fun_0007', name: 'Only line breaks', input: '\n\n\n\n\n' },
    { id: 'Neg_Fun_0008', name: 'Brackets and slashes', input: '[]{}()<>\\\\////' },
    { id: 'Neg_Fun_0009', name: 'Random gibberish', input: 'qwrtypsdfghjklzxcvbnm' },
    { id: 'Neg_Fun_0010', name: 'URLs + tokens', input: 'https://test.com @user #tag ?q=1' },
  ];

  for (const c of negativeCases) {
    test(`${c.id} - ${c.name}`, async ({ page }) => {
      await typeAndExpectFail(page, c.input);
    });
  }
});

// Run:
// npx playwright test --headed --project=chromium
