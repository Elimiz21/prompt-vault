'use client'

import { useState } from 'react'
import { Prompt } from '@/lib/types'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Plus,
  Search,
  Sparkles,
  LogOut,
  Calendar,
  Edit,
  Trash2,
  MoreVertical,
  FileText,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import PromptEditor from '@/components/PromptEditor'

interface DashboardClientProps {
  initialPrompts: Prompt[]
  user: User
}

export default function DashboardClient({ initialPrompts, user }: DashboardClientProps) {
  const [prompts, setPrompts] = useState<Prompt[]>(initialPrompts)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const handleCreatePrompt = () => {
    setSelectedPrompt(null)
    setIsCreating(true)
    setIsEditorOpen(true)
  }

  const handleEditPrompt = (prompt: Prompt) => {
    setSelectedPrompt(prompt)
    setIsCreating(false)
    setIsEditorOpen(true)
  }

  const handleDeletePrompt = async (promptId: string) => {
    if (!confirm('Are you sure you want to delete this prompt?')) return

    const { error } = await supabase.from('prompts').delete().eq('id', promptId)

    if (!error) {
      setPrompts(prompts.filter((p) => p.id !== promptId))
    }
  }

  const handleSavePrompt = async (promptData: { title: string; content: string; tags: string[] }) => {
    if (isCreating) {
      const { data, error } = await supabase
        .from('prompts')
        .insert({
          user_id: user.id,
          ...promptData,
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating prompt:', error)
      } else if (data) {
        setPrompts([data, ...prompts])
      }
    } else if (selectedPrompt) {
      const { data, error } = await supabase
        .from('prompts')
        .update(promptData)
        .eq('id', selectedPrompt.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating prompt:', error)
      } else if (data) {
        setPrompts(prompts.map((p) => (p.id === data.id ? data : p)))
      }
    }

    setIsEditorOpen(false)
  }

  const filteredPrompts = prompts.filter(
    (prompt) =>
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#000000]">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-[#007AFF]/20 via-[#5856D6]/20 to-transparent dark:from-[#0A84FF]/30 dark:via-[#5E5CE6]/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#AF52DE]/20 via-[#FF2D55]/20 to-transparent dark:from-[#BF5AF2]/30 dark:via-[#FF375F]/30 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative border-b border-black/5 dark:border-white/10 backdrop-blur-2xl bg-white/40 dark:bg-black/40 sticky top-0 z-50 shadow-sm dark:shadow-white/5">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#007AFF] via-[#5856D6] to-[#AF52DE] rounded-2xl shadow-lg shadow-[#007AFF]/25">
              <Sparkles className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-[22px] font-semibold tracking-tight bg-gradient-to-r from-[#007AFF] via-[#5856D6] to-[#AF52DE] bg-clip-text text-transparent">
                PromptVault
              </h1>
              <p className="text-[13px] text-gray-600 dark:text-gray-400 font-medium">Your AI Prompt Library</p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-11 w-11 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                <Avatar className="h-11 w-11">
                  <AvatarFallback className="bg-gradient-to-br from-[#007AFF] via-[#5856D6] to-[#AF52DE] text-white text-[15px] font-semibold">
                    {user.email?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-white/80 dark:bg-black/80 backdrop-blur-2xl border-black/10 dark:border-white/10 shadow-2xl">
              <div className="flex items-center justify-start gap-3 p-3">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-semibold text-[14px]">{user.email}</p>
                  <p className="text-[12px] text-gray-600 dark:text-gray-400">Manage your prompts</p>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-black/5 dark:bg-white/10" />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-600 dark:text-red-400 m-1 rounded-lg">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative container mx-auto px-6 py-12">
        {/* Search and Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-[18px] w-[18px] text-gray-400 dark:text-gray-500" />
            <Input
              placeholder="Search prompts by title, content, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-[52px] bg-white/60 dark:bg-black/40 backdrop-blur-xl border-black/10 dark:border-white/10 rounded-2xl text-[15px] placeholder:text-gray-500 dark:placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:border-blue-500/40 transition-all shadow-sm"
            />
          </div>
          <Button
            onClick={handleCreatePrompt}
            size="lg"
            className="h-[52px] px-6 bg-gradient-to-br from-[#007AFF] via-[#5856D6] to-[#AF52DE] hover:from-[#0051D5] hover:via-[#3634A3] hover:to-[#8944AB] text-white rounded-2xl shadow-lg shadow-[#007AFF]/25 hover:shadow-xl hover:shadow-[#007AFF]/30 transition-all font-semibold text-[15px] active:scale-[0.98]"
          >
            <Plus className="mr-2 h-5 w-5" strokeWidth={2.5} />
            New Prompt
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          <Card className="border-black/5 dark:border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="pb-4">
              <CardTitle className="text-[13px] font-semibold text-gray-600 dark:text-gray-400 tracking-wide uppercase">
                Total Prompts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-[48px] font-bold tracking-tight bg-gradient-to-br from-[#007AFF] to-[#5856D6] bg-clip-text text-transparent">
                {prompts.length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-black/5 dark:border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="pb-4">
              <CardTitle className="text-[13px] font-semibold text-gray-600 dark:text-gray-400 tracking-wide uppercase">
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-[48px] font-bold tracking-tight bg-gradient-to-br from-[#5856D6] to-[#AF52DE] bg-clip-text text-transparent">
                {
                  prompts.filter(
                    (p) => new Date(p.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  ).length
                }
              </div>
            </CardContent>
          </Card>
          <Card className="border-black/5 dark:border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="pb-4">
              <CardTitle className="text-[13px] font-semibold text-gray-600 dark:text-gray-400 tracking-wide uppercase">
                Tags Used
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-[48px] font-bold tracking-tight bg-gradient-to-br from-[#AF52DE] to-[#FF2D55] bg-clip-text text-transparent">
                {new Set(prompts.flatMap((p) => p.tags)).size}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Prompts Grid */}
        {filteredPrompts.length === 0 ? (
          <Card className="border-dashed border-2 border-black/10 dark:border-white/10 bg-white/40 dark:bg-black/20 backdrop-blur-xl">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <FileText className="h-20 w-20 text-gray-400 dark:text-gray-600 mb-6" strokeWidth={1.5} />
              <h3 className="text-2xl font-semibold mb-3 tracking-tight">
                {searchQuery ? 'No prompts found' : 'No prompts yet'}
              </h3>
              <p className="text-[15px] text-gray-600 dark:text-gray-400 text-center mb-8 max-w-sm">
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'Create your first prompt to get started'}
              </p>
              {!searchQuery && (
                <Button
                  onClick={handleCreatePrompt}
                  className="h-[48px] px-6 bg-gradient-to-br from-[#007AFF] via-[#5856D6] to-[#AF52DE] hover:from-[#0051D5] hover:via-[#3634A3] hover:to-[#8944AB] text-white rounded-2xl shadow-lg shadow-[#007AFF]/25 font-semibold text-[15px] active:scale-[0.98] transition-all"
                >
                  <Plus className="mr-2 h-5 w-5" strokeWidth={2.5} />
                  Create Prompt
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPrompts.map((prompt) => (
              <Card
                key={prompt.id}
                className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-black/5 dark:border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur-xl hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.99]"
                onClick={() => handleEditPrompt(prompt)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-[17px] font-semibold mb-2 line-clamp-1 tracking-tight">{prompt.title}</CardTitle>
                      <CardDescription className="flex items-center text-[13px] text-gray-600 dark:text-gray-400">
                        <Calendar className="h-3.5 w-3.5 mr-1.5" strokeWidth={2} />
                        {formatDate(prompt.updated_at)}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 -mr-2">
                          <MoreVertical className="h-4 w-4" strokeWidth={2} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white/80 dark:bg-black/80 backdrop-blur-2xl border-black/10 dark:border-white/10 shadow-2xl">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation()
                          handleEditPrompt(prompt)
                        }} className="m-1 rounded-lg">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-black/5 dark:bg-white/10" />
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeletePrompt(prompt.id)
                          }}
                          className="text-red-600 dark:text-red-400 m-1 rounded-lg"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-[14px] leading-relaxed text-gray-700 dark:text-gray-300 line-clamp-3 mb-4">
                    {prompt.content}
                  </p>
                  {prompt.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {prompt.tags.slice(0, 3).map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-[12px] font-medium px-2.5 py-1 bg-[#007AFF]/10 dark:bg-[#0A84FF]/20 text-[#007AFF] dark:text-[#0A84FF] border-0 rounded-lg"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {prompt.tags.length > 3 && (
                        <Badge variant="secondary" className="text-[12px] font-medium px-2.5 py-1 rounded-lg">
                          +{prompt.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-6xl h-[92vh] p-0 bg-white/95 dark:bg-black/95 backdrop-blur-3xl border-black/10 dark:border-white/10 shadow-2xl rounded-3xl overflow-hidden">
          <DialogTitle className="sr-only">
            {isCreating ? 'Create New Prompt' : 'Edit Prompt'}
          </DialogTitle>
          <PromptEditor
            prompt={selectedPrompt}
            onSave={handleSavePrompt}
            onCancel={() => setIsEditorOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
