// 📄 pdf-helper.js
function openPdfSmart(filename, viewerId = "pdfViewer") {
  console.log("openPdfSmart called with:", filename, "viewerId:", viewerId);

  if (!filename) {
    alert("❌ لم يتم تحديد الملف");
    return;
  }

  const fileUrl = `/pdfs/${filename}`;
  const viewerUrl = `/pdfjs/web/viewer.html?file=${encodeURIComponent(fileUrl)}`;

  // Detect mobile
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (isMobile) {
    console.log("📱 Mobile detected → opening native viewer:", fileUrl);
    // Mobile → rely on native browser PDF handling (download/print in browser UI)
    window.open(fileUrl, "_blank");
    return;
  }

  // 💻 Desktop → use PDF.js viewer inside iframe
  const pdfViewer = document.getElementById(viewerId);
  if (pdfViewer) {
    console.log("✅ Desktop detected → loading in iframe:", viewerUrl);
    pdfViewer.src = viewerUrl;
    pdfViewer.style.display = "block";
    pdfViewer.scrollIntoView({ behavior: "smooth" });
  } else {
    console.warn("⚠️ No iframe found → fallback open in new tab:", viewerUrl);
    window.open(viewerUrl, "_blank");
  }
}

// ✅ Export globally
window.openPdfSmart = openPdfSmart;
