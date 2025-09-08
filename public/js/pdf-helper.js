// 📄 pdf-helper.js

function openPdfSmart(filename) {
  if (!filename) {
    alert("❌ لم يتم تحديد الملف");
    return;
  }

  const fileUrl = `/api/pdfs/${filename}`;
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  if (isMobile) {
    // على الموبايل → افتح الملف مباشرة في نافذة جديدة
    const newWindow = window.open(fileUrl, "_blank");
    if (!newWindow) {
      alert("❌ المتصفح منع فتح الملف. تأكد من السماح للنوافذ المنبثقة.");
    }
  } else {
    // على الكمبيوتر → افتح باستخدام pdf.js داخل iframe
    const viewerUrl = `/pdfjs/web/viewer.html?file=${encodeURIComponent(fileUrl)}`;
    const pdfViewer = document.getElementById("pdfViewer");

    if (pdfViewer) {
      pdfViewer.src = viewerUrl;
      pdfViewer.style.display = "block";
      pdfViewer.scrollIntoView({ behavior: "smooth" });
    } else {
      window.open(viewerUrl, "_blank");
    }
  }
}
