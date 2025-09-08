// 📄 pdf-helper.js
function openPdfSmart(filename) {
  if (!filename) {
    alert("❌ لم يتم تحديد الملف");
    return;
  }

  const fileUrl = `/pdfs/${filename}`;

  // افتح الملف في تبويب جديد مباشرة عند الضغط على الزر
  const newWindow = window.open(fileUrl, "_blank");
  
  if (!newWindow) {
    alert("⚠️ المتصفح منع فتح نافذة جديدة. الرجاء السماح بالنوافذ المنبثقة.");
  }
}
