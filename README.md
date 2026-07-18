# Character Thesaurus

A notebook for how your characters perceive reality — their instinctive question,
what they notice/ignore/misunderstand, and a growing word collection per category,
plus a place for their "at their worst" antithesis words.

This app has two parts:
- **The database** (Supabase) — where your words actually live, forever, for free.
- **The app itself** (this code, hosted on Render) — the page you visit to read and write to that database.

Follow the steps in order. Every step is something you do in your own browser —
nothing here needs a card number or a password typed anywhere but the official site itself.

---

## Step 1 — Create your free database on Supabase

1. Go to **https://supabase.com** and click **Start your project** (or **Sign in**).
2. Sign up (GitHub sign-in is fastest, but email works too). No credit card required for the free tier.
3. Click **New project**. Give it any name, e.g. `character-thesaurus`. Set a database password (Supabase generates one for you if you want — just save it somewhere, you likely won't need it again for this app). Choose the region closest to you. Click **Create new project** and wait about a minute while it spins up.
4. Once it's ready, click the **SQL Editor** icon in the left sidebar (it looks like `>_`).
5. Click **New query**, paste this in, and click **Run**:

   ```sql
   create table app_state (
     id text primary key,
     data jsonb not null,
     updated_at timestamptz default now()
   );
   ```

   You should see "Success. No rows returned." That table is where all your characters and words will be stored.
6. Click **Project Settings** (gear icon, bottom of the left sidebar) → **Data API**. Copy the **Project URL** — you'll need it in Step 3.
7. Still in Project Settings, click **API Keys**. Copy the **`service_role`** key (not the `anon` key — the service role key is the one only your server will ever see). Keep this page open or paste both values into a scratch note for a moment.

---

## Step 2 — Put the code on GitHub

1. Go to **https://github.com** and sign up or sign in.
2. Click the **+** in the top right → **New repository**. Name it `character-thesaurus`. Keep it **Private** if you'd rather your notes weren't public (recommended, since it holds your working notes). Don't add a README/gitignore/license — this project already has them. Click **Create repository**.
3. GitHub will show you a page with commands. On your own computer, open a terminal (Mac: Terminal app; Windows: PowerShell) and download this project's files there — unzip the file I gave you into a folder, then in the terminal:

   ```bash
   cd path/to/character-thesaurus-app
   git remote add origin https://github.com/YOUR-USERNAME/character-thesaurus.git
   git branch -M main
   git push -u origin main
   ```

   Replace `YOUR-USERNAME` with your actual GitHub username. The first push will ask you to sign in — follow GitHub's prompts (it may open a browser window to confirm).

Your code is now on GitHub. From here on, whenever you want to change the code itself (not your character data — that's separate, and lives in Supabase), you'd edit the files and run:
```bash
git add -A
git commit -m "describe what you changed"
git push
```

---

## Step 3 — Deploy it on Render

1. Go to **https://render.com** and sign up or sign in (signing in with your GitHub account makes the next steps faster).
2. Click **New +** → **Web Service**.
3. Connect your GitHub account if prompted, then select the `character-thesaurus` repo.
4. Fill in:
   - **Name**: `character-thesaurus` (or anything you like — this becomes part of your URL)
   - **Region**: closest to you
   - **Branch**: `main`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: **Free**
5. Scroll to **Environment Variables** and add two:
   - `SUPABASE_URL` → paste the Project URL from Step 1.6
   - `SUPABASE_KEY` → paste the `service_role` key from Step 1.7
6. Click **Create Web Service**. Render will build and deploy — this takes a few minutes the first time. When it's done, you'll see a URL like `https://character-thesaurus.onrender.com` at the top of the page. That's your tool.

**One quirk of the free tier worth knowing:** if the app sits unused for 15 minutes, Render puts it to sleep. The next time you open your link, the first load can take up to a minute while it wakes back up — totally normal, not an error. Everything you've saved is safe in Supabase the whole time either way.

---

## Using it going forward

- Bookmark your Render URL — that's your permanent link to the tool.
- Every change (new word, new category, edited notes) saves straight to Supabase automatically — you'll see a small "saved" indicator in the sidebar.
- Your data has no expiration date on Supabase's free tier as of this writing, but it's still wise to check Supabase's current free-tier terms occasionally, since cloud pricing pages change.
- If you ever want a plain-text backup of everything, Supabase's Table Editor (left sidebar → **Table Editor** → `app_state`) lets you view and export the raw data any time.

---

## Running it on your own computer first (optional, but a good way to test)

Before deploying, you can run this locally to make sure everything connects properly:

```bash
cd character-thesaurus-app
npm install
cp .env.example .env
```

Open `.env` in any text editor and paste in your real `SUPABASE_URL` and `SUPABASE_KEY` from Step 1. Then:

```bash
npm start
```

Open **http://localhost:3000** in your browser. If you see your characters, it's working — Render will behave the same way once deployed.
