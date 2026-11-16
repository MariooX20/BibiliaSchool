import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import {
  UserRound,
  ExternalLink,
  Loader2,
  Award,
  QrCode,
  X,
  Printer,
  Lock,
  Pencil,
  Check
} from "lucide-react";
import { useAttendance } from "./useAttendance";
import { AttendanceCard, AttendanceTable } from "./AttendanceSection";

const GRADUATION_PROJECT_FORM_URL =
  "https://forms.gle/BSUNvWiSrXgnmrqv6";
const PDF_PROJECT_FORM_URL =
  "https://forms.gle/iS91YSBtqNmfLt91A";

const Profile = ({ themeMode, currentUser }) => {
  const { currentUser: authUser, refreshProfile } = useAuth();
  const activeUser = currentUser || authUser;

  // Interactive states for certificates
  const [activeTerm, setActiveTerm] = useState("term1");
  const [showCertModal, setShowCertModal] = useState(false);
  const [dbAuthLevel, setDbAuthLevel] = useState(null);

  // QR (loaded from Supabase)
  const [studentCode, setStudentCode] = useState(null); // e.g. BS_2028_42_Wave_2
  const [qrUrl, setQrUrl] = useState(null); // Drive link stored in qr_links.url
  const [qrLoading, setQrLoading] = useState(true);

  // Lock status for project submission
  const isProjectLocked = false;
  const isPdfLocked = false;

  // Dynamic user name from auth profile / metadata / email
  const getInitialName = () => {
    if (activeUser?.name) return activeUser.name;
    if (activeUser?.email) return activeUser.email.split("@")[0];
    return "User";
  };

  const [studentName, setStudentName] = useState(getInitialName);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);
  const [nameSaveMsg, setNameSaveMsg] = useState(null);

  useEffect(() => {
    if (activeUser?.name) {
      setStudentName(activeUser.name);
    } else if (activeUser?.email) {
      setStudentName(activeUser.email.split("@")[0]);
    }
  }, [activeUser?.name, activeUser?.email]);

  // Load the student's code and Drive QR link from Supabase
  useEffect(() => {
    if (!activeUser?.id) {
      setStudentCode(null);
      setQrUrl(null);
      setQrLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      setQrLoading(true);
      try {
        const { data: prof, error: profErr } = await supabase
          .from("profiles")
          .select("student_id, auth_level")
          .eq("id", activeUser.id)
          .maybeSingle();

        if (profErr) console.warn("Profile fetch error:", profErr);
        if (cancelled) return;

        if (prof?.auth_level !== undefined && prof?.auth_level !== null) {
          setDbAuthLevel(Number(prof.auth_level));
        }

        const code = prof?.student_id ?? null;
        setStudentCode(code);

        if (!code) {
          setQrUrl(null);
          return;
        }

        const { data: link, error: linkErr } = await supabase
          .from("qr_links")
          .select("url")
          .eq("student_id", code)
          .maybeSingle();

        if (linkErr) console.warn("QR link fetch error:", linkErr);
        if (!cancelled) setQrUrl(link?.url ?? null);
      } catch (err) {
        console.error("Error loading QR:", err);
      } finally {
        if (!cancelled) setQrLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeUser?.id]);

  const handleStartEditName = () => {
    setNameInput(studentName);
    setIsEditingName(true);
    setNameSaveMsg(null);
  };

  const handleSaveName = async () => {
    const trimmed = nameInput.trim();
    if (!trimmed) return;

    setIsSavingName(true);
    setNameSaveMsg(null);
    try {
      if (activeUser?.id) {
        // 1. Save to Supabase profiles table
        const { error: profileErr } = await supabase
          .from("profiles")
          .upsert({ id: activeUser.id, name: trimmed }, { onConflict: "id" });

        if (profileErr) console.warn("Profile table update error:", profileErr);

        // 2. Update user metadata in Supabase Auth
        await supabase.auth.updateUser({
          data: { name: trimmed }
        });

        // 3. Refresh profile across the app
        if (refreshProfile) {
          await refreshProfile();
        }
      }

      setStudentName(trimmed);
      setIsEditingName(false);
      setNameSaveMsg({ type: "success", text: "تم حفظ الاسم بنجاح!" });
      setTimeout(() => setNameSaveMsg(null), 3000);
    } catch (err) {
      console.error("Error updating name:", err);
      setNameSaveMsg({ type: "error", text: "حدث خطأ أثناء حفظ الاسم!" });
    } finally {
      setIsSavingName(false);
    }
  };

  // Real student ID from Supabase (null until the student is linked)
  const studentId = studentCode || "غير مرتبط بعد";

  const currentAuthLevel = Number(
    dbAuthLevel ?? activeUser?.authLevel ?? activeUser?.auth_level ?? 0
  );

  // Real attendance (sessions held for the student's year vs. their QR scans)
  const att = useAttendance(studentCode, currentAuthLevel, qrLoading);

  const getAcademicStatusText = () => {
    if (currentAuthLevel === 1) {
      return "طالب في مدرسة الكتاب المقدس — السنة الدراسية الأولى";
    }
    if (currentAuthLevel === 2) {
      return "طالب في مدرسة الكتاب المقدس — السنة الدراسية الثانية";
    }
    return "غير ملتحق بالمدرسة";
  };

  // Theme-aware palette helper
  const isDark = themeMode === "dark";
  const isSepia = themeMode === "sepia";

  const cardBg = isDark
    ? "bg-[#131b2e] border-[#23304e]"
    : isSepia
      ? "bg-[#fbf7eb] border-[#e6dbc3]"
      : "bg-white border-slate-200";

  const subBoxBg = isDark
    ? "bg-[#0b1326] border-[#1f2d4a]"
    : isSepia
      ? "bg-[#f4ecdb] border-[#e1d5be]"
      : "bg-slate-50 border-slate-200";

  const textPrimary = isDark ? "text-white" : isSepia ? "text-[#342415]" : "text-slate-900";
  const textSecondary = isDark ? "text-slate-300" : isSepia ? "text-[#634e3a]" : "text-slate-600";
  const textMuted = isDark ? "text-slate-400" : isSepia ? "text-[#87725d]" : "text-slate-500";
  const borderDivider = isDark ? "border-[#1f2d4a]" : isSepia ? "border-[#dfd3bc]" : "border-slate-100";

  // Theme tokens shared with the attendance components
  const ui = { isDark, isSepia, cardBg, subBoxBg, textPrimary, textSecondary, textMuted, borderDivider };

  // Certificates mock data per term
  const certificatesData = {
    term1: {
      termTitle: "الترم الأول",
      certName: "شهادة إتمام دراسات العهد الجديد",
      code: "BS-CERT-9041-T1",
      summary: "",
      status: "جاهزة للاستلام",
    },
    term2: {
      termTitle: "الترم الثاني",
      certName: "شهادة دراسات العهد القديم والأسفار التعليمية",
      code: "BS-CERT-9042-T2",
      summary: "تم تسليم الأبحاث الدورية والمشاركة الفعالة في حلقات النقاش الأسبوعية.",
      status: "جاهزة للتحميل",
    },
    term3: {
      termTitle: "الترم الثالث",
      certName: "شهادة اللاهوت وتاريخ الكنيسة الجامعة",
      code: "BS-CERT-9043-T3",
      summary: "يجري حالياً مراجعة أبحاث التخرج وتقييم درجات الحضور النهائي.",
      status: "قيد المراجعة",
    },
  };

  const currentCert = certificatesData[activeTerm];

  const handleDownloadCertPdf = () => {
    // Disabled temporarily until certificates are ready
  };

  if (!currentUser) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] text-center px-4">
        <div className={`p-8 rounded-3xl max-w-md w-full border ${cardBg} shadow-2xl`}>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <UserRound size={36} />
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${textPrimary}`}>يجب تسجيل الدخول أولاً</h2>
          <p className={`text-sm mb-6 ${textSecondary}`}>
            يرجى تسجيل الدخول للوصول إلى لوحة الطالب والشهادات ورمز الدخول الرقمي.
          </p>
          <Link
            to="/login"
            className="block w-full py-3 px-6 rounded-xl font-bold bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-all"
          >
            تسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto pb-12 transition-colors duration-300">
      {/* Top Greeting and Current Path Breadcrumb */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-amber-500 font-bold">لوحة الطالب</span>
          <span className={textMuted}>/</span>
          <span className={textSecondary}>الملف الشخصي والأكاديمي</span>
        </div>
        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border ${subBoxBg} ${textSecondary} shadow-sm`}>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-[11px] font-medium">  2027 - 2026    </span>
        </div>
      </div>

      {/* BEGIN: PrimaryProfileCard */}
      <section
        className={`rounded-3xl border ${cardBg} shadow-2xl overflow-hidden mb-10 transition-all duration-300`}
        data-purpose="user-profile-header-card"
      >
        {/* Card Amber Banner */}
        <div className="h-36 sm:h-44 w-full bg-gradient-to-r from-[#d97706] via-[#f59e0b] to-[#fbbf24] relative overflow-hidden flex items-end justify-center">
          <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-around">
            <svg className="w-96 h-96 -translate-y-10" fill="currentColor" viewBox="0 0 200 200">
              <circle cx="100" cy="100" fill="none" r="80" stroke="white" strokeWidth="4"></circle>
              <path d="M100 20 L100 180 M20 100 L180 100" stroke="white" strokeWidth="3"></path>
            </svg>
          </div>
        </div>

        {/* Avatar & Central Profile Info */}
        <div className="px-6 pb-8 pt-0 relative flex flex-col items-center text-center">
          {/* Overlapping Profile Avatar */}
          <div className="relative -mt-16 sm:-mt-20 mb-4">
            <div
              className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 flex items-center justify-center text-[#f59e0b] ring-4 ring-[#f59e0b]/40 overflow-hidden shadow-xl ${isDark ? "bg-[#17233d] border-[#131b2e]" : isSepia ? "bg-[#e5d8bf] border-[#fbf7eb]" : "bg-slate-100 border-white"
                }`}
            >
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={studentName}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg className="w-16 h-16 sm:w-20 sm:h-20" fill="currentColor" viewBox="0 0 24 24">
                  <path clipRule="evenodd" d="M12 2a5 5 0 100 10 5 5 0 000-10zm-7 18a7 7 0 0114 0H5z" fillRule="evenodd"></path>
                </svg>
              )}
            </div>
          </div>

          {/* Student Name & Academic Details with Inline Name Editor */}
          <div className="flex flex-col items-center justify-center gap-1.5 mb-1">
            {isEditingName ? (
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="أدخل اسمك..."
                  className={`px-4 py-1.5 rounded-xl border text-lg font-bold text-center focus:outline-none focus:ring-2 focus:ring-amber-400 ${isDark ? "bg-[#0b1326] border-amber-500/40 text-white" : isSepia ? "bg-[#f2ead6] border-amber-600/40 text-[#342415]" : "bg-slate-50 border-amber-400 text-slate-900"
                    }`}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveName();
                    if (e.key === "Escape") setIsEditingName(false);
                  }}
                />
                <button
                  onClick={handleSaveName}
                  disabled={isSavingName}
                  className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow transition-all"
                  title="حفظ الاسم"
                  type="button"
                >
                  {isSavingName ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                </button>
                <button
                  onClick={() => setIsEditingName(false)}
                  className="p-2 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-300 transition-all"
                  title="إلغاء"
                  type="button"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 group">
                <h1 className={`text-2xl sm:text-3xl font-black ${textPrimary} tracking-wide`}>
                  {studentName}
                </h1>
                <button
                  onClick={handleStartEditName}
                  className="opacity-70 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-amber-500/20 text-amber-400 transition-all"
                  title="تعديل اسمك"
                  type="button"
                >
                  <Pencil size={17} />
                </button>
              </div>
            )}

            {nameSaveMsg && (
              <span className={`text-xs font-bold animate-fade-in ${nameSaveMsg.type === "success" ? "text-emerald-400" : "text-red-400"}`}>
                {nameSaveMsg.text}
              </span>
            )}
          </div>
          <p className={`text-sm sm:text-base mt-1 font-medium ${textSecondary}`}>
            {getAcademicStatusText()}
          </p>



          {/* Section Divider */}
          <div className={`w-full max-w-4xl my-7 border-t ${borderDivider}`}></div>

          {/* Project Submission Boxes (Video on Right, PDF on Left) */}
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box 1: Video Submission (Right in RTL) */}
            <div className={`rounded-2xl p-5 sm:p-6 text-center sm:text-right flex flex-col sm:flex-row items-center justify-between gap-4 border shadow-inner ${subBoxBg}`}>
              <div className="flex-1">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <span className={`w-2.5 h-2.5 rounded-full ${isProjectLocked ? "bg-slate-500" : "bg-amber-400"}`}></span>
                  <h2 className={`text-base sm:text-lg font-bold ${textPrimary}`}>مشروع التخرج</h2>
                  {isProjectLocked && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      <Lock size={12} /> مغلق حالياً
                    </span>
                  )}
                </div>
                <p className={`text-xs sm:text-sm leading-relaxed ${textMuted}`}>
                  {isProjectLocked
                    ? "باب تسليم المشروعات مغلق حالياً. سيتم إتاحة تسليم المشروعات للطلاب مع اقتراب موعد التقييم النهائي."
                    : (
                      <>
                        <span>ارفع فيديو مشروع التخرج هنا</span>
                        <span className="block text-[11px] font-mono font-medium text-amber-500/90 mt-1" dir="ltr">
                          videos only
                        </span>
                      </>
                    )
                  }
                </p>
              </div>

              <div className="flex flex-col items-center sm:items-end gap-2 shrink-0">
                {isProjectLocked ? (
                  <div
                    className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border font-bold text-xs cursor-not-allowed select-none shadow-sm ${isDark ? "bg-[#18233d] border-slate-700/60 text-slate-400" : isSepia ? "bg-[#e8dec7] border-[#d8caa9] text-[#705e4a]" : "bg-slate-100 border-slate-300 text-slate-500"
                      }`}
                    title="باب تسليم المشروعات مغلق حالياً"
                  >
                    <Lock size={16} className="text-amber-500" />
                    <span>التسليم غير متاح</span>
                  </div>
                ) : (
                  <a
                    href={GRADUATION_PROJECT_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] via-[#f59e0b] to-[#fbbf24] hover:from-[#b45309] hover:to-[#f59e0b] text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/25 transition-all transform hover:scale-[1.02]"
                  >
                    <ExternalLink size={16} className="text-slate-950" />
                    <span>ارفع هنا !</span>
                  </a>
                )}
              </div>
            </div>

            {/* Box 2: PDF Submission (Left in RTL) */}
            <div className={`rounded-2xl p-5 sm:p-6 text-center sm:text-right flex flex-col sm:flex-row items-center justify-between gap-4 border shadow-inner ${subBoxBg}`}>
              <div className="flex-1">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <span className={`w-2.5 h-2.5 rounded-full ${isPdfLocked ? "bg-slate-500" : "bg-amber-400"}`}></span>
                  <h2 className={`text-base sm:text-lg font-bold ${textPrimary}`}>ملفات اخري </h2>
                  {isPdfLocked && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      <Lock size={12} /> مغلق حالياً
                    </span>
                  )}
                </div>
                <p className={`text-xs sm:text-sm leading-relaxed ${textMuted}`}>
                  {isPdfLocked
                    ? "باب تسليم أبحاث وملفات الـ PDF مغلق حالياً."
                    : (
                      <>
                        <span>ارفع اي ملفات خاصه بمشروع التخرج هنا</span>
                        <span className="block text-[11px] font-mono font-medium text-amber-500/90 mt-1" dir="ltr">
                          PDFs,Presentation,Word,Images
                        </span>
                      </>
                    )
                  }
                </p>
              </div>

              <div className="flex flex-col items-center sm:items-end gap-2 shrink-0">
                {isPdfLocked ? (
                  <div
                    className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border font-bold text-xs cursor-not-allowed select-none shadow-sm ${isDark ? "bg-[#18233d] border-slate-700/60 text-slate-400" : isSepia ? "bg-[#e8dec7] border-[#d8caa9] text-[#705e4a]" : "bg-slate-100 border-slate-300 text-slate-500"
                      }`}
                    title="باب تسليم ملفات الـ PDF مغلق حالياً"
                  >
                    <Lock size={16} className="text-amber-500" />
                    <span>التسليم غير متاح</span>
                  </div>
                ) : (
                  <a
                    href={PDF_PROJECT_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] via-[#f59e0b] to-[#fbbf24] hover:from-[#b45309] hover:to-[#f59e0b] text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/25 transition-all transform hover:scale-[1.02]"
                  >
                    <ExternalLink size={16} className="text-slate-950" />
                    <span>ارفع هنا !</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* END: PrimaryProfileCard */}

      {/* BEGIN: AcademicFeatureGrid (3 Main Grid Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {/* CARD 1: الشهادات الأكاديمية (Academic Certificates) */}
        <section
          className={`rounded-2xl border ${cardBg} p-6 flex flex-col justify-between hover:border-amber-500/40 transition-all shadow-xl`}
          data-purpose="certificate-issuance-card"
        >
          <div>
            {/* Header */}
            <div className={`flex items-center justify-between pb-4 border-b ${borderDivider}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <Award size={22} />
                </div>
                <div>
                  <h3 className={`text-base font-bold ${textPrimary}`}>الشهادات </h3>
                  <p className={`text-xs ${textMuted}`}>شهادة إتمام السنة الدراسية</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/25">
                غير متاحة حالياً
              </span>
            </div>

            {/* Empty State / Not Available Message */}
            <div className="my-8 flex flex-col items-center justify-center min-h-[140px] gap-3 text-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400/80 flex items-center justify-center border border-amber-500/20">
                <Award size={34} />
              </div>
              <div>
                <h4 className={`text-sm font-bold ${textPrimary} mb-1`}>لا توجد شهادات متاحة حالياً</h4>

              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className={`mt-4 pt-3 border-t ${borderDivider}`}>
            <button
              disabled
              className="w-full py-2.5 px-3 rounded-xl bg-amber-500/10 text-slate-400 text-xs font-bold flex items-center justify-center gap-2 cursor-not-allowed border border-amber-500/20"
              type="button"
            >
              <Award size={16} className="text-amber-400/40" />
              <span>الشهادة غير متاحة حالياً</span>
            </button>
          </div>
        </section>

        {/* CARD 2: رمز الدخول الرقمي (QR Code Pass) */}
        <section
          className={`rounded-2xl border ${cardBg} p-6 flex flex-col justify-between hover:border-amber-500/40 transition-all shadow-xl`}
          data-purpose="student-qr-code-card"
        >
          <div>
            {/* Header */}
            <div className={`flex items-center justify-between pb-4 border-b ${borderDivider}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                  <QrCode size={22} />
                </div>
                <div>
                  <h3 className={`text-base font-bold ${textPrimary}`}>رمز الدخول الرقمي (QR)</h3>
                  <p className={`text-xs ${textMuted}`}>لتسجيل الحضور بالقاعات </p>
                </div>
              </div>
              {qrUrl && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  جاهز
                </span>
              )}
            </div>

            {/* QR status / student code */}
            <div className="my-8 flex flex-col items-center justify-center min-h-[140px] gap-3 text-center">
              {qrLoading ? (
                <Loader2 size={32} className="animate-spin text-amber-500" />
              ) : qrUrl ? (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/30">
                    <QrCode size={34} />
                  </div>
                  <p className="text-xs text-amber-500 font-mono tracking-wider font-bold" dir="ltr">
                    ID: {studentCode}
                  </p>
                </>
              ) : (
                <p className={`text-sm leading-relaxed ${textMuted}`}>
                  {studentCode
                    ? "لا يوجد رمز QR متاح لحسابك حالياً. تواصل مع الإدارة."
                    : "لا يوجد رمز QR. تواصل مع الإدارة."}
                </p>
              )}
            </div>

          </div>

          {/* Open QR in Drive */}
          <div className={`mt-4 pt-3 border-t ${borderDivider}`}>
            {qrUrl ? (
              <a
                href={qrUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow"
              >
                <QrCode size={16} />
                <span>افتح الـ QR بتاعي</span>
              </a>
            ) : (
              <button
                disabled
                className="w-full py-2.5 px-3 rounded-lg bg-amber-500/30 text-slate-400 text-xs font-bold flex items-center justify-center gap-1.5 cursor-not-allowed"
                type="button"
              >
                <QrCode size={16} />
                <span>{qrLoading ? "جاري التحميل..." : "الرمز غير متاح"}</span>
              </button>
            )}
          </div>
        </section>

        {/* CARD 3: نسبة الحضور والالتزام (real data from Supabase) */}
        <AttendanceCard att={att} ui={ui} />
      </div>
      {/* END: AcademicFeatureGrid */}

      {/* BEGIN: QuickStatsAndLectures (real data from Supabase) */}
      <AttendanceTable att={att} ui={ui} />
      {/* END: QuickStatsAndLectures */}

      {/* CERTIFICATE FULL PREVIEW MODAL */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className={`relative w-full max-w-2xl rounded-3xl border ${cardBg} p-6 sm:p-8 shadow-2xl overflow-hidden`}>
            {/* Close Button */}
            <button
              onClick={() => setShowCertModal(false)}
              className="absolute top-4 left-4 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              aria-label="إغلاق"
            >
              <X size={20} />
            </button>

            {/* Certificate Display Area */}
            <div className="border-4 border-double border-amber-500/60 rounded-2xl p-6 sm:p-8 text-center bg-gradient-to-b from-[#182542] via-[#11192e] to-[#0b1326] text-white relative overflow-hidden shadow-inner">
              <div className="absolute top-2 left-2 text-amber-400/40 text-2xl font-serif">✝</div>
              <div className="absolute top-2 right-2 text-amber-400/40 text-2xl font-serif">✝</div>
              <div className="absolute bottom-2 left-2 text-amber-400/40 text-2xl font-serif">✝</div>
              <div className="absolute bottom-2 right-2 text-amber-400/40 text-2xl font-serif">✝</div>

              <div className="text-amber-400 text-xs tracking-widest uppercase font-serif mb-1">
                Biβλία • BIBLIA SCHOOL OF THEOLOGY
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-amber-300 font-serif">
                شهادة إتمام السنة الدراسية
              </h2>
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto my-3"></div>

              <p className="text-xs text-slate-300 mb-2">تشهد إدارة مدرسة الكتاب المقدس بأن الطالب / الطالبة:</p>
              <h3 className="text-2xl font-black text-white mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-200">
                {studentName}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto mb-4">
                قد أتم بنجاح متطلبات دراسة <strong>{currentCert.certName}</strong> ونسبة حضور <strong>{att.percent !== null ? `${att.percent}%` : "—"}</strong> وفقاً للائحة الأكاديمية المعتمدة.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-amber-500/30 text-xs text-slate-300">
                <div>
                  <p className="text-[10px] text-slate-400">عميد الشؤون الأكاديمية</p>
                  <p className="font-serif font-bold text-amber-300 mt-1">د. يوسف ميخائيل</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">كود الشهادة</p>
                  <p className="font-mono font-bold text-emerald-400 mt-1">{currentCert.code}</p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                onClick={handleDownloadCertPdf}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow hover:scale-105 transition-all"
              >
                <Printer size={16} />
                <span>طباعة / حفظ كـ PDF</span>
              </button>
              <button
                onClick={() => setShowCertModal(false)}
                className={`py-2.5 px-4 rounded-xl border ${subBoxBg} ${textSecondary} text-xs font-semibold`}
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;