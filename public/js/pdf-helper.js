// 📄 pdf-helper.js
function openPdfSmart(filename) {
  if (!filename) {
    alert("❌ لم يتم تحديد الملف");
    return;
  }

  // 🔗 مسار ملف PDF
  const fileUrl = `/pdfs/${filename}`;

  // 📑 نعرض الملف دائمًا في PDF.js داخل تبويب جديد
  const viewerUrl = `/pdfjs/web/viewer.html?file=${encodeURIComponent(fileUrl)}`;

  // فتح في تبويب جديد (يدعم تحميل و طباعة)
  window.open(viewerUrl, "_blank");
}
