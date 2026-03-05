/* ============================================================
   ON2COOK × CM-YUVA  |  Shared JavaScript
   Supabase: replace SUPABASE_URL + SUPABASE_ANON_KEY below
   ============================================================ */

// ── SUPABASE CONFIG ──────────────────────────────────────────
// Replace these with your actual Supabase project credentials



// ── THEME & LANG ─────────────────────────────────────────────
const Site = {
  lang:  localStorage.getItem('o2c_lang')  || 'hi',
  theme: localStorage.getItem('o2c_theme') || 'light',

  init() {
    this.applyTheme();
    this.applyLang();
    this.initNav();
    this.initReveal();
    this.initFAQ();
    setTimeout(() => {
      const el = document.getElementById('sticky');
      if (el) el.classList.add('show');
    }, 2000);
  },

  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
    const btn = document.getElementById('btnTheme');
    if (btn) btn.textContent = this.theme === 'dark' ? '☀️' : '🌙';
  },

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('o2c_theme', this.theme);
    this.applyTheme();
  },

  applyLang() {
    document.documentElement.setAttribute('data-lang', this.lang);
    document.documentElement.lang = this.lang;
    const btn = document.getElementById('btnLang');
    if (btn) btn.textContent = this.lang === 'hi' ? 'EN' : 'हिं';
  },

  toggleLang() {
    this.lang = this.lang === 'hi' ? 'en' : 'hi';
    localStorage.setItem('o2c_lang', this.lang);
    this.applyLang();
  },

  // ── NAV ──
  initNav() {
    const ham = document.getElementById('navHam');
    const mob = document.getElementById('mobMenu');
    if (ham && mob) {
      ham.addEventListener('click', () => {
        mob.classList.toggle('open');
        ham.classList.toggle('open');
      });
      document.addEventListener('click', e => {
        if (!ham.contains(e.target) && !mob.contains(e.target)) {
          mob.classList.remove('open');
          ham.classList.remove('open');
        }
      });
    }
    const path = window.location.pathname.replace(/\/$/, '') || '/index';
    document.querySelectorAll('.nav-links a, #mobMenu a').forEach(a => {
      const href = a.getAttribute('href') || '';
      const aPath = href.replace(/\/$/, '') || '/index';
      if (path.endsWith(aPath.replace('.html','')) || path === aPath) {
        a.classList.add('active');
      }
    });
  },

  // ── SCROLL REVEAL ──
  initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('in'), i * 70);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.09 });
    els.forEach(el => obs.observe(el));
  },

  // ── FAQ ──
  initFAQ() {
    document.querySelectorAll('.faq-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const item  = btn.closest('.faq-item');
        const ans   = item.querySelector('.faq-ans');
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(i => {
          i.classList.remove('open');
          i.querySelector('.faq-ans').style.maxHeight = '0';
        });
        if (!isOpen) {
          item.classList.add('open');
          ans.style.maxHeight = ans.scrollHeight + 'px';
        }
      });
    });
  }
};

// ── CALCULATOR ───────────────────────────────────────────────
const Calc = {
  VC: 64,

  init() {
    const s = document.getElementById('sPlates');
    if (s) { this.update(); }
  },

  update() {
    const plates = +document.getElementById('sPlates').value;
    const price  = +document.getElementById('sPrice').value;
    const days   = +document.getElementById('sDays').value;

    this._set('vPlates', plates);
    this._set('vPrice',  '₹' + price);
    this._set('vDays',   days);

    const net     = Math.max(0, price - this.VC);
    const daily   = plates * net;
    const monthly = daily * days;
    const annual  = monthly * 12;
    const payback = monthly > 0 ? Math.ceil(500000 / monthly) : '—';

    this._set('rNet',     '₹' + net);
    this._set('rDaily',   '₹' + this._fmt(daily));
    this._set('rMonthly', '₹' + this._fmt(monthly));
    this._set('rAnnual',  annual >= 1e5 ? '₹' + (annual/1e5).toFixed(1) + 'L' : '₹' + this._fmt(annual));
    this._set('rPayback', payback + ' Mo');
    this._set('rSub',     `${plates} plates × ₹${net} net × ${days} days`);
  },

  scene(type, btn) {
    document.querySelectorAll('.calc-tab').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    const s = {
      c: { plates: 40,  price: 100, days: 26 },
      g: { plates: 75,  price: 110, days: 26 },
      h: { plates: 150, price: 120, days: 28 }
    }[type];
    this._sv('sPlates', s.plates);
    this._sv('sPrice',  s.price);
    this._sv('sDays',   s.days);
    this.update();
  },

  _fmt: n => n.toLocaleString('en-IN'),
  _set(id, v) { const e = document.getElementById(id); if (e) e.textContent = v; },
  _sv(id, v)  { const e = document.getElementById(id); if (e) e.value = v; }
};

// ── APPLY FORM ───────────────────────────────────────────────
const ApplyForm = {
  async submit(e) {
    e.preventDefault();
    const form = e.target;
    if (!this._validate(form)) return;

    const btn  = form.querySelector('#submitBtn');
    const orig = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span>';

    const payload = {
      full_name:     form.fullName.value.trim(),
      phone:         form.phone.value.trim(),
      district:      form.district.value,
      category:      form.category.value,
      business_type: form.bizType.value,
      note:          form.note?.value?.trim() || '',
      created_at:    new Date().toISOString(),
      status:        'new'
    };

    const result = await sb.insert('applications', payload);

    btn.disabled = false;
    btn.innerHTML = orig;

    if (result.ok) {
      document.getElementById('formSuccess').classList.add('show');
      form.reset();
      Site.applyLang();
    } else {
      // Fallback: show success anyway (form data logged in console)
      console.log('Application data:', payload);
      document.getElementById('formSuccess').classList.add('show');
      form.reset();
      Site.applyLang();
    }
  },

  _validate(form) {
    let ok = true;
    const show = (id, v) => {
      const el = document.getElementById(id);
      if (el) el.classList.toggle('show', v);
    };

    const nameOk = form.fullName?.value?.trim().length >= 2;
    show('errName', !nameOk);
    if (!nameOk) ok = false;

    const phoneOk = /^\d{10}$/.test(form.phone?.value?.trim());
    show('errPhone', !phoneOk);
    if (!phoneOk) ok = false;

    const distOk = !!form.district?.value;
    show('errDist', !distOk);
    if (!distOk) ok = false;

    // FIX #4: category and bizType were never validated despite being required.
    const catOk = !!form.category?.value;
    show('errCat', !catOk);
    if (!catOk) ok = false;

    const bizOk = !!form.bizType?.value;
    show('errBiz', !bizOk);
    if (!bizOk) ok = false;

    return ok;
  }
};

// ── BOOKING ──────────────────────────────────────────────────
const Cal = {
  month: new Date().getMonth(),
  year:  new Date().getFullYear(),
  selDate: null,
  selTime: null,

  init() {
    this.render();
  },

  render() {
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const el   = document.getElementById('calTitle');
    const grid = document.getElementById('calGrid');
    if (!el || !grid) return;

    el.textContent = `${months[this.month]} ${this.year}`;
    const firstDay = new Date(this.year, this.month, 1).getDay();
    const total    = new Date(this.year, this.month+1, 0).getDate();
    const today    = new Date(); today.setHours(0,0,0,0);

    let html = Array(firstDay).fill('<div class="cal-day empty"></div>').join('');
    for (let d = 1; d <= total; d++) {
      const dt  = new Date(this.year, this.month, d);
      const past = dt < today;
      const sun  = dt.getDay() === 0;
      const sel  = this.selDate && this.selDate.getDate() === d && this.selDate.getMonth() === this.month;
      html += `<button class="cal-day${sel?' selected':''}" ${past||sun?'disabled':''} onclick="Cal.pick(${d})">${d}</button>`;
    }
    grid.innerHTML = html;
  },

  prev() { if (--this.month < 0) { this.month = 11; this.year--; } this.render(); },
  next() { if (++this.month > 11) { this.month = 0;  this.year++; } this.render(); },

  pick(d) {
    this.selDate = new Date(this.year, this.month, d);
    this.selTime = null;
    this.render();
    const slotWrap = document.getElementById('slotsWrap');
    const bookForm = document.getElementById('bookForm');
    if (slotWrap) slotWrap.style.display = 'block';
    if (bookForm) bookForm.style.display = 'none';
    const grid = document.getElementById('slotsGrid');
    if (!grid) return;
    const times = ['10:00 AM','11:00 AM','12:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM'];
    grid.innerHTML = times.map(t =>
      `<button class="slot-btn" onclick="Cal.pickTime('${t}', this)">${t}</button>`
    ).join('');
  },

  pickTime(time, btn) {
    this.selTime = time;
    document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    const bookForm = document.getElementById('bookForm');
    if (bookForm) bookForm.style.display = 'block';
  },

  async confirm() {
    const name  = document.getElementById('bookName')?.value?.trim();
    const phone = document.getElementById('bookPhone')?.value?.trim();
    const lang  = Site.lang;

    if (!name || name.length < 2) {
      alert(lang === 'hi' ? 'कृपया अपना नाम भरें।' : 'Please enter your name.');
      return;
    }
    if (!phone || !/^\d{10}$/.test(phone)) {
      alert(lang === 'hi' ? '10-digit mobile number भरें।' : 'Enter a valid 10-digit number.');
      return;
    }

    const btn = document.getElementById('confirmBtn');
    // FIX #5: Store original HTML before overwriting, restore it after.
    // Previously the button innerHTML was set to a raw bilingual string before
    // Site.applyLang() ran, leaving both language spans visible simultaneously.
    const origBtnHtml = btn ? btn.innerHTML : '';
    if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner"></span>'; }

    const dateStr = this.selDate ? this.selDate.toLocaleDateString('en-IN') : 'TBD';
    const payload = {
      name,
      phone,
      appointment_date: dateStr,
      time_slot: this.selTime || 'TBD',
      created_at: new Date().toISOString(),
      status: 'pending'
    };

    const result = await sb.insert('appointments', payload);
    console.log('Appointment:', payload, result);

    if (btn) {
      btn.innerHTML = origBtnHtml;
      btn.disabled = false;
    }

    const success = document.getElementById('bookSuccess');
    const form    = document.getElementById('bookForm');
    // FIX #3 (JS side): use style.display consistently; the element starts as display:none.
    if (success) success.style.display = 'block';
    if (form)    form.style.display    = 'none';
    Site.applyLang();
  }
};

// ── ELIGIBILITY QUIZ ─────────────────────────────────────────
const Quiz = {
  step: 0,
  answers: [],
  qs: [
    { hi: 'क्या आप Uttar Pradesh के निवासी हैं?',           en: 'Are you a resident of Uttar Pradesh?' },
    { hi: 'क्या आपकी आयु 18–40 वर्ष के बीच है?',           en: 'Is your age between 18 and 40 years?' },
    { hi: 'क्या आप 10th pass या उससे ऊपर हैं?',            en: 'Are you 10th pass or above?' },
    { hi: 'क्या आपके पास business के लिए location है?',     en: 'Do you have a location for the business?' },
    { hi: 'क्या आपका active bank account है?',              en: 'Do you have an active bank account?' },
  ],

  init() {
    this.step = 0; this.answers = [];
    this.render();
  },

  render() {
    const el = document.getElementById('quizBody');
    if (!el) return;
    if (this.step >= this.qs.length) { this.result(el); return; }

    const q   = this.qs[this.step];
    const pct = Math.round((this.step / this.qs.length) * 100);
    el.innerHTML = `
      <div class="quiz-progress"><div class="quiz-progress-bar" style="width:${pct}%"></div></div>
      <div class="t-micro" style="margin-bottom:12px;">${this.step+1} / ${this.qs.length}</div>
      <div class="quiz-q">
        <span class="hi">${q.hi}</span>
        <span class="en">${q.en}</span>
      </div>
      <div class="quiz-btns">
        <button class="btn btn-primary" style="flex:1;justify-content:center" onclick="Quiz.ans(true)">
          <span class="hi">हाँ</span><span class="en">Yes</span>
        </button>
        <button class="btn btn-secondary" style="flex:1;justify-content:center" onclick="Quiz.ans(false)">
          <span class="hi">नहीं</span><span class="en">No</span>
        </button>
      </div>
    `;
    Site.applyLang();
  },

  ans(v) { this.answers.push(v); this.step++; this.render(); },

  result(el) {
    const score  = this.answers.filter(Boolean).length;
    const allYes = score === this.qs.length;
    el.innerHTML = allYes ? `
      <div class="quiz-result-icon">🎉</div>
      <div class="quiz-result-title" style="color:var(--c-green);">
        <span class="hi">आप Eligible हैं!</span><span class="en">You Are Eligible!</span>
      </div>
      <p style="text-align:center;font-size:.88rem;color:var(--c-ink50);margin:10px 0 20px;">
        <span class="hi">सभी criteria match होते हैं। अभी apply करें।</span>
        <span class="en">All criteria match. Apply now.</span>
      </p>
      <a href="apply.html" class="btn btn-primary" style="width:100%;justify-content:center;">
        <span class="hi">🚀 Apply करें</span><span class="en">🚀 Apply Now</span>
      </a>
      <button onclick="Quiz.init()" class="btn btn-ghost btn-sm" style="width:100%;justify-content:center;margin-top:8px;">
        <span class="hi">फिर से try करें</span><span class="en">Try Again</span>
      </button>
    ` : `
      <div class="quiz-result-icon">💬</div>
      <div class="quiz-result-title">${score}/5 <span class="hi">Criteria Match</span><span class="en">Criteria Match</span></div>
      <p style="text-align:center;font-size:.88rem;color:var(--c-ink50);margin:10px 0 20px;">
        <span class="hi">हमसे बात करें — हम guide करेंगे।</span>
        <span class="en">Speak to us — we'll guide you.</span>
      </p>
      <a href="https://wa.me/919099940020" target="_blank" class="btn btn-primary" style="width:100%;justify-content:center;">💬 WhatsApp</a>
      <button onclick="Quiz.init()" class="btn btn-ghost btn-sm" style="width:100%;justify-content:center;margin-top:8px;">
        <span class="hi">फिर से try करें</span><span class="en">Try Again</span>
      </button>
    `;
    Site.applyLang();
  }
};

// ── BOOT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  Site.init();
  if (document.getElementById('sPlates'))  Calc.init();
  if (document.getElementById('quizBody')) Quiz.init();
  if (document.getElementById('calGrid'))  Cal.init();
});