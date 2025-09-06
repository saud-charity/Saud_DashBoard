// 📄 pdf-helper.js
// دالة ذكية لفتح PDF بشكل متوافق مع الكمبيوتر والموبايل
function openPdfSmart(filename) {
  if (!filename) {
    alert("❌ لم يتم تحديد الملف");
    return;
  }

  // مسار الملف من مجلد public/pdfs
  const fileUrl = `/pdfs/${filename}`;
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  if (isMobile) {
    // ✅ في الموبايل: افتح الملف في تبويب جديد (أضمن حل)
    window.open(fileUrl, "_blank");
  } else {
    // ✅ في الكمبيوتر: اعرض داخل pdf.js (لو متوفر)
    const viewerUrl = `/pdfjs/web/viewer.html?file=${encodeURIComponent(fileUrl)}`;
    const pdfViewer = document.getElementById("pdfViewer");
    if (pdfViewer) {
      pdfViewer.src = viewerUrl;
      pdfViewer.style.display = "block";
      pdfViewer.scrollIntoView({ behavior: "smooth" });
    } else {
      // fallback إذا ما فيه iframe
      window.open(viewerUrl, "_blank");
    }
  }
}
