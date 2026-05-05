/**
 * ポータル本体の courses.js を実行時に動的インポートするラッパー。
 * rootDir 制約を避けるため dynamic import + path.resolve を使う。
 *
 * 実行パス: dist/server/data/courses.js
 * 対象ファイル: ../../../../src/data/courses.js (= リポジトリルートの src/data/courses.js)
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Course } from "../shared/types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface CoursesModule {
  courses: Course[];
  CATEGORIES: Record<string, string>;
  SUBCATEGORIES: Record<string, string>;
}

let _cached: CoursesModule | null = null;

export async function loadCourses(): Promise<CoursesModule> {
  if (_cached) return _cached;
  // dist/server/data/ から4階層上がるとリポジトリルート
  const portalPath = path.resolve(__dirname, "../../../../src/data/courses.js");
  _cached = (await import(portalPath)) as CoursesModule;
  return _cached;
}
