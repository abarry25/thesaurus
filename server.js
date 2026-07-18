require('dotenv').config();
const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.warn(
    'Missing SUPABASE_URL or SUPABASE_KEY. Set them in a .env file locally, ' +
    'or in your Render environment variables.'
  );
}

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_KEY || ''
);

// Everything lives in one row of one table, since this is a single-user tool.
const ROW_ID = 'default';

app.get('/api/state', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('app_state')
      .select('data')
      .eq('id', ROW_ID)
      .maybeSingle();

    if (error) throw error;
    res.json(data ? data.data : null);
  } catch (err) {
    console.error('Load failed:', err.message);
    res.status(500).json({ error: 'Could not load data from Supabase. Check your SUPABASE_URL / SUPABASE_KEY and that the app_state table exists.' });
  }
});

app.put('/api/state', async (req, res) => {
  try {
    const { error } = await supabase
      .from('app_state')
      .upsert({ id: ROW_ID, data: req.body, updated_at: new Date().toISOString() });

    if (error) throw error;
    res.json({ ok: true });
  } catch (err) {
    console.error('Save failed:', err.message);
    res.status(500).json({ error: 'Could not save data to Supabase.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Character Thesaurus running on port ${PORT}`));
