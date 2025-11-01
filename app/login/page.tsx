'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Mail, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        })
        if (error) throw error
        setMessage({
          type: 'success',
          text: 'Password reset email sent! Check your inbox (and spam folder).'
        })
        setLoading(false)
        return
      }

      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })

        console.log('Signup result:', { data, error })

        if (error) throw error

        // With email confirmation disabled, user should have a session immediately
        if (data?.session) {
          console.log('Signup successful with session, syncing to server...')

          // Must sync session to server-side cookies for middleware
          const response = await fetch('/api/auth/set-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              access_token: data.session.access_token,
              refresh_token: data.session.refresh_token,
            }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Failed to sync session')
          }

          console.log('Session synced to server, redirecting...')
          setMessage({ type: 'success', text: 'Account created! Redirecting...' })

          // Use window.location for full page reload with cookies
          await new Promise(resolve => setTimeout(resolve, 100))
          window.location.href = '/dashboard'
        } else {
          setMessage({
            type: 'error',
            text: 'Signup succeeded but no session created. Please try logging in.'
          })
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        console.log('Login attempt:', { data, error })

        if (error) {
          console.error('Login error:', error)
          throw error
        }

        if (!data.session) {
          throw new Error('Login failed: No session created.')
        }

        console.log('Login successful, syncing to server...')

        // Must sync session to server-side cookies for middleware
        const response = await fetch('/api/auth/set-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to sync session')
        }

        console.log('Session synced to server, redirecting...')
        setMessage({ type: 'success', text: 'Logged in successfully! Redirecting...' })

        // Use window.location for full page reload with cookies
        await new Promise(resolve => setTimeout(resolve, 100))
        window.location.href = '/dashboard'
      }
    } catch (error) {
      console.error('Auth error:', error)
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'An error occurred' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-gray-900 dark:via-purple-950 dark:to-violet-950 p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300 dark:bg-purple-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-fuchsia-300 dark:bg-fuchsia-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-violet-300 dark:bg-violet-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-2">
            PromptVault
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your AI prompt library, beautifully organized
          </p>
        </div>

        {/* Auth Card */}
        <Card className="border-none shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              {isForgotPassword ? 'Reset Password' : isSignUp ? 'Create an account' : 'Welcome back'}
            </CardTitle>
            <CardDescription>
              {isForgotPassword
                ? 'Enter your email to receive a password reset link'
                : isSignUp
                ? 'Enter your email to create your account'
                : 'Enter your credentials to access your prompts'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11"
                    required
                  />
                </div>
              </div>
              {!isForgotPassword && (
                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-11"
                      required
                    />
                  </div>
                </div>
              )}

              {message && (
                <div
                  className={`p-3 rounded-lg text-sm ${
                    message.type === 'error'
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                      : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                  }`}
                >
                  {message.text}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
                disabled={loading}
              >
                {loading ? 'Loading...' : isForgotPassword ? 'Send Reset Email' : isSignUp ? 'Sign Up' : 'Sign In'}
              </Button>

              <div className="text-center text-sm space-y-2">
                {!isForgotPassword && !isSignUp && (
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(true)
                        setMessage(null)
                      }}
                      className="text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp)
                    setIsForgotPassword(false)
                    setMessage(null)
                  }}
                  className="text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 font-medium"
                >
                  {isForgotPassword
                    ? 'Back to Sign In'
                    : isSignUp
                    ? 'Already have an account? Sign in'
                    : "Don't have an account? Sign up"}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-8">
          Powered by Claude AI • Built with Next.js & Supabase
        </p>
      </div>
    </div>
  )
}
