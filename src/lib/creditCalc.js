import { CATEGORIES } from '../data/courses.js'
import { REQUIREMENTS, TOTAL_REQUIRED_CREDITS } from '../data/requirements.js'

/**
 * 履修データから単位集計を計算する
 * @param {Array} userCredits - Supabase の user_credits テーブルのレコード配列
 * @param {Array} courses - courses.js の courses 配列
 * @returns {{ results: Array, totalEarned: number }}
 */
export function calcSummary(userCredits, courses) {
  // 合格扱いのレコードだけ抽出(不可・未履修を除く)
  const passed = userCredits.filter(
    (uc) => uc.grade && uc.grade !== '不可' && uc.grade !== '未履修'
  )

  const results = REQUIREMENTS.map((req) => {
    let earned = 0

    if (
      req.category === CATEGORIES.PRO_FREE_AGRI ||
      req.category === CATEGORIES.PRO_FREE_OTHER
    ) {
      // 自由科目: course_id がない自由入力分のみ集計
      const free = passed.filter((uc) => {
        if (uc.course_id) return false
        return uc.custom_category === req.category
      })
      earned = free.reduce((sum, uc) => sum + (uc.custom_credits || 0), 0)
    } else {
      const matched = passed.filter((uc) => {
        const course = courses.find((c) => c.id === uc.course_id)
        return course && course.category === req.category
      })
      earned = matched.reduce((sum, uc) => {
        const course = courses.find((c) => c.id === uc.course_id)
        return sum + (course ? course.credits : 0)
      }, 0)
    }

    const countable =
      req.maxCountableCredits !== null
        ? Math.min(earned, req.maxCountableCredits)
        : earned

    return { ...req, earned, countable }
  })

  const totalEarned = results.reduce((sum, r) => sum + r.countable, 0)
  return { results, totalEarned, totalRequired: TOTAL_REQUIRED_CREDITS }
}

/** 成績の重み定数 */
export const GRADE_WEIGHTS = { 秀: 4, 優: 3, 良: 2, 可: 1, 不可: 0 }
