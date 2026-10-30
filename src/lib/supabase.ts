import { createClient } from "@supabase/supabase-js";

// 교육용이라 로그인 없이 공개 키로 읽고 쓴다 (memos 표의 RLS 정책이 누구나 허용)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  { auth: { persistSession: false } },
);
