import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Invalid prompt' }, { status: 400 })
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: `You are an expert AI prompt engineer. Your task is to optimize the following AI prompt to make it more effective, clear, and likely to produce better results.

When optimizing:
1. Improve clarity and specificity
2. Add structure if missing (e.g., sections for role, task, context, constraints)
3. Include relevant examples if helpful
4. Ensure the prompt is well-formatted using Markdown
5. Make it more actionable and concrete
6. Remove ambiguity while preserving the original intent

Original prompt:
${prompt}

Please provide the optimized version of this prompt. Return ONLY the optimized prompt without any explanation or meta-commentary.`,
        },
      ],
    })

    const optimizedPrompt = message.content[0].type === 'text' ? message.content[0].text : prompt

    return NextResponse.json({ optimizedPrompt })
  } catch (error) {
    console.error('Error optimizing prompt:', error)
    return NextResponse.json(
      { error: 'Failed to optimize prompt' },
      { status: 500 }
    )
  }
}
