// ✅ pdf-helper.js

// فتح ملف PDF مع إظهار أزرار التحكم (تحميل + طباعة)
window.openPdfWithControls = function (filename, viewerId, controlsId, printBtnId, downloadBtnId) {
  if (!filename) {
    alert("❌ لم يتم تحديد الملف");
    return;
  }

  const fileUrl = `/api/pdfs/${filename}`;
  const viewer = document.getElementById(viewerId);
  const controls = document.getElementById(controlsId);
  const printBtn = document.getElementById(printBtnId);
  const downloadBtn = document.getElementById(downloadBtnId);

  if (!viewer) {
    window.open(fileUrl, "_blank");
    return;
  }

  // ✅ عرض الملف داخل iframe
  viewer.src = fileUrl;
  viewer.style.display = "block";

  // ✅ إظهار أزرار التحكم
  if (controls) controls.style.display = "block";

  // زر الطباعة
  if (printBtn) {
    printBtn.onclick = () => {
      const newTab = window.open(fileUrl, "_blank");
      if (newTab) {
        newTab.addEventListener("load", () => newTab.print());
      }
    };
  }

  // زر التنزيل
  if (downloadBtn) {
    downloadBtn.onclick = () => {
      const a = document.createElement("a");
      a.href = fileUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
  }
};
