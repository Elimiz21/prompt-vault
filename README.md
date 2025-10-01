# PromptVault - AI Prompt Library

A beautiful, modern AI prompt library application built with Next.js 15, Supabase, Tailwind CSS, and Shadcn UI. Save, organize, and optimize your AI prompts with Claude AI.

![PromptVault](https://img.shields.io/badge/Next.js-15-black)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## ✨ Features

- 🎨 **Beautiful UI** - Stunning gradient design with glassmorphism effects
- 📝 **Markdown Editor** - Rich markdown editor with live preview
- ✨ **AI Optimization** - Optimize your prompts using Claude Sonnet 4.5 API
- 🏷️ **Tags & Search** - Organize prompts with tags and powerful search
- 🔐 **Authentication** - Secure auth with Supabase
- 📊 **Dashboard Stats** - Track your prompt library growth
- 🌙 **Dark Mode** - Beautiful dark mode support
- 📱 **Responsive** - Works perfectly on all devices

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account ([signup here](https://supabase.com))
- An Anthropic API key ([get one here](https://console.anthropic.com))

### 1. Clone and Install

```bash
cd prompt-library
npm install
```

### 2. Set Up Supabase

1. Create a new project in [Supabase](https://supabase.com)
2. Go to Project Settings → API to get your credentials
3. Go to SQL Editor and run the SQL from `supabase-schema.sql`:

```sql
-- This will create the prompts table with RLS policies
-- Copy the entire contents of supabase-schema.sql and run it
```

### 3. Configure Environment Variables

Update `.env.local` with your credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Anthropic API Key
ANTHROPIC_API_KEY=sk-ant-...your-key
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

### Creating Your First Prompt

1. Sign up for an account
2. Click "New Prompt" on the dashboard
3. Add a title and write your prompt (Markdown supported!)
4. Add tags for organization
5. Click "Save Prompt"

### Optimizing Prompts

1. Open any prompt in the editor
2. Click the "Optimize with Claude" button
3. Claude will analyze and improve your prompt
4. Review the changes and save

### Organizing Prompts

- Use tags to categorize prompts
- Search by title, content, or tags
- View stats about your prompt library

## 🏗️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn UI
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **AI:** Anthropic Claude API
- **Markdown:** react-markdown + remark-gfm

## 📁 Project Structure

```
prompt-library/
├── app/
│   ├── api/
│   │   └── optimize/          # Claude API integration
│   ├── dashboard/             # Main dashboard
│   ├── login/                 # Auth pages
│   └── page.tsx               # Home redirect
├── components/
│   ├── ui/                    # Shadcn UI components
│   └── PromptEditor.tsx       # Main editor component
├── lib/
│   ├── supabase/              # Supabase client setup
│   ├── types.ts               # TypeScript types
│   └── utils.ts               # Utility functions
└── supabase-schema.sql        # Database schema
```

## 🎨 Features Breakdown

### Authentication
- Email/password signup and login
- Secure session management with Supabase
- Protected routes with middleware
- Auto-redirect based on auth state

### Prompt Editor
- Full markdown support with live preview
- Syntax highlighting for code blocks
- Tag management
- Character and word count
- Copy to clipboard
- Auto-save functionality

### AI Optimization
- Claude Sonnet 4.5 integration
- Intelligent prompt improvement
- Preserves original intent
- Adds structure and clarity

### Dashboard
- Beautiful card-based grid layout
- Real-time search and filtering
- Quick stats overview
- Hover animations and effects
- Responsive design

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- User-specific data isolation
- Secure API routes
- Environment variable protection

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel settings
4. Deploy!

### Environment Variables for Production

Make sure to add all environment variables from `.env.local` to your hosting platform.

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit PRs.

## 💡 Tips

- Use markdown formatting to structure your prompts
- Add specific tags for easy filtering
- Use the optimize feature to improve prompt quality
- Export your prompts by copying them to clipboard

## 🐛 Troubleshooting

### Authentication Issues
- Make sure your Supabase URL and keys are correct
- Check that RLS policies are properly set up
- Verify email confirmation settings in Supabase

### API Errors
- Verify your Anthropic API key is valid
- Check API key has sufficient credits
- Ensure API route is accessible

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js, Supabase, and Claude AI
