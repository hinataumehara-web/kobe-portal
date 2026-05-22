// ============================================================================
// 単位集計ロジック
//
// calcSummary(userCredits, curriculum) を外部から呼ぶ。
// curriculum は getCurriculum() の返り値 { key, courses, categories, requirements, totalRequired }。
// ============================================================================

/** 成績の重み定数 */
export const GRADE_WEIGHTS = { 秀: 4, 優: 3, 良: 2, 可: 1, 不可: 0 }

// 旧制度の自由科目カテゴリ(マスタ登録 + 自由入力の両方を集計)
const OLD_FREE_CATS = new Set(['自由科目(農学部開講)', '自由科目(他学部開講)'])

// 旧制度で PRO_COURSE 要件に合算するカテゴリ(他コース開講を含む)
const PRO_COURSE_CATS = new Set(['食料環境経済学コース開講科目', '他コース開講科目'])

/** 単位取得とみなさないグレード */
const FAILED_GRADES = new Set(['不可', '未履修', '不合格'])

/**
 * 単位取得済みのレコードを抽出する
 * 秀/優/良/可 + 合格 → 取得済み
 * 不可/未履修/不合格 → 未取得
 */
function filterPassed(userCredits) {
  return userCredits.filter(
    (uc) => uc.grade && !FAILED_GRADES.has(uc.grade)
  )
}

// ============================================================================
// 旧制度(2024以前)用計算
// ============================================================================
function calcOld(passed, courses, requirements, totalRequired) {
  const results = requirements.map((req) => {
    let earned = 0

    if (OLD_FREE_CATS.has(req.category)) {
      // 自由科目: マスタ登録(course_id あり)+ 自由入力(course_id なし)を両方集計
      const masteredEarned = passed
        .filter((uc) => {
          if (!uc.course_id) return false
          const course = courses.find((c) => c.id === uc.course_id)
          return course && course.category === req.category
        })
        .reduce((sum, uc) => {
          const course = courses.find((c) => c.id === uc.course_id)
          return sum + (course ? course.credits : 0)
        }, 0)

      const customEarned = passed
        .filter((uc) => !uc.course_id && uc.custom_category === req.category)
        .reduce((sum, uc) => sum + (uc.custom_credits || 0), 0)

      earned = masteredEarned + customEarned
    } else if (PRO_COURSE_CATS.has(req.category)) {
      // PRO_COURSE 要件: 自コース + 他コース開講科目を合算
      const matched = passed.filter((uc) => {
        const course = courses.find((c) => c.id === uc.course_id)
        return course && PRO_COURSE_CATS.has(course.category)
      })
      earned = matched.reduce((sum, uc) => {
        const course = courses.find((c) => c.id === uc.course_id)
        return sum + (course ? course.credits : 0)
      }, 0)
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
  return { results, totalEarned, totalRequired, nestedRequirements: null }
}

// ============================================================================
// 新制度(2025以降)用計算
// ============================================================================
function calcNew2025(passed, courses, requirements, categories, totalRequired) {
  // Step 1: カテゴリごとの取得単位を集計
  const earnedByCategory = {}
  for (const cat of Object.values(categories)) {
    earnedByCategory[cat] = 0
  }

  for (const uc of passed) {
    if (!uc.course_id) {
      // 自由入力科目(custom_category)
      if (uc.custom_category && earnedByCategory[uc.custom_category] !== undefined) {
        earnedByCategory[uc.custom_category] += uc.custom_credits || 0
      }
      continue
    }
    const course = courses.find((c) => c.id === uc.course_id)
    if (course && earnedByCategory[course.category] !== undefined) {
      earnedByCategory[course.category] += course.credits || 0
    }
  }

  // Step 2: 仮想カテゴリを計算
  const hsInner =
    (earnedByCategory[categories.LIBERAL_HUMANITIES] || 0) +
    (earnedByCategory[categories.LIBERAL_SOCIAL]     || 0)

  const hsnTotal =
    hsInner +
    (earnedByCategory[categories.LIBERAL_NATURAL]    || 0) +
    (earnedByCategory[categories.LIBERAL_INTEGRATED] || 0)

  earnedByCategory[categories.LIBERAL_HS_INNER]  = hsInner
  earnedByCategory[categories.LIBERAL_HSN_TOTAL] = hsnTotal

  // Step 3: 外国語・健康スポーツの超過分 → FREE_SELECT へ
  const lang1Over = Math.max(0, (earnedByCategory[categories.FOREIGN_LANG_1] || 0) - 4)
  const lang2Over = Math.max(0, (earnedByCategory[categories.FOREIGN_LANG_2] || 0) - 4)
  const hsOver    = Math.max(0, (earnedByCategory[categories.HEALTH_SPORTS]  || 0) - 1)
  earnedByCategory[categories.FREE_SELECT] = lang1Over + lang2Over + hsOver

  // Step 4: 各要件の earned/countable を算出
  const results = requirements.map((req) => {
    const earned = earnedByCategory[req.category] || 0
    const countable =
      req.maxCountableCredits !== null
        ? Math.min(earned, req.maxCountableCredits)
        : earned
    return { ...req, earned, countable }
  })

  // Step 5: totalEarned の算出
  // excludeFromTotal な要件は二重カウントしない。
  // 人文・社会・自然・総合の4カテゴリは HSN_TOTAL の countable(最大12)で代表させる。
  const excludedCats = new Set([
    categories.LIBERAL_HS_INNER,
    categories.LIBERAL_HUMANITIES,
    categories.LIBERAL_SOCIAL,
    categories.LIBERAL_NATURAL,
    categories.LIBERAL_INTEGRATED,
  ])

  let totalEarned = 0
  for (const r of results) {
    if (r.excludeFromTotal) continue
    if (excludedCats.has(r.category)) continue
    totalEarned += r.countable
  }

  return {
    results,
    totalEarned,
    totalRequired,
    nestedRequirements: {
      hsInnerEarned:    hsInner,
      hsInnerSatisfied: hsInner >= 8,
      hsnTotalEarned:   hsnTotal,
      hsnTotalSatisfied: hsnTotal >= 12,
    },
  }
}

// ============================================================================
// 公開 API
// ============================================================================

/**
 * 単位集計を計算する
 *
 * @param {Array} userCredits  - Supabase の user_credits レコード配列
 * @param {{
 *   key: string,
 *   courses: Array,
 *   categories: object,
 *   requirements: Array,
 *   totalRequired: number,
 * }} curriculum - getCurriculum() の返り値
 *
 * @returns {{
 *   results: Array,           // 要件ごとの集計行
 *   totalEarned: number,      // 卒業要件にカウントされる総単位
 *   totalRequired: number,    // 卒業必要単位
 *   nestedRequirements: object|null, // 2025制度専用の入れ子要件情報
 * }}
 */
export function calcSummary(userCredits, curriculum) {
  const { key, courses, categories, requirements, totalRequired } = curriculum
  const passed = filterPassed(userCredits)

  if (key === '2025') {
    return calcNew2025(passed, courses, requirements, categories, totalRequired)
  }
  return calcOld(passed, courses, requirements, totalRequired)
}
