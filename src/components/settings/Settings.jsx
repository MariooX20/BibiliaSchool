
function Settings({
  themeMode,
  setThemeMode,
  fontSize,
  setFontSize,
  handleResetProgress
}) {
  return (
    <div className="space-y-8 animate-fade-in text-right max-w-2xl mx-auto">
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-white">إعدادات الحساب وتفضيلات القراءة</h2>
        <p className="text-xs opacity-70">خصص مظهر التطبيق وسلوك المشغل الصوتي بما يتناسب مع رغبتك.</p>
      </div>

      <div className={`p-6 rounded-3xl border transition-all ${
        themeMode === 'dark' ? 'bg-deep-900 border-deep-800' :
        themeMode === 'sepia' ? 'bg-[#efe9d0] border-[#dfd5b4]' : 'bg-white border-stone-200 shadow-md'
      }`}>
        <h3 className="font-bold text-sm mb-5 text-gold-500">مظهر شاشة القراءة</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'dark', label: 'مظهر داكن ملائم', desc: 'راحة تامة للعين ليلاً', bg: 'bg-deep-950 border-deep-800 text-white' },
            { id: 'sepia', label: 'ورق قديم (سيپيا)', desc: 'مثالي للقراءة الطويلة', bg: 'bg-[#f7f3e3] border-[#dfd5b4] text-[#433422]' },
            { id: 'light', label: 'مظهر ناصع البياض', desc: 'لإضاءة قوية أثناء النهار', bg: 'bg-white border-stone-200 text-stone-900 shadow-sm' }
          ].map((themeOpt) => (
            <button
              key={themeOpt.id}
              onClick={() => setThemeMode(themeOpt.id)}
              className={`p-4 rounded-2xl border-2 text-right transition-all flex flex-col justify-between h-28 ${themeOpt.bg} ${
                themeMode === themeOpt.id ? 'border-gold-600 scale-[1.02] ring-2 ring-gold-600/30' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <span className="text-xs font-black">{themeOpt.label}</span>
              <span className="text-[10px] opacity-60 block mt-1 leading-normal">{themeOpt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={`p-6 rounded-3xl border transition-all ${
        themeMode === 'dark' ? 'bg-deep-900 border-deep-800' :
        themeMode === 'sepia' ? 'bg-[#efe9d0] border-[#dfd5b4]' : 'bg-white border-stone-200 shadow-md'
      }`}>
        <h3 className="font-bold text-sm mb-4 text-gold-500">حجم ونوع خط الآيات والأسفار</h3>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span>حجم خط القارئ الافتراضي</span>
              <span className="font-mono text-gold-500">{fontSize}px</span>
            </div>
            <input
              type="range"
              min="14"
              max="28"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-full accent-gold-500"
            />
          </div>
          <div className={`p-5 rounded-2xl border text-center transition-all ${
            themeMode === 'dark' ? 'bg-deep-950 border-deep-900' : 'bg-black/5 border-black/5'
          }`}>
            <p className="text-[10px] opacity-55 mb-2">معاينة نص الخط العربي المختار (Amiri):</p>
            <p className="font-amiri leading-loose text-gold-400" style={{ fontSize: `${fontSize}px` }}>
              « فِي الْبَدْءِ كَانَ الْكَلِمَةُ، وَالْكَلِمَةُ كَانَ عِنْدَ اللهِ، وَكَانَ الْكَلِمَةُ اللهَ. »
            </p>
          </div>
        </div>
      </div>

      <div className={`p-6 rounded-3xl border border-red-950/20 bg-red-950/5 text-right transition-all`}>
        <h3 className="font-bold text-sm text-red-400 mb-2">إعادة ضبط بيانات الدراسة</h3>
        <p className="text-xs opacity-70 mb-4 leading-normal">سيؤدي هذا الإجراء إلى إعادة تعيين تقدم دراسة المناهج (النسبة المئوية، الكويزات المحلولة، وحالة إتمام الدروس) إلى نقطة البداية الصفرية.</p>
        <button
          onClick={handleResetProgress}
          className="px-5 py-2.5 rounded-xl font-bold bg-red-600/10 hover:bg-red-600/20 text-red-500 transition-all border border-red-500/25 active:scale-95 text-xs"
        >
          إعادة تعيين كافة البيانات والتقدم
        </button>
      </div>
    </div>
  );
}

export default Settings;
