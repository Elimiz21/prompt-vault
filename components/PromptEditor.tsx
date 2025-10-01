'use client'

import { useState, useEffect } from 'react'
import { Prompt } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import TextareaAutosize from 'react-textarea-autosize'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  Save,
  X,
  Sparkles,
  Eye,
  Edit3,
  Tag,
  Loader2,
  Copy,
  Check,
} from 'lucide-react'

interface PromptEditorProps {
  prompt: Prompt | null
  onSave: (data: { title: string; content: string; tags: string[] }) => void
  onCancel: () => void
}

export default function PromptEditor({ prompt, onSave, onCancel }: PromptEditorProps) {
  const [title, setTitle] = useState(prompt?.title || '')
  const [content, setContent] = useState(prompt?.content || '')
  const [tags, setTags] = useState<string[]>(prompt?.tags || [])
  const [tagInput, setTagInput] = useState('')
  const [isPreview, setIsPreview] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    if (prompt) {
      setTitle(prompt.title)
      setContent(prompt.content)
      setTags(prompt.tags)
    }
  }, [prompt])

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
      }
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleOptimize = async () => {
    if (!content.trim()) return

    setIsOptimizing(true)
    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: content }),
      })

      if (!response.ok) throw new Error('Failed to optimize')

      const data = await response.json()
      setContent(data.optimizedPrompt)

      // Auto-save after optimization
      if (title.trim()) {
        onSave({ title, content: data.optimizedPrompt, tags })
      }
    } catch (error) {
      console.error('Error optimizing prompt:', error)
      alert('Failed to optimize prompt. Please try again.')
    } finally {
      setIsOptimizing(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      alert('Please provide both a title and content for your prompt.')
      return
    }
    onSave({ title, content, tags })
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-8 py-6 border-b border-black/5 dark:border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[28px] font-semibold tracking-tight bg-gradient-to-r from-[#007AFF] via-[#5856D6] to-[#AF52DE] bg-clip-text text-transparent">
            {prompt ? 'Edit Prompt' : 'Create New Prompt'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onCancel} className="rounded-full hover:bg-black/5 dark:hover:bg-white/10">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Title Input */}
        <Input
          placeholder="Untitled Prompt"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-[20px] font-semibold border-0 focus-visible:ring-0 px-0 h-auto bg-transparent"
        />

        {/* Tags */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              placeholder="Add tags (press Enter)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="h-9 text-[14px] bg-black/5 dark:bg-white/5 border-0 focus-visible:ring-1 focus-visible:ring-[#007AFF]/40 rounded-xl"
            />
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-[12px] font-medium px-3 py-1.5 bg-[#007AFF]/10 dark:bg-[#0A84FF]/20 text-[#007AFF] dark:text-[#0A84FF] cursor-pointer hover:bg-[#007AFF]/20 dark:hover:bg-[#0A84FF]/30 border-0 rounded-lg transition-colors"
                  onClick={() => handleRemoveTag(tag)}
                >
                  {tag}
                  <X className="ml-1.5 h-3 w-3" />
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="shrink-0 px-8 py-4 border-b border-black/5 dark:border-white/10 flex items-center justify-between bg-black/[0.02] dark:bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <Button
            variant={isPreview ? 'ghost' : 'secondary'}
            size="sm"
            onClick={() => setIsPreview(false)}
            className="rounded-xl h-9 px-4"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant={isPreview ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setIsPreview(true)}
            className="rounded-xl h-9 px-4"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Separator orientation="vertical" className="h-6 mx-2 bg-black/10 dark:bg-white/10" />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="text-gray-600 dark:text-gray-400 rounded-xl h-9 px-4"
          >
            {isCopied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </>
            )}
          </Button>
        </div>
        <Button
          onClick={handleOptimize}
          disabled={isOptimizing || !content.trim()}
          size="sm"
          className="h-9 px-5 bg-gradient-to-br from-[#007AFF] via-[#5856D6] to-[#AF52DE] hover:from-[#0051D5] hover:via-[#3634A3] hover:to-[#8944AB] text-white rounded-xl shadow-lg shadow-[#007AFF]/20 font-semibold text-[14px] active:scale-[0.98] transition-all"
        >
          {isOptimizing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Optimizing...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Optimize with Claude
            </>
          )}
        </Button>
      </div>

      {/* Editor/Preview Area - Fixed scrolling */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {isPreview ? (
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || '*No content to preview*'}</ReactMarkdown>
          </div>
        ) : (
          <TextareaAutosize
            placeholder="Write your AI prompt here... You can use Markdown formatting.

Example:
# Role
You are an expert copywriter...

# Task
Create engaging content that...

# Context
The target audience is..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[500px] resize-none outline-none bg-transparent text-[15px] leading-relaxed font-mono"
            autoFocus
          />
        )}
      </div>

      {/* Footer */}
      <div className="shrink-0 px-8 py-5 border-t border-black/5 dark:border-white/10 flex items-center justify-between bg-black/[0.02] dark:bg-white/[0.02]">
        <div className="text-[13px] font-medium text-gray-600 dark:text-gray-400">
          {content.length} characters • {content.split(/\s+/).filter(Boolean).length} words
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onCancel} className="h-10 px-5 rounded-xl font-medium">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="h-10 px-5 bg-gradient-to-br from-[#007AFF] via-[#5856D6] to-[#AF52DE] hover:from-[#0051D5] hover:via-[#3634A3] hover:to-[#8944AB] text-white rounded-xl shadow-lg shadow-[#007AFF]/20 font-semibold text-[14px] active:scale-[0.98] transition-all"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Prompt
          </Button>
        </div>
      </div>
    </div>
  )
}
