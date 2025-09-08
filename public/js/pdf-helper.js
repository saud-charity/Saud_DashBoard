// ✅ pdf-helper.js
window.openPdfSmart = function(filename) {
  if (!filename) {
    alert("❌ لم يتم تحديد الملف");
    return;
  }

  const fileUrl = `/api/pdfs/${filename}`;

  // حاول فتح التبويب مباشرة
  const newTab = window.open(fileUrl, "_blank");

  if (!newTab || newTab.closed || typeof newTab.closed === "undefined") {
    alert("⚠️ المتصفح منع فتح النافذة الجديدة. الرجاء السماح بالنوافذ المنبثقة.");
  }
};
