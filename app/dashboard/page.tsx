import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: prompts } = await supabase
    .from('prompts')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  return <DashboardClient initialPrompts={prompts || []} user={user} />
}
