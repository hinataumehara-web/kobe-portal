// ============================================================================
// 神戸大学 農学部 食料環境システム学科 食料環境経済学コース
// 科目データ(2026/4/23時点)
//
// 【未入力項目について】
// year / semester / teacher / syllabus / evaluation が null の科目は
// シラバスPDFから Claude Code で一括追加する想定。
//
// 【自由科目の扱いについて】
// 自由科目(農学部最大8 + 他学部最大2 = 合計10単位)は、
// 履修可能な科目のバリエーションが非常に多いため、
// courses.js への網羅的な登録は行わない。
//
// 単位計算ツール上で「自由科目(農学部開講)」「自由科目(他学部開講)」
// のカテゴリを選んで、ユーザーが科目名・単位数を自由入力する方式とする。
//
// 現在 courses.js に登録されている他学科開講科目(OD001〜OD016)は、
// 自コース生が履修しやすい科目の「参考リスト」として残してある。
//
// 【基礎教養科目について】
// 別画像で受領予定。末尾の TODO セクション参照。
// ============================================================================

/**
 * @typedef {Object} Course
 * @property {string} id - 科目ID(カテゴリ略称 + 連番)
 * @property {string} name - 科目名
 * @property {number|null} credits - 単位数
 * @property {string} category - 大分類(卒業要件と対応)
 * @property {string} subcategory - 小分類("必修" | "選択" | "自由")
 * @property {boolean} isFacultyDesignated - 学部指定科目(履修登録上限を超えて登録可能)
 * @property {number|null} year - 開講学年
 * @property {"前期"|"後期"|"通年"|null} semester - 開講学期
 * @property {string|null} teacher - 担当教員
 * @property {string|null} syllabus - シラバス概要
 * @property {string|null} evaluation - 評価方法
 * @property {string|null} note - 備考(学部指定科目など特記事項)
 */

// ----------------------------------------------------------------------------
// 卒業要件の分類定義
// ----------------------------------------------------------------------------
// この CATEGORIES / SUBCATEGORIES は requirements.js でも参照する共通定数。
// 文字列を直書きせず、必ずこの定数経由で参照すること。
// ----------------------------------------------------------------------------

export const CATEGORIES = {
  // ===== 教養系(要追加)=====
  BASIC_LIBERAL: "基礎教養科目",                          // 6単位必要
  GENERAL_LIBERAL: "総合教養科目",                        // 6単位必要
  FOREIGN_LANG_1: "外国語科目Ⅰ",                         // 4単位必要
  FOREIGN_LANG_2: "外国語科目Ⅱ",                         // 4単位必要
  INFO: "情報科目",                                       // 1単位必要
  HEALTH_SPORTS: "健康・スポーツ科学",                    // 1単位必要
  ADVANCED_LIBERAL_COURSE: "高度教養科目(自コース指定)", // 2単位必要
  ADVANCED_LIBERAL_OTHER: "高度教養科目(その他)",        // 2単位必要

  // ===== 専門系 =====
  COMMON_PRO_BASIC: "共通専門基礎科目",                   // 選択16単位必要
  PRO_FACULTY_COMMON: "学部共通科目",                     // 専門必修の一部
  SEMINAR: "初年次セミナー", 　　　　　　　　　　　　　　　　　//初年次セミナー（1単位）
  PRO_DEPT_COMMON: "学科共通科目",                        // 専門必修の一部
  PRO_COURSE: "食料環境経済学コース開講科目",             // 専門必修+選択
  PRO_OTHER_COURSE: "他コース開講科目",                   // 選択
  PRO_FREE_AGRI: "自由科目(農学部開講)",                // 最大8単位までカウント
  PRO_FREE_OTHER: "自由科目(他学部開講)",               // 最大2単位までカウント
};

export const SUBCATEGORIES = {
  REQUIRED: "必修",
  ELECTIVE: "選択",
  FREE: "自由",
};

// ----------------------------------------------------------------------------
// 科目リスト
// ----------------------------------------------------------------------------

export const courses = [
  // ==========================================================================
  // 共通専門基礎科目(選択のみ、16単位必要)
  // ==========================================================================
  { id: "CPB001", name: "線形代数1", credits: 1, category: CATEGORIES.COMMON_PRO_BASIC, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: "前期", teacher: "大須賀　昇", syllabus: null, evaluation: null, note: null },
  { id: "CPB002", name: "線形代数2", credits: 1, category: CATEGORIES.COMMON_PRO_BASIC, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: "前期", teacher: "大須賀　昇", syllabus: null, evaluation: null, note: null },
  { id: "CPB003", name: "線形代数3", credits: 1, category: CATEGORIES.COMMON_PRO_BASIC, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: "後期", teacher: "山田　智宏", syllabus: null, evaluation: null, note: null },
  { id: "CPB004", name: "線形代数4", credits: 1, category: CATEGORIES.COMMON_PRO_BASIC, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: "後期", teacher: "山田　智宏", syllabus: null, evaluation: null, note: null },
  { id: "CPB005", name: "微分積分入門1", credits: 1, category: CATEGORIES.COMMON_PRO_BASIC, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: "前期", teacher: "尾形　尚子", syllabus: null, evaluation: null, note: null },
  { id: "CPB006", name: "微分積分入門2", credits: 1, category: CATEGORIES.COMMON_PRO_BASIC, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: "前期", teacher: "尾形　尚子", syllabus: null, evaluation: null, note: null },
  { id: "CPB007", name: "微分積分1", credits: 1, category: CATEGORIES.COMMON_PRO_BASIC, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "CPB008", name: "微分積分2", credits: 1, category: CATEGORIES.COMMON_PRO_BASIC, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "CPB009", name: "基礎無機化学1", credits: 1, category: CATEGORIES.COMMON_PRO_BASIC, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: "前期", teacher: "梶並　昭彦", syllabus: null, evaluation: null, note: null },
  { id: "CPB010", name: "基礎無機化学2", credits: 1, category: CATEGORIES.COMMON_PRO_BASIC, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: "前期", teacher: "梶並　昭彦", syllabus: null, evaluation: null, note: null },
  { id: "CPB011", name: "基礎有機化学1", credits: 1, category: CATEGORIES.COMMON_PRO_BASIC, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: "前期", teacher: "今田　泰嗣", syllabus: null, evaluation: null, note: null },
  { id: "CPB012", name: "基礎有機化学2", credits: 1, category: CATEGORIES.COMMON_PRO_BASIC, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: "前期", teacher: "今田　泰嗣", syllabus: null, evaluation: null, note: null },
  { id: "CPB013", name: "生物学概論D1", credits: 1, category: CATEGORIES.COMMON_PRO_BASIC, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: "前期", teacher: "石井　尊生", syllabus: null, evaluation: null, note: null },
  { id: "CPB014", name: "生物学概論D2", credits: 1, category: CATEGORIES.COMMON_PRO_BASIC, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: "前期", teacher: "中屋敷　均", syllabus: null, evaluation: null, note: null },
  { id: "CPB015", name: "生物学各論B1", credits: 1, category: CATEGORIES.COMMON_PRO_BASIC, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: "後期", teacher: "原　登志彦", syllabus: null, evaluation: null, note: null },
  { id: "CPB016", name: "生物学各論B2", credits: 1, category: CATEGORIES.COMMON_PRO_BASIC, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: "後期", teacher: "原　登志彦", syllabus: null, evaluation: null, note: null },
  { id: "CPB017", name: "数理統計1", credits: 1, category: CATEGORIES.COMMON_PRO_BASIC, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: "後期", teacher: "稲葉　太一", syllabus: null, evaluation: null, note: null },
  { id: "CPB018", name: "数理統計2", credits: 1, category: CATEGORIES.COMMON_PRO_BASIC, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: "後期", teacher: "稲葉　太一", syllabus: null, evaluation: null, note: null },

  // ==========================================================================
  // 学部共通科目
  // ==========================================================================
  { id: "FC001", name: "食の倫理", credits: 2, category: CATEGORIES.PRO_FACULTY_COMMON, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: "後期", teacher: "山下　陽子", syllabus: null, evaluation: null, note: null },
  { id: "FC002", name: "緑の保全", credits: 2, category: CATEGORIES.PRO_FACULTY_COMMON, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: "後期", teacher: "藤嶽　暢英", syllabus: null, evaluation: null, note: null },
  { id: "FC003", name: "実践農学入門", credits: 2, category: CATEGORIES.PRO_FACULTY_COMMON, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: true, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "学部指定科目" },
  { id: "FC004", name: "実践農学", credits: 2, category: CATEGORIES.PRO_FACULTY_COMMON, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: true, year: null, semester: "後期", teacher: "中塚　雅也", syllabus: null, evaluation: null, note: "学部指定科目" },
  { id: "FC005", name: "農場と食卓をつなぐフィールド演習", credits: 1, category: CATEGORIES.PRO_FACULTY_COMMON, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FC006", name: "食の安全科学実践検査学", credits: 1, category: CATEGORIES.PRO_FACULTY_COMMON, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FC007", name: "食の安全科学技術演習", credits: 2, category: CATEGORIES.PRO_FACULTY_COMMON, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FC008", name: "初年次セミナー", credits: 1, category: CATEGORIES.SEMINAR, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: 1, semester: "前期", teacher: "東　哲司", syllabus: null, evaluation: null, note: null, isPassFail: true },
  { id: "FC009", name: "English for Agricultural Science", credits: 2, category: CATEGORIES.PRO_FACULTY_COMMON, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "単位数要確認" },

  // ==========================================================================
  // 学科共通科目
  // ==========================================================================
  { id: "DC001", name: "食料環境システム学概論Ⅰ", credits: 2, category: CATEGORIES.PRO_DEPT_COMMON, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: "前期", teacher: "澤田　豊", syllabus: null, evaluation: null, note: null },
  { id: "DC002", name: "食料環境システム学概論Ⅱ", credits: 2, category: CATEGORIES.PRO_DEPT_COMMON, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: "前期", teacher: "伊藤　博通", syllabus: null, evaluation: null, note: null },
  { id: "DC003", name: "食料環境システム学概論Ⅲ", credits: 2, category: CATEGORIES.PRO_DEPT_COMMON, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: "後期", teacher: "石田　章", syllabus: null, evaluation: null, note: null },
  { id: "DC004", name: "卒業研究", credits: 10, category: CATEGORIES.PRO_DEPT_COMMON, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: 4, semester: "通年", teacher: null, syllabus: null, evaluation: null, note: null },

  // ==========================================================================
  // 食料環境経済学コース開講科目
  // ==========================================================================
  // --- 必修 ---
  { id: "PC001", name: "食料経済学", credits: 2, category: CATEGORIES.PRO_COURSE, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: "前期", teacher: "八木　浩平", syllabus: null, evaluation: null, note: null },
  { id: "PC002", name: "ミクロ経済学", credits: 2, category: CATEGORIES.PRO_COURSE, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: "前期", teacher: "八木　浩平", syllabus: null, evaluation: null, note: null },
  { id: "PC003", name: "マクロ経済学", credits: 2, category: CATEGORIES.PRO_COURSE, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: "後期", teacher: "石田　章", syllabus: null, evaluation: null, note: null },
  { id: "PC004", name: "食料生産管理学", credits: 2, category: CATEGORIES.PRO_COURSE, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: "前期", teacher: "中塚　雅也", syllabus: null, evaluation: null, note: null },
  { id: "PC005", name: "食料情報学", credits: 2, category: CATEGORIES.PRO_COURSE, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: "後期", teacher: "八木　浩平", syllabus: null, evaluation: null, note: null },
  { id: "PC006", name: "食料環境経済学演習Ⅰ", credits: 1, category: CATEGORIES.PRO_COURSE, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: 2, semester: "後期", teacher: "髙田　晋史", syllabus: null, evaluation: null, note: null },
  { id: "PC007", name: "食料環境経済学演習Ⅱ", credits: 2, category: CATEGORIES.PRO_COURSE, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "PC008", name: "食料環境経済学演習Ⅲ", credits: 2, category: CATEGORIES.PRO_COURSE, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "PC009", name: "農場実習Ⅱ", credits: 2, category: CATEGORIES.PRO_COURSE, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "PC010", name: "途上国経済論", credits: 2, category: CATEGORIES.PRO_COURSE, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "PC011", name: "組織管理論", credits: 2, category: CATEGORIES.PRO_COURSE, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "PC012", name: "食料産業論", credits: 2, category: CATEGORIES.PRO_COURSE, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "PC013", name: "食料政策", credits: 2, category: CATEGORIES.PRO_COURSE, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "PC014", name: "外国書講読", credits: 2, category: CATEGORIES.PRO_COURSE, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: "前期", teacher: "小川　景司", syllabus: null, evaluation: null, note: null },

  // --- 選択 ---
  { id: "PC015", name: "農業計算学", credits: 2, category: CATEGORIES.PRO_COURSE, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: "前期", teacher: "中塚　雅也", syllabus: null, evaluation: null, note: null },
  { id: "PC016", name: "地域調査論", credits: 2, category: CATEGORIES.PRO_COURSE, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "PC017", name: "農村発展論", credits: 2, category: CATEGORIES.PRO_COURSE, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "PC018", name: "食料経済・政策学特別講義", credits: 2, category: CATEGORIES.PRO_COURSE, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "PC019", name: "農業農村経営学特別講義", credits: 2, category: CATEGORIES.PRO_COURSE, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "PC020", name: "国際食料情報学特別講義", credits: 2, category: CATEGORIES.PRO_COURSE, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },

  // ==========================================================================
  // 他コース開講科目(選択)
  // ==========================================================================
  { id: "OC001", name: "農村環境論", credits: 2, category: CATEGORIES.PRO_OTHER_COURSE, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "OC002", name: "地域計画論", credits: 2, category: CATEGORIES.PRO_OTHER_COURSE, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "OC003", name: "土地改良法", credits: 2, category: CATEGORIES.PRO_OTHER_COURSE, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "OC004", name: "バイオシステム工学特別講義B", credits: 2, category: CATEGORIES.PRO_OTHER_COURSE, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "OD001", name: "食用作物学", credits: 2, category: CATEGORIES.PRO_OTHER_COURSE, subcategory: SUBCATEGORIES.FREE, isFacultyDesignated: false, year: null, semester: "前期", teacher: "深山　浩", syllabus: null, evaluation: null, note: null },
  { id: "OD002", name: "果樹園芸学", credits: 2, category: CATEGORIES.PRO_OTHER_COURSE, subcategory: SUBCATEGORIES.FREE, isFacultyDesignated: false, year: null, semester: "後期", teacher: "安田　剛志", syllabus: null, evaluation: null, note: null },
  { id: "OD003", name: "野菜園芸学1", credits: 1, category: CATEGORIES.PRO_OTHER_COURSE, subcategory: SUBCATEGORIES.FREE, isFacultyDesignated: false, year: null, semester: "前期", teacher: "宇野　雄一", syllabus: null, evaluation: null, note: null },
  { id: "OD004", name: "野菜園芸学2", credits: 1, category: CATEGORIES.PRO_OTHER_COURSE, subcategory: SUBCATEGORIES.FREE, isFacultyDesignated: false, year: null, semester: "前期", teacher: "宇野　雄一", syllabus: null, evaluation: null, note: null },
  { id: "OD005", name: "森林生態学", credits: 2, category: CATEGORIES.PRO_OTHER_COURSE, subcategory: SUBCATEGORIES.FREE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "OD006", name: "基礎昆虫学A", credits: 1, category: CATEGORIES.PRO_OTHER_COURSE, subcategory: SUBCATEGORIES.FREE, isFacultyDesignated: false, year: null, semester: "前期", teacher: "杉浦　真治", syllabus: null, evaluation: null, note: null },
  { id: "OD007", name: "基礎昆虫学B", credits: 1, category: CATEGORIES.PRO_OTHER_COURSE, subcategory: SUBCATEGORIES.FREE, isFacultyDesignated: false, year: null, semester: "前期", teacher: "坂本　克彦", syllabus: null, evaluation: null, note: null },
  { id: "OD008", name: "基礎植物病理学", credits: 2, category: CATEGORIES.PRO_OTHER_COURSE, subcategory: SUBCATEGORIES.FREE, isFacultyDesignated: false, year: null, semester: "後期", teacher: "池田　健一", syllabus: null, evaluation: null, note: null },
  { id: "OD009", name: "植物育種学", credits: 2, category: CATEGORIES.PRO_OTHER_COURSE, subcategory: SUBCATEGORIES.FREE, isFacultyDesignated: false, year: null, semester: "後期", teacher: "石井　尊生", syllabus: null, evaluation: null, note: null },
  { id: "OD010", name: "園芸栽培学1", credits: 1, category: CATEGORIES.PRO_OTHER_COURSE, subcategory: SUBCATEGORIES.FREE, isFacultyDesignated: false, year: null, semester: "後期", teacher: "宇野　雄一", syllabus: null, evaluation: null, note: null },
  { id: "OD011", name: "園芸栽培学2", credits: 1, category: CATEGORIES.PRO_OTHER_COURSE, subcategory: SUBCATEGORIES.FREE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "OD012", name: "園芸植物繁殖学", credits: 2, category: CATEGORIES.PRO_OTHER_COURSE, subcategory: SUBCATEGORIES.FREE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "OD013", name: "産業資源植物学", credits: 2, category: CATEGORIES.PRO_OTHER_COURSE, subcategory: SUBCATEGORIES.FREE, isFacultyDesignated: false, year: null, semester: "後期", teacher: "畠中　知子", syllabus: null, evaluation: null, note: null },
  { id: "OD014", name: "花卉園芸学1", credits: 1, category: CATEGORIES.PRO_OTHER_COURSE, subcategory: SUBCATEGORIES.FREE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "OD015", name: "花卉園芸学2", credits: 1, category: CATEGORIES.PRO_OTHER_COURSE, subcategory: SUBCATEGORIES.FREE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "OD016", name: "造園学", credits: 2, category: CATEGORIES.PRO_OTHER_COURSE, subcategory: SUBCATEGORIES.FREE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },

  // ==========================================================================
  // 他学科開講科目(自由科目、農学部開講扱い)- 参考リスト
  // ※自由科目はユーザー自由入力方式のため、このセクションは参考用。
  // ※単位計算上は PRO_FREE_AGRI カテゴリで最大8単位まで算入。
  // ==========================================================================
  { id: "OD017", name: "動物資源学1", credits: 1, category: CATEGORIES.PRO_FREE_AGRI, subcategory: SUBCATEGORIES.FREE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "OD018", name: "動物資源学2", credits: 1, category: CATEGORIES.PRO_FREE_AGRI, subcategory: SUBCATEGORIES.FREE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "OD019", name: "植物栄養学", credits: 2, category: CATEGORIES.PRO_FREE_AGRI, subcategory: SUBCATEGORIES.FREE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "OD020", name: "作物進化学", credits: 2, category: CATEGORIES.PRO_FREE_AGRI, subcategory: SUBCATEGORIES.FREE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },

  //他学部開校自由科目（上限2単位）
  { id: "HS001", name: "健康・スポーツ科学講義A", credits: 1, category: CATEGORIES.PRO_FREE_OTHER, subcategory: SUBCATEGORIES.FREE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "HS002", name: "健康・スポーツ科学講義B", credits: 1, category: CATEGORIES.PRO_FREE_OTHER, subcategory: SUBCATEGORIES.FREE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "HS004", name: "健康・スポーツ科学実習1", credits: 0.5, category: CATEGORIES.PRO_FREE_OTHER, subcategory: SUBCATEGORIES.FREE, isFacultyDesignated: false, year: null, semester: "後期", teacher: "秋元　忍", syllabus: null, evaluation: null, note: null },
  { id: "HS005", name: "健康・スポーツ科学実習2", credits: 0.5, category: CATEGORIES.PRO_FREE_OTHER, subcategory: SUBCATEGORIES.FREE, isFacultyDesignated: false, year: null, semester: "後期", teacher: "秋元　忍", syllabus: null, evaluation: null, note: null },
  { id: "OH001", name: "総合科目Ⅰ", credits: 1, category: CATEGORIES.PRO_FREE_OTHER, subcategory: SUBCATEGORIES.FREE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "OH002", name: "総合科目Ⅱ", credits: 1, category: CATEGORIES.PRO_FREE_OTHER, subcategory: SUBCATEGORIES.FREE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },



  // ==========================================================================
  // 高度教養科目(自コース指定)- 2単位必要
  // ==========================================================================
  // 食料環境経済学コース指定の必修。2025年度生から履修不可の注記あり(要確認)
  { id: "ALC001", name: "兵庫県農業環境論A", credits: 1, category: CATEGORIES.ADVANCED_LIBERAL_COURSE, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: 2, semester: "後期", teacher: "中塚　雅也", syllabus: null, evaluation: null, note: "食料環境経済学コース指定科目(必修)/ 金・3 / 2025年度生から履修不可" },
  { id: "ALC002", name: "兵庫県農業環境論B", credits: 1, category: CATEGORIES.ADVANCED_LIBERAL_COURSE, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: 2, semester: "後期", teacher: "髙田　晋史", syllabus: null, evaluation: null, note: "食料環境経済学コース指定科目(必修)/ 金・3 / 2025年度生から履修不可" },

  // ==========================================================================
  // 高度教養科目(その他)- 2単位必要
  // ==========================================================================
  // 他コース開講の高度教養で履修可能なもの(自コース対象)
  { id: "ALO001", name: "食料と環境を支える工学", credits: 1, category: CATEGORIES.ADVANCED_LIBERAL_OTHER, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: 3, semester: "3Q", teacher: null, syllabus: null, evaluation: null, note: "火・1 / 入学年度により履修可否の制約あり(要確認)" },
  { id: "ALO002", name: "放射線科学", credits: 2, category: CATEGORIES.ADVANCED_LIBERAL_OTHER, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: 3, semester: "後期", teacher: null, syllabus: null, evaluation: null, note: "月・4 / 2025年度生から高度教養科目としては履修不可" },
  { id: "ALO003", name: "生物科学英語リスニング演習", credits: 1, category: CATEGORIES.ADVANCED_LIBERAL_OTHER, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: 3, semester: "2Q", teacher: null, syllabus: null, evaluation: null, note: "水・2 / 環境生物学コース・応用機能生物学コース履修不可 / 2025年度生から履修不可" },
  { id: "ALO004", name: "高度教養セミナー農学部生産環境工学入門", credits: 1, category: CATEGORIES.ADVANCED_LIBERAL_OTHER, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: 3, semester: "1Q", teacher: null, syllabus: null, evaluation: null, note: "金・5 / 上限1単位まで / 2025年度生から履修不可" },
  { id: "ALO005", name: "高度教養セミナー農学部応用動物学入門", credits: 1, category: CATEGORIES.ADVANCED_LIBERAL_OTHER, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: 3, semester: "3Q", teacher: null, syllabus: null, evaluation: null, note: "月・2 / 上限1単位まで / 2025年度生から履修不可" },
  { id: "ALO006", name: "高度教養セミナー農学部応用植物学入門", credits: 1, category: CATEGORIES.ADVANCED_LIBERAL_OTHER, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: 3, semester: "1Q", teacher: null, syllabus: null, evaluation: null, note: "月・1 / 上限1単位まで / 2025年度生から履修不可" },
  { id: "ALO007", name: "高度教養セミナー農学部応用生命化学入門", credits: 1, category: CATEGORIES.ADVANCED_LIBERAL_OTHER, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: 3, semester: "3Q", teacher: null, syllabus: null, evaluation: null, note: "月・3 / 上限1単位まで / 2025年度生から履修不可" },
  { id: "ALO008", name: "高度教養セミナー農学部環境生物学入門", credits: 1, category: CATEGORIES.ADVANCED_LIBERAL_OTHER, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: 3, semester: "1Q", teacher: null, syllabus: null, evaluation: null, note: "月・4 / 上限1単位まで / 2025年度生から履修不可" },
  { id: "ALO009", name: "高度教養セミナー農学部応用機能生物学入門", credits: 1, category: CATEGORIES.ADVANCED_LIBERAL_OTHER, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: 3, semester: "1Q", teacher: null, syllabus: null, evaluation: null, note: "月・4 / 上限1単位まで / 2025年度生から履修不可" },

  // ==========================================================================
  // 総合教養科目 - 6単位必要
  // ==========================================================================
  // キャリア科目
  { id: "GL001", name: "職業と学び―キャリアデザインを考えるA", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "キャリア科目" },
  { id: "GL002", name: "職業と学び―キャリアデザインを考えるB", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "キャリア科目" },
  { id: "GL003", name: "社会基礎学(グローバル人材に不可欠な教養)", credits: 2, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "キャリア科目" },
  { id: "GL004", name: "ボランティアと社会貢献活動A", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "キャリア科目" },
  { id: "GL005", name: "ボランティアと社会貢献活動B", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "キャリア科目" },
  { id: "GL006", name: "グローバルチャレンジ実習", credits: 2, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: "後期", teacher: "金丸　研吾", syllabus: null, evaluation: null, note: "キャリア科目 / 1又は2単位" },
  // 神戸学
  { id: "GL007", name: "神戸大学史A", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "神戸学" },
  { id: "GL008", name: "神戸大学史B", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "神戸学" },
  { id: "GL009", name: "阪神・淡路大震災と都市の安全", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "神戸学 / 阪神・淡路大震災" },
  { id: "GL010", name: "ひょうご神戸学", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "神戸学 / 地域連携" },
  { id: "GL011", name: "地域社会形成基礎論", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "神戸学 / 地域連携" },
  { id: "GL012", name: "日本酒学入門", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "神戸学 / 地域連携" },
  { id: "GL013", name: "海への誘い", credits: 2, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "神戸学" },
  { id: "GL014", name: "瀬戸内海学入門", credits: 2, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "神戸学" },
  // データサイエンス
  { id: "GL015", name: "データサイエンス概論A", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: "後期", teacher: "伊藤　真理", syllabus: null, evaluation: null, note: "データサイエンス" },
  { id: "GL016", name: "データサイエンス概論B", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: "後期", teacher: "小澤　誠一", syllabus: null, evaluation: null, note: "データサイエンス" },
  { id: "GL017", name: "データサイエンス基礎演習", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "データサイエンス" },

  // ==========================================================================
  // 外国語科目Ⅰ(Academic English 系)- 4単位必要
  // ==========================================================================
  // 各0.5単位。8科目取ると4単位
  // Communication系
  { id: "FL1_001", name: "Academic English Communication A1", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_1, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: "前期", teacher: "長嶺　圭子", syllabus: null, evaluation: null, note: null },
  { id: "FL1_002", name: "Academic English Communication A2", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_1, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: "前期", teacher: "長嶺　圭子", syllabus: null, evaluation: null, note: null },
  { id: "FL1_003", name: "Academic English Communication B1", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_1, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FL1_004", name: "Academic English Communication B2", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_1, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FL1_005", name: "Academic English Communication B1(選抜上級クラス)", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_1, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: "後期", teacher: "Brad Colpitts", syllabus: null, evaluation: null, note: "B1 選抜上級で代替可" },
  { id: "FL1_006", name: "Academic English Communication B2(選抜上級クラス)", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_1, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: "後期", teacher: "Brad Colpitts", syllabus: null, evaluation: null, note: "B2 選抜上級で代替可" },
  // Literacy系
  { id: "FL1_007", name: "Academic English Literacy A1", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_1, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: "前期", teacher: "深町　悟", syllabus: null, evaluation: null, note: null },
  { id: "FL1_008", name: "Academic English Literacy A2", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_1, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: "前期", teacher: "深町　悟", syllabus: null, evaluation: null, note: null },
  { id: "FL1_009", name: "Academic English Literacy B1", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_1, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FL1_010", name: "Academic English Literacy B2", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_1, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FL1_011", name: "Academic English Literacy B1(選抜上級クラス)", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_1, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: "後期", teacher: "Jimmy J.Aames", syllabus: null, evaluation: null, note: "B1 選抜上級で代替可" },
  { id: "FL1_012", name: "Academic English Literacy B2(選抜上級クラス)", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_1, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: "後期", teacher: "Jimmy J.Aames", syllabus: null, evaluation: null, note: "B2 選抜上級で代替可" },
  // その他
  { id: "FL1_013", name: "Advanced English Online 1", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_1, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FL1_014", name: "Advanced English Online 2", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_1, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "FL1_015", name: "Advanced English(海外研修)", credits: 1, category: CATEGORIES.FOREIGN_LANG_1, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },

  // ==========================================================================
  // 外国語科目Ⅱ(第2外国語)- 4単位必要
  // ==========================================================================
  // ドイツ語・フランス語・中国語・ロシア語から1言語を選択
  // 各0.5単位。8科目取ると4単位
  // --- ドイツ語 ---
  { id: "FL2_DE01", name: "ドイツ語初級A1", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "ドイツ語" },
  { id: "FL2_DE02", name: "ドイツ語初級A2", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "ドイツ語" },
  { id: "FL2_DE03", name: "ドイツ語初級B1", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "ドイツ語" },
  { id: "FL2_DE04", name: "ドイツ語初級B2", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "ドイツ語" },
  { id: "FL2_DE05", name: "ドイツ語初級A3", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "ドイツ語 / SA3で代替可" },
  { id: "FL2_DE06", name: "ドイツ語初級A4", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "ドイツ語 / SA4で代替可" },
  { id: "FL2_DE07", name: "ドイツ語初級B3", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "ドイツ語 / SB3で代替可" },
  { id: "FL2_DE08", name: "ドイツ語初級B4", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "ドイツ語 / SB4で代替可" },
  { id: "FL2_DE09", name: "ドイツ語初級SA3", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "ドイツ語" },
  { id: "FL2_DE10", name: "ドイツ語初級SA4", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "ドイツ語" },
  { id: "FL2_DE11", name: "ドイツ語初級SB3", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "ドイツ語" },
  { id: "FL2_DE12", name: "ドイツ語初級SB4", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "ドイツ語" },
  { id: "FL2_DE13", name: "ドイツ語中級C1", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "ドイツ語" },
  { id: "FL2_DE14", name: "ドイツ語中級C2", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "ドイツ語" },
  // --- フランス語 ---
  { id: "FL2_FR01", name: "フランス語初級A1", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "フランス語" },
  { id: "FL2_FR02", name: "フランス語初級A2", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "フランス語" },
  { id: "FL2_FR03", name: "フランス語初級B1", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "フランス語" },
  { id: "FL2_FR04", name: "フランス語初級B2", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "フランス語" },
  { id: "FL2_FR05", name: "フランス語初級A3", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "フランス語 / SA3で代替可" },
  { id: "FL2_FR06", name: "フランス語初級A4", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "フランス語 / SA4で代替可" },
  { id: "FL2_FR07", name: "フランス語初級B3", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "フランス語 / SB3で代替可" },
  { id: "FL2_FR08", name: "フランス語初級B4", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "フランス語 / SB4で代替可" },
  { id: "FL2_FR09", name: "フランス語初級SA3", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "フランス語" },
  { id: "FL2_FR10", name: "フランス語初級SA4", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "フランス語" },
  { id: "FL2_FR11", name: "フランス語初級SB3", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "フランス語" },
  { id: "FL2_FR12", name: "フランス語初級SB4", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "フランス語" },
  { id: "FL2_FR13", name: "フランス語中級C1", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "フランス語" },
  { id: "FL2_FR14", name: "フランス語中級C2", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "フランス語" },
  // --- 中国語 ---
  { id: "FL2_ZH01", name: "中国語初級A1", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: "前期", teacher: "アルチャ", syllabus: null, evaluation: null, note: "中国語" },
  { id: "FL2_ZH02", name: "中国語初級A2", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: "前期", teacher: "アルチャ", syllabus: null, evaluation: null, note: "中国語" },
  { id: "FL2_ZH03", name: "中国語初級B1", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: "前期", teacher: "姫　梅", syllabus: null, evaluation: null, note: "中国語" },
  { id: "FL2_ZH04", name: "中国語初級B2", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: "前期", teacher: "姫　梅", syllabus: null, evaluation: null, note: "中国語" },
  { id: "FL2_ZH05", name: "中国語初級A3", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: "後期", teacher: "劉　燕子", syllabus: null, evaluation: null, note: "中国語 / SA3で代替可" },
  { id: "FL2_ZH06", name: "中国語初級A4", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: "後期", teacher: "劉　燕子", syllabus: null, evaluation: null, note: "中国語 / SA4で代替可" },
  { id: "FL2_ZH07", name: "中国語初級B3", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: "後期", teacher: "周　俊", syllabus: null, evaluation: null, note: "中国語 / SB3で代替可" },
  { id: "FL2_ZH08", name: "中国語初級B4", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: "後期", teacher: "周　俊", syllabus: null, evaluation: null, note: "中国語 / SB4で代替可" },
  { id: "FL2_ZH09", name: "中国語初級SA3", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "中国語" },
  { id: "FL2_ZH10", name: "中国語初級SA4", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "中国語" },
  { id: "FL2_ZH11", name: "中国語初級SB3", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "中国語" },
  { id: "FL2_ZH12", name: "中国語初級SB4", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "中国語" },
  { id: "FL2_ZH13", name: "中国語中級C1", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "中国語" },
  { id: "FL2_ZH14", name: "中国語中級C2", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "中国語" },
  // --- ロシア語 ---
  { id: "FL2_RU01", name: "ロシア語初級A1", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "ロシア語" },
  { id: "FL2_RU02", name: "ロシア語初級A2", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "ロシア語" },
  { id: "FL2_RU03", name: "ロシア語初級B1", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "ロシア語" },
  { id: "FL2_RU04", name: "ロシア語初級B2", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "ロシア語" },
  { id: "FL2_RU05", name: "ロシア語初級A3", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "ロシア語" },
  { id: "FL2_RU06", name: "ロシア語初級A4", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "ロシア語" },
  { id: "FL2_RU07", name: "ロシア語初級B3", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "ロシア語" },
  { id: "FL2_RU08", name: "ロシア語初級B4", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "ロシア語" },
  { id: "FL2_RU09", name: "ロシア語中級C1", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "ロシア語" },
  { id: "FL2_RU10", name: "ロシア語中級C2", credits: 0.5, category: CATEGORIES.FOREIGN_LANG_2, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "ロシア語" },

  // ==========================================================================
  // 情報科目 - 1単位必要
  // ==========================================================================
  { id: "INFO001", name: "情報基礎", credits: 1, category: CATEGORIES.INFO, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: "前期", teacher: "村尾　元", syllabus: null, evaluation: null, note: null, isPassFail: true },
  { id: "INFO002", name: "情報科学1", credits: 1, category: CATEGORIES.INFO, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },
  { id: "INFO003", name: "情報科学2", credits: 1, category: CATEGORIES.INFO, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: null },

  // ==========================================================================
  // 健康・スポーツ科学 - 1単位必要
  // ==========================================================================
  { id: "HS003", name: "健康・スポーツ科学実習基礎", credits: 1, category: CATEGORIES.HEALTH_SPORTS, subcategory: SUBCATEGORIES.REQUIRED, isFacultyDesignated: false, year: null, semester: "前期", teacher: "秋元　忍", syllabus: null, evaluation: null, note: null },

  // ==========================================================================
  // 基礎教養科目 - 6単位必要
  // ==========================================================================
  // 斜線科目(必修・選択欄に斜線)は卒業要件算入の可否について要確認のため、
  // subcategory を "参考" として別扱い。暫定的に "選択" 扱いで登録しておく。
  // --- 人文系 ---
  { id: "BL001", name: "哲学", credits: 1, category: CATEGORIES.BASIC_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "人文系 / 哲学" },
  { id: "BL002", name: "心理学A", credits: 1, category: CATEGORIES.BASIC_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "人文系 / 心理学" },
  { id: "BL003", name: "心理学B", credits: 1, category: CATEGORIES.BASIC_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: "後期", teacher: "林　創", syllabus: null, evaluation: null, note: "人文系 / 心理学" },
  { id: "BL004", name: "論理学", credits: 1, category: CATEGORIES.BASIC_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "人文系 / 論理学" },
  { id: "BL005", name: "教育学A", credits: 1, category: CATEGORIES.BASIC_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "人文系 / 教育学" },
  { id: "BL006", name: "教育学B", credits: 1, category: CATEGORIES.BASIC_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: "後期", teacher: "大山　牧子", syllabus: null, evaluation: null, note: "人文系 / 教育学" },
  { id: "BL007", name: "倫理学", credits: 1, category: CATEGORIES.BASIC_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "人文系 / 倫理学" },
  // --- 社会科学系 ---
  { id: "BL008", name: "法学A", credits: 1, category: CATEGORIES.BASIC_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "社会科学系 / 法学" },
  { id: "BL009", name: "法学B", credits: 1, category: CATEGORIES.BASIC_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "社会科学系 / 法学" },
  { id: "BL010", name: "政治学A", credits: 1, category: CATEGORIES.BASIC_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "社会科学系 / 政治学" },
  { id: "BL011", name: "政治学B", credits: 1, category: CATEGORIES.BASIC_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "社会科学系 / 政治学" },
  { id: "BL012", name: "経済学A", credits: 1, category: CATEGORIES.BASIC_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "社会科学系 / 経済学 / ⚠️食料環境経済学コース履修不可" },
  { id: "BL013", name: "経済学B", credits: 1, category: CATEGORIES.BASIC_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "社会科学系 / 経済学 / ⚠️食料環境経済学コース履修不可" },
  { id: "BL014", name: "経営学", credits: 1, category: CATEGORIES.BASIC_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: "前期", teacher: "LI FANGKUN", syllabus: null, evaluation: null, note: "社会科学系 / 経営学" },
  { id: "BL015", name: "社会学", credits: 1, category: CATEGORIES.BASIC_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: "前期", teacher: "梅村　麦生", syllabus: null, evaluation: null, note: "社会科学系 / 社会学" },
  { id: "BL016", name: "教育社会学", credits: 1, category: CATEGORIES.BASIC_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "社会科学系 / 教育社会学" },
  { id: "BL017", name: "地理学", credits: 1, category: CATEGORIES.BASIC_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: "前期", teacher: "澤　宗則", syllabus: null, evaluation: null, note: "社会科学系 / 地理学" },
  // --- 生命科学系 ---
  { id: "BL018", name: "医学A", credits: 1, category: CATEGORIES.BASIC_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "生命科学系 / 医学" },
  { id: "BL019", name: "医学B", credits: 1, category: CATEGORIES.BASIC_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "生命科学系 / 医学" },
  { id: "BL020", name: "保健学A", credits: 1, category: CATEGORIES.BASIC_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "生命科学系 / 保健学" },
  { id: "BL021", name: "保健学B", credits: 1, category: CATEGORIES.BASIC_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "生命科学系 / 保健学" },
  { id: "BL022", name: "健康科学A", credits: 1, category: CATEGORIES.BASIC_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "生命科学系 / 保健学" },
  { id: "BL023", name: "健康科学B", credits: 1, category: CATEGORIES.BASIC_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "生命科学系 / 保健学" },
  // --- 自然科学系 ---
  // 注: 数学A〜D、統計学A・B、物理学A・B、化学A・B、情報学A・B、生物学A〜C は
  //     必修・選択欄が斜線で卒業要件に算入しないため登録しない
  { id: "BL037", name: "惑星学A", credits: 1, category: CATEGORIES.BASIC_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "自然科学系 / 惑星学" },
  { id: "BL038", name: "惑星学B", credits: 1, category: CATEGORIES.BASIC_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "自然科学系 / 惑星学" },
  { id: "BL041", name: "データサイエンス基礎学", credits: 1, category: CATEGORIES.BASIC_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: "前期", teacher: "山田　明", syllabus: null, evaluation: null, note: "自然科学系 / 情報科学" },

  // ==========================================================================
  // 総合教養科目 (1)多文化理解 (2)自然界の成り立ち - 追加分
  // ※前回登録済みの(5)キャリア科目 (6)神戸学 (7)データサイエンスと同じカテゴリ
  // ==========================================================================
  // (1) 多文化理解
  { id: "GL101", name: "教育と人間形成", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(1)多文化理解" },
  { id: "GL102", name: "文学A", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(1)多文化理解 / 文学" },
  { id: "GL103", name: "文学B", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(1)多文化理解 / 文学" },
  { id: "GL104", name: "言語科学A", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(1)多文化理解 / 言語科学" },
  { id: "GL105", name: "言語科学B", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(1)多文化理解 / 言語科学" },
  { id: "GL106", name: "芸術と文化A", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(1)多文化理解 / 芸術と文化" },
  { id: "GL107", name: "芸術と文化B", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(1)多文化理解 / 芸術と文化" },
  { id: "GL108", name: "日本史A", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(1)多文化理解 / 日本史" },
  { id: "GL109", name: "日本史B", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(1)多文化理解 / 日本史" },
  { id: "GL110", name: "東洋史A", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(1)多文化理解 / 東洋史" },
  { id: "GL111", name: "東洋史B", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(1)多文化理解 / 東洋史" },
  { id: "GL112", name: "アジア史A", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(1)多文化理解 / アジア史" },
  { id: "GL113", name: "アジア史B", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(1)多文化理解 / アジア史" },
  { id: "GL114", name: "西洋史A", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(1)多文化理解 / 西洋史" },
  { id: "GL115", name: "西洋史B", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(1)多文化理解 / 西洋史" },
  { id: "GL116", name: "考古学A", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(1)多文化理解 / 考古学" },
  { id: "GL117", name: "考古学B", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(1)多文化理解 / 考古学" },
  { id: "GL118", name: "芸術史A", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(1)多文化理解 / 芸術史" },
  { id: "GL119", name: "芸術史B", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(1)多文化理解 / 芸術史" },
  { id: "GL120", name: "美術史A", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(1)多文化理解 / 美術史" },
  { id: "GL121", name: "美術史B", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(1)多文化理解 / 美術史" },
  { id: "GL122", name: "科学史A", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(1)多文化理解 / 科学史" },
  { id: "GL123", name: "科学史B", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(1)多文化理解 / 科学史" },
  { id: "GL124", name: "社会思想史", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(1)多文化理解" },
  { id: "GL125", name: "文化人類学", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(1)多文化理解" },
  { id: "GL126", name: "現代社会論A", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(1)多文化理解 / 現代社会論" },
  { id: "GL127", name: "現代社会論B", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(1)多文化理解 / 現代社会論" },
  { id: "GL128", name: "越境する文化", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(1)多文化理解" },
  { id: "GL129", name: "生活環境と技術", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(1)多文化理解" },
  { id: "GL130", name: "カタチの文化学", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(1)多文化理解" },
  // (2) 自然界の成り立ち
  { id: "GL201", name: "科学技術と倫理", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(2)自然界の成り立ち" },
  { id: "GL202", name: "現代物理学が描く世界", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(2)自然界の成り立ち" },
  { id: "GL203", name: "身近な物理法則", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(2)自然界の成り立ち" },
  { id: "GL204", name: "カタチの自然学A", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(2)自然界の成り立ち / カタチの自然学" },
  { id: "GL205", name: "カタチの自然学B", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(2)自然界の成り立ち / カタチの自然学" },
  { id: "GL206", name: "ものづくりと科学技術A", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(2)自然界の成り立ち / ものづくりと科学技術" },
  { id: "GL207", name: "ものづくりと科学技術B", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(2)自然界の成り立ち / ものづくりと科学技術" },
  // (2) 続き: 生命科学 / 生物資源と農業
  // 注: 生物資源と農業A〜Dは斜線科目のため登録しない
  { id: "GL208", name: "生命科学A", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(2)自然界の成り立ち / 生命科学" },
  { id: "GL209", name: "生命科学B", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(2)自然界の成り立ち / 生命科学" },

  // (3) グローバルイシュー
  // 注: 食と健康A・Bは斜線科目のため登録しない
  { id: "GL301", name: "環境学入門A", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(3)グローバルイシュー / 環境学入門" },
  { id: "GL302", name: "環境学入門B", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(3)グローバルイシュー / 環境学入門" },
  { id: "GL303", name: "社会と人権A", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(3)グローバルイシュー / 社会と人権" },
  { id: "GL304", name: "社会と人権B", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(3)グローバルイシュー / 社会と人権" },
  { id: "GL305", name: "男女共同参画とジェンダーA", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(3)グローバルイシュー / 男女共同参画とジェンダー" },
  { id: "GL306", name: "男女共同参画とジェンダーB", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(3)グローバルイシュー / 男女共同参画とジェンダー" },
  { id: "GL307", name: "グローバルリーダーシップ育成基礎演習", credits: 2, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(3)グローバルイシュー" },
  { id: "GL308", name: "国際協力の現状と課題A", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(3)グローバルイシュー / 国際協力の現状と課題" },
  { id: "GL309", name: "国際協力の現状と課題B", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(3)グローバルイシュー / 国際協力の現状と課題" },
  { id: "GL310", name: "政治と社会", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(3)グローバルイシュー" },
  { id: "GL311", name: "社会生活と法", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(3)グローバルイシュー" },
  { id: "GL312", name: "国家と法", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(3)グローバルイシュー" },
  { id: "GL313", name: "現代の経済A", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: "前期", teacher: "石黒　一彦", syllabus: null, evaluation: null, note: "(3)グローバルイシュー / 現代の経済" },
  { id: "GL314", name: "現代の経済B", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(3)グローバルイシュー / 現代の経済" },
  { id: "GL315", name: "経済社会の発展", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(3)グローバルイシュー" },
  { id: "GL316", name: "地球史における生物の変遷", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(3)グローバルイシュー" },
  { id: "GL317", name: "生物の環境適応", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(3)グローバルイシュー" },
  { id: "GL318", name: "人間活動と地球生態系", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: "前期", teacher: "石井　弘明", syllabus: null, evaluation: null, note: "(3)グローバルイシュー" },
  { id: "GL319", name: "資源・材料とエネルギーA", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(3)グローバルイシュー / 資源・材料とエネルギー" },
  { id: "GL320", name: "資源・材料とエネルギーB", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(3)グローバルイシュー / 資源・材料とエネルギー" },

  // (4) ESD
  { id: "GL401", name: "ESD基礎(持続可能な社会づくり1)", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(4)ESD / ESD基礎" },
  { id: "GL402", name: "ESD論(持続可能な社会づくり2)A", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(4)ESD / ESD論" },
  { id: "GL403", name: "ESD論(持続可能な社会づくり2)B", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(4)ESD / ESD論" },
  { id: "GL404", name: "ESD生涯学習論A", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(4)ESD / ESD生涯学習論" },
  { id: "GL405", name: "ESD生涯学習論B", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(4)ESD / ESD生涯学習論" },
  { id: "GL406", name: "ESDボランティア論", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(4)ESD" },

  // (5) キャリア科目 追加分: 企業社会論
  { id: "GL501", name: "企業社会論A", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(5)キャリア科目 / 企業社会論" },
  { id: "GL502", name: "企業社会論B", credits: 1, category: CATEGORIES.GENERAL_LIBERAL, subcategory: SUBCATEGORIES.ELECTIVE, isFacultyDesignated: false, year: null, semester: null, teacher: null, syllabus: null, evaluation: null, note: "(5)キャリア科目 / 企業社会論" },

  // ==========================================================================
  // 【追加予定】以下は今後追記する領域
  // ==========================================================================
  //
  // 現在、全カテゴリの登録が完了しています(シラバス情報 year/semester/teacher
  // などを除く)。
  //
  // 注1: 自由科目(10単位)は courses.js には登録せず、
  //     単位計算ツール側でユーザー自由入力方式に対応する。
  //     (取れる授業のバリエーションが多すぎるため)
  //
  // 注2: 基礎教養の斜線科目(生物学A〜C、数学A〜D、統計学A・B、
  //     物理学A・B、化学A・B、情報学A・B)、および総合教養(2)の
  //     生物資源と農業A〜D、(3)の食と健康A・Bは卒業要件に算入しない
  //     ため courses.js には登録しない方針。
  //
];

// ----------------------------------------------------------------------------
// ユーティリティ関数
// ----------------------------------------------------------------------------

/**
 * カテゴリ別に科目をフィルタする
 * @param {string} category
 * @returns {Course[]}
 */
export const getCoursesByCategory = (category) =>
  courses.filter((c) => c.category === category);

/**
 * ID で科目を取得
 * @param {string} id
 * @returns {Course | undefined}
 */
export const getCourseById = (id) =>
  courses.find((c) => c.id === id);

/**
 * キーワード検索(科目名・教員名)
 * @param {string} keyword
 * @returns {Course[]}
 */
export const searchCourses = (keyword) => {
  const k = keyword.toLowerCase();
  return courses.filter(
    (c) =>
      c.name.toLowerCase().includes(k) ||
      (c.teacher && c.teacher.toLowerCase().includes(k))
  );
};

/**
 * 外国語Ⅱの言語別フィルタ
 * 第2外国語は1言語を選択して4単位取るため、言語別に絞り込みたい場面で使用
 * @param {"ドイツ語"|"フランス語"|"中国語"|"ロシア語"} language
 * @returns {Course[]}
 */
export const getForeignLang2ByLanguage = (language) =>
  courses.filter(
    (c) =>
      c.category === CATEGORIES.FOREIGN_LANG_2 &&
      c.note &&
      c.note.startsWith(language)
  );
