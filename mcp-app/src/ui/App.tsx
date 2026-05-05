import { useEffect, useMemo, useState } from "react";
import { useApp } from "@modelcontextprotocol/ext-apps/react";
import {
  applyDocumentTheme,
  applyHostFonts,
  applyHostStyleVariables,
} from "@modelcontextprotocol/ext-apps";
import type {
  CourseFilter,
  CourseInfoFilter,
  Payload,
  PastExamFilter,
} from "../shared/types.js";
import { CourseList } from "./components/CourseList.js";
import { CourseInfoList } from "./components/CourseInfoList.js";
import { PastExamList } from "./components/PastExamList.js";
import { Toolbar } from "./components/Toolbar.js";
import "./styles.css";

type View =
  | { name: "loading" }
  | { name: "course-list"; payload: Extract<Payload, { kind: "course-list" }> }
  | { name: "course-info-list"; payload: Extract<Payload, { kind: "course-info-list" }> }
  | { name: "past-exam-list"; payload: Extract<Payload, { kind: "past-exam-list" }> }
  | { name: "error"; message: string };

export function App(): JSX.Element {
  const [view, setView] = useState<View>({ name: "loading" });
  const [busy, setBusy] = useState(false);

  const { app, isConnected, error } = useApp({
    appInfo: { name: "kobe-portal", version: "0.1.0" },
    capabilities: {},
    onAppCreated: (instance) => {
      instance.ontoolresult = (result) => {
        const payload = result.structuredContent as Payload | undefined;
        if (!payload) {
          setView({ name: "error", message: "サーバーから構造化データを受け取れませんでした。" });
          return;
        }
        applyPayload(payload);
      };

      instance.onhostcontextchanged = (ctx) => {
        if (ctx.theme) applyDocumentTheme(ctx.theme);
        if (ctx.styles?.variables) applyHostStyleVariables(ctx.styles.variables);
        if (ctx.styles?.css?.fonts) applyHostFonts(ctx.styles.css.fonts);
      };
    },
  });

  useEffect(() => {
    if (!app) return;
    const ctx = app.getHostContext();
    if (ctx?.theme) applyDocumentTheme(ctx.theme);
    if (ctx?.styles?.variables) applyHostStyleVariables(ctx.styles.variables);
    if (ctx?.styles?.css?.fonts) applyHostFonts(ctx.styles.css.fonts);
  }, [app]);

  function applyPayload(payload: Payload): void {
    switch (payload.kind) {
      case "course-list":
        setView({ name: "course-list", payload });
        break;
      case "course-info-list":
        setView({ name: "course-info-list", payload });
        break;
      case "past-exam-list":
        setView({ name: "past-exam-list", payload });
        break;
    }
  }

  async function callTool<T = unknown>(
    name: string,
    args: Record<string, unknown>
  ): Promise<T | null> {
    if (!app) return null;
    setBusy(true);
    try {
      const res = await app.callServerTool({ name, arguments: args });
      if (res.isError) {
        const msg =
          res.content?.find((c) => c.type === "text")?.text ?? "エラーが発生しました";
        setView({ name: "error", message: msg });
        return null;
      }
      return res.structuredContent as T;
    } finally {
      setBusy(false);
    }
  }

  async function searchCourses(filter: CourseFilter): Promise<void> {
    const payload = await callTool<Payload>("search-courses", {
      query: filter.query,
      category: filter.category,
      subcategory: filter.subcategory,
    });
    if (payload) applyPayload(payload);
  }

  async function listCourseInfo(filter: CourseInfoFilter): Promise<void> {
    const payload = await callTool<Payload>("list-course-info", {
      course_id: filter.course_id,
      difficulty: filter.difficulty,
    });
    if (payload) applyPayload(payload);
  }

  async function listPastExams(filter: PastExamFilter): Promise<void> {
    const payload = await callTool<Payload>("list-past-exams", {
      course_id: filter.course_id,
      course_name: filter.course_name,
      year: filter.year,
    });
    if (payload) applyPayload(payload);
  }

  const subtitle = useMemo(() => {
    switch (view.name) {
      case "course-list":
        return `科目検索 — ${view.payload.total} 件`;
      case "course-info-list":
        return `授業攻略情報 — ${view.payload.total} 件`;
      case "past-exam-list":
        return `過去問 — ${view.payload.total} 件`;
      case "loading":
        return "接続中…";
      case "error":
        return "エラー";
    }
  }, [view]);

  if (error) {
    return (
      <div className="kp-app kp-error-panel">
        <h1>接続エラー</h1>
        <p>{error.message}</p>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="kp-app">
        <p className="kp-muted" style={{ padding: "24px" }}>
          ホストへ接続中…
        </p>
      </div>
    );
  }

  return (
    <div className="kp-app">
      <Toolbar
        subtitle={subtitle}
        busy={busy}
        onHome={() => searchCourses({})}
      />

      <main className="kp-main">
        {view.name === "loading" && (
          <p className="kp-muted">Claude からツールを呼び出すと結果がここに表示されます。</p>
        )}

        {view.name === "course-list" && (
          <CourseList
            courses={view.payload.courses}
            total={view.payload.total}
            filter={view.payload.filter}
            categories={view.payload.categories}
            subcategories={view.payload.subcategories}
            onFilterChange={searchCourses}
          />
        )}

        {view.name === "course-info-list" && (
          <CourseInfoList
            items={view.payload.items}
            total={view.payload.total}
            filter={view.payload.filter}
            onFilterChange={listCourseInfo}
          />
        )}

        {view.name === "past-exam-list" && (
          <PastExamList
            exams={view.payload.exams}
            total={view.payload.total}
            filter={view.payload.filter}
            onFilterChange={listPastExams}
          />
        )}

        {view.name === "error" && (
          <div className="kp-error-panel">
            <p>{view.message}</p>
            <button onClick={() => searchCourses({})}>科目一覧へ戻る</button>
          </div>
        )}
      </main>
    </div>
  );
}
