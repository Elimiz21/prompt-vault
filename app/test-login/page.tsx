'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [status, setStatus] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('Processing...')

    const supabase = createClient()

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) {
          setStatus(`Signup error: ${error.message}`)
        } else if (data.session) {
          setStatus('Signup successful! Redirecting...')
          setTimeout(() => window.location.href = '/dashboard', 1000)
        } else {
          setStatus('Signup succeeded but no session - try logging in')
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
          setStatus(`Login error: ${error.message}`)
        } else if (data.session) {
          setStatus('Login successful! Redirecting...')
          setTimeout(() => window.location.href = '/dashboard', 1000)
        } else {
          setStatus('No session created')
        }
      }
    } catch (err) {
      setStatus(`Exception: ${err}`)
    }
  }

  return (
    <div style={{ padding: '50px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Test Auth Page</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <button type="submit" style={{ padding: '10px', fontSize: '16px', cursor: 'pointer' }}>
          {mode === 'login' ? 'Login' : 'Sign Up'}
        </button>
        <button
          type="button"
          onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          style={{ padding: '10px', fontSize: '14px', cursor: 'pointer' }}
        >
          Switch to {mode === 'login' ? 'Sign Up' : 'Login'}
        </button>
      </form>
      {status && <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0' }}>{status}</div>}
    </div>
  )
}
