// 📄 pdf-helper.js
function openPdfSmart(filename) {
  console.log("openPdfSmart called with:", filename);

  if (!filename) {
    alert("❌ لم يتم تحديد الملف");
    return;
  }

  const fileUrl = `/pdfs/${filename}`;
  console.log("🔗 Opening PDF in new tab:", fileUrl);

  // Always open in new tab → works on desktop & mobile
  window.open(fileUrl, "_blank");
}

// ✅ Make sure it’s globally available
window.openPdfSmart = openPdfSmart;
