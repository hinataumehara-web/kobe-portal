import { useState } from "react";
import type { Course, CourseFilter } from "../../shared/types.js";

interface Props {
  courses: Course[];
  total: number;
  filter: CourseFilter;
  categories: string[];
  subcategories: string[];
  onFilterChange: (filter: CourseFilter) => void;
}

export function CourseList({
  courses,
  total,
  filter,
  categories,
  subcategories,
  onFilterChange,
}: Props): JSX.Element {
  const [queryDraft, setQueryDraft] = useState(filter.query ?? "");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    onFilterChange({ ...filter, query: queryDraft || undefined });
  }

  return (
    <div>
      <div className="kp-filters">
        <form onSubmit={handleSearch} style={{ display: "flex", gap: 6 }}>
          <input
            type="text"
            placeholder="科目名・教員・シラバスで検索"
            value={queryDraft}
            onChange={(e) => setQueryDraft(e.target.value)}
          />
          <button type="submit" style={{ padding: "4px 10px", cursor: "pointer", border: "1px solid var(--color-border-primary, #d4d6db)", borderRadius: "var(--border-radius-sm, 4px)", background: "var(--color-background-primary, #fff)" }}>
            検索
          </button>
        </form>

        <label>
          分類:
          <select
            value={filter.category ?? ""}
            onChange={(e) =>
              onFilterChange({ ...filter, category: e.target.value || undefined })
            }
          >
            <option value="">すべて</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label>
          区分:
          <select
            value={filter.subcategory ?? ""}
            onChange={(e) =>
              onFilterChange({ ...filter, subcategory: e.target.value || undefined })
            }
          >
            <option value="">すべて</option>
            {subcategories.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>

      <p className="kp-count">{total} 件</p>

      {courses.length === 0 ? (
        <p className="kp-muted">該当する科目がありません。</p>
      ) : (
        <table className="kp-course-table">
          <thead>
            <tr>
              <th>科目名</th>
              <th>分類</th>
              <th>区分</th>
              <th>単位</th>
              <th>学年</th>
              <th>学期</th>
              <th>担当教員</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td>
                  <div className="kp-course__name">{course.name}</div>
                  {course.syllabus && (
                    <div className="kp-course__syllabus">{course.syllabus}</div>
                  )}
                </td>
                <td style={{ whiteSpace: "nowrap", fontSize: 11 }}>{course.category}</td>
                <td>
                  <SubcategoryBadge subcategory={course.subcategory} />
                </td>
                <td style={{ textAlign: "center" }}>{course.credits}</td>
                <td style={{ textAlign: "center" }}>{course.year ?? "—"}</td>
                <td style={{ whiteSpace: "nowrap" }}>{course.semester ?? "—"}</td>
                <td>{course.teacher ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function SubcategoryBadge({ subcategory }: { subcategory: string }): JSX.Element {
  const cls =
    subcategory === "必修"
      ? "kp-badge--required"
      : subcategory === "選択"
      ? "kp-badge--elective"
      : "kp-badge--free";
  return <span className={`kp-badge ${cls}`}>{subcategory}</span>;
}
