import { useState, useMemo } from 'react'

import { useAuth }          from './hooks/useAuth.js'
import { useAutoLock }      from './hooks/useAutoLock.js'
import { useCredits }       from './hooks/useCredits.js'
import { useSharedCourses } from './hooks/useSharedCourses.js'
import { usePastExams }     from './hooks/usePastExams.js'
import { useCourseInfo }    from './hooks/useCourseInfo.js'
import { getCurriculum }    from './data/curriculum.js'

import LoginForm          from './components/auth/LoginForm.jsx'
import VerifyCodeForm     from './components/auth/VerifyCodeForm.jsx'
import PassphraseSetup       from './components/auth/PassphraseSetup.jsx'
import UnlockGate            from './components/auth/UnlockGate.jsx'
import MigrationGate         from './components/auth/MigrationGate.jsx'
import RecoveryCodeReveal    from './components/auth/RecoveryCodeReveal.jsx'
import ResetWithRecoveryGate from './components/auth/ResetWithRecoveryGate.jsx'
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
  const {
    session, profile, cryptoKey, loading: authLoading,
    keyless, needsMigration, locked,
    pendingRecoveryCode, clearPendingRecoveryCode,
    signIn, verifyCode, signOut,
    createProfile, unlock, migrate, recoverWithCode,
    lock,
    updateAdmissionYear,
  } = useAuth()

  // 解錠中だけ自動ロックを有効化
  // 60分無操作 or タブを閉じたとき(beforeunload/pagehide) or バックグラウンド中に期限切れ
  useAutoLock(lock, {
    idleMs: 60 * 60 * 1000,
    enabled: !!cryptoKey,
  })
  const [forgotMode, setForgotMode] = useState(false)
  const { credits, loading: creditsLoading, updateGrade, updateSharedGrade, updateCustomCredit, deleteCustomCredit } = useCredits(profile?.id, cryptoKey)
  const { sharedCourses, loading: sharedCoursesLoading, addSharedCourse, deleteSharedCourse } = useSharedCourses()
  const { exams, loading: examsLoading, uploadExam, getDownloadUrl, deleteExam } = usePastExams()
  const { courseInfos, loading: courseInfoLoading, submitCourseInfo, deleteCourseInfo } = useCourseInfo()

  // 単位計算用: shared_course_id を持つ user_credits に category/credits を補完
  const enrichedCredits = useMemo(() => {
    if (!sharedCourses.length) return credits
    return credits.map((uc) => {
      if (!uc.shared_course_id) return uc
      const sc = sharedCourses.find((s) => s.id === uc.shared_course_id)
      if (!sc) return uc
      return { ...uc, custom_category: sc.category, custom_credits: sc.credits }
    })
  }, [credits, sharedCourses])

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
        <VerifyCodeForm
          email={sentEmail}
          verifyCode={verifyCode}
          resend={signIn}
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
  if (keyless) {
    const defaultStudentId = session.user.email.split('@')[0].toUpperCase()
    return (
      <PassphraseSetup
        email={session.user.email}
        defaultStudentId={defaultStudentId}
        onSubmit={({ name, passphrase }) => createProfile(name, passphrase)}
      />
    )
  }

  // ── リカバリーコード発行直後: 必ず一度表示する ──────────────
  if (pendingRecoveryCode) {
    return (
      <RecoveryCodeReveal
        code={pendingRecoveryCode}
        onConfirm={() => {
          clearPendingRecoveryCode()
          setForgotMode(false)
        }}
      />
    )
  }

  // ── 既存(平文)ユーザー: 暗号化方式への移行 ────────────────
  if (needsMigration) {
    return (
      <MigrationGate
        email={session.user.email}
        onMigrate={({ passphrase, purge }) => migrate(passphrase, { purge })}
        onSignOut={signOut}
      />
    )
  }

  // ── パスフレーズ忘失リセット ──────────────────────────────
  if (forgotMode) {
    return (
      <ResetWithRecoveryGate
        email={session.user.email}
        onSubmit={({ code, newPassphrase }) => recoverWithCode(code, newPassphrase)}
        onCancel={() => setForgotMode(false)}
      />
    )
  }

  // ── プロフィールあり・鍵未ロード ──────────────────────────────
  if (locked) {
    return (
      <UnlockGate
        email={session.user.email}
        onUnlock={unlock}
        onForgot={() => setForgotMode(true)}
        onSignOut={signOut}
      />
    )
  }

  // 解錠後だが何らかの理由で profile がまだ null(理論上は起きない)
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-green-700 rounded-full animate-spin" />
      </div>
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
            credits={enrichedCredits}
            loading={creditsLoading || sharedCoursesLoading}
            updateGrade={updateGrade}
            updateSharedGrade={updateSharedGrade}
            updateCustomCredit={updateCustomCredit}
            deleteCustomCredit={deleteCustomCredit}
            sharedCourses={sharedCourses}
            addSharedCourse={addSharedCourse}
            deleteSharedCourse={deleteSharedCourse}
            profile={profile}
            showToast={showToast}
          />
        )
      case 'summary':
        return (
          <SummaryPage
            credits={enrichedCredits}
            loading={creditsLoading || sharedCoursesLoading}
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
