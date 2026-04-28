// ============================================================================
// 2025年度以降入学生 卒業要件定義(合計126単位)
//
// 【教養系の人文・社会・自然・総合について】
// 4カテゴリに個別の必要単位はなく、合計12単位以上が要件。
// うち人文系・社会系で8単位以上という入れ子要件もある。
// isVirtual:true のカテゴリは courses_2025.js に科目なし(集計専用)。
// excludeFromTotal:true は totalEarned への二重カウント防止用フラグ。
// ============================================================================

import { CATEGORIES } from "./courses_2025.js"

export const REQUIREMENTS = [
  // ===== 教養科目 =====
  { category: CATEGORIES.LIBERAL_BASE,        requiredCredits: 4,  maxCountableCredits: 4,    group: "教養", description: "基盤系 必修" },

  // 人文・社会・自然・総合は個別要件なし、合計12単位要件(HSN_TOTAL)で判定する
  { category: CATEGORIES.LIBERAL_HUMANITIES,  requiredCredits: 0,  maxCountableCredits: null, group: "教養", description: "人文系",   excludeFromTotal: true },
  { category: CATEGORIES.LIBERAL_SOCIAL,      requiredCredits: 0,  maxCountableCredits: null, group: "教養", description: "社会系",   excludeFromTotal: true },
  { category: CATEGORIES.LIBERAL_NATURAL,     requiredCredits: 0,  maxCountableCredits: null, group: "教養", description: "自然系",   excludeFromTotal: true },
  { category: CATEGORIES.LIBERAL_INTEGRATED,  requiredCredits: 0,  maxCountableCredits: null, group: "教養", description: "総合系",   excludeFromTotal: true },

  // 仮想カテゴリ — creditCalc.js で計算する
  { category: CATEGORIES.LIBERAL_HS_INNER,    requiredCredits: 8,  maxCountableCredits: null, group: "教養", description: "うち人文系・社会系 8単位以上", isVirtual: true, excludeFromTotal: true },
  { category: CATEGORIES.LIBERAL_HSN_TOTAL,   requiredCredits: 12, maxCountableCredits: 12,   group: "教養", description: "人文社会自然総合 合計 12単位以上", isVirtual: true },

  { category: CATEGORIES.FOREIGN_LANG_1,      requiredCredits: 4,  maxCountableCredits: 4,    group: "教養", description: "外国語系 第Ⅰ" },
  { category: CATEGORIES.FOREIGN_LANG_2,      requiredCredits: 4,  maxCountableCredits: 4,    group: "教養", description: "外国語系 第Ⅱ" },
  { category: CATEGORIES.HEALTH_SPORTS,       requiredCredits: 1,  maxCountableCredits: 1,    group: "教養", description: "健康・スポーツ科学系" },

  // 外国語・健康スポーツの超過分が自動算入される仮想カテゴリ
  { category: CATEGORIES.FREE_SELECT,         requiredCredits: 0,  maxCountableCredits: null, group: "教養", description: "自由選択科目(外国語・健康スポーツ超過分)", isVirtual: true, isAutoCalc: true },

  // ===== 共通専門基礎科目 =====
  { category: CATEGORIES.COMMON_PRO_BASIC,    requiredCredits: 16, maxCountableCredits: null, group: "専門", description: "共通専門基礎科目 選択" },

  // ===== 専門科目 =====
  { category: CATEGORIES.PRO_FACULTY_COMMON,  requiredCredits: 5,  maxCountableCredits: null, group: "専門", description: "学部共通科目 必修(食の倫理2 + 緑の保全2 + EfAS1)" },
  { category: CATEGORIES.PRO_DEPT_COMMON,     requiredCredits: 16, maxCountableCredits: null, group: "専門", description: "学科共通科目 必修(概論ⅠⅡⅢ各2 + 卒業研究10)" },
  { category: CATEGORIES.PRO_COURSE,          requiredCredits: 52, maxCountableCredits: null, group: "専門", description: "コース開講科目 必修26 + 選択26" },
  { category: CATEGORIES.PRO_RELATED,         requiredCredits: 12, maxCountableCredits: null, group: "専門", description: "関連科目(他コース・他学科開講)" },
]

export const TOTAL_REQUIRED_CREDITS = 126

export const getRequiredCredits = (category) => {
  const req = REQUIREMENTS.find((r) => r.category === category)
  return req ? req.requiredCredits : 0
}

export const getMaxCountable = (category) => {
  const req = REQUIREMENTS.find((r) => r.category === category)
  return req ? req.maxCountableCredits : null
}
