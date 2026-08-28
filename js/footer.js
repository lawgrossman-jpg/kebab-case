// Shared footer markup, injected client-side so it stays in one place
// across pages without requiring a build step or a fetch() (works from file://).
document.addEventListener('DOMContentLoaded', function () {
  var el = document.getElementById('site-footer');
  if (!el) return;
  el.innerHTML = [
    '<div class="container">',
    '  <div class="footer-grid">',
    '    <div>',
    '      <img src="assets/logo.svg" alt="עו&quot;ד ישראל גרוסמן" style="height:44px;filter:brightness(0) invert(1);opacity:.9;margin-bottom:14px">',
    '      <p style="color:#cfd6e2;max-width:32ch">משרד עורכי דין המתמחה בתביעות רשלנות רפואית, נזיקין וביטוח, לצד ליווי אישי ומקצועי לאורך כל התהליך.</p>',
    '    </div>',
    '    <div>',
    '      <h4>ניווט מהיר</h4>',
    '      <ul>',
    '        <li><a href="index.html">דף הבית</a></li>',
    '        <li><a href="about.html">אודות המשרד</a></li>',
    '        <li><a href="practice-areas.html">תחומי עיסוק</a></li>',
    '        <li><a href="blog.html">תבעתי ונושעתי</a></li>',
    '        <li><a href="contact.html">יצירת קשר</a></li>',
    '      </ul>',
    '    </div>',
    '    <div>',
    '      <h4>פרטי התקשרות</h4>',
    '      <ul>',
    '        <li><a href="tel:035624483">טלפון: 03-5624483</a></li>',
    '        <li><a href="tel:0523636941">נייד: 052-3636941</a></li>',
    '        <li><a href="mailto:lawgrossman@gmail.com">lawgrossman@gmail.com</a></li>',
    '        <li>רח\' אריה בן אליעזר 21, פתח תקווה</li>',
    '      </ul>',
    '    </div>',
    '  </div>',
    '  <div class="footer-bottom">',
    '    <span>&copy; ' + new Date().getFullYear() + ' עו"ד ישראל גרוסמן. כל הזכויות שמורות.</span>',
    '    <span>האתר נבנה מתוך מחויבות לנגישות ולשירות מכובד לכלל הציבור</span>',
    '  </div>',
    '  <p class="disclaimer">האמור באתר זה הינו מידע כללי בלבד ואינו מהווה ייעוץ משפטי. אין להסתמך על האמור לצורך קבלת החלטות משפטיות מבלי להיוועץ בעורך דין. פרסום מקרים וסיפורי לקוחות נעשה בכפוף לחיסיון עו"ד-לקוח ובהסכמה מלאה.</p>',
    '</div>'
  ].join('');
});
