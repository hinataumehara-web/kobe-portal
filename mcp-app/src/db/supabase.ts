import { createClient } from "@supabase/supabase-js";
import type { CourseInfo, PastExam } from "../shared/types.js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  throw new Error(
    "環境変数 SUPABASE_URL と SUPABASE_ANON_KEY が設定されていません。\n" +
      ".env を作成するか、Claude Desktop の env 設定を確認してください。"
  );
}

const supabase = createClient(url, key);

export async function fetchCourseInfos(filter: {
  course_id?: string;
  difficulty?: string;
  limit?: number;
}): Promise<CourseInfo[]> {
  let q = supabase
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
  let q = supabase
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
