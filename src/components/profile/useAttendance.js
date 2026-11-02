import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

export const MIN_ATTENDANCE_PERCENT = 80;

/**
 * نسبة الحضور = الجلسات اللي حضرها ÷ (الجلسات اللي اتعقدت - الغياب بعذر)
 * - المقام = الجلسات اللي اتعقدت فعلاً لحد النهارده لسنة الطالب (held = true)
 * - الغياب بعذر بيتشال من المقام (غيّر EXCUSED_COUNTS_AS_PRESENT لو عايزه يتحسب حضور)
 */
const EXCUSED_COUNTS_AS_PRESENT = false;

export function useAttendance(studentCode, year, isCheckingCode = false) {
  const [state, setState] = useState({ loading: true, error: null, sessions: [], rows: [] });

  useEffect(() => {
    if (isCheckingCode) {
      setState((s) => ({ ...s, loading: true, error: null }));
      return;
    }

    if (!studentCode || !year) {
      setState({ loading: false, error: null, sessions: [], rows: [] });
      return;
    }

    let cancelled = false;
    (async () => {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        // YYYY-MM-DD بتوقيت القاهرة
        const today = new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Cairo" });

        const [sRes, aRes] = await Promise.all([
          supabase
            .from("sessions")
            .select("session_date,title,lecturer")
            .eq("year", year)
            .eq("held", true)
            .lte("session_date", today)
            .order("session_date", { ascending: false }),
          supabase
            .from("attendance")
            .select("session_date,status,signed_in_at")
            .eq("student_id", studentCode),
        ]);

        if (sRes.error) throw sRes.error;
        if (aRes.error) throw aRes.error;
        if (cancelled) return;

        setState({ loading: false, error: null, sessions: sRes.data || [], rows: aRes.data || [] });
      } catch (err) {
        console.error("Attendance load error:", err);
        if (!cancelled) setState({ loading: false, error: err, sessions: [], rows: [] });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [studentCode, year, isCheckingCode]);

  return useMemo(() => {
    const byDate = new Map(state.rows.map((r) => [r.session_date, r]));

    const list = state.sessions.map((s) => {
      const row = byDate.get(s.session_date);
      return {
        date: s.session_date,
        title: s.title,
        lecturer: s.lecturer,
        status: row ? row.status : "absent", // present | excused | absent
        signedInAt: row?.signed_in_at || null,
      };
    });

    const present = list.filter((x) => x.status === "present").length;
    const excused = list.filter((x) => x.status === "excused").length;
    const absent = list.filter((x) => x.status === "absent").length;

    const attended = EXCUSED_COUNTS_AS_PRESENT ? present + excused : present;
    const denominator = EXCUSED_COUNTS_AS_PRESENT ? list.length : list.length - excused;
    const percent =
      denominator > 0
        ? Math.min(100, Math.round((attended / denominator) * 100))
        : list.length > 0 && excused === list.length
        ? 100
        : null;

    return {
      loading: state.loading,
      error: state.error,
      list,
      present,
      excused,
      absent,
      totalSessions: list.length,
      denominator,
      percent,
      eligible: percent === null ? null : percent >= MIN_ATTENDANCE_PERCENT,
      hasStudentCode: !!studentCode,
      isEnrolled: year === 1 || year === 2,
    };
  }, [state, studentCode, year]);
}