// ✅ دالة لاكتشاف إذا كان الجهاز موبايل
function isMobile() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

/**
 * يفتح ملف PDF بشكل ذكي (كمبيوتر = pdf.js | موبايل = تبويب جديد/تحميل)
 * @param {string} filename اسم الملف (داخل /pdfs/)
 * @param {string} [viewerId] id عنصر iframe إذا كان موجود
 */
function openPdfSmart(filename, viewerId = "pdfViewer") {
  if (isMobile()) {
    // على الموبايل → فتح الملف مباشرة في تبويب جديد
    window.open(`/pdfs/${filename}`, "_blank");
  } else {
    // على الكمبيوتر → فتح الملف داخل pdf.js
    const pdfViewer = document.getElementById(viewerId);
    if (pdfViewer) {
      pdfViewer.src = `/pdfjs/web/viewer.html?file=/pdfs/${filename}`;
      pdfViewer.style.display = "block";
      pdfViewer.scrollIntoView({ behavior: "smooth" });
    } else {
      // fallback: فتح تبويب جديد إذا لم يوجد iframe
      window.open(`/pdfs/${filename}`, "_blank");
    }
  }
}
