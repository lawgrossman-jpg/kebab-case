// Hebrew has no native Latin slug form, so transliterate consonants to keep
// URLs ASCII-only (avoids percent-encoding edge cases in the router/sitemap).
const HEBREW_MAP = {
  א: 'a', ב: 'b', ג: 'g', ד: 'd', ה: 'h', ו: 'v', ז: 'z', ח: 'ch', ט: 't',
  י: 'y', כ: 'k', ך: 'k', ל: 'l', מ: 'm', ם: 'm', נ: 'n', ן: 'n', ס: 's',
  ע: 'a', פ: 'p', ף: 'p', צ: 'tz', ץ: 'tz', ק: 'k', ר: 'r', ש: 'sh', ת: 't',
};

export function slugify(title, fallbackPrefix = 'item') {
  const transliterated = String(title)
    .split('')
    .map((ch) => HEBREW_MAP[ch] ?? ch)
    .join('');
  const slug = transliterated
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || `${fallbackPrefix}-${Date.now()}`;
}
