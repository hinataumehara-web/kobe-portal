import type { CourseInfo, CourseInfoFilter } from "../../shared/types.js";

interface Props {
  items: CourseInfo[];
  total: number;
  filter: CourseInfoFilter;
  onFilterChange: (filter: CourseInfoFilter) => void;
}

const DIFFICULTIES = ["楽単", "普通", "難"] as const;

export function CourseInfoList({ items, total, filter, onFilterChange }: Props): JSX.Element {
  return (
    <div>
      <div className="kp-filters">
        <label>
          難易度:
          <select
            value={filter.difficulty ?? ""}
            onChange={(e) =>
              onFilterChange({ ...filter, difficulty: e.target.value || undefined })
            }
          >
            <option value="">すべて</option>
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </label>
      </div>

      <p className="kp-count">{total} 件</p>

      {items.length === 0 ? (
        <p className="kp-muted">条件に一致する授業攻略情報がありません。</p>
      ) : (
        <div className="kp-info-list">
          {items.map((item) => (
            <CourseInfoCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function CourseInfoCard({ item }: { item: CourseInfo }): JSX.Element {
  return (
    <div className="kp-info-card">
      <div className="kp-info-card__header">
        <span className="kp-info-card__course">
          {item.course_id ?? "—"}
        </span>
        {item.difficulty && <DifficultyBadge difficulty={item.difficulty} />}
      </div>

      <div className="kp-info-card__meta">
        {item.schedule && <span>🕐 {item.schedule}</span>}
        <span>投稿者: {item.is_anonymous ? "匿名" : (item.submitter_name ?? "不明")}</span>
        <span>{new Date(item.created_at).toLocaleDateString("ja-JP")}</span>
      </div>

      {item.tags && item.tags.length > 0 && (
        <div className="kp-tags" style={{ marginBottom: 6 }}>
          {item.tags.map((tag) => (
            <span key={tag} className="kp-tag">{tag}</span>
          ))}
        </div>
      )}

      {item.summary && (
        <div className="kp-info-card__summary">{item.summary}</div>
      )}

      {item.detail && (
        <div>
          <div className="kp-info-card__section-label">授業について</div>
          <div className="kp-info-card__detail">{item.detail}</div>
        </div>
      )}

      {item.exam_tips && (
        <div>
          <div className="kp-info-card__section-label">テスト対策</div>
          <div className="kp-info-card__exam-tips">{item.exam_tips}</div>
        </div>
      )}
    </div>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: string }): JSX.Element {
  const cls =
    difficulty === "楽単"
      ? "kp-badge--easy"
      : difficulty === "難"
      ? "kp-badge--hard"
      : "kp-badge--normal";
  return <span className={`kp-badge ${cls}`}>{difficulty}</span>;
}
