import { useAuth } from './useAuth.js'
import { getCurriculum } from '../data/curriculum.js'

/**
 * ログイン中ユーザーの入学年度に基づきカリキュラムデータを返す hook
 *
 * 返り値:
 *   key          - 'old' | '2025'
 *   label        - 表示用ラベル
 *   courses      - 科目リスト
 *   categories   - CATEGORIES 定数
 *   requirements - 卒業要件リスト
 *   totalRequired - 卒業必要単位数
 *   subcategories - SUBCATEGORIES 定数
 */
export function useCurriculum() {
  const { profile } = useAuth()
  return getCurriculum(profile?.admission_year)
}
