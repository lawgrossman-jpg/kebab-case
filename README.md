# אתר עו"ד ישראל גרוסמן

אתר תדמית דינמי עבור משרד עורכי הדין של ישראל גרוסמן, בנוי כ-Cloudflare Worker
עם מסד נתונים D1, כולל מערכת ניהול תוכן (CMS) מלאה: עריכת כל טקסט באתר, ניהול
מאמרים ("תבעתי ונושעתי" / "טעם של עו"ד"), ניהול תחומי עיסוק, ניהול סרטוני
"סליחה יש לך חצי דקה?", ולוח פניות (לידים). מותאם ל-SEO עם תגיות meta דינמיות,
Structured Data (JSON-LD), sitemap.xml ו-robots.txt.

## ארכיטקטורה

- **Cloudflare Worker** (`src/worker.js`) — מרנדר את כל הדפים בצד השרת (SSR)
  ישירות מה-DB, כולל דפי המאמרים ותחומי העיסוק (חשוב ל-SEO — התוכן קיים ב-HTML
  הראשוני ולא רק נטען דרך JS).
- **D1 (SQLite)** — מסד הנתונים: תוכן האתר, תחומי עיסוק, מאמרים, סרטונים, פניות.
- **Cloudflare Assets** — קבצים סטטיים (`public/`): לוגו, פאביקון, CSS/Font
  Awesome מקומפלים (לא CDN — ראו "מדוע לא Tailwind CDN" למטה).
- **מערכת ניהול (`/admin`)** — מוגנת בסיסמה, session חתום (HMAC), עם הגנת
  Rate-limiting מפני ניסיונות פריצה.

## מבנה הפרויקט

```
src/worker.js          נתב (router) ראשי: כל הדפים וה-API
src/db.js              שכבת גישה ל-D1 (תוכן, מאמרים, תחומי עיסוק, סרטונים, פניות)
src/auth.js            אימות: סיסמת מנהל, session cookie חתום, הגנת brute-force
src/seo.js             בניית meta tags, JSON-LD, escaping
src/slug.js            תעתוק עברית→לטינית ליצירת slugs תקינים ב-URL
src/layout.js          שלד HTML משותף + header/footer
src/pages/home.js      דף הבית (one-page: hero/practices/about/knowledge/shorts/contact)
src/pages/blog.js      אינדקס בלוג + עמוד מאמר בודד
src/pages/practice-area.js   עמוד ייעודי לכל תחום עיסוק
src/pages/admin.js     דף התחברות + לוח הבקרה (SPA קטן בג'אווהסקריפט טהור)
schema.sql             סכמת D1
seed.sql               תוכן התחלתי (התואם לעיצוב שאושר)
public/                נכסים סטטיים: לוגו, פאביקון, tailwind.css מקומפל, Font Awesome מקומי
```

## הרצה מקומית

```bash
npm install                                              # מתקין תלויות + מעתיק Font Awesome
npx wrangler d1 execute kebab-case-db --local --file=./schema.sql
npx wrangler d1 execute kebab-case-db --local --file=./seed.sql
cp .dev.vars.example .dev.vars   # וערכו סיסמת מנהל וסוד session משלכם
npm run dev                       # מקמפל CSS ומריץ wrangler dev
```

האתר יעלה על http://localhost:8787, ומערכת הניהול על http://localhost:8787/admin
(סיסמה מ-`.dev.vars`).

## פריסה לייצור (Cloudflare)

### 1. יצירת מסד הנתונים ב-Cloudflare (פעם אחת)

```bash
npx wrangler d1 create kebab-case-db
```

הפקודה תדפיס `database_id` — יש להעתיק אותו לתוך `wrangler.toml`, במקום
`REPLACE_WITH_REAL_DATABASE_ID`.

### 2. הרצת הסכמה והתוכן ההתחלתי על הענן

```bash
npm run db:migrate:remote
npm run db:seed:remote
```

### 3. הגדרת סודות (secrets) — **חובה לפני עלייה לאוויר**

```bash
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put SESSION_SECRET
```

`ADMIN_PASSWORD` היא הסיסמה להתחברות ל-`/admin`. `SESSION_SECRET` הוא מחרוזת
אקראית וסודית (למשל תוצאה של `openssl rand -hex 32`) המשמשת לחתימת ה-session.
בלי סודות אלה מוגדרים ב-Cloudflare, ההתחברות לא תעבוד.

### 4. פריסה

מכיוון שה-Build command ב-Cloudflare מוגדר כ-`npx wrangler deploy` בלבד (ללא
שלב build), הקבצים המקומפלים (`public/assets/tailwind.css` ותיקיית
`public/assets/fontawesome/`) **נשמרים בגיט** ונפרסים כמות שהם. אם משנים
עיצוב/HTML בתבניות (`src/pages/*.js`, `src/layout.js`), יש להריץ לפני commit:

```bash
npm run build:css
git add public/assets/tailwind.css
```

(לחלופין, ניתן לשנות ב-Cloudflare dashboard את Build command ל-
`npm ci && npm run build:css` כדי שזה יקרה אוטומטית בכל פריסה.)

## מדוע לא Tailwind/Font Awesome מ-CDN

עיצוב האתר מבוסס על תבנית Tailwind שסופקה, אך `cdn.tailwindcss.com` (ה"play
CDN") מיועד לפי התיעוד הרשמי של Tailwind **לפיתוח/אב-טיפוס בלבד ולא לייצור**
— הוא מקמפל CSS בזמן ריצה בדפדפן, גורם לפליקר של תוכן לא מעוצב, ותלוי בזמינות
שרת חיצוני בכל טעינת עמוד. לכן ה-CSS מקומפל מראש (`npm run build:css`, מבוסס
על Tailwind CLI) ומוגש כקובץ סטטי מהיר מה-Worker עצמו, וכנ"ל Font Awesome
(מוגש מקומית מ-`public/assets/fontawesome`). התוצאה הוויזואלית זהה לעיצוב
שאושר, אך טעינה מהירה ויציבה יותר — שני גורמים שמשפיעים ישירות על דירוג ב-Google.

## מערכת הניהול (`/admin`)

לאחר התחברות עם `ADMIN_PASSWORD`, ניתן לערוך:

- **תוכן האתר** — כל טקסט גלוי באתר (כותרות, פסקאות, פרטי קשר, תגיות SEO
  כלליות), מאורגן לפי אזורים (Hero, אודות, מרכז ידע, יצירת קשר וכו').
- **תחומי עיסוק** — הוספה/עריכה/מחיקה, כולל תוכן מלא ותגיות SEO לכל עמוד.
- **מאמרים** — הוספה/עריכה/מחיקה של מאמרי "תבעתי ונושעתי" / "טעם של עו"ד",
  עם שליטה על פרסום (טיוטה מול פורסם) ותגיות SEO פר-מאמר.
- **סרטונים** — ניהול רשימת "סליחה יש לך חצי דקה?" (כותרת, תקציר, קישור הטמעה
  אופציונלי ל-YouTube/Vimeo).
- **פניות (לידים)** — כל פנייה מטופס יצירת הקשר נשמרת ב-D1 ומוצגת כאן בזמן אמת.

כל השינויים נשמרים ישירות ב-D1 ומשתקפים באתר החי מיידית, ללא צורך בפריסה
מחדש.

## SEO

- כל דף (בית, מאמר, תחום עיסוק) מקבל `<title>`, `meta description` ו-
  `canonical` ייחודיים, הניתנים לעריכה מהאדמין.
- Structured Data (JSON-LD): `LegalService` בדף הבית, `Article` בכל מאמר,
  `BreadcrumbList` בדפים הפנימיים — עוזר לגוגל להבין את סוג העסק והתוכן.
- `sitemap.xml` נבנה דינמית מכל התחומים והמאמרים הקיימים ב-DB.
- `robots.txt` מפנה למפת האתר וחוסם אינדוקס של `/admin`.
- דפי `/admin` מסומנים `noindex, nofollow`.
- מהירות טעינה: CSS/אייקונים מוגשים מקומית (ראו סעיף קודם) במקום CDN חיצוני
  לא-ייצורי.

**מה שעדיין כדאי לעשות (לא טכני, לא ניתן לאוטומציה):**
1. לרשום את האתר ב-Google Search Console ולשלוח את ה-sitemap.
2. ליצור/לאמת פרופיל Google Business לעסק (משפיע מאוד על חיפושים מקומיים
   כמו "עורך דין רשלנות רפואית פתח תקווה").
3. להוסיף תוכן אמיתי (לא לדוגמה) למאמרים ולביוגרפיה — תוכן איכותי ומקורי הוא
   גורם הדירוג המשמעותי ביותר לטווח ארוך.

## מה עדיין דורש השלמה

1. **וידאו אמיתי** — כרטיסי "סליחה יש לך חצי דקה?" הם placeholder ויזואלי;
   בשדה `embed_url` באדמין ניתן להזין קישור YouTube/Vimeo, אך התבנית עדיין
   מציגה תמונת placeholder ולא נגן מוטמע בפועל — שיפור עתידי קל להוספה.
2. **תוכן לדוגמה** — המאמרים, הביוגרפיה וה-slugs הראשוניים הם תוכן לדוגמה
   התואם למבנה שאושר; יש להחליפם בתוכן הסופי דרך מערכת הניהול.
3. **גיבוי** — מומלץ להריץ מדי פעם `wrangler d1 export kebab-case-db --remote`
   לגיבוי התוכן.

## נגישות ותאימות למגזר החרדי

העיצוב שומר על ניגודיות גבוהה לקריאות טקסטים משפטיים ורפואיים, ונמנע מתוכן
שיווקי אגרסיבי, כמבוקש במסמך האפיון המקורי.
