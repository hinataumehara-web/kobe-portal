import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
  RESOURCE_MIME_TYPE,
  registerAppResource,
  registerAppTool,
} from "@modelcontextprotocol/ext-apps/server";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { z } from "zod";

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { loadCourses } from "../data/courses.js";
import { fetchCourseInfos, fetchPastExams } from "../db/supabase.js";
import type { Course } from "../shared/types.js";

/* ============================================================ */
/*  定数 / 設定                                                  */
/* ============================================================ */

const APP_NAME = "kobe-portal-mcp-app";
const APP_VERSION = "0.1.0";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const UI_HTML_PATHS = [
  path.resolve(__dirname, "../../ui/mcp-app.html"),
  path.resolve(__dirname, "../ui/mcp-app.html"),
  path.resolve(process.cwd(), "dist/ui/mcp-app.html"),
  path.resolve(process.cwd(), "src/ui/mcp-app.html"),
];

const RESOURCE_URI = "ui://kobe-portal/mcp-app.html";

/* ============================================================ */
/*  入力スキーマ                                                  */
/* ============================================================ */

const SearchCoursesInput = z.object({
  query: z.string().optional().describe("科目名・担当教員・シラバス内のキーワード"),
  category: z.string().optional().describe("分類名（例: 共通専門基礎科目）"),
  subcategory: z.string().optional().describe("必修 | 選択 | 自由"),
  limit: z.number().int().min(1).max(200).optional().default(50),
});

const ListCourseInfoInput = z.object({
  course_id: z.string().optional().describe("科目ID（例: CPB001）"),
  difficulty: z.enum(["楽単", "普通", "難"]).optional().describe("難易度フィルタ"),
  limit: z.number().int().min(1).max(100).optional().default(30),
});

const ListPastExamsInput = z.object({
  course_id: z.string().optional().describe("科目ID（例: CPB001）"),
  course_name: z.string().optional().describe("科目名の部分一致"),
  year: z.number().int().min(2000).max(2100).optional().describe("試験実施年度"),
  limit: z.number().int().min(1).max(100).optional().default(30),
});

/* ============================================================ */
/*  ユーティリティ                                                */
/* ============================================================ */

async function loadUiHtml(): Promise<string> {
  for (const candidate of UI_HTML_PATHS) {
    try {
      return await fs.readFile(candidate, "utf-8");
    } catch {
      /* 次を試す */
    }
  }
  throw new Error(
    `UI HTML が見つかりません。先に npm run build:ui を実行してください。\n試したパス: ${UI_HTML_PATHS.join(", ")}`
  );
}

function filterCourses(courses: Course[], filter: {
  query?: string;
  category?: string;
  subcategory?: string;
  limit?: number;
}): Course[] {
  let result = courses;

  if (filter.category) {
    result = result.filter((c) => c.category === filter.category);
  }
  if (filter.subcategory) {
    result = result.filter((c) => c.subcategory === filter.subcategory);
  }
  if (filter.query) {
    const q = filter.query.toLowerCase();
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.teacher ?? "").toLowerCase().includes(q) ||
        (c.syllabus ?? "").toLowerCase().includes(q)
    );
  }
  if (filter.limit) {
    result = result.slice(0, filter.limit);
  }
  return result;
}

/* ============================================================ */
/*  サーバー構築                                                  */
/* ============================================================ */

export async function buildServer(): Promise<McpServer> {
  const server = new McpServer({ name: APP_NAME, version: APP_VERSION });

  /* ----- UI リソース登録 ----- */
  registerAppResource(
    server,
    RESOURCE_URI,
    RESOURCE_URI,
    { mimeType: RESOURCE_MIME_TYPE },
    async () => {
      const html = await loadUiHtml();
      return {
        contents: [{ uri: RESOURCE_URI, mimeType: RESOURCE_MIME_TYPE, text: html }],
      };
    }
  );

  /* ----- Tool: search-courses ----- */
  registerAppTool(
    server,
    "search-courses",
    {
      title: "科目を検索",
      description:
        "神戸大学食料環境経済学コースの科目マスタを検索します。" +
        "科目名・担当教員・シラバスキーワード・カテゴリ・必修/選択などで絞り込めます。" +
        "チャット内に科目一覧UIが表示され、シラバスや担当教員を確認できます。",
      inputSchema: SearchCoursesInput.shape,
      _meta: { ui: { resourceUri: RESOURCE_URI } },
    },
    async (args) => {
      const parsed = SearchCoursesInput.parse(args);
      const { courses, CATEGORIES, SUBCATEGORIES } = await loadCourses();

      const filtered = filterCourses(courses, parsed);
      const categories = Object.values(CATEGORIES as Record<string, string>);
      const subcategories = Object.values(SUBCATEGORIES as Record<string, string>);

      const payload = {
        kind: "course-list" as const,
        courses: filtered,
        total: filtered.length,
        filter: {
          query: parsed.query,
          category: parsed.category,
          subcategory: parsed.subcategory,
        },
        categories,
        subcategories,
      };

      const desc = [
        parsed.query ? `「${parsed.query}」` : null,
        parsed.category ?? null,
        parsed.subcategory ?? null,
      ]
        .filter(Boolean)
        .join(" / ");

      return {
        content: [
          {
            type: "text",
            text:
              filtered.length === 0
                ? `条件${desc ? ` (${desc})` : ""}に一致する科目はありませんでした。`
                : `${filtered.length} 件の科目が見つかりました。${desc ? ` (${desc})` : ""}`,
          },
        ],
        structuredContent: payload,
      };
    }
  );

  /* ----- Tool: list-course-info ----- */
  registerAppTool(
    server,
    "list-course-info",
    {
      title: "授業攻略情報を見る",
      description:
        "先輩学生が投稿した授業の攻略情報（難易度・テスト傾向・スケジュール等）を一覧表示します。" +
        "科目IDや難易度（楽単/普通/難）でフィルタできます。",
      inputSchema: ListCourseInfoInput.shape,
      _meta: { ui: { resourceUri: RESOURCE_URI } },
    },
    async (args) => {
      const parsed = ListCourseInfoInput.parse(args);
      const items = await fetchCourseInfos({
        course_id: parsed.course_id,
        difficulty: parsed.difficulty,
        limit: parsed.limit,
      });

      const payload = {
        kind: "course-info-list" as const,
        items,
        total: items.length,
        filter: {
          course_id: parsed.course_id,
          difficulty: parsed.difficulty,
        },
      };

      return {
        content: [
          {
            type: "text",
            text:
              items.length === 0
                ? "条件に一致する授業攻略情報はありませんでした。"
                : `${items.length} 件の授業攻略情報が見つかりました。`,
          },
        ],
        structuredContent: payload,
      };
    }
  );

  /* ----- Tool: list-past-exams ----- */
  registerAppTool(
    server,
    "list-past-exams",
    {
      title: "過去問一覧を見る",
      description:
        "先輩学生が共有した過去問の一覧を表示します（メタ情報のみ、ファイルDLは除く）。" +
        "科目ID・科目名（部分一致）・年度でフィルタできます。",
      inputSchema: ListPastExamsInput.shape,
      _meta: { ui: { resourceUri: RESOURCE_URI } },
    },
    async (args) => {
      const parsed = ListPastExamsInput.parse(args);
      const exams = await fetchPastExams({
        course_id: parsed.course_id,
        course_name: parsed.course_name,
        year: parsed.year,
        limit: parsed.limit,
      });

      const payload = {
        kind: "past-exam-list" as const,
        exams,
        total: exams.length,
        filter: {
          course_id: parsed.course_id,
          course_name: parsed.course_name,
          year: parsed.year,
        },
      };

      return {
        content: [
          {
            type: "text",
            text:
              exams.length === 0
                ? "条件に一致する過去問はありませんでした。"
                : `${exams.length} 件の過去問情報が見つかりました。`,
          },
        ],
        structuredContent: payload,
      };
    }
  );

  return server;
}

/* ============================================================ */
/*  起動                                                          */
/* ============================================================ */

async function runStdio(): Promise<void> {
  const server = await buildServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`[${APP_NAME}] stdio transport ready`);
}

async function runHttp(port: number): Promise<void> {
  const app = new Hono();

  app.get("/health", (c) => c.json({ ok: true, name: APP_NAME, version: APP_VERSION }));

  app.post("/mcp", async (c) => {
    const server = await buildServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });
    await server.connect(transport);

    const body = await c.req.json().catch(() => ({}));
    const incoming = (c.env as { incoming?: unknown }).incoming as Parameters<
      typeof transport.handleRequest
    >[0];
    const outgoing = (c.env as { outgoing?: unknown }).outgoing as Parameters<
      typeof transport.handleRequest
    >[1];

    if (!incoming || !outgoing) {
      return c.json({ error: "HTTP transport requires Node adapter" }, 500);
    }

    outgoing.on("close", () => transport.close());
    await transport.handleRequest(incoming, outgoing, body);
    return new Response(null);
  });

  serve({ fetch: app.fetch, port }, ({ port: actualPort }) => {
    console.error(`[${APP_NAME}] http listening on http://localhost:${actualPort}/mcp`);
  });
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const mode = args.includes("--http") ? "http" : "stdio";

  if (mode === "stdio") {
    await runStdio();
  } else {
    await runHttp(Number(process.env.PORT ?? 3001));
  }
}

const isMain = (() => {
  try {
    return import.meta.url === `file://${process.argv[1]}`;
  } catch {
    return false;
  }
})();

if (isMain) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
