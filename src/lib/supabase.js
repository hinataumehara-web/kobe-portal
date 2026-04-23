import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  throw new Error(
    '環境変数 VITE_SUPABASE_URL と VITE_SUPABASE_ANON_KEY が設定されていません。\n' +
    'プロジェクトルートに .env ファイルを作成してください。(.env.example を参照)'
  )
}

export const supabase = createClient(url, key)
