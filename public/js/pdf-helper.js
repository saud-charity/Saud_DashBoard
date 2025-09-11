// public/js/pdf-helper.js
function openPdfSmart(filename) {
  if (!filename) {
    alert("❌ لم يتم تحديد الملف");
    return;
  }

  // نستخدم المسار الثابت (static) لكي يعمل على الموبايل والكمبيوتر
  const pdfStaticUrl = `/pdfs/${filename}`;        // ملف ثابت
  const apiPdfUrl = `/api/pdfs/${filename}`;       // API مؤمن (اختياري)
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (isMobile) {
    // على الموبايل: افتح الملف مباشرة (browser native viewer يدعم print/download)
    const newTab = window.open(pdfStaticUrl, "_blank");
    if (!newTab) alert("⚠️ المتصفح منع فتح النافذة الجديدة. فعّل النوافذ المنبثقة للموقع.");
    return;
  }

  // على الكمبيوتر: نعرض داخل PDF.js viewer (إذا أردت إبقاؤه)
  const viewerUrl = `/pdfjs/web/viewer.html?file=${encodeURIComponent(pdfStaticUrl)}`;
  const iframe = document.getElementById("pdfViewer");
  if (iframe) {
    iframe.src = viewerUrl;
    iframe.style.display = "block";
    iframe.scrollIntoView({ behavior: "smooth" });
  } else {
    // إذا لم يتوفر iframe افتح في تبويب جديد
    window.open(viewerUrl, "_blank");
  }
}
