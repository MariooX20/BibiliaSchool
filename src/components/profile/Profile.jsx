import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import {
  UserRound,
  Upload,
  CheckCircle,
  XCircle,
  Loader2,
  Award,
  QrCode,
  CheckCircle2,
  Download,
  Eye,
  X,
  Printer,
  ShieldCheck,
  Lock,
  Pencil,
  Check
} from "lucide-react";

const Profile = ({ themeMode, currentUser }) => {
  const { currentUser: authUser, refreshProfile } = useAuth();
  const activeUser = currentUser || authUser;

  const fileInput = useRef();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  // Interactive states for certificates
  const [activeTerm, setActiveTerm] = useState("term1");
  const [showCertModal, setShowCertModal] = useState(false);

  // QR (loaded from Supabase)
  const [studentCode, setStudentCode] = useState(null); // e.g. BS_2028_42_Wave_2
  const [qrUrl, setQrUrl] = useState(null); // Drive link stored in qr_links.url
  const [qrLoading, setQrLoading] = useState(true);

  // Lock status for project submission
  const isProjectLocked = true;

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
          .select("student_id")
          .eq("id", activeUser.id)
          .maybeSingle();

        if (profErr) console.warn("Profile fetch error:", profErr);
        if (cancelled) return;

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

  // Certificates mock data per term
  const certificatesData = {
    term1: {
      termTitle: "الترم الأول",
      certName: "شهادة إتمام دراسات العهد الجديد",
      code: "BS-CERT-9041-T1",
      summary: "تم استيفاء معايير الحضور (92%) واجتياز الامتحانات بنجاح بمعدل تراكمي ممتاز.",
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

  const openFilePicker = () => {
    if (isUploading) return;
    fileInput.current?.click();
  };

  const uploadFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      setUploadStatus({ type: "error", message: "حجم الملف يتجاوز الحد الأقصى (50 ميجابايت)!" });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus(null);

    try {
      const params = new URLSearchParams({
        userId: currentUser?.id || "guest",
        userName: studentName,
        fileName: file.name,
        fileType: file.type || "application/octet-stream",
      });

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
        }
      });

      xhr.onload = () => {
        setIsUploading(false);
        if (xhr.status >= 200 && xhr.status < 300) {
          setUploadStatus({ type: "success", message: "تم رفع مشروع التخرج بنجاح!" });
          if (fileInput.current) fileInput.current.value = "";
        } else {
          let errorMsg = "فشل الرفع!";
          try {
            const data = JSON.parse(xhr.responseText);
            if (data.error) errorMsg += `: ${data.error}`;
          } catch {
            if (xhr.responseText) errorMsg += `: ${xhr.responseText}`;
          }
          setUploadStatus({ type: "error", message: errorMsg });
        }
      };

      const rawUrl = (import.meta.env.VITE_BACKEND_URL || "").trim();
      const base =
        rawUrl && rawUrl !== "/"
          ? rawUrl
          : "https://bibliaschoolbackend-production.up.railway.app";
      const targetUrl = new URL(
        "upload-stream",
        base.endsWith("/") ? base : base + "/"
      );
      targetUrl.search = params.toString();

      const fetchFallback = async () => {
        try {
          setUploadProgress(50);
          const response = await fetch(targetUrl.toString(), {
            method: "POST",
            headers: {
              "Content-Type": file.type || "application/octet-stream",
            },
            body: file,
          });

          setIsUploading(false);
          if (response.ok) {
            setUploadProgress(100);
            setUploadStatus({ type: "success", message: "تم رفع المشروع بنجاح!" });
            if (fileInput.current) fileInput.current.value = "";
          } else {
            const text = await response.text();
            let errorMsg = "فشل الرفع!";
            try {
              const data = JSON.parse(text);
              if (data.error) errorMsg += `: ${data.error}`;
            } catch {
              if (text) errorMsg += `: ${text}`;
            }
            setUploadStatus({ type: "error", message: errorMsg });
          }
        } catch (err) {
          setIsUploading(false);
          setUploadStatus({
            type: "error",
            message: err.message || "حدث خطأ أثناء رفع الملف!",
          });
        }
      };

      xhr.onerror = (e) => {
        console.warn("XHR blocked by browser security, falling back to fetch()...", e);
        fetchFallback();
      };

      xhr.open("POST", targetUrl.toString(), true);
      xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
      xhr.send(file);
    } catch (err) {
      setIsUploading(false);
      setUploadStatus({ type: "error", message: err.message || "حدث خطأ في الاتصال بالسيرفر!" });
    }
  };

  const handleDownloadCertPdf = () => {
    window.print();
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
          <span className="text-[11px] font-medium">العام الدراسي 2024 - 2025 • الفصل الدراسي الثاني</span>
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
              className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 flex items-center justify-center text-[#f59e0b] ring-4 ring-[#f59e0b]/40 overflow-hidden shadow-xl ${
                isDark ? "bg-[#17233d] border-[#131b2e]" : isSepia ? "bg-[#e5d8bf] border-[#fbf7eb]" : "bg-slate-100 border-white"
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
            <span className={`absolute bottom-1 start-2 bg-emerald-500 text-slate-950 text-[11px] font-extrabold px-2 py-0.5 rounded-full border-2 flex items-center gap-1 shadow ${
              isDark ? "border-[#131b2e]" : isSepia ? "border-[#fbf7eb]" : "border-white"
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-950"></span> نشط
            </span>
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
                  className={`px-4 py-1.5 rounded-xl border text-lg font-bold text-center focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                    isDark ? "bg-[#0b1326] border-amber-500/40 text-white" : isSepia ? "bg-[#f2ead6] border-amber-600/40 text-[#342415]" : "bg-slate-50 border-amber-400 text-slate-900"
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
                <span className="text-amber-500 font-semibold text-lg">(طالب معتمد)</span>
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
            طالب في مدرسة الكتاب المقدس — السنة الدراسية الثانية (اللاهوت والعهد الجديد)
          </p>

          {/* Identification Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4 text-xs font-semibold">
            <span className="bg-amber-500/15 text-amber-400 border border-amber-500/30 px-3.5 py-1 rounded-full shadow-sm">
              رقم القيد: <span dir="ltr">{studentId}</span>
            </span>
            <span className={`px-3.5 py-1 rounded-full border ${subBoxBg} ${textSecondary}`}>
              المجموعة: مجموعة القديس يوحنا (A)
            </span>
            <span className="bg-emerald-950/70 text-emerald-400 border border-emerald-500/30 px-3.5 py-1 rounded-full shadow-sm">
              حالة الحساب: معتمد ومكتمل
            </span>
          </div>

          {/* Section Divider */}
          <div className={`w-full max-w-4xl my-7 border-t ${borderDivider}`}></div>

          {/* Project Submission Box */}
          <div className={`w-full max-w-2xl rounded-2xl p-5 sm:p-6 text-center sm:text-right flex flex-col sm:flex-row items-center justify-between gap-5 border shadow-inner ${subBoxBg}`}>
            <div className="flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <span className={`w-2.5 h-2.5 rounded-full ${isProjectLocked ? "bg-slate-500" : "bg-amber-400"}`}></span>
                <h2 className={`text-base sm:text-lg font-bold ${textPrimary}`}>مشروع التخرج السنوي</h2>
                {isProjectLocked && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    <Lock size={12} /> مغلق حالياً
                  </span>
                )}
              </div>
              <p className={`text-xs sm:text-sm leading-relaxed ${textMuted}`}>
                {isProjectLocked
                  ? "باب تسليم المشروعات مغلق حالياً. سيتم إتاحة رفع الملفات للطلاب مع اقتراب موعد التقييم النهائي."
                  : "ارفع مشروع التخرج للفصل الحالي. الصيغ المقبولة: PDF, DOCX, ZIP بحد أقصى 50MB."
                }
              </p>
            </div>

            <div className="flex flex-col items-center sm:items-end gap-2 shrink-0">
              {isProjectLocked ? (
                <div
                  className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border font-bold text-xs cursor-not-allowed select-none shadow-sm ${
                    isDark ? "bg-[#18233d] border-slate-700/60 text-slate-400" : isSepia ? "bg-[#e8dec7] border-[#d8caa9] text-[#705e4a]" : "bg-slate-100 border-slate-300 text-slate-500"
                  }`}
                  title="باب رفع المشروعات مغلق حالياً"
                >
                  <Lock size={16} className="text-amber-500" />
                  <span>التسليم غير متاح الآن</span>
                </div>
              ) : (
                <>
                  <button
                    onClick={openFilePicker}
                    disabled={isUploading}
                    className="cursor-pointer inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-[#d97706] via-[#f59e0b] to-[#fbbf24] hover:from-[#b45309] hover:to-[#f59e0b] text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/25 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                    type="button"
                  >
                    {isUploading ? (
                      <Loader2 size={18} className="animate-spin text-slate-950" />
                    ) : (
                      <Upload size={18} className="text-slate-950" />
                    )}
                    <span>{isUploading ? "جاري الرفع..." : "اختر ملف للرفع"}</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInput}
                    onChange={uploadFile}
                    accept=".pdf,.docx,.zip,application/pdf,application/zip"
                    hidden
                  />
                </>
              )}
            </div>
          </div>

          {/* Progress Bar & Status Alerts */}
          {(isUploading || uploadStatus) && (
            <div className="mt-5 w-full max-w-2xl mx-auto">
              {isUploading && (
                <div className="mb-2">
                  <div className="w-full bg-stone-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden flex" dir="ltr">
                    <div
                      className="bg-amber-500 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-amber-500 font-bold mt-2 text-right">
                    {uploadProgress}% تم الرفع
                  </p>
                </div>
              )}

              {uploadStatus && !isUploading && (
                <div className={`flex items-center gap-2 p-3.5 rounded-xl text-sm font-semibold justify-center sm:justify-start ${
                  uploadStatus.type === 'success'
                    ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
                    : 'bg-red-950/40 text-red-400 border border-red-500/30'
                }`}>
                  {uploadStatus.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
                  <span>{uploadStatus.message}</span>
                </div>
              )}
            </div>
          )}
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
                  <h3 className={`text-base font-bold ${textPrimary}`}>الشهادات الأكاديمية</h3>
                  <p className={`text-xs ${textMuted}`}>شهادة إتمام السنة الدراسية</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/40 animate-pulse">
                {currentCert.status}
              </span>
            </div>

            {/* Term Tabs */}
            <div className={`grid grid-cols-3 gap-1.5 p-1 rounded-xl mt-4 text-[11px] font-bold text-center border ${subBoxBg}`}>
              <button
                onClick={() => setActiveTerm("term1")}
                className={`py-2 px-1 rounded-lg transition-all ${
                  activeTerm === "term1"
                    ? "bg-amber-500 text-slate-950 font-extrabold shadow"
                    : `${textMuted} hover:${textPrimary}`
                }`}
                type="button"
              >
                الترم الأول
              </button>
              <button
                onClick={() => setActiveTerm("term2")}
                className={`py-2 px-1 rounded-lg transition-all ${
                  activeTerm === "term2"
                    ? "bg-amber-500 text-slate-950 font-extrabold shadow"
                    : `${textMuted} hover:${textPrimary}`
                }`}
                type="button"
              >
                الترم الثاني
              </button>
              <button
                onClick={() => setActiveTerm("term3")}
                className={`py-2 px-1 rounded-lg transition-all ${
                  activeTerm === "term3"
                    ? "bg-amber-500 text-slate-950 font-extrabold shadow"
                    : `${textMuted} hover:${textPrimary}`
                }`}
                type="button"
              >
                الترم الثالث
              </button>
            </div>

            {/* Elegant Certificate Miniature Preview Card with Gold Borders */}
            <div className="my-4 p-4 rounded-xl bg-gradient-to-b from-[#182542] to-[#0f172a] border border-amber-500/40 relative overflow-hidden text-center shadow-inner text-slate-100">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-200 to-amber-600"></div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-amber-400 text-xs">✦</span>
                <p className="text-[11px] tracking-widest text-amber-300 uppercase font-bold font-serif">
                  BIBLIA SCHOOL CERTIFICATE • {activeTerm.toUpperCase()}
                </p>
                <span className="text-amber-400 text-xs">✦</span>
              </div>
              <h4 className="text-sm font-extrabold text-white mt-1">{currentCert.certName}</h4>
              <div className="text-[11px] text-slate-300 mt-1">منحت للطالب: <span className="text-amber-300 font-bold">{studentName}</span></div>
              <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 bg-amber-950/60 border border-amber-500/40 rounded-full text-[10px] text-amber-300 font-bold">
                <ShieldCheck size={14} className="text-amber-400 shrink-0" />
                <span>معتمدة برقم ترخيص: {currentCert.code}</span>
              </div>
            </div>
            <p className={`text-xs leading-relaxed text-center ${textMuted}`}>
              {currentCert.summary}
            </p>
          </div>

          {/* Action Buttons */}
          <div className={`mt-4 pt-3 border-t ${borderDivider} space-y-2`}>
            <button
              onClick={() => setShowCertModal(true)}
              className="w-full py-2 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-amber-500/30"
              type="button"
            >
              <Eye size={16} />
              <span>معاينة الشهادة (تكبير / تفاصيل الاعتماد)</span>
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleDownloadCertPdf}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] hover:from-[#b45309] hover:to-[#d97706] text-slate-950 text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all text-center"
                type="button"
              >
                <Download size={16} className="text-slate-950 shrink-0" />
                <span>تحميل PDF</span>
              </button>
              <a
                href={`https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(currentCert.certName)}&organizationName=Biblia+School`}
                target="_blank"
                rel="noopener noreferrer"
                className={`py-2.5 px-3 rounded-xl border ${subBoxBg} ${textSecondary} hover:${textPrimary} text-xs font-medium flex items-center justify-center gap-1.5 transition-colors text-center`}
              >
                <svg className="w-3.5 h-3.5 text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                </svg>
                <span>إضافة لـ LinkedIn</span>
              </a>
            </div>
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
                  <p className={`text-xs ${textMuted}`}>لتسجيل الحضور بالقاعات والبث</p>
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
                    : "حسابك غير مرتبط برقم قيد بعد، لذلك لا يوجد رمز QR. تواصل مع الإدارة."}
                </p>
              )}
            </div>
            <p className={`text-xs text-center leading-relaxed ${textMuted}`}>
              امسح الرمز ضوئياً عند بوابات المحاضرة المباشرة أو شاركه لتأكيد حضورك التفاعلي.
            </p>
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

        {/* CARD 3: نسبة الحضور والالتزام (Attendance & Commitment) */}
        <section
          className={`rounded-2xl border ${cardBg} p-6 flex flex-col justify-between hover:border-amber-500/40 transition-all shadow-xl`}
          data-purpose="attendance-analytics-card"
        >
          <div>
            {/* Header */}
            <div className={`flex items-center justify-between pb-4 border-b ${borderDivider}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <h3 className={`text-base font-bold ${textPrimary}`}>نسبة الحضور والالتزام</h3>
                  <p className={`text-xs ${textMuted}`}>إحصائيات المحاضرات والندوات</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                مؤهل للتخرج
              </span>
            </div>

            {/* Circular Attendance Indicator Gauge (92%) */}
            <div className="flex flex-col items-center justify-center my-6">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background track */}
                  <path
                    className={isDark ? "text-slate-800" : isSepia ? "text-[#dfd4bd]" : "text-slate-200"}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                  ></path>
                  {/* Progress ring (92%) */}
                  <path
                    className="text-emerald-400"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="92, 100"
                    strokeLinecap="round"
                    strokeWidth="3.5"
                  ></path>
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className={`text-3xl font-black ${textPrimary}`}>92%</span>
                  <span className="text-[11px] text-emerald-400 font-bold">ممتاز جداً</span>
                </div>
              </div>
            </div>

            {/* Attendance Metric Points */}
            <div className="space-y-2.5 text-xs">
              <div className={`flex justify-between items-center p-2.5 rounded-lg border ${subBoxBg}`}>
                <span className={textMuted}>المحاضرات المحضورة:</span>
                <span className={`font-bold ${textPrimary}`}>23 من أصل 25 محاضرة</span>
              </div>
              <div className={`flex justify-between items-center p-2.5 rounded-lg border ${subBoxBg}`}>
                <span className={textMuted}>الغيابات المبررة:</span>
                <span className="font-bold text-amber-500">2 محاضرة (مقبولة)</span>
              </div>
              <div className={`flex justify-between items-center p-2.5 rounded-lg border ${subBoxBg}`}>
                <span className={textMuted}>الحد الأدنى المطلوب للتخرج:</span>
                <span className={`font-bold ${textSecondary}`}>80% كحد أدنى</span>
              </div>
            </div>
          </div>

          {/* Footer Progress Note */}
          <div className={`mt-5 pt-3 border-t ${borderDivider}`}>
            <p className={`text-[11px] leading-normal ${textMuted}`}>
              ✓ حافظ على هذه النسبة حتى نهاية الفصل لتضمن أولوية التكريم في الحفل السنوي.
            </p>
          </div>
        </section>
      </div>
      {/* END: AcademicFeatureGrid */}

      {/* BEGIN: QuickStatsAndLectures */}
      <section
        className={`rounded-2xl border ${cardBg} p-6 shadow-xl`}
        data-purpose="recent-activities-table"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <h3 className={`text-lg font-bold ${textPrimary}`}>سجل حضور المحاضرات الأخيرة</h3>
            <p className={`text-xs ${textMuted}`}>تحديث فوري لآخر الجلسات الدراسية وحالة التأكيد</p>
          </div>
          <Link
            to="/courses"
            className="text-xs font-bold text-amber-500 hover:text-amber-400 flex items-center gap-1.5 transition-colors"
          >
            <span>عرض جميع المحاضرات المسجلة</span>
            <span>←</span>
          </Link>
        </div>

        {/* Responsive Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className={`text-[11px] ${textMuted} uppercase border-b ${borderDivider} ${subBoxBg}`}>
              <tr>
                <th className="py-3 px-4 font-bold" scope="col">عنوان المحاضرة</th>
                <th className="py-3 px-4 font-bold" scope="col">المحاضر</th>
                <th className="py-3 px-4 font-bold" scope="col">التاريخ والتوقيت</th>
                <th className="py-3 px-4 font-bold text-center" scope="col">حالة الحضور</th>
                <th className="py-3 px-4 font-bold text-center" scope="col">المواد الدراسية</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${borderDivider}`}>
              {/* Row 1 */}
              <tr className="hover:bg-amber-500/5 transition-colors">
                <td className={`py-3.5 px-4 font-bold ${textPrimary} flex items-center gap-2`}>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  مدخل إلى لاهوت القديس بولس في رسالة رومية
                </td>
                <td className={`py-3.5 px-4 ${textSecondary}`}>د. يوسف ميخائيل</td>
                <td className={`py-3.5 px-4 ${textMuted}`}>الخميس، 18 سبتمبر 2024 (7:00 م)</td>
                <td className="py-3.5 px-4 text-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/70 text-emerald-400 border border-emerald-500/30">
                    تم تسجيل الحضور بالـ QR
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <Link to="/courses" className="text-amber-500 hover:underline font-semibold">
                    تحميل العرض (PDF)
                  </Link>
                </td>
              </tr>
              {/* Row 2 */}
              <tr className="hover:bg-amber-500/5 transition-colors">
                <td className={`py-3.5 px-4 font-bold ${textPrimary} flex items-center gap-2`}>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  السياق التاريخي والجغرافي لأسفار العهد الجديد
                </td>
                <td className={`py-3.5 px-4 ${textSecondary}`}>أ. مريم إسطفانوس</td>
                <td className={`py-3.5 px-4 ${textMuted}`}>الإثنين، 15 سبتمبر 2024 (8:00 م)</td>
                <td className="py-3.5 px-4 text-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/70 text-emerald-400 border border-emerald-500/30">
                    تم الحضور عبر البث المباشر
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <Link to="/courses" className="text-amber-500 hover:underline font-semibold">
                    ملخص المحاضرة
                  </Link>
                </td>
              </tr>
              {/* Row 3 */}
              <tr className="hover:bg-amber-500/5 transition-colors">
                <td className={`py-3.5 px-4 font-bold ${textPrimary} flex items-center gap-2`}>
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  ورشة التفسير الكتابي والتطبيق العملي
                </td>
                <td className={`py-3.5 px-4 ${textSecondary}`}>القس مرقس عزيز</td>
                <td className={`py-3.5 px-4 ${textMuted}`}>الجمعة، 12 سبتمبر 2024 (6:00 م)</td>
                <td className="py-3.5 px-4 text-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/60 text-amber-400 border border-amber-500/30">
                    غياب بعذر
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <Link to="/courses" className={`hover:text-amber-500 font-semibold ${textSecondary}`}>
                    مشاهدة التسجيل
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
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
                قد أتم بنجاح متطلبات دراسة <strong>{currentCert.certName}</strong> ونسبة حضور <strong>92%</strong> وفقاً للائحة الأكاديمية المعتمدة.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-amber-500/30 text-xs text-slate-300">
                <div>
                  <p className="text-[10px] text-slate-400">عميد الشؤون الأكاديمية</p>
                  <p className="font-serif font-bold text-amber-300 mt-1">د. يوسف ميخائيل</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">رقم ترخيص الشهادة</p>
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