# PromptVault - Project Overview

## 🎯 What We Built

A beautiful, full-featured AI prompt library application where users can:
- Create and store AI prompts with markdown support
- Organize prompts with tags
- Search and filter their prompt collection
- **Optimize prompts using Claude Sonnet 4.5 AI**
- View their library in a stunning card-based interface

## 🎨 Design Philosophy

**Not Your Typical AI Interface** - We avoided the standard chat interface and created something unique:
- **Gradient-based design** with violet, purple, and fuchsia color scheme
- **Glassmorphism effects** with backdrop blur and transparency
- **Animated backgrounds** with floating blob animations
- **Card-based grid layout** for the prompt library
- **Beautiful markdown editor** with live preview
- **Smooth hover effects** and transitions throughout

## 📂 Project Structure

```
prompt-library/
├── app/
│   ├── api/
│   │   └── optimize/
│   │       └── route.ts           # Claude API integration for prompt optimization
│   ├── dashboard/
│   │   ├── page.tsx              # Server component, fetches prompts
│   │   └── DashboardClient.tsx   # Client component with all the UI logic
│   ├── login/
│   │   └── page.tsx              # Beautiful auth page with gradients
│   ├── globals.css               # Global styles + custom animations
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page (redirects to dashboard/login)
├── components/
│   ├── ui/                       # Shadcn UI components
│   └── PromptEditor.tsx          # Main editor with markdown preview
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser Supabase client
│   │   ├── server.ts             # Server Supabase client
│   │   └── middleware.ts         # Supabase middleware helpers
│   ├── types.ts                  # TypeScript types
│   └── utils.ts                  # Utility functions
├── middleware.ts                  # Next.js middleware for auth
├── supabase-schema.sql           # Database schema with RLS
├── .env.local                    # Environment variables (not in git)
├── .env.example                  # Example env file
└── README.md                     # Full documentation
```

## 🔑 Key Features

### 1. Authentication
- **Location:** `app/login/page.tsx`, `middleware.ts`
- Email/password authentication via Supabase
- Secure session management
- Auto-redirect based on auth state
- Beautiful gradient login page with animated background

### 2. Prompt Library Dashboard
- **Location:** `app/dashboard/`
- Card-based grid layout
- Real-time search across title, content, and tags
- Stats cards showing total prompts, weekly activity, and tag count
- Hover effects and smooth animations
- Responsive design for all screen sizes

### 3. Markdown Editor
- **Location:** `components/PromptEditor.tsx`
- Full markdown support with live preview
- Auto-resizing textarea
- Tag management (press Enter to add tags)
- Character and word count
- Copy to clipboard functionality
- Edit/Preview mode toggle

### 4. AI Optimization (★ Star Feature)
- **Location:** `app/api/optimize/route.ts`
- Integration with Claude Sonnet 4.5 API
- Click "Optimize with Claude" button in the editor
- AI analyzes and improves your prompt:
  - Adds clarity and structure
  - Includes helpful sections (role, task, context)
  - Removes ambiguity
  - Preserves original intent
- Loading state with spinner

### 5. CRUD Operations
- **Create:** New prompts with title, content, tags
- **Read:** View all your prompts in dashboard
- **Update:** Edit existing prompts
- **Delete:** Remove prompts with confirmation

### 6. Search & Filter
- Real-time search as you type
- Searches across:
  - Prompt titles
  - Prompt content
  - Tags
- Shows "No prompts found" state when no matches

## 🔒 Security Features

1. **Row Level Security (RLS)**
   - Users can only see/edit their own prompts
   - Database-level security via Supabase

2. **Protected Routes**
   - Middleware checks auth on every request
   - Auto-redirect to login if not authenticated

3. **API Key Protection**
   - Anthropic API key stored server-side only
   - Never exposed to client

4. **Environment Variables**
   - All secrets in `.env.local` (gitignored)
   - Example file provided for setup

## 🎨 UI/UX Highlights

### Color Scheme
- **Primary:** Violet (600-700)
- **Secondary:** Fuchsia (600-700)
- **Accents:** Purple (500-600)
- **Background:** Gradient from violet-50 via purple-50 to fuchsia-50
- **Dark Mode:** Fully supported with darker versions

### Animations
1. **Blob Animation** - Floating gradient blobs on login page
2. **Card Hover** - Scale and shadow on prompt cards
3. **Button Transitions** - Smooth gradient transitions
4. **Loading States** - Spinner for optimize button

### Components Used
- **Shadcn UI:** For consistent, accessible components
- **Lucide Icons:** For beautiful icons
- **React Markdown:** For markdown rendering
- **Textarea Autosize:** For auto-growing textarea

## 📊 Database Schema

```sql
Table: prompts
- id (UUID, primary key)
- user_id (UUID, references auth.users)
- title (VARCHAR 255)
- content (TEXT)
- tags (TEXT[])
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP, auto-updates)

Indexes:
- prompts_user_id_idx
- prompts_created_at_idx

RLS Policies:
- Users can SELECT/INSERT/UPDATE/DELETE only their own rows
```

## 🚀 Tech Stack Rationale

### Why Next.js 15?
- Latest features like Server Components
- App Router for better organization
- Built-in API routes
- Excellent performance

### Why Supabase?
- PostgreSQL database
- Built-in authentication
- Row Level Security
- Generous free tier
- Real-time capabilities (if needed later)

### Why Tailwind + Shadcn?
- Rapid development
- Consistent design system
- Accessible components
- Easy customization
- Beautiful out of the box

### Why Claude API?
- Best-in-class prompt engineering
- Latest Sonnet 4.5 model
- Reliable API
- Great for text analysis and improvement

## 🔄 Data Flow

### Creating a Prompt
1. User clicks "New Prompt"
2. Dialog opens with PromptEditor
3. User writes prompt in markdown
4. Optional: Click "Optimize" → API call to Claude → Content updated
5. User adds tags
6. Click "Save" → Supabase INSERT → Dashboard updates

### Viewing Prompts
1. Dashboard page loads (server component)
2. Fetches prompts from Supabase with auth
3. Passes to DashboardClient
4. Client renders cards with search/filter

### Optimizing a Prompt
1. User clicks "Optimize with Claude"
2. POST to `/api/optimize` with prompt content
3. API calls Claude with optimization instructions
4. Claude returns improved version
5. Editor content updates with new version

## 🎯 Future Enhancements (Ideas)

1. **Categories/Folders** - Organize prompts into folders
2. **Favorites** - Star important prompts
3. **Sharing** - Share prompts with other users
4. **Templates** - Pre-made prompt templates
5. **Export** - Export to JSON/CSV
6. **Version History** - Track prompt changes over time
7. **Prompt Testing** - Test prompts against different AI models
8. **Collaborative Editing** - Share and edit with team
9. **Prompt Analytics** - Track which prompts you use most
10. **AI Suggestions** - AI suggests related prompts

## 📈 Performance Considerations

- **Server Components** - Fetch data on server for faster initial load
- **Static Generation** - Most pages can be cached
- **Lazy Loading** - Images and components load on demand
- **Optimized Images** - Next.js automatic image optimization
- **Database Indexes** - Fast queries with proper indexes

## 🧪 Testing Recommendations

Before deploying:
1. Test signup/login flow
2. Create multiple prompts
3. Test search with various queries
4. Test optimize feature with different prompt types
5. Test on mobile devices
6. Test dark mode
7. Test with slow network (optimize loading states)

## 📝 Environment Setup Checklist

- [ ] Supabase project created
- [ ] Database schema executed
- [ ] Supabase credentials in .env.local
- [ ] Anthropic API key obtained
- [ ] API key in .env.local
- [ ] Email confirmation settings configured
- [ ] npm dependencies installed
- [ ] Dev server running successfully

## 🎓 Learning Resources

If you want to extend this project:
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Anthropic API Docs](https://docs.anthropic.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn UI](https://ui.shadcn.com)

---

Built with ❤️ - Happy coding! 🚀
