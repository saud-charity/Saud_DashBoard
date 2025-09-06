(function () {
  let currentPDF = null;

  // 🔹 أنشئ نافذة عرض PDF + الأزرار مرة واحدة
  function initPDFViewer() {
    if (document.getElementById("pdfContainer")) return; // موجودة بالفعل

    const container = document.createElement("div");
    container.id = "pdfContainer";
    container.style.display = "none";
    container.style.textAlign = "center";

    container.innerHTML = `
      <div style="margin-bottom:15px;">
        <button class="action-btn download" onclick="PDFViewer.download()">⬇ تحميل</button>
        <button class="action-btn print" onclick="PDFViewer.print()">🖨 طباعة</button>
        <button class="action-btn back" onclick="PDFViewer.back()">🔙 رجوع</button>
      </div>
      <iframe id="pdfViewer" style="width:95%; height:600px; border:1px solid #ccc; border-radius:8px;"></iframe>
    `;

    document.body.appendChild(container);
  }

  // 🔹 API عام
  window.PDFViewer = {
    show(file, titleText = "") {
      initPDFViewer();
      currentPDF = file;

      // إخفاء القوائم
      const menu = document.getElementById("menuContainer");
      const title = document.getElementById("pageTitle");
      if (menu) menu.style.display = "none";
      if (title) title.style.display = "none";

      // إظهار PDF
      document.getElementById("pdfContainer").style.display = "block";
      document.getElementById("pdfViewer").src = `/pdfjs/web/viewer.html?file=${file}`;
    },

    download() {
      if (!currentPDF) return;
      const a = document.createElement("a");
      a.href = currentPDF;
      a.download = currentPDF.split("/").pop();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },

    print() {
      if (!currentPDF) return;
      const win = window.open(currentPDF, "_blank");
      win.onload = () => {
        win.focus();
        win.print();
      };
    },

    back() {
      const menu = document.getElementById("menuContainer");
      const title = document.getElementById("pageTitle");
      if (menu) menu.style.display = "flex";
      if (title) title.style.display = "block";

      document.getElementById("pdfContainer").style.display = "none";
      document.getElementById("pdfViewer").src = "";
      currentPDF = null;
    }
  };
})();
