// ============================================================================
// 神戸大学 農学部 食料環境システム学科 食料環境経済学コース
// 科目データ — 2025年度以降入学生カリキュラム
// ============================================================================

export const CATEGORIES = {
  // ===== 教養科目 =====
  LIBERAL_BASE:       "基盤系",                    // 必修4単位
  LIBERAL_HUMANITIES: "人文系",                    // 選択(合算で12以上)
  LIBERAL_SOCIAL:     "社会系",                    // 選択(合算で12以上)
  LIBERAL_NATURAL:    "自然系",                    // 選択(合算で12以上)
  LIBERAL_INTEGRATED: "総合系",                    // 選択(合算で12以上)

  // 集計用の仮想カテゴリ
  LIBERAL_HS_INNER:   "人文系・社会系 小計",       // うち8単位以上要件
  LIBERAL_HSN_TOTAL:  "人文社会自然総合 合計",      // 12単位以上要件

  FOREIGN_LANG_1: "外国語系 第Ⅰ",                 // 4単位
  FOREIGN_LANG_2: "外国語系 第Ⅱ",                 // 4単位
  HEALTH_SPORTS:  "健康・スポーツ科学系",           // 1単位

  // ===== 専門科目 =====
  COMMON_PRO_BASIC:   "共通専門基礎科目",           // 選択16単位
  PRO_FACULTY_COMMON: "学部共通科目",
  PRO_DEPT_COMMON:    "学科共通科目",
  PRO_COURSE:         "食料環境経済学コース開講科目",
  PRO_RELATED:        "関連科目",                  // 他コース・他学科開講 12単位

  // 仮想カテゴリ(自動算入)
  FREE_SELECT:        "自由選択科目",               // 外国語・健康スポーツ超過分
}

export const SUBCATEGORIES = {
  REQUIRED: "必修",
  ELECTIVE: "選択",
  FREE:     "自由",
}

// ショートハンド
const R = SUBCATEGORIES.REQUIRED
const E = SUBCATEGORIES.ELECTIVE
const CAT = CATEGORIES

/** @type {import('./courses.js').Course[]} */
export const courses = [

  // ==========================================================================
  // 基盤系 — 必修 各1単位 計4単位
  // ==========================================================================
  { id: "BASE001", name: "教養とは何か",         credits: 1, category: CAT.LIBERAL_BASE, subcategory: R, isFacultyDesignated: false, year: 1, semester: "前期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "BASE002", name: "多言語と多文化の世界", credits: 1, category: CAT.LIBERAL_BASE, subcategory: R, isFacultyDesignated: false, year: 1, semester: "前期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "BASE003", name: "情報基礎",             credits: 1, category: CAT.LIBERAL_BASE, subcategory: R, isFacultyDesignated: false, year: 1, semester: "前期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "BASE004", name: "データサイエンス基礎学", credits: 1, category: CAT.LIBERAL_BASE, subcategory: R, isFacultyDesignated: false, year: 1, semester: "前期", teacher: null, syllabus: null, evaluation: null, note: null },

  // ==========================================================================
  // 人文系 — 選択 各1単位
  // ==========================================================================
  { id: "HU001", name: "哲学",             credits: 1, category: CAT.LIBERAL_HUMANITIES, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "HU002", name: "論理学",           credits: 1, category: CAT.LIBERAL_HUMANITIES, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "HU003", name: "倫理学",           credits: 1, category: CAT.LIBERAL_HUMANITIES, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "HU004", name: "科学技術と倫理",   credits: 1, category: CAT.LIBERAL_HUMANITIES, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "HU005", name: "心理学A",          credits: 1, category: CAT.LIBERAL_HUMANITIES, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "HU006", name: "心理学B",          credits: 1, category: CAT.LIBERAL_HUMANITIES, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "HU007", name: "教育学A",          credits: 1, category: CAT.LIBERAL_HUMANITIES, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "HU008", name: "教育学B",          credits: 1, category: CAT.LIBERAL_HUMANITIES, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "HU009", name: "教育と人間形成",   credits: 1, category: CAT.LIBERAL_HUMANITIES, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "HU010", name: "言語科学A",        credits: 1, category: CAT.LIBERAL_HUMANITIES, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "HU011", name: "言語科学B",        credits: 1, category: CAT.LIBERAL_HUMANITIES, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "HU012", name: "文学A",            credits: 1, category: CAT.LIBERAL_HUMANITIES, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "HU013", name: "文学B",            credits: 1, category: CAT.LIBERAL_HUMANITIES, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "HU014", name: "芸術と文化A",      credits: 1, category: CAT.LIBERAL_HUMANITIES, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "HU015", name: "芸術と文化B",      credits: 1, category: CAT.LIBERAL_HUMANITIES, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "HU016", name: "芸術史A",          credits: 1, category: CAT.LIBERAL_HUMANITIES, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "HU017", name: "芸術史B",          credits: 1, category: CAT.LIBERAL_HUMANITIES, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "HU018", name: "美術史A",          credits: 1, category: CAT.LIBERAL_HUMANITIES, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "HU019", name: "美術史B",          credits: 1, category: CAT.LIBERAL_HUMANITIES, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "HU020", name: "科学史A",          credits: 1, category: CAT.LIBERAL_HUMANITIES, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "HU021", name: "科学史B",          credits: 1, category: CAT.LIBERAL_HUMANITIES, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "HU022", name: "日本史A",          credits: 1, category: CAT.LIBERAL_HUMANITIES, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "HU023", name: "日本史B",          credits: 1, category: CAT.LIBERAL_HUMANITIES, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "HU024", name: "東洋史A",          credits: 1, category: CAT.LIBERAL_HUMANITIES, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "HU025", name: "東洋史B",          credits: 1, category: CAT.LIBERAL_HUMANITIES, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "HU026", name: "アジア史A",        credits: 1, category: CAT.LIBERAL_HUMANITIES, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "HU027", name: "アジア史B",        credits: 1, category: CAT.LIBERAL_HUMANITIES, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "HU028", name: "西洋史A",          credits: 1, category: CAT.LIBERAL_HUMANITIES, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "HU029", name: "西洋史B",          credits: 1, category: CAT.LIBERAL_HUMANITIES, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "HU030", name: "考古学A",          credits: 1, category: CAT.LIBERAL_HUMANITIES, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "HU031", name: "考古学B",          credits: 1, category: CAT.LIBERAL_HUMANITIES, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },

  // ==========================================================================
  // 社会系 — 選択 各1単位
  // ==========================================================================
  { id: "SC001", name: "法学A",          credits: 1, category: CAT.LIBERAL_SOCIAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "SC002", name: "法学B",          credits: 1, category: CAT.LIBERAL_SOCIAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "SC003", name: "社会生活と法",   credits: 1, category: CAT.LIBERAL_SOCIAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "SC004", name: "国家と法",       credits: 1, category: CAT.LIBERAL_SOCIAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "SC005", name: "政治学A",        credits: 1, category: CAT.LIBERAL_SOCIAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "SC006", name: "政治学B",        credits: 1, category: CAT.LIBERAL_SOCIAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "SC007", name: "政治と社会",     credits: 1, category: CAT.LIBERAL_SOCIAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "SC008", name: "経済学A",        credits: 1, category: CAT.LIBERAL_SOCIAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "SC009", name: "経済学B",        credits: 1, category: CAT.LIBERAL_SOCIAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "SC010", name: "現代の経済A",    credits: 1, category: CAT.LIBERAL_SOCIAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "SC011", name: "現代の経済B",    credits: 1, category: CAT.LIBERAL_SOCIAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "SC012", name: "経済社会の発展", credits: 1, category: CAT.LIBERAL_SOCIAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "SC013", name: "経営学",         credits: 1, category: CAT.LIBERAL_SOCIAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "SC014", name: "社会学",         credits: 1, category: CAT.LIBERAL_SOCIAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "SC015", name: "教育と社会",     credits: 1, category: CAT.LIBERAL_SOCIAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "SC016", name: "地理学",         credits: 1, category: CAT.LIBERAL_SOCIAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "SC017", name: "社会思想史",     credits: 1, category: CAT.LIBERAL_SOCIAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "SC018", name: "文化人類学",     credits: 1, category: CAT.LIBERAL_SOCIAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "SC019", name: "現代社会論A",    credits: 1, category: CAT.LIBERAL_SOCIAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "SC020", name: "現代社会論B",    credits: 1, category: CAT.LIBERAL_SOCIAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "SC021", name: "越境する文化",   credits: 1, category: CAT.LIBERAL_SOCIAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "SC022", name: "生活環境と技術", credits: 1, category: CAT.LIBERAL_SOCIAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },

  // ==========================================================================
  // 自然系 — 選択 各1単位
  // ==========================================================================
  { id: "NA001", name: "数学A",               credits: 1, category: CAT.LIBERAL_NATURAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "NA002", name: "数学B",               credits: 1, category: CAT.LIBERAL_NATURAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "NA003", name: "数学C",               credits: 1, category: CAT.LIBERAL_NATURAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "NA004", name: "数学D",               credits: 1, category: CAT.LIBERAL_NATURAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "NA005", name: "統計学A",             credits: 1, category: CAT.LIBERAL_NATURAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "NA006", name: "統計学B",             credits: 1, category: CAT.LIBERAL_NATURAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "NA007", name: "物理学A",             credits: 1, category: CAT.LIBERAL_NATURAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "NA008", name: "物理学B",             credits: 1, category: CAT.LIBERAL_NATURAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "NA009", name: "現代物理学が描く世界", credits: 1, category: CAT.LIBERAL_NATURAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "NA010", name: "身近な物理法則",       credits: 1, category: CAT.LIBERAL_NATURAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "NA011", name: "化学A",               credits: 1, category: CAT.LIBERAL_NATURAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "NA012", name: "化学B",               credits: 1, category: CAT.LIBERAL_NATURAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "NA013", name: "生物学A",             credits: 1, category: CAT.LIBERAL_NATURAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "NA014", name: "生物学B",             credits: 1, category: CAT.LIBERAL_NATURAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "NA015", name: "生物学C",             credits: 1, category: CAT.LIBERAL_NATURAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "NA016", name: "生物学D",             credits: 1, category: CAT.LIBERAL_NATURAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "NA017", name: "生命科学A",           credits: 1, category: CAT.LIBERAL_NATURAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "NA018", name: "生命科学B",           credits: 1, category: CAT.LIBERAL_NATURAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "NA019", name: "医学A",               credits: 1, category: CAT.LIBERAL_NATURAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "NA020", name: "医学B",               credits: 1, category: CAT.LIBERAL_NATURAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "NA021", name: "保健学A",             credits: 1, category: CAT.LIBERAL_NATURAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "NA022", name: "保健学B",             credits: 1, category: CAT.LIBERAL_NATURAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "NA023", name: "健康科学A",           credits: 1, category: CAT.LIBERAL_NATURAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "NA024", name: "健康科学B",           credits: 1, category: CAT.LIBERAL_NATURAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "NA025", name: "惑星学A",             credits: 1, category: CAT.LIBERAL_NATURAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "NA026", name: "惑星学B",             credits: 1, category: CAT.LIBERAL_NATURAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "NA027", name: "情報学A",             credits: 1, category: CAT.LIBERAL_NATURAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "NA028", name: "情報学B",             credits: 1, category: CAT.LIBERAL_NATURAL, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },

  // ==========================================================================
  // 総合系 — 選択 (社会と環境)
  // ==========================================================================
  { id: "IN001", name: "ESD論(基礎)",                       credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "社会と環境" },
  { id: "IN002", name: "ESD論A",                            credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "社会と環境" },
  { id: "IN003", name: "ESD論B",                            credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "社会と環境" },
  { id: "IN004", name: "環境学入門A",                        credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "社会と環境" },
  { id: "IN005", name: "環境学入門B",                        credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "社会と環境" },
  { id: "IN006", name: "海への誘い",                         credits: 2, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "社会と環境" },
  { id: "IN007", name: "瀬戸内海学入門",                     credits: 2, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "社会と環境" },
  { id: "IN008", name: "社会と人権A",                        credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "社会と環境" },
  { id: "IN009", name: "社会と人権B",                        credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "社会と環境" },
  { id: "IN010", name: "社会と人権C",                        credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "社会と環境" },
  { id: "IN011", name: "ジェンダーとセクシュアリティA",      credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "社会と環境" },
  { id: "IN012", name: "ジェンダーとセクシュアリティB",      credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "社会と環境" },

  // 総合系 — 選択 (価値と創造)
  { id: "IN013", name: "阪神・淡路大震災と都市の安全",       credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "価値と創造" },
  { id: "IN014", name: "ボランティアと社会貢献活動A",         credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "価値と創造" },
  { id: "IN015", name: "ボランティアと社会貢献活動B",         credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "価値と創造" },
  { id: "IN016", name: "地域社会形成基礎論",                 credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "価値と創造" },
  { id: "IN017", name: "ひょうご神戸学",                     credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "価値と創造" },
  { id: "IN018", name: "日本酒学入門",                       credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "価値と創造" },
  { id: "IN019", name: "神戸大学史",                         credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "価値と創造" },
  { id: "IN020", name: "神戸大学研究最前線",                 credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "価値と創造" },
  { id: "IN021", name: "社会基礎学",                         credits: 2, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "価値と創造" },
  { id: "IN022", name: "職業と学び―キャリアデザインを考えるA", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "価値と創造" },
  { id: "IN023", name: "職業と学び―キャリアデザインを考えるB", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "価値と創造" },
  { id: "IN024", name: "価値創造論基礎",                     credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "価値と創造" },
  { id: "IN025", name: "価値創造論A",                        credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "価値と創造" },
  { id: "IN026", name: "価値創造論B",                        credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "価値と創造" },
  { id: "IN027", name: "価値創造論C",                        credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "価値と創造" },
  { id: "IN028", name: "アントレプレナーシップ入門",           credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "価値と創造" },

  // 総合系 — 選択 (科学と技術)
  { id: "IN029", name: "食と健康A",                         credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "科学と技術" },
  { id: "IN030", name: "食と健康B",                         credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "科学と技術" },
  { id: "IN031", name: "生物資源と農業A",                    credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "科学と技術" },
  { id: "IN032", name: "生物資源と農業B",                    credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "科学と技術" },
  { id: "IN033", name: "生物資源と農業C",                    credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "科学と技術" },
  { id: "IN034", name: "生物資源と農業D",                    credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "科学と技術" },
  { id: "IN035", name: "科学技術と社会A",                    credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "科学と技術" },
  { id: "IN036", name: "科学技術と社会B",                    credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "科学と技術" },
  { id: "IN037", name: "科学技術と社会C",                    credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "科学と技術" },
  { id: "IN038", name: "科学技術と社会D",                    credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "科学と技術" },
  { id: "IN039", name: "カタチの文化学",                     credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "科学と技術" },
  { id: "IN040", name: "カタチの自然学A",                    credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "科学と技術" },
  { id: "IN041", name: "カタチの自然学B",                    credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "科学と技術" },
  { id: "IN042", name: "カタチの科学",                       credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "科学と技術" },
  { id: "IN043", name: "放射線科学",                         credits: 2, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "科学と技術" },
  { id: "IN044", name: "データサイエンス概論A",               credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "科学と技術" },
  { id: "IN045", name: "データサイエンス概論B",               credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "科学と技術" },
  { id: "IN046", name: "データサイエンス基礎演習",             credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "科学と技術" },
  { id: "IN047", name: "データサイエンスPBL演習",             credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "科学と技術" },

  // 総合系 — 選択 (世界と日本)
  { id: "IN048", name: "複言語共修セミナー(タンデム)",         credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "IN049", name: "複言語共修セミナー(外国語としての日本語)", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "IN050", name: "グローバルリーダーシップ育成基礎演習",  credits: 2, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "IN051", name: "多文化共生のための日本語コミュニケーション", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "IN052", name: "海外留学のすすめA",                   credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "IN053", name: "海外留学のすすめB",                   credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "IN054", name: "グローバルラーニングスキルズ",          credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "IN055", name: "グローバルエキスパートセミナー",        credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "IN056", name: "グローバルチャレンジ実習",              credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本 / 1又は2単位" },
  { id: "IN057", name: "国際共修プロジェクト",                 credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本 / 1又は2単位" },
  { id: "IN058", name: "国際協力の現状と課題A",                credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "IN059", name: "国際協力の現状と課題B",                credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "IN060", name: "国際協力アクティブ・ラーニングA",       credits: 2, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "IN061", name: "国際協力アクティブ・ラーニングB",       credits: 2, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "IN062", name: "国際協力アクティブ・ラーニングC",       credits: 2, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },

  // 総合系 — 外国語セミナー(英語)
  { id: "GSEN001", name: "英語外国語セミナーA", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "GSEN002", name: "英語外国語セミナーB", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "GSEN003", name: "英語外国語セミナーC", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "GSEN004", name: "英語外国語セミナーD", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "GSEN005", name: "英語外国語セミナーE", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "GSEN006", name: "英語外国語セミナーF", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  // 総合系 — 外国語セミナー(ドイツ語)
  { id: "GSDE001", name: "ドイツ語外国語セミナーA", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "GSDE002", name: "ドイツ語外国語セミナーB", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "GSDE003", name: "ドイツ語外国語セミナーC", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "GSDE004", name: "ドイツ語外国語セミナーD", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "GSDE005", name: "ドイツ語外国語セミナーE", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "GSDE006", name: "ドイツ語外国語セミナーF", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  // 総合系 — 外国語セミナー(フランス語)
  { id: "GSFR001", name: "フランス語外国語セミナーA", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "GSFR002", name: "フランス語外国語セミナーB", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "GSFR003", name: "フランス語外国語セミナーC", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "GSFR004", name: "フランス語外国語セミナーD", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "GSFR005", name: "フランス語外国語セミナーE", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "GSFR006", name: "フランス語外国語セミナーF", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  // 総合系 — 外国語セミナー(中国語)
  { id: "GSZH001", name: "中国語外国語セミナーA", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "GSZH002", name: "中国語外国語セミナーB", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "GSZH003", name: "中国語外国語セミナーC", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "GSZH004", name: "中国語外国語セミナーD", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "GSZH005", name: "中国語外国語セミナーE", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "GSZH006", name: "中国語外国語セミナーF", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  // 総合系 — 外国語セミナー(ロシア語)
  { id: "GSRU001", name: "ロシア語外国語セミナーA", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "GSRU002", name: "ロシア語外国語セミナーB", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "GSRU003", name: "ロシア語外国語セミナーC", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "GSRU004", name: "ロシア語外国語セミナーD", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "GSRU005", name: "ロシア語外国語セミナーE", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "GSRU006", name: "ロシア語外国語セミナーF", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  // 総合系 — 多言語セミナー(スペイン語)
  { id: "MSES001", name: "スペイン語多言語セミナー1", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "MSES002", name: "スペイン語多言語セミナー2", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "MSES003", name: "スペイン語多言語セミナー3", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "MSES004", name: "スペイン語多言語セミナー4", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "MSIT001", name: "イタリア語多言語セミナー1", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "MSIT002", name: "イタリア語多言語セミナー2", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "MSIT003", name: "イタリア語多言語セミナー3", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "MSIT004", name: "イタリア語多言語セミナー4", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "MSKO001", name: "韓国語多言語セミナー1", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "MSKO002", name: "韓国語多言語セミナー2", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "MSKO003", name: "韓国語多言語セミナー3", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "MSKO004", name: "韓国語多言語セミナー4", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "MSLA001", name: "ラテン語多言語セミナー1", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "MSLA002", name: "ラテン語多言語セミナー2", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "MSLA003", name: "ラテン語多言語セミナー3", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },
  { id: "MSLA004", name: "ラテン語多言語セミナー4", credits: 1, category: CAT.LIBERAL_INTEGRATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "世界と日本" },

  // ==========================================================================
  // 外国語系 第Ⅰ — 各0.5単位
  // ==========================================================================
  { id: "FL001", name: "Academic English Communication A1",      credits: 0.5, category: CAT.FOREIGN_LANG_1, subcategory: R, isFacultyDesignated: false, year: 1, semester: "前期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FL002", name: "Academic English Communication A2",      credits: 0.5, category: CAT.FOREIGN_LANG_1, subcategory: R, isFacultyDesignated: false, year: 1, semester: "前期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FL003", name: "Academic English Communication B1",      credits: 0.5, category: CAT.FOREIGN_LANG_1, subcategory: R, isFacultyDesignated: false, year: 1, semester: "後期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FL004", name: "Academic English Communication B2",      credits: 0.5, category: CAT.FOREIGN_LANG_1, subcategory: R, isFacultyDesignated: false, year: 1, semester: "後期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FL005", name: "Academic English Communication B1(ACE)", credits: 0.5, category: CAT.FOREIGN_LANG_1, subcategory: E, isFacultyDesignated: false, year: 1, semester: "後期", teacher: null, syllabus: null, evaluation: null, note: "ACE代替可" },
  { id: "FL006", name: "Academic English Communication B2(ACE)", credits: 0.5, category: CAT.FOREIGN_LANG_1, subcategory: E, isFacultyDesignated: false, year: 1, semester: "後期", teacher: null, syllabus: null, evaluation: null, note: "ACE代替可" },
  { id: "FL007", name: "Academic English Literacy A1",           credits: 0.5, category: CAT.FOREIGN_LANG_1, subcategory: R, isFacultyDesignated: false, year: 1, semester: "前期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FL008", name: "Academic English Literacy A2",           credits: 0.5, category: CAT.FOREIGN_LANG_1, subcategory: R, isFacultyDesignated: false, year: 1, semester: "前期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FL009", name: "Academic English Literacy B1",           credits: 0.5, category: CAT.FOREIGN_LANG_1, subcategory: R, isFacultyDesignated: false, year: 1, semester: "後期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FL010", name: "Academic English Literacy B2",           credits: 0.5, category: CAT.FOREIGN_LANG_1, subcategory: R, isFacultyDesignated: false, year: 1, semester: "後期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FL011", name: "Academic English Literacy B1(ACE)",      credits: 0.5, category: CAT.FOREIGN_LANG_1, subcategory: E, isFacultyDesignated: false, year: 1, semester: "後期", teacher: null, syllabus: null, evaluation: null, note: "ACE代替可" },
  { id: "FL012", name: "Academic English Literacy B2(ACE)",      credits: 0.5, category: CAT.FOREIGN_LANG_1, subcategory: E, isFacultyDesignated: false, year: 1, semester: "後期", teacher: null, syllabus: null, evaluation: null, note: "ACE代替可" },

  // ==========================================================================
  // 外国語系 第Ⅱ — 各0.5単位 (ドイツ語)
  // ==========================================================================
  { id: "FLDE001", name: "ドイツ語初級A1", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 1, semester: "前期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLDE002", name: "ドイツ語初級A2", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 1, semester: "前期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLDE003", name: "ドイツ語初級A3", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 1, semester: "前期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLDE004", name: "ドイツ語初級A4", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 1, semester: "前期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLDE005", name: "ドイツ語初級B1", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 1, semester: "後期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLDE006", name: "ドイツ語初級B2", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 1, semester: "後期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLDE007", name: "ドイツ語初級B3", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 1, semester: "後期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLDE008", name: "ドイツ語初級B4", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 1, semester: "後期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLDE009", name: "ドイツ語初級SA3", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 2, semester: "前期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLDE010", name: "ドイツ語初級SA4", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 2, semester: "前期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLDE011", name: "ドイツ語初級SB3", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 2, semester: "後期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLDE012", name: "ドイツ語初級SB4", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 2, semester: "後期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLDE013", name: "ドイツ語中級C1", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLDE014", name: "ドイツ語中級C2", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  // 外国語系 第Ⅱ — フランス語
  { id: "FLFR001", name: "フランス語初級A1", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 1, semester: "前期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLFR002", name: "フランス語初級A2", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 1, semester: "前期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLFR003", name: "フランス語初級A3", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 1, semester: "前期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLFR004", name: "フランス語初級A4", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 1, semester: "前期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLFR005", name: "フランス語初級B1", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 1, semester: "後期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLFR006", name: "フランス語初級B2", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 1, semester: "後期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLFR007", name: "フランス語初級B3", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 1, semester: "後期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLFR008", name: "フランス語初級B4", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 1, semester: "後期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLFR009", name: "フランス語初級SA3", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 2, semester: "前期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLFR010", name: "フランス語初級SA4", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 2, semester: "前期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLFR011", name: "フランス語初級SB3", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 2, semester: "後期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLFR012", name: "フランス語初級SB4", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 2, semester: "後期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLFR013", name: "フランス語中級C1", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLFR014", name: "フランス語中級C2", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  // 外国語系 第Ⅱ — 中国語
  { id: "FLZH001", name: "中国語初級A1", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 1, semester: "前期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLZH002", name: "中国語初級A2", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 1, semester: "前期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLZH003", name: "中国語初級A3", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 1, semester: "前期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLZH004", name: "中国語初級A4", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 1, semester: "前期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLZH005", name: "中国語初級B1", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 1, semester: "後期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLZH006", name: "中国語初級B2", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 1, semester: "後期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLZH007", name: "中国語初級B3", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 1, semester: "後期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLZH008", name: "中国語初級B4", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 1, semester: "後期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLZH009", name: "中国語初級SA3", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 2, semester: "前期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLZH010", name: "中国語初級SA4", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 2, semester: "前期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLZH011", name: "中国語初級SB3", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 2, semester: "後期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLZH012", name: "中国語初級SB4", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 2, semester: "後期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLZH013", name: "中国語中級C1", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLZH014", name: "中国語中級C2", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  // 外国語系 第Ⅱ — ロシア語
  { id: "FLRU001", name: "ロシア語初級A1", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 1, semester: "前期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLRU002", name: "ロシア語初級A2", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 1, semester: "前期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLRU003", name: "ロシア語初級A3", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 1, semester: "前期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLRU004", name: "ロシア語初級A4", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 1, semester: "前期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLRU005", name: "ロシア語初級B1", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 1, semester: "後期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLRU006", name: "ロシア語初級B2", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 1, semester: "後期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLRU007", name: "ロシア語初級B3", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 1, semester: "後期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLRU008", name: "ロシア語初級B4", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 1, semester: "後期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLRU009", name: "ロシア語初級SA3", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 2, semester: "前期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLRU010", name: "ロシア語初級SA4", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 2, semester: "前期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLRU011", name: "ロシア語初級SB3", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 2, semester: "後期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLRU012", name: "ロシア語初級SB4", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: 2, semester: "後期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLRU013", name: "ロシア語中級C1", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FLRU014", name: "ロシア語中級C2", credits: 0.5, category: CAT.FOREIGN_LANG_2, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },

  // ==========================================================================
  // 健康・スポーツ科学系 — 選択
  // ==========================================================================
  { id: "HS001", name: "健康・スポーツ科学講義A",   credits: 1,   category: CAT.HEALTH_SPORTS, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "HS002", name: "健康・スポーツ科学講義B",   credits: 1,   category: CAT.HEALTH_SPORTS, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "HS003", name: "健康・スポーツ科学実習基礎", credits: 1,   category: CAT.HEALTH_SPORTS, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "HS004", name: "健康・スポーツ科学実習1",   credits: 0.5, category: CAT.HEALTH_SPORTS, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "HS005", name: "健康・スポーツ科学実習2",   credits: 0.5, category: CAT.HEALTH_SPORTS, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },

  // ==========================================================================
  // 共通専門基礎科目 — 選択 各1単位(計16単位以上)
  // ==========================================================================
  { id: "INFO002", name: "情報科学1", credits: 1, category: CAT.COMMON_PRO_BASIC, subcategory: E, isFacultyDesignated: false, year: null, semester: "前期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "INFO003", name: "情報科学2", credits: 1, category: CAT.COMMON_PRO_BASIC, subcategory: E, isFacultyDesignated: false, year: null, semester: "後期", teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "CPB001", name: "線形代数1", credits: 1, category: CAT.COMMON_PRO_BASIC, subcategory: E, isFacultyDesignated: false, year: null, semester: "前期", teacher: "大須賀　昇", syllabus: null, evaluation: null, note: null },
  { id: "CPB002", name: "線形代数2", credits: 1, category: CAT.COMMON_PRO_BASIC, subcategory: E, isFacultyDesignated: false, year: null, semester: "前期", teacher: "大須賀　昇", syllabus: null, evaluation: null, note: null },
  { id: "CPB003", name: "線形代数3", credits: 1, category: CAT.COMMON_PRO_BASIC, subcategory: E, isFacultyDesignated: false, year: null, semester: "後期", teacher: "山田　智宏", syllabus: null, evaluation: null, note: null },
  { id: "CPB004", name: "線形代数4", credits: 1, category: CAT.COMMON_PRO_BASIC, subcategory: E, isFacultyDesignated: false, year: null, semester: "後期", teacher: "山田　智宏", syllabus: null, evaluation: null, note: null },
  { id: "CPB005", name: "微分積分入門1", credits: 1, category: CAT.COMMON_PRO_BASIC, subcategory: E, isFacultyDesignated: false, year: null, semester: "前期", teacher: "尾形　尚子", syllabus: null, evaluation: null, note: null },
  { id: "CPB006", name: "微分積分入門2", credits: 1, category: CAT.COMMON_PRO_BASIC, subcategory: E, isFacultyDesignated: false, year: null, semester: "前期", teacher: "尾形　尚子", syllabus: null, evaluation: null, note: null },
  { id: "CPB007", name: "微分積分1", credits: 1, category: CAT.COMMON_PRO_BASIC, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "CPB008", name: "微分積分2", credits: 1, category: CAT.COMMON_PRO_BASIC, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "CPB009", name: "基礎無機化学1", credits: 1, category: CAT.COMMON_PRO_BASIC, subcategory: E, isFacultyDesignated: false, year: null, semester: "前期", teacher: "梶並　昭彦", syllabus: null, evaluation: null, note: null },
  { id: "CPB010", name: "基礎無機化学2", credits: 1, category: CAT.COMMON_PRO_BASIC, subcategory: E, isFacultyDesignated: false, year: null, semester: "前期", teacher: "梶並　昭彦", syllabus: null, evaluation: null, note: null },
  { id: "CPB011", name: "基礎有機化学1", credits: 1, category: CAT.COMMON_PRO_BASIC, subcategory: E, isFacultyDesignated: false, year: null, semester: "前期", teacher: "今田　泰嗣", syllabus: null, evaluation: null, note: null },
  { id: "CPB012", name: "基礎有機化学2", credits: 1, category: CAT.COMMON_PRO_BASIC, subcategory: E, isFacultyDesignated: false, year: null, semester: "前期", teacher: "今田　泰嗣", syllabus: null, evaluation: null, note: null },
  { id: "CPB013", name: "生物学概論D1", credits: 1, category: CAT.COMMON_PRO_BASIC, subcategory: E, isFacultyDesignated: false, year: null, semester: "前期", teacher: "石井　尊生", syllabus: null, evaluation: null, note: null },
  { id: "CPB014", name: "生物学概論D2", credits: 1, category: CAT.COMMON_PRO_BASIC, subcategory: E, isFacultyDesignated: false, year: null, semester: "前期", teacher: "中屋敷　均", syllabus: null, evaluation: null, note: null },
  { id: "CPB015", name: "生物学各論D1", credits: 1, category: CAT.COMMON_PRO_BASIC, subcategory: E, isFacultyDesignated: false, year: null, semester: "後期", teacher: null, syllabus: null, evaluation: null, note: "旧制度の生物学各論B1から変更" },
  { id: "CPB016", name: "生物学各論D2", credits: 1, category: CAT.COMMON_PRO_BASIC, subcategory: E, isFacultyDesignated: false, year: null, semester: "後期", teacher: null, syllabus: null, evaluation: null, note: "旧制度の生物学各論B2から変更" },
  { id: "CPB017", name: "数理統計1", credits: 1, category: CAT.COMMON_PRO_BASIC, subcategory: E, isFacultyDesignated: false, year: null, semester: "後期", teacher: "稲葉　太一", syllabus: null, evaluation: null, note: null },
  { id: "CPB018", name: "数理統計2", credits: 1, category: CAT.COMMON_PRO_BASIC, subcategory: E, isFacultyDesignated: false, year: null, semester: "後期", teacher: "稲葉　太一", syllabus: null, evaluation: null, note: null },

  // ==========================================================================
  // 学部共通科目
  // 必修5単位 = 食の倫理(2) + 緑の保全(2) + English for Agricultural Science(1)
  // ==========================================================================
  { id: "FC001", name: "食の倫理",                          credits: 2, category: CAT.PRO_FACULTY_COMMON, subcategory: R, isFacultyDesignated: false, year: null, semester: "後期", teacher: "山下　陽子", syllabus: null, evaluation: null, note: null },
  { id: "FC002", name: "緑の保全",                          credits: 2, category: CAT.PRO_FACULTY_COMMON, subcategory: R, isFacultyDesignated: false, year: null, semester: "後期", teacher: "藤嶽　暢英", syllabus: null, evaluation: null, note: null },
  { id: "FC009", name: "English for Agricultural Science",  credits: 1, category: CAT.PRO_FACULTY_COMMON, subcategory: R, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "1単位(2025年度以降確定)" },
  { id: "FC003", name: "実践農学入門",                      credits: 2, category: CAT.PRO_FACULTY_COMMON, subcategory: E, isFacultyDesignated: true,  year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "学部指定科目" },
  { id: "FC004", name: "実践農学",                          credits: 2, category: CAT.PRO_FACULTY_COMMON, subcategory: E, isFacultyDesignated: true,  year: null, semester: "後期", teacher: "中塚　雅也", syllabus: null, evaluation: null, note: "学部指定科目" },
  { id: "FC005", name: "農場と食卓をつなぐフィールド演習",  credits: 1, category: CAT.PRO_FACULTY_COMMON, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FC006", name: "食の安全科学実践検査学",            credits: 1, category: CAT.PRO_FACULTY_COMMON, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FC007", name: "食の安全科学技術演習",              credits: 2, category: CAT.PRO_FACULTY_COMMON, subcategory: E, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  // 旧制度では高度教養科目だったが2025年度から学部共通科目(選択)に移動
  { id: "ALC001", name: "兵庫県農業環境論A",               credits: 1, category: CAT.PRO_FACULTY_COMMON, subcategory: E, isFacultyDesignated: false, year: 2, semester: "後期", teacher: "中塚　雅也", syllabus: null, evaluation: null, note: "2025年度以降は学部共通選択科目" },
  { id: "ALC002", name: "兵庫県農業環境論B",               credits: 1, category: CAT.PRO_FACULTY_COMMON, subcategory: E, isFacultyDesignated: false, year: 2, semester: "後期", teacher: "髙田　晋史", syllabus: null, evaluation: null, note: "2025年度以降は学部共通選択科目" },

  // ==========================================================================
  // 学科共通科目 — 必修 計16単位
  // ==========================================================================
  { id: "DC001", name: "食料環境システム学概論Ⅰ",  credits: 2,  category: CAT.PRO_DEPT_COMMON, subcategory: R, isFacultyDesignated: false, year: null, semester: "前期", teacher: "澤田　豊",  syllabus: null, evaluation: null, note: null },
  { id: "DC002", name: "食料環境システム学概論Ⅱ",  credits: 2,  category: CAT.PRO_DEPT_COMMON, subcategory: R, isFacultyDesignated: false, year: null, semester: "前期", teacher: "伊藤　博通", syllabus: null, evaluation: null, note: null },
  { id: "DC003", name: "食料環境システム学概論Ⅲ",  credits: 2,  category: CAT.PRO_DEPT_COMMON, subcategory: R, isFacultyDesignated: false, year: null, semester: "後期", teacher: "石田　章",  syllabus: null, evaluation: null, note: null },
  { id: "DC004", name: "卒業研究",                  credits: 10, category: CAT.PRO_DEPT_COMMON, subcategory: R, isFacultyDesignated: false, year: 4,    semester: "通年",  teacher: null,      syllabus: null, evaluation: null, note: null },

  // ==========================================================================
  // 食料環境経済学コース開講科目
  // 必修26単位 + 選択26単位 = 52単位
  // ==========================================================================
  // --- 必修(26単位) ---
  { id: "PC001", name: "食料経済学",               credits: 2, category: CAT.PRO_COURSE, subcategory: R, isFacultyDesignated: false, year: null, semester: "前期", teacher: "八木　浩平", syllabus: null, evaluation: null, note: null },
  { id: "PC002", name: "ミクロ経済学",             credits: 2, category: CAT.PRO_COURSE, subcategory: R, isFacultyDesignated: false, year: null, semester: "前期", teacher: "八木　浩平", syllabus: null, evaluation: null, note: null },
  { id: "PC003", name: "マクロ経済学",             credits: 2, category: CAT.PRO_COURSE, subcategory: R, isFacultyDesignated: false, year: null, semester: "後期", teacher: "石田　章",   syllabus: null, evaluation: null, note: null },
  { id: "PC004", name: "食料生産管理学",           credits: 2, category: CAT.PRO_COURSE, subcategory: R, isFacultyDesignated: false, year: null, semester: "前期", teacher: "中塚　雅也", syllabus: null, evaluation: null, note: null },
  { id: "PC005", name: "食料情報学",               credits: 2, category: CAT.PRO_COURSE, subcategory: R, isFacultyDesignated: false, year: null, semester: "後期", teacher: "八木　浩平", syllabus: null, evaluation: null, note: null },
  { id: "PC006", name: "食料環境経済学演習Ⅰ",     credits: 1, category: CAT.PRO_COURSE, subcategory: R, isFacultyDesignated: false, year: 2,    semester: "後期", teacher: "髙田　晋史", syllabus: null, evaluation: null, note: null },
  { id: "PC007", name: "食料環境経済学演習Ⅱ",     credits: 2, category: CAT.PRO_COURSE, subcategory: R, isFacultyDesignated: false, year: null, semester: null,   teacher: null,       syllabus: null, evaluation: null, note: null },
  { id: "PC008", name: "食料環境経済学演習Ⅲ",     credits: 2, category: CAT.PRO_COURSE, subcategory: R, isFacultyDesignated: false, year: null, semester: null,   teacher: null,       syllabus: null, evaluation: null, note: null },
  { id: "PC009", name: "農場実習Ⅱ",               credits: 2, category: CAT.PRO_COURSE, subcategory: R, isFacultyDesignated: false, year: null, semester: null,   teacher: null,       syllabus: null, evaluation: null, note: null },
  { id: "PC010", name: "途上国経済論",             credits: 2, category: CAT.PRO_COURSE, subcategory: R, isFacultyDesignated: false, year: null, semester: null,   teacher: null,       syllabus: null, evaluation: null, note: null },
  { id: "PC011", name: "組織管理論",               credits: 2, category: CAT.PRO_COURSE, subcategory: R, isFacultyDesignated: false, year: null, semester: null,   teacher: null,       syllabus: null, evaluation: null, note: null },
  { id: "PC012", name: "食料産業論",               credits: 2, category: CAT.PRO_COURSE, subcategory: R, isFacultyDesignated: false, year: null, semester: null,   teacher: null,       syllabus: null, evaluation: null, note: null },
  { id: "PC013", name: "食料政策",                 credits: 2, category: CAT.PRO_COURSE, subcategory: R, isFacultyDesignated: false, year: null, semester: null,   teacher: null,       syllabus: null, evaluation: null, note: null },
  { id: "PC014", name: "外国書講読",               credits: 2, category: CAT.PRO_COURSE, subcategory: R, isFacultyDesignated: false, year: null, semester: "前期", teacher: "小川　景司", syllabus: null, evaluation: null, note: null },
  // --- 選択(26単位) ---
  { id: "PC015", name: "農業計算学",               credits: 2, category: CAT.PRO_COURSE, subcategory: E, isFacultyDesignated: false, year: null, semester: "前期", teacher: "中塚　雅也", syllabus: null, evaluation: null, note: null },
  { id: "PC016", name: "地域調査論",               credits: 2, category: CAT.PRO_COURSE, subcategory: E, isFacultyDesignated: false, year: null, semester: null,   teacher: null,       syllabus: null, evaluation: null, note: null },
  { id: "PC017", name: "農村発展論",               credits: 2, category: CAT.PRO_COURSE, subcategory: E, isFacultyDesignated: false, year: null, semester: null,   teacher: null,       syllabus: null, evaluation: null, note: null },
  { id: "PC018", name: "食料経済・政策学特別講義", credits: 2, category: CAT.PRO_COURSE, subcategory: E, isFacultyDesignated: false, year: null, semester: null,   teacher: null,       syllabus: null, evaluation: null, note: null },
  { id: "PC019", name: "農業農村経営学特別講義",   credits: 2, category: CAT.PRO_COURSE, subcategory: E, isFacultyDesignated: false, year: null, semester: null,   teacher: null,       syllabus: null, evaluation: null, note: null },
  { id: "PC020", name: "国際食料情報学特別講義",   credits: 2, category: CAT.PRO_COURSE, subcategory: E, isFacultyDesignated: false, year: null, semester: null,   teacher: null,       syllabus: null, evaluation: null, note: null },

  // ==========================================================================
  // 関連科目(他コース・他学科開講)— 選択 計12単位以上
  // ==========================================================================
  // 他コース開講
  { id: "OC001", name: "農村環境論",                 credits: 2, category: CAT.PRO_RELATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null,   teacher: null,       syllabus: null, evaluation: null, note: "他コース開講" },
  { id: "OC002", name: "地域計画論",                 credits: 2, category: CAT.PRO_RELATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null,   teacher: null,       syllabus: null, evaluation: null, note: "他コース開講" },
  { id: "OC003", name: "土地改良法",                 credits: 2, category: CAT.PRO_RELATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null,   teacher: null,       syllabus: null, evaluation: null, note: "他コース開講" },
  { id: "OC004", name: "バイオシステム工学特別講義B", credits: 2, category: CAT.PRO_RELATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null,   teacher: null,       syllabus: null, evaluation: null, note: "他コース開講" },
  // 他学科開講
  { id: "OD001", name: "食用作物学",     credits: 2, category: CAT.PRO_RELATED, subcategory: E, isFacultyDesignated: false, year: null, semester: "前期", teacher: "深山　浩",    syllabus: null, evaluation: null, note: "他学科開講" },
  { id: "OD002", name: "果樹園芸学",     credits: 2, category: CAT.PRO_RELATED, subcategory: E, isFacultyDesignated: false, year: null, semester: "後期", teacher: "安田　剛志",  syllabus: null, evaluation: null, note: "他学科開講" },
  { id: "OD003", name: "野菜園芸学1",    credits: 1, category: CAT.PRO_RELATED, subcategory: E, isFacultyDesignated: false, year: null, semester: "前期", teacher: "宇野　雄一",  syllabus: null, evaluation: null, note: "他学科開講" },
  { id: "OD004", name: "野菜園芸学2",    credits: 1, category: CAT.PRO_RELATED, subcategory: E, isFacultyDesignated: false, year: null, semester: "前期", teacher: "宇野　雄一",  syllabus: null, evaluation: null, note: "他学科開講" },
  { id: "OD005", name: "森林生態学",     credits: 2, category: CAT.PRO_RELATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null,   teacher: null,          syllabus: null, evaluation: null, note: "他学科開講" },
  { id: "OD006", name: "基礎昆虫学A",   credits: 1, category: CAT.PRO_RELATED, subcategory: E, isFacultyDesignated: false, year: null, semester: "前期", teacher: "杉浦　真治",  syllabus: null, evaluation: null, note: "他学科開講" },
  { id: "OD007", name: "基礎昆虫学B",   credits: 1, category: CAT.PRO_RELATED, subcategory: E, isFacultyDesignated: false, year: null, semester: "前期", teacher: "坂本　克彦",  syllabus: null, evaluation: null, note: "他学科開講" },
  { id: "OD008", name: "基礎植物病理学", credits: 2, category: CAT.PRO_RELATED, subcategory: E, isFacultyDesignated: false, year: null, semester: "後期", teacher: "池田　健一",  syllabus: null, evaluation: null, note: "他学科開講" },
  { id: "OD009", name: "植物育種学",     credits: 2, category: CAT.PRO_RELATED, subcategory: E, isFacultyDesignated: false, year: null, semester: "後期", teacher: "石井　尊生",  syllabus: null, evaluation: null, note: "他学科開講" },
  { id: "OD010", name: "園芸栽培学1",   credits: 1, category: CAT.PRO_RELATED, subcategory: E, isFacultyDesignated: false, year: null, semester: "後期", teacher: "宇野　雄一",  syllabus: null, evaluation: null, note: "他学科開講" },
  { id: "OD011", name: "園芸栽培学2",   credits: 1, category: CAT.PRO_RELATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null,   teacher: null,          syllabus: null, evaluation: null, note: "他学科開講" },
  { id: "OD012", name: "園芸植物繁殖学", credits: 2, category: CAT.PRO_RELATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null,   teacher: null,          syllabus: null, evaluation: null, note: "他学科開講" },
  { id: "OD013", name: "産業資源植物学", credits: 2, category: CAT.PRO_RELATED, subcategory: E, isFacultyDesignated: false, year: null, semester: "後期", teacher: "畠中　知子",  syllabus: null, evaluation: null, note: "他学科開講" },
  { id: "OD014", name: "花卉園芸学1",   credits: 1, category: CAT.PRO_RELATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null,   teacher: null,          syllabus: null, evaluation: null, note: "他学科開講" },
  { id: "OD015", name: "花卉園芸学2",   credits: 1, category: CAT.PRO_RELATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null,   teacher: null,          syllabus: null, evaluation: null, note: "他学科開講" },
  { id: "OD016", name: "造園学",         credits: 2, category: CAT.PRO_RELATED, subcategory: E, isFacultyDesignated: false, year: null, semester: null,   teacher: null,          syllabus: null, evaluation: null, note: "他学科開講" },
]
