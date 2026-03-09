
const SUPABASE_URL  = 'https://bugsfjchvdhujazurjzq.supabase.co';
const SUPABASE_ANON_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1Z3NmamNodmRodWphenVyanpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MDU4NzYsImV4cCI6MjA4ODI4MTg3Nn0.T5CEeN81kqC7YwNaFIqJ3sUZABHU5GZ-MsFvzAl6_VI';


// ── VALIDATION ───────────────────────────────────────────────
// Warn loudly in development if credentials are still placeholders.
(function checkConfig() {
  const missing = [];
  if (!SUPABASE_URL      || SUPABASE_URL.includes('YOUR_PROJECT_ID')) missing.push('SUPABASE_URL');
  if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY.includes('YOUR_ANON_KEY'))  missing.push('SUPABASE_ANON_KEY');
  if (missing.length) {
    console.warn(
      `%c[Supabase] Missing credentials: ${missing.join(', ')}\n` +
      'Open js/supabase.js and replace the placeholder values.',
      'color:#e05; font-weight:bold;'
    );
  }
})();

// ── REST CLIENT ──────────────────────────────────────────────
// Lightweight wrapper — covers everything the app needs
// without importing the full 200kb Supabase SDK.

const sb = {

  // ── INSERT ────────────────────────────────────────────────
  // Returns { ok: true, data } on success or { ok: false, error, status } on failure.
  async insert(table, payload) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'apikey':        SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer':        'return=representation',   // return the inserted row
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const raw = await res.text();
        let msg = raw;
        try {
          const json = JSON.parse(raw);
          msg = json.message || json.error || raw;
          // Surface the most common errors with actionable hints.
          if (json.code === '42501') {
            msg = `Row-level security blocked the insert on "${table}". ` +
                  'Run supabase-setup.sql in your Supabase SQL Editor to add the anon insert policy.';
          }
          if (res.status === 401) {
            msg = 'Unauthorized (401). Check that SUPABASE_ANON_KEY in supabase.js is correct ' +
                  'and matches the "anon public" key in your Supabase project settings.';
          }
        } catch (_) { /* raw text is fine */ }
        throw Object.assign(new Error(msg), { status: res.status });
      }

      const data = await res.json();
      return { ok: true, data };

    } catch (err) {
      console.error(`[Supabase] insert("${table}") failed:`, err.message);
      return { ok: false, error: err.message, status: err.status };
    }
  },

  // ── SELECT ────────────────────────────────────────────────
  // filters: PostgREST query string, e.g. 'status=eq.new&order=created_at.desc'
  // Returns array of rows (empty array on error).
  async select(table, filters = '') {
    try {
      const qs  = filters ? `?${filters}` : '';
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}${qs}`, {
        headers: {
          'apikey':        SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error(`[Supabase] select("${table}") failed:`, err.message);
      return [];
    }
  },

  // ── UPDATE ────────────────────────────────────────────────
  // filters: PostgREST filter string, e.g. 'id=eq.some-uuid'
  // Returns { ok: true } or { ok: false, error }.
  async update(table, filters, payload) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${filters}`, {
        method:  'PATCH',
        headers: {
          'Content-Type':  'application/json',
          'apikey':        SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer':        'return=representation',
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      return { ok: true };
    } catch (err) {
      console.error(`[Supabase] update("${table}") failed:`, err.message);
      return { ok: false, error: err.message };
    }
  },

  // ── DELETE ────────────────────────────────────────────────
  // filters: PostgREST filter string, e.g. 'id=eq.some-uuid'
  async delete(table, filters) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${filters}`, {
        method:  'DELETE',
        headers: {
          'apikey':        SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });
      if (!res.ok) throw new Error(await res.text());
      return { ok: true };
    } catch (err) {
      console.error(`[Supabase] delete("${table}") failed:`, err.message);
      return { ok: false, error: err.message };
    }
  },
};