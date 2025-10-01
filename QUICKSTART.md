# ⚡ Quick Start Guide

Get your PromptVault running in 5 minutes!

## 1️⃣ Set Up Supabase (2 minutes)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click **"New Project"**
3. Fill in:
   - Name: `PromptVault`
   - Password: (create a strong one)
   - Region: (closest to you)
4. Click **"Create new project"** and wait ~2 minutes

5. Once ready, go to **SQL Editor** (left sidebar)
6. Click **"+ New query"**
7. Copy and paste the entire `supabase-schema.sql` file
8. Click **"Run"** (or Cmd/Ctrl + Enter)

9. Go to **Settings** → **API**
10. Copy:
    - **Project URL**
    - **anon public** key

## 2️⃣ Get Anthropic API Key (1 minute)

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or login
3. Go to **API Keys**
4. Click **"Create Key"**
5. Name it "PromptVault"
6. Copy the key (starts with `sk-ant-`)

## 3️⃣ Configure Your App (1 minute)

1. Open `.env.local` in your project
2. Replace the placeholders:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...your-key
ANTHROPIC_API_KEY=sk-ant-api03...your-key
```

## 4️⃣ Run It! (30 seconds)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 5️⃣ Try It Out!

1. **Sign up** with any email/password
2. Click **"New Prompt"**
3. Write a prompt like:
   ```
   Write a blog post about AI
   ```
4. Click **"Optimize with Claude"** 🪄
5. Watch it improve!
6. Add tags: `writing`, `ai`, `blog`
7. Click **"Save Prompt"**

## 🎉 You're Done!

Your PromptVault is ready to use!

---

## 💡 Tips

- Press **Enter** to add tags
- Use **markdown** in your prompts
- Toggle **Preview** to see formatted view
- Use **Search** to find prompts
- Click cards to edit them

## ⚠️ Troubleshooting

**Can't log in?**
- Check your Supabase URL and key in `.env.local`
- Make sure you ran the SQL schema
- Restart the dev server

**Optimize doesn't work?**
- Verify your Anthropic API key
- Check you have credits
- Check browser console for errors

**Need more help?**
See `SETUP.md` for detailed instructions.

---

Enjoy! 🚀
