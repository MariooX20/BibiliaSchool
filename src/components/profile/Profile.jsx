import { useRef, useState } from "react";
import { UserRound, Upload, CheckCircle, XCircle, Loader2 } from "lucide-react";

const Profile = ({ themeMode, currentUser }) => {
  const fileInput = useRef();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  const openFilePicker = () => {
    if (isUploading) return;
    fileInput.current.click();
  };

  const uploadFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus(null);

    try {
      const params = new URLSearchParams({
        userId: currentUser.id,
        userName: currentUser.name,
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
          setUploadStatus({ type: "success", message: "تم رفع الملف بنجاح!" });
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

      xhr.onerror = () => {
        setIsUploading(false);
        setUploadStatus({ type: "error", message: "حدث خطأ أثناء رفع الملف!" });
      };

      const rawUrl = (import.meta.env.VITE_BACKEND_URL || "").trim();
      const backendUrl = (
        rawUrl && rawUrl !== "/"
          ? rawUrl
          : "https://bibliaschoolbackend-production.up.railway.app"
      ).replace(/\/+$/, "");

      xhr.open("POST", `${backendUrl}/upload-stream?${params.toString()}`, true);
      xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
      xhr.send(file);
    } catch (err) {
      setIsUploading(false);
      setUploadStatus({ type: "error", message: err.message || "حدث خطأ في الاتصال بالسيرفر!" });
    }
  };

  if (!currentUser) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">يجب تسجيل الدخول لعرض الملف الشخصي</h2>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className={`rounded-3xl shadow-xl overflow-hidden ${
        themeMode === 'dark' ? 'bg-deep-900 shadow-black/40' : 
        themeMode === 'sepia' ? 'bg-[#efe9d0] shadow-amber-900/10' : 'bg-white shadow-stone-200/50'
      }`}>
        {/* Cover Photo Area */}
        <div className="h-40 bg-gradient-to-r from-gold-600 to-amber-500 w-full relative">
          {/* Profile Picture */}
          <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
            <div 
              className={`w-28 h-28 rounded-full border-4 flex items-center justify-center text-4xl font-bold overflow-hidden ${
                themeMode === 'dark' ? 'border-deep-900 bg-deep-800 text-gold-400' :
                themeMode === 'sepia' ? 'border-[#efe9d0] bg-[#dfd5b4] text-[#433422]' : 'border-white bg-stone-100 text-stone-600'
              }`}
            >
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt={currentUser.name} className="w-full h-full object-cover" />
              ) : (
                <UserRound size={48} />
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="pt-20 pb-8 px-8 text-center">
          <h1 className="text-3xl font-bold mb-1">{currentUser.name}</h1>
          <p className={`text-sm mb-6 ${
            themeMode === 'dark' ? 'text-gray-400' : 
            themeMode === 'sepia' ? 'text-[#7c684d]' : 'text-stone-500'
          }`}>طالب في مدرسة الكتاب المقدس</p>

          <hr className={`my-8 ${themeMode === 'dark' ? 'border-deep-800' : themeMode === 'sepia' ? 'border-[#dfd5b4]' : 'border-stone-100'}`} />

          {/* User File Upload Section */}
          <div className="text-right">
            <h2 className="text-xl font-bold mb-4">ارفع مشروعك</h2>
            <p className={`text-sm mb-4 ${themeMode === 'dark' ? 'text-gray-400' : themeMode === 'sepia' ? 'text-[#7c684d]' : 'text-stone-500'}`}>
             ارفع مشروع التخرج
            </p>
            <button
              onClick={openFilePicker}
              disabled={isUploading}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                isUploading 
                ? 'bg-stone-400 dark:bg-stone-600 text-stone-100 cursor-not-allowed'
                : 'bg-gradient-to-l from-gold-600 to-amber-500 text-white hover:shadow-lg hover:from-gold-700 hover:to-gold-800'
              }`}
            >
              {isUploading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
              {isUploading ? 'جاري الرفع...' : 'اختر ملف للرفع'}
            </button>
            <input
              type="file"
              ref={fileInput}
              onChange={uploadFile}
              hidden
            />

            {/* Progress Bar & Status */}
            {(isUploading || uploadStatus) && (
              <div className="mt-6 max-w-sm ml-auto">
                {isUploading && (
                  <div className="mb-2">
                    <div className="w-full bg-stone-200 dark:bg-stone-700 rounded-full h-2 overflow-hidden flex" dir="ltr">
                      <div 
                        className="bg-gold-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-stone-500 dark:text-stone-400 mt-2 text-right">
                      {uploadProgress}% تم الرفع
                    </p>
                  </div>
                )}
                
                {uploadStatus && !isUploading && (
                  <div className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium w-fit ml-auto ${
                    uploadStatus.type === 'success' 
                    ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {uploadStatus.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
                    <span>{uploadStatus.message}</span>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;