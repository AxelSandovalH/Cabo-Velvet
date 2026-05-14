'use client'

import { useState } from 'react'
import { createSupabaseBrowser } from '@/lib/supabase-browser'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createSupabaseBrowser()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Credenciales incorrectas')
      setLoading(false)
      return
    }

    window.location.href = '/admin/dashboard'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080808]">
      <div className="w-full max-w-sm px-8 py-10 bg-[#111] rounded-2xl border border-white/10">
        <h1 className="text-2xl font-semibold text-[#F2EDE4] mb-8 text-center tracking-wide">
          Cabo Rico Admin
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-[#F2EDE4] placeholder-white/30 focus:outline-none focus:border-white/30"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-[#F2EDE4] placeholder-white/30 focus:outline-none focus:border-white/30"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#F2EDE4] text-[#080808] rounded-lg font-semibold hover:bg-white transition-colors disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
