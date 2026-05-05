import { useState } from "react";
import type { PastExam, PastExamFilter } from "../../shared/types.js";

interface Props {
  exams: PastExam[];
  total: number;
  filter: PastExamFilter;
  onFilterChange: (filter: PastExamFilter) => void;
}

export function PastExamList({ exams, total, filter, onFilterChange }: Props): JSX.Element {
  const [nameDraft, setNameDraft] = useState(filter.course_name ?? "");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    onFilterChange({ ...filter, course_name: nameDraft || undefined });
  }

  return (
    <div>
      <div className="kp-filters">
        <form onSubmit={handleSearch} style={{ display: "flex", gap: 6 }}>
          <input
            type="text"
            placeholder="科目名で検索"
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
          />
          <button
            type="submit"
            style={{
              padding: "4px 10px",
              cursor: "pointer",
              border: "1px solid var(--color-border-primary, #d4d6db)",
              borderRadius: "var(--border-radius-sm, 4px)",
              background: "var(--color-background-primary, #fff)",
            }}
          >
            検索
          </button>
        </form>

        <label>
          年度:
          <input
            type="number"
            placeholder="例: 2024"
            value={filter.year ?? ""}
            onChange={(e) =>
              onFilterChange({
                ...filter,
                year: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            min={2000}
            max={2100}
          />
        </label>
      </div>

      <p className="kp-count">{total} 件</p>

      {exams.length === 0 ? (
        <p className="kp-muted">条件に一致する過去問がありません。</p>
      ) : (
        <div className="kp-exam-list">
          {exams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      )}
    </div>
  );
}

function ExamCard({ exam }: { exam: PastExam }): JSX.Element {
  return (
    <div className="kp-exam-card">
      <div className="kp-exam-card__header">
        <span className="kp-exam-card__course">{exam.course_name}</span>
        <span className="kp-exam-card__year">{exam.year} 年度</span>
      </div>

      <div className="kp-exam-card__meta">
        <span>投稿者: {exam.is_anonymous ? "匿名" : (exam.uploader_name ?? "不明")}</span>
        <span>{new Date(exam.created_at).toLocaleDateString("ja-JP")}</span>
        {exam.course_id && <span>科目ID: {exam.course_id}</span>}
      </div>

      {exam.comment && (
        <div className="kp-exam-card__comment">{exam.comment}</div>
      )}

      {exam.file_name && (
        <div className="kp-exam-card__file">
          📄 {exam.file_name}（ファイルあり）
        </div>
      )}
    </div>
  );
}
