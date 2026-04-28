// ============================================================================
// カリキュラム判定ヘルパー
// 入学年度から旧制度(2024以前) / 新制度(2025以降)を振り分けて
// 各ページが参照するデータセットを返す。
// ============================================================================

import { courses as coursesOld, CATEGORIES as CATEGORIES_OLD, SUBCATEGORIES } from './courses.js'
import { REQUIREMENTS as REQUIREMENTS_OLD, TOTAL_REQUIRED_CREDITS as TOTAL_OLD } from './requirements.js'
import { courses as courses2025, CATEGORIES as CATEGORIES_2025 } from './courses_2025.js'
import { REQUIREMENTS as REQUIREMENTS_2025, TOTAL_REQUIRED_CREDITS as TOTAL_2025 } from './requirements_2025.js'

/**
 * 入学年度から制度キーを返す
 * @param {number|null} admissionYear
 * @returns {'2025'|'old'}
 */
export const getCurriculumKey = (admissionYear) =>
  admissionYear != null && admissionYear >= 2025 ? '2025' : 'old'

/**
 * 入学年度に応じたカリキュラムデータを返す
 * @param {number|null} admissionYear
 * @returns {{
 *   key: string,
 *   label: string,
 *   courses: Array,
 *   categories: object,
 *   requirements: Array,
 *   totalRequired: number,
 *   subcategories: object,
 * }}
 */
export const getCurriculum = (admissionYear) => {
  const key = getCurriculumKey(admissionYear)

  if (key === '2025') {
    return {
      key,
      label:        '2025年度以降カリキュラム',
      courses:      courses2025,
      categories:   CATEGORIES_2025,
      requirements: REQUIREMENTS_2025,
      totalRequired: TOTAL_2025,
      subcategories: SUBCATEGORIES,
    }
  }

  return {
    key,
    label:        '2024年度以前カリキュラム',
    courses:      coursesOld,
    categories:   CATEGORIES_OLD,
    requirements: REQUIREMENTS_OLD,
    totalRequired: TOTAL_OLD,
    subcategories: SUBCATEGORIES,
  }
}
