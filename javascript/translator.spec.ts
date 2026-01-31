import { test, expect, Page } from '@playwright/test';

const URL = 'https://www.swifttranslator.com/';

async function typeAndCheck(page: Page, inputText: string, expectedSinhalaRegex: RegExp) {
  await page.goto(URL, { waitUntil: 'domcontentloaded' });

  const singlishInput = page.locator('textarea').first();
  await expect(singlishInput).toBeVisible({ timeout: 15000 });

  await singlishInput.fill(inputText);

  await expect(page.locator('body')).toContainText(expectedSinhalaRegex, { timeout: 15000 });
}

async function typeAndExpectFail(page: Page, inputText: string) {
  await page.goto(URL, { waitUntil: 'domcontentloaded' });

  const singlishInput = page.locator('textarea').first();
  await expect(singlishInput).toBeVisible({ timeout: 15000 });

  await singlishInput.fill(inputText);

  await expect(page).toHaveURL(/swifttranslator\.com/i);

  await expect(page.locator('body')).not.toContainText(/[අ-ෆ]/, { timeout: 5000 });
}

test.describe('SwiftTranslator - Singlish to Sinhala Automated Tests', () => {
  test('Pos_UI_0001 - Output updates automatically', async ({ page }) => {
    await typeAndCheck(page, 'eka poddak amaaruyi vagee', /අමාරු|පොඩ්ඩක්|වගේ/);
  });

  const positiveCases: { id: string; name: string; input: string; expect: RegExp }[] = [
    // 1–6: Simple / Daily language
    { id: 'Pos_Fun_0001', name: 'Simple sentence', input: 'mama gedhara giihin innawa', expect: /මම|මං|මන්|ගෙදර/ },
    { id: 'Pos_Fun_0002', name: 'Need something', input: 'mata bath tikak ona', expect: /මට|බත්/ },
    { id: 'Pos_Fun_0003', name: 'Plural pronoun', input: 'api paasalata yanna hadanawa', expect: /අපි|පාසල්/ },
    { id: 'Pos_Fun_0004', name: 'Staying at home', input: 'mama gedhara thama inne', expect: /ගෙදර|ඉන්න/ },
    { id: 'Pos_Fun_0005', name: 'Feeling sleepy', input: 'mata tikak nidhimathayi dan', expect: /නිදි|මට/ },
    { id: 'Pos_Fun_0006', name: 'Weather', input: 'dan tikak vahinawa wage', expect: /වැහි|වහින/ },
    { id: 'Pos_Fun_0007', name: 'Question 1', input: 'oyaata kohomadha dan', expect: /ඔයා|ඔබ|කොහොම/ },
    { id: 'Pos_Fun_0008', name: 'Question 2', input: 'oyaa enne kawadhdha kiyanna', expect: /කවදා|ඔයා|එන/ },
    { id: 'Pos_Fun_0009', name: 'Command 1', input: 'issarahata yanna poddak', expect: /යන්න/ },
    { id: 'Pos_Fun_0010', name: 'Command 2', input: 'mata kiyanna eeka', expect: /කියන්න/ },
    { id: 'Pos_Fun_0011', name: 'Past tense', input: 'iiyee mama gedhara hariyata giyaa', expect: /ඊයේ|ගියා|ගෙදර/ },
    { id: 'Pos_Fun_0012', name: 'Present tense', input: 'dhaen mama vaeda tikak karanavaa', expect: /දැන්|වැඩ/ },
    { id: 'Pos_Fun_0013', name: 'Future tense', input: 'heta mama aluthen enavaa', expect: /හෙට|එනවා/ },
    { id: 'Pos_Fun_0014', name: 'Next week plan', input: 'ilaga sathiyee api yamu neh', expect: /සතිය|යමු/ },
    { id: 'Pos_Fun_0015', name: 'Polite request', input: 'karuNaakaralaa mata udhavvak karanna puluvandha meka', expect: /කරුණා|උදව්|කරන්න/ },
    { id: 'Pos_Fun_0016', name: 'Apology', input: 'samaavenna, eeka athvaeradhuna', expect: /සමාවෙන්න/ },
    { id: 'Pos_Fun_0017', name: 'Informal', input: 'ehema karapan dan', expect: /කරපන්|කරන්න/ },
    { id: 'Pos_Fun_0018', name: 'Compound with and', input: 'api kaeema kanna yamu saha passe film ekak balamu', expect: /කෑම|කන්න|බලනවා|චිත්‍රපට/ },
    { id: 'Pos_Fun_0019', name: 'Conditional', input: 'oyaa enavaanam mama balan innam', expect: /ඔයා|ඉන්නවා|බලන්/ },
    { id: 'Pos_Fun_0020', name: 'Compound + negation', input: 'mama gedhara yanna hithuwa, habai vahina nisaa dhaen yanne na.', expect: /වැහි|වැසි|නෑ|යන්න/ },
    { id: 'Pos_Fun_0021', name: 'Mixed English 1', input: 'mama office yanna delay una traffic nisaa', expect: /office|traffic|අපමාද|පරක්කු|නිසා/ },
    { id: 'Pos_Fun_0022', name: 'Zoom meeting', input: 'ada Zoom meeting ekak thiyennee', expect: /Zoom|meeting|මීටින්/ },
    { id: 'Pos_Fun_0023', name: 'Email request', input: 'documents tika email karanna puluvandha?', expect: /email|ලියවිලි|කරන්න/ },
    { id: 'Pos_Fun_0024', name: 'New lines', input: 'mama gedhara yanna hadanawa.\noyaa enne kawadhdha?', expect: /ගෙදර|කවදා|එන/ },

    {
      id: 'Pos_Fun_0025',
      name: 'Long news-style sentence (stress test)',
      input:
        'dawasak thula aethi vuu suLi kuNaatu saha gQQvathura heethuven boho pradesha walata paalu sidu una athara, maarga kotas boho deval vinaashayata path una bawa wartha we. ehi pramaanaya ha samastha dhiga pramaanaya pilibanda adhikaariyange prakashayak sidu una.',
      expect: /[අ-ෆ]/,
    },
  ];

  for (const c of positiveCases) {
    test(`${c.id} - ${c.name}`, async ({ page }) => {
      await typeAndCheck(page, c.input, c.expect);
    });
  }

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
      await typeAndExpectFail(page, c.input);
    });
  }
});


