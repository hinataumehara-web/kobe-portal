import { useState } from 'react'

import { useAuth }       from './hooks/useAuth.js'
import { useCredits }    from './hooks/useCredits.js'
import { usePastExams }  from './hooks/usePastExams.js'
import { useCourseInfo } from './hooks/useCourseInfo.js'
import { getCurriculum } from './data/curriculum.js'

import LoginForm          from './components/auth/LoginForm.jsx'
import MagicLinkSent      from './components/auth/MagicLinkSent.jsx'
import ProfileSetup       from './components/auth/ProfileSetup.jsx'
import AdmissionYearModal from './components/auth/AdmissionYearModal.jsx'
import PortalLayout       from './components/layout/PortalLayout.jsx'
import { useToast, ToastContainer } from './components/Toast.jsx'

import HomePage       from './components/pages/HomePage.jsx'
import CoursesPage    from './components/pages/CoursesPage.jsx'
import CourseInfoPage from './components/pages/CourseInfoPage.jsx'
import PastExamsPage  from './components/pages/PastExamsPage.jsx'
import CreditsPage    from './components/pages/CreditsPage.jsx'
import SummaryPage    from './components/pages/SummaryPage.jsx'

export default function App() {
  const { session, profile, loading: authLoading, signIn, signOut, createProfile, updateAdmissionYear } = useAuth()
  const { credits, loading: creditsLoading, updateGrade } = useCredits(profile?.id)
  const { exams, loading: examsLoading, uploadExam, getDownloadUrl, deleteExam } = usePastExams()
  const { courseInfos, loading: courseInfoLoading, submitCourseInfo, deleteCourseInfo } = useCourseInfo()

  const [page,               setPage]               = useState('home')
  const [sentEmail,          setSentEmail]          = useState('')
  const [pastExamsFilter,    setPastExamsFilter]    = useState(null)
  const [showCurriculumModal, setShowCurriculumModal] = useState(false)
  const { toasts, showToast }                       = useToast()

  // 入学年度未設定チェック
  const needsAdmissionYear = !!profile && profile.admission_year == null

  // カリキュラムデータ(モーダル外でも使用)
  const curriculum = getCurriculum(profile?.admission_year)

  // 授業情報 → 過去問ページへ遷移
  function navigateToExams(courseId) {
    setPastExamsFilter(courseId)
    setPage('exams')
  }

  // 通常のページ遷移(過去問フィルタをリセット)
  function handleNavigate(p) {
    if (p !== 'exams') setPastExamsFilter(null)
    setPage(p)
  }

  // 入学年度を保存してモーダルを閉じる
  async function handleAdmissionYearSelect(year) {
    await updateAdmissionYear(year)
    setShowCurriculumModal(false)
  }

  // ── ローディング中 ──────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-green-700 rounded-full animate-spin" />
      </div>
    )
  }

  // ── 未ログイン ───────────────────────────────────────────────
  if (!session) {
    if (sentEmail) {
      return (
        <MagicLinkSent
          email={sentEmail}
          onBack={() => setSentEmail('')}
        />
      )
    }
    return (
      <LoginForm
        signIn={signIn}
        onSent={(email) => setSentEmail(email)}
      />
    )
  }

  // ── ログイン済み・プロフィール未作成(初回) ──────────────────
  if (!profile) {
    return (
      <ProfileSetup
        email={session.user.email}
        createProfile={createProfile}
      />
    )
  }

  // ── メインポータル ───────────────────────────────────────────
  function renderPage() {
    switch (page) {
      case 'home':
        return (
          <HomePage
            profile={profile}
            credits={credits}
            recentExams={exams.slice(0, 3)}
            onNavigate={setPage}
          />
        )
      case 'courses':
        return <CoursesPage />
      case 'courseInfo':
        return (
          <CourseInfoPage
            courseInfos={courseInfos}
            loading={courseInfoLoading}
            submitCourseInfo={submitCourseInfo}
            deleteCourseInfo={deleteCourseInfo}
            profile={profile}
            onNavigateToExams={navigateToExams}
            showToast={showToast}
          />
        )
      case 'exams':
        return (
          <PastExamsPage
            exams={exams}
            loading={examsLoading}
            uploadExam={uploadExam}
            getDownloadUrl={getDownloadUrl}
            deleteExam={deleteExam}
            profile={profile}
            showToast={showToast}
            initialCourseId={pastExamsFilter}
          />
        )
      case 'credits':
        return (
          <CreditsPage
            credits={credits}
            loading={creditsLoading}
            updateGrade={updateGrade}
            showToast={showToast}
          />
        )
      case 'summary':
        return (
          <SummaryPage
            credits={credits}
            loading={creditsLoading}
          />
        )
      default:
        return null
    }
  }

  return (
    <>
      <PortalLayout
        profile={profile}
        page={page}
        onNavigate={handleNavigate}
        onSignOut={signOut}
        curriculumLabel={curriculum.label}
        onChangeCurriculum={() => setShowCurriculumModal(true)}
      >
        {renderPage()}
      </PortalLayout>

      <ToastContainer toasts={toasts} />

      {/* 入学年度選択モーダル — 未設定の場合は強制表示、切り替え時は任意 */}
      {(needsAdmissionYear || showCurriculumModal) && (
        <AdmissionYearModal
          currentYear={needsAdmissionYear ? null : profile.admission_year}
          onSelect={handleAdmissionYearSelect}
          onClose={needsAdmissionYear ? undefined : () => setShowCurriculumModal(false)}
        />
      )}
    </>
  )
}
