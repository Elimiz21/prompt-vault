# PromptVault Setup Guide

Complete step-by-step guide to get your PromptVault app running.

## Step 1: Install Dependencies

The dependencies are already installed, but if you need to reinstall:

```bash
npm install
```

## Step 2: Set Up Supabase

### Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub or create an account
4. Click "New Project"
5. Fill in:
   - **Project name:** PromptVault (or any name you like)
   - **Database password:** Create a strong password (save this!)
   - **Region:** Choose closest to you
   - **Pricing Plan:** Free tier is perfect
6. Click "Create new project"
7. Wait 2-3 minutes for setup to complete

### Get Your Supabase Credentials

1. Once the project is ready, go to **Project Settings** (gear icon in sidebar)
2. Click on **API** in the settings menu
3. You'll see:
   - **Project URL** - Copy this
   - **anon public** key - Copy this (under "Project API keys")

### Set Up the Database

1. In your Supabase dashboard, click on **SQL Editor** in the sidebar
2. Click "+ New query"
3. Copy the **entire contents** of the file `supabase-schema.sql` from your project
4. Paste it into the SQL editor
5. Click "Run" or press Cmd/Ctrl + Enter
6. You should see "Success. No rows returned" - that's good!

This creates:
- A `prompts` table to store all your prompts
- Row Level Security (RLS) policies so users can only see their own prompts
- Indexes for better performance
- An auto-update trigger for the `updated_at` field

### Configure Email Settings (Optional)

By default, Supabase requires email confirmation for new signups. For development, you can disable this:

1. Go to **Authentication** → **Providers** → **Email**
2. Toggle off "Confirm email"
3. Click "Save"

For production, keep email confirmation ON for security.

## Step 3: Get Your Anthropic API Key

1. Go to [https://console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Click on "API Keys" in the dashboard
4. Click "Create Key"
5. Give it a name (e.g., "PromptVault")
6. Copy the API key (starts with `sk-ant-`)
7. **IMPORTANT:** Save this key somewhere safe - you won't be able to see it again!

## Step 4: Configure Environment Variables

1. In your project root, you should see a `.env.local` file
2. Open it and replace the placeholder values:

```env
# Replace with your Supabase Project URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co

# Replace with your Supabase anon/public key
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Replace with your Anthropic API key
ANTHROPIC_API_KEY=sk-ant-api03-...
```

**Example:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoyMDE1NTc2MDAwfQ.abcdefghijklmnopqrstuvwxyz123456789
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxx
```

3. Save the file

## Step 5: Run the Development Server

```bash
npm run dev
```

You should see:
```
▲ Next.js 15.x.x
- Local:        http://localhost:3000
```

## Step 6: Test the Application

1. Open [http://localhost:3000](http://localhost:3000) in your browser
2. You should be redirected to the login page
3. Click "Don't have an account? Sign up"
4. Enter an email and password
5. Click "Sign Up"
6. If you disabled email confirmation, you'll be logged in immediately
7. If not, check your email and click the confirmation link

## Step 7: Create Your First Prompt

1. Once logged in, you'll see the dashboard
2. Click "New Prompt"
3. Enter a title (e.g., "Blog Post Writer")
4. Write your prompt:
   ```markdown
   # Role
   You are an expert blog writer...

   # Task
   Write an engaging blog post about...
   ```
5. Add tags (press Enter after each): `writing`, `blog`, `content`
6. Click "Optimize with Claude" to see AI improvements
7. Click "Save Prompt"

## Troubleshooting

### "Invalid API key" Error
- Double-check your `.env.local` file
- Make sure there are no spaces around the `=` signs
- Restart the dev server after changing env variables

### Can't log in / Auth errors
- Verify Supabase URL and key are correct
- Check that you ran the SQL schema
- Go to Supabase → Authentication → Users to see if your user was created

### "Failed to optimize" Error
- Verify your Anthropic API key is correct
- Check you have credits in your Anthropic account
- Check browser console for detailed error

### Changes not showing up
- Make sure you saved `.env.local`
- Restart the dev server (`Ctrl+C` then `npm run dev` again)
- Clear browser cache or use incognito mode

### Database errors
- Make sure you ran the entire `supabase-schema.sql` file
- Check Supabase → Database → Tables to see if `prompts` table exists
- Verify RLS policies are enabled

## Next Steps

- Customize the colors in `app/globals.css`
- Add more features like categories, favorites, or sharing
- Deploy to Vercel (see README.md)
- Set up custom domain

## Support

If you run into issues:
1. Check the error message in browser console (F12 → Console)
2. Check the terminal where dev server is running
3. Verify all environment variables are set correctly
4. Make sure Supabase project is active (not paused)

---

Enjoy your PromptVault! 🚀
