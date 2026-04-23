// ============================================================================
// 神戸大学 農学部 食料環境システム学科 食料環境経済学コース
// 卒業要件定義(合計126単位)
//
// 【自由科目について】
// 自由科目(PRO_FREE_AGRI / PRO_FREE_OTHER)は requiredCredits=0 で、
// maxCountableCredits のみ設定。これは「必須ではないが、履修した場合に
// 最大X単位までは専門科目84単位の一部として算入できる」という意味。
//
// 単位計算ツール側では:
//   - 自由科目は courses.js に登録されていなくてもユーザー自由入力可能
//   - 農学部開講8単位 + 他学部開講2単位 = 最大10単位まで算入
//   - 超過分は表示するが算入しない
// ============================================================================

import { CATEGORIES } from "./courses.js";

/**
 * @typedef {Object} Requirement
 * @property {string} category - 分類名(CATEGORIES の値と一致)
 * @property {number} requiredCredits - 必要単位数
 * @property {number|null} maxCountableCredits - 卒業単位に算入できる上限(自由科目用)
 * @property {string} group - 集計グループ("教養"|"専門")
 * @property {string} description - 説明
 */

export const REQUIREMENTS = [
  // --- 教養系 ---
  { category: CATEGORIES.BASIC_LIBERAL,           requiredCredits: 6, maxCountableCredits: null, group: "教養", description: "基礎教養科目" },
  { category: CATEGORIES.GENERAL_LIBERAL,         requiredCredits: 6, maxCountableCredits: null, group: "教養", description: "総合教養科目" },
  { category: CATEGORIES.FOREIGN_LANG_1,          requiredCredits: 4, maxCountableCredits: null, group: "教養", description: "外国語科目Ⅰ" },
  { category: CATEGORIES.FOREIGN_LANG_2,          requiredCredits: 4, maxCountableCredits: null, group: "教養", description: "外国語科目Ⅱ" },
  { category: CATEGORIES.INFO,                    requiredCredits: 1, maxCountableCredits: null, group: "教養", description: "情報科目" },
  { category: CATEGORIES.HEALTH_SPORTS,           requiredCredits: 1, maxCountableCredits: null, group: "教養", description: "健康・スポーツ科学" },
  { category: CATEGORIES.ADVANCED_LIBERAL_COURSE, requiredCredits: 2, maxCountableCredits: null, group: "教養", description: "高度教養科目(自コース指定)" },
  { category: CATEGORIES.ADVANCED_LIBERAL_OTHER,  requiredCredits: 2, maxCountableCredits: null, group: "教養", description: "高度教養科目(その他)" },

  // --- 共通専門基礎(16単位必要)---
  { category: CATEGORIES.COMMON_PRO_BASIC,        requiredCredits: 16, maxCountableCredits: null, group: "専門", description: "共通専門基礎科目 選択" },

  // --- 専門科目(合計84単位)---
  // 内訳: 必修48 + 選択26 + 自由10
  // 必修48 = 学部共通必修5 + 学科共通必修16 + コース開講必修27
  { category: CATEGORIES.PRO_FACULTY_COMMON,      requiredCredits: 5,  maxCountableCredits: null, group: "専門", description: "学部共通科目 必修(初年次セミナー1 + 食の倫理2 + 緑の保全2)" },
  { category: CATEGORIES.PRO_DEPT_COMMON,         requiredCredits: 16, maxCountableCredits: null, group: "専門", description: "学科共通科目 必修(概論ⅠⅡⅢ各2 + 卒業研究10)" },
  { category: CATEGORIES.PRO_COURSE,              requiredCredits: 53, maxCountableCredits: null, group: "専門", description: "コース開講科目 必修27 + 選択26(他コース開講含む)" },
  { category: CATEGORIES.PRO_FREE_AGRI,           requiredCredits: 0,  maxCountableCredits: 8,  group: "専門", description: "自由科目(農学部開講)最大8単位" },
  { category: CATEGORIES.PRO_FREE_OTHER,          requiredCredits: 0,  maxCountableCredits: 2,  group: "専門", description: "自由科目(他学部開講)最大2単位" },
];

export const TOTAL_REQUIRED_CREDITS = 126;

/**
 * カテゴリ名から必要単位数を取得
 * @param {string} category
 * @returns {number}
 */
export const getRequiredCredits = (category) => {
  const req = REQUIREMENTS.find((r) => r.category === category);
  return req ? req.requiredCredits : 0;
};

/**
 * カテゴリが自由科目上限を持つかチェック
 * @param {string} category
 * @returns {number|null}
 */
export const getMaxCountable = (category) => {
  const req = REQUIREMENTS.find((r) => r.category === category);
  return req ? req.maxCountableCredits : null;
};
