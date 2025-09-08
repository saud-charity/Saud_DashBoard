// 📄 pdf-helper.js

function openPdfSmart(filename) {
  if (!filename) {
    alert("❌ لم يتم تحديد الملف");
    return;
  }

  // 👇 نستخدم API السيرفر لضمان فتح الملف بشكل صحيح
  const fileUrl = `/api/pdfs/${filename}`;

  // 🔹 افتح الملف في تبويب جديد سواء كمبيوتر أو موبايل
  const newTab = window.open(fileUrl, "_blank");

  if (!newTab) {
    alert("❌ لم يتمكن المتصفح من فتح الملف. تأكد من عدم وجود حظر النوافذ المنبثقة.");
  }
}
