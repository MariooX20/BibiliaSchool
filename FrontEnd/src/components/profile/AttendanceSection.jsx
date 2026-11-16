import { Link } from "react-router-dom";
import { CheckCircle2, Loader2 } from "lucide-react";
import { MIN_ATTENDANCE_PERCENT } from "./useAttendance";

const ratingFor = (p) => {
  if (p >= 90) return { label: "ممتاز جداً", color: "text-emerald-400" };
  if (p >= MIN_ATTENDANCE_PERCENT) return { label: "جيد", color: "text-emerald-400" };
  if (p >= 60) return { label: "يحتاج انتظام", color: "text-amber-400" };
  return { label: "يحتاج تحسين", color: "text-red-400" };
};

export function AttendanceCard({ att, ui }) {
  const { isDark, isSepia, cardBg, subBoxBg, textPrimary, textSecondary, textMuted, borderDivider } = ui;
  const hasData = att.percent !== null;
  const rating = hasData ? ratingFor(att.percent) : null;

  return (
    <section
      className={`rounded-2xl border ${cardBg} p-6 flex flex-col justify-between hover:border-amber-500/40 transition-all shadow-xl`}
      data-purpose="attendance-analytics-card"
    >
      <div>
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
          {hasData && att.eligible && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-md border bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              مؤهل للتخرج
            </span>
          )}
        </div>

        {att.loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 size={32} className="animate-spin text-amber-500" />
          </div>
        ) : !att.hasStudentCode ? (
          <p className={`text-sm text-center leading-relaxed my-12 ${textMuted}`}>
            حسابك غير مرتبط بQR بعد، لذلك لا يمكن حساب الحضور. تواصل مع الإدارة.
          </p>
        ) : !att.isEnrolled ? (
          <p className={`text-sm text-center leading-relaxed my-12 ${textMuted}`}>
            حسابك غير مسجل في سنة دراسية حالية (السنة الأولى أو الثانية).
          </p>
        ) : att.error ? (
          <p className="text-sm text-center leading-relaxed my-12 text-red-400">
            تعذّر تحميل بيانات الحضور. حاول مرة أخرى لاحقاً.
          </p>
        ) : !hasData ? (
          <p className={`text-sm text-center leading-relaxed my-12 ${textMuted}`}>
            لم تُسجَّل أي جلسات دراسية معقودة حتى الآن.
          </p>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center my-6">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className={isDark ? "text-slate-800" : isSepia ? "text-[#dfd4bd]" : "text-slate-200"}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                  />
                  <path
                    className={rating.color}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray={`${att.percent}, 100`}
                    strokeLinecap="round"
                    strokeWidth="3.5"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className={`text-3xl font-black ${textPrimary}`}>{att.percent}%</span>
                  <span className={`text-[11px] font-bold ${rating.color}`}>{rating.label}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className={`flex justify-between items-center p-2.5 rounded-lg border ${subBoxBg}`}>
                <span className={textMuted}>الجلسات المحضورة:</span>
                <span className={`font-bold ${textPrimary}`}>
                  {att.present} من أصل {att.denominator} جلسة
                </span>
              </div>
              <div className={`flex justify-between items-center p-2.5 rounded-lg border ${subBoxBg}`}>
                <span className={textMuted}>الغياب:</span>
                <span className={`font-bold ${att.absent > 0 ? "text-red-400" : textPrimary}`}>
                  {att.absent} جلسة
                </span>
              </div>
              {att.excused > 0 && (
                <div className={`flex justify-between items-center p-2.5 rounded-lg border ${subBoxBg}`}>
                  <span className={textMuted}>الغيابات المبررة:</span>
                  <span className="font-bold text-amber-500">{att.excused} جلسة (مقبولة)</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

const STATUS_UI = {
  present: { text: "حاضر", cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  excused: { text: "غياب بعذر", cls: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  absent: { text: "غائب", cls: "bg-red-500/15 text-red-400 border-red-500/30" },
};

const fmtDate = (d) =>
  new Date(d + "T12:00:00").toLocaleDateString("ar-EG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const fmtTime = (iso) =>
  iso
    ? new Date(iso).toLocaleTimeString("ar-EG", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "Africa/Cairo",
    })
    : "";

export function AttendanceTable({ att, ui }) {
  const { cardBg, subBoxBg, textPrimary, textMuted, borderDivider } = ui;
  const recent = att.list.slice(0, 10);

  return (
    <section className={`rounded-2xl border ${cardBg} p-6 shadow-xl`} data-purpose="recent-activities-table">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h3 className={`text-lg font-bold ${textPrimary}`}>سجل حضور المحاضرات الأخيرة</h3>
          <p className={`text-xs ${textMuted}`}>تحديث تلقائي لآخر الجلسات الدراسية وحالة التأكيد</p>
        </div>
        <Link
          to="/courses"
          className="text-xs font-bold text-amber-500 hover:text-amber-400 flex items-center gap-1.5 transition-colors"
        >
          <span>عرض جميع المحاضرات المسجلة</span>
          <span>←</span>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right text-xs">
          <thead className={`text-[11px] ${textMuted} uppercase border-b ${borderDivider} ${subBoxBg}`}>
            <tr>
              <th className="py-3 px-4 font-bold" scope="col">عنوان المحاضرة</th>
              <th className="py-3 px-4 font-bold" scope="col">المحاضر</th>
              <th className="py-3 px-4 font-bold" scope="col">التاريخ والتوقيت</th>
              <th className="py-3 px-4 font-bold text-center" scope="col">حالة الحضور</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${borderDivider}`}>
            {att.loading ? (
              <tr>
                <td colSpan="4" className={`py-12 text-center ${textMuted}`}>
                  <Loader2 size={24} className="animate-spin text-amber-500 inline" />
                </td>
              </tr>
            ) : att.error ? (
              <tr>
                <td colSpan="4" className="py-12 text-center text-red-400">
                  <p className="text-sm font-semibold">تعذّر تحميل سجل الحضور</p>
                  <p className="text-xs mt-1 text-slate-400">يرجى المحاولة مرة أخرى لاحقاً</p>
                </td>
              </tr>
            ) : recent.length === 0 ? (
              <tr>
                <td colSpan="4" className={`py-12 text-center ${textMuted}`}>
                  <p className="text-sm font-semibold">لا يوجد سجل حضور مسجل حتى الآن</p>
                  <p className="text-xs mt-1 text-slate-400">ستظهر جلساتك هنا تلقائياً عند مسح رمز الـ QR</p>
                </td>
              </tr>
            ) : (
              recent.map((r) => {
                const st = STATUS_UI[r.status] || {
                  text: r.status || "غائب",
                  cls: "bg-red-500/15 text-red-400 border-red-500/30",
                };
                return (
                  <tr key={r.date}>
                    <td className={`py-3 px-4 font-semibold ${textPrimary}`}>{r.title || "جلسة الجمعة"}</td>
                    <td className={`py-3 px-4 ${textMuted}`}>{r.lecturer || "—"}</td>
                    <td className={`py-3 px-4 ${textMuted}`}>
                      {fmtDate(r.date)}
                      {r.signedInAt && <span className="block text-[11px]">وقت التسجيل: {fmtTime(r.signedInAt)}</span>}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full border font-bold ${st.cls}`}>
                        {st.text}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}