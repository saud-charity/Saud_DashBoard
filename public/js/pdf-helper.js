function openPdfSmart(filename, viewerId = "pdfViewer") {
  if (!filename) {
    alert("❌ لم يتم تحديد الملف");
    return;
  }

  const fileUrl = `/pdfs/${filename}`;
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  const mobileControls = document.getElementById("mobileControls");
  const pdfViewer = document.getElementById(viewerId);

  if (isMobile) {
    // 📱 Mobile → open in new tab
    window.open(fileUrl, "_blank");
    // show mobile controls if needed
    if (mobileControls) mobileControls.style.display = "block";
  } else {
    // 💻 Desktop → embed in iframe
    const viewerUrl = `/pdfjs/web/viewer.html?file=${encodeURIComponent(fileUrl)}`;
    if (pdfViewer) {
      pdfViewer.src = viewerUrl;
      pdfViewer.style.display = "block";
      pdfViewer.scrollIntoView({ behavior: "smooth" });
    } else {
      window.open(viewerUrl, "_blank");
    }
  }

  // Mobile Back button
  const backBtn = document.getElementById("backBtn");
  if (backBtn) backBtn.onclick = () => window.history.back();

  // Mobile Close button
  const closeBtn = document.getElementById("closeBtn");
  if (closeBtn) closeBtn.onclick = () => {
    if (pdfViewer) pdfViewer.style.display = "none";
    if (mobileControls) mobileControls.style.display = "none";
  };
}
