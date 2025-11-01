import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { access_token, refresh_token } = body

    console.log('Set session API called')
    console.log('Has access_token:', !!access_token)
    console.log('Has refresh_token:', !!refresh_token)

    if (!access_token || !refresh_token) {
      console.error('Missing tokens in request body:', body)
      return NextResponse.json(
        { error: 'Missing tokens' },
        { status: 400 }
      )
    }

    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    })

    if (error) {
      console.error('Error setting session:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }

    console.log('Session set successfully on server')
    return NextResponse.json({ success: true, user: data.user })
  } catch (error) {
    console.error('Session API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
