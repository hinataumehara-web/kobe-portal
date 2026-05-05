/**
 * Server <-> UI 間で structuredContent として行き来する型。
 * JSON-serializable のみで構成する。
 */

export interface Course {
  id: string;
  name: string;
  credits: number;
  category: string;
  subcategory: string;
  isFacultyDesignated: boolean;
  year: number | null;
  semester: string | null;
  teacher: string | null;
  syllabus: string | null;
  evaluation: string | null;
  note: string | null;
}

export interface CourseInfo {
  id: string;
  course_id: string | null;
  submitted_by: string;
  submitter_name: string | null;
  is_anonymous: boolean;
  created_at: string;
  schedule: string | null;
  difficulty: string | null;
  tags: string[] | null;
  summary: string | null;
  detail: string | null;
  exam_tips: string | null;
}

export interface PastExam {
  id: string;
  course_id: string | null;
  course_name: string;
  year: number;
  file_path: string | null;
  file_name: string | null;
  comment: string | null;
  is_anonymous: boolean;
  uploaded_by: string;
  uploader_name: string | null;
  created_at: string;
}

export interface CourseFilter {
  query?: string;
  category?: string;
  subcategory?: string;
}

export interface CourseInfoFilter {
  course_id?: string;
  difficulty?: string;
}

export interface PastExamFilter {
  course_id?: string;
  course_name?: string;
  year?: number;
}

export type Payload =
  | {
      kind: "course-list";
      courses: Course[];
      total: number;
      filter: CourseFilter;
      categories: string[];
      subcategories: string[];
    }
  | {
      kind: "course-info-list";
      items: CourseInfo[];
      total: number;
      filter: CourseInfoFilter;
    }
  | {
      kind: "past-exam-list";
      exams: PastExam[];
      total: number;
      filter: PastExamFilter;
    };
