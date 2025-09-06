// 📄 public/js/pdf-helper.js
function openPdfSmart(filename, viewerId = "pdfViewer") {
  if (!filename) {
    alert("❌ لم يتم تحديد الملف");
    return;
  }

  const fileUrl = `/pdfs/${filename}`;
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  if (isMobile) {
    // 📱 على الموبايل → افتح الملف في تبويب جديد
    window.open(fileUrl, "_blank");
  } else {
    // 💻 على الكمبيوتر → حاول تعرضه في pdf.js داخل iframe
    const viewerUrl = `/pdfjs/web/viewer.html?file=${encodeURIComponent(fileUrl)}`;
    const pdfViewer = document.getElementById(viewerId);

    if (pdfViewer) {
      pdfViewer.src = viewerUrl;
      pdfViewer.style.display = "block";
      pdfViewer.scrollIntoView({ behavior: "smooth" });
    } else {
      window.open(viewerUrl, "_blank");
    }
  }
}
