// 📄 pdf-helper.js
// وظيفة بسيطة لفتح ملفات PDF في تبويب جديد (Desktop & Mobile)
function openPdfSmart(filename) {
  if (!filename) {
    alert("❌ لم يتم تحديد الملف");
    return;
  }

  const fileUrl = `/pdfs/${filename}`;
  // افتح الملف دائمًا في تبويب جديد → يدعم الطباعة والتنزيل
  window.open(fileUrl, "_blank");
}
