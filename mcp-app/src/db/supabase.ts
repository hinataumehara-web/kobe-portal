import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { CourseInfo, PastExam } from "../shared/types.js";

// トップレベルでは初期化しない。ツール呼び出し時に初めて検証・生成する。
let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "環境変数 SUPABASE_URL と SUPABASE_ANON_KEY が設定されていません。\n" +
        "Claude Desktop の設定ファイル (claude_desktop_config.json) の env セクションを確認してください。"
    );
  }
  _client = createClient(url, key);
  return _client;
}

export async function fetchCourseInfos(filter: {
  course_id?: string;
  difficulty?: string;
  limit?: number;
}): Promise<CourseInfo[]> {
  let q = getClient()
    .from("course_info")
    .select("*")
    .order("created_at", { ascending: false });

  if (filter.course_id) q = q.eq("course_id", filter.course_id);
  if (filter.difficulty) q = q.eq("difficulty", filter.difficulty);
  if (filter.limit) q = q.limit(filter.limit);

  const { data, error } = await q;
  if (error) throw new Error(`course_info 取得エラー: ${error.message}`);
  return (data ?? []) as CourseInfo[];
}

export async function fetchPastExams(filter: {
  course_id?: string;
  course_name?: string;
  year?: number;
  limit?: number;
}): Promise<PastExam[]> {
  let q = getClient()
    .from("past_exams")
    .select("*")
    .order("created_at", { ascending: false });

  if (filter.course_id) q = q.eq("course_id", filter.course_id);
  if (filter.course_name) q = q.ilike("course_name", `%${filter.course_name}%`);
  if (filter.year) q = q.eq("year", filter.year);
  if (filter.limit) q = q.limit(filter.limit);

  const { data, error } = await q;
  if (error) throw new Error(`past_exams 取得エラー: ${error.message}`);
  return (data ?? []) as PastExam[];
}
