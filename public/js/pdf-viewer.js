// ✅ كائن موحد لعرض الـ PDF
const PDFViewer = {
  file: null,
  iframe: null,
  controls: null,

  init: function(iframeId = "pdfViewer") {
    this.iframe = document.getElementById(iframeId);
  },

  open: function(filename) {
    this.file = filename;
    if (!this.iframe) {
      console.error("❌ لم يتم العثور على iframe لعرض PDF");
      return;
    }

    this.iframe.src = `/pdfjs/web/viewer.html?file=/pdfs/${filename}`;
    this.iframe.style.display = "block";
    this.iframe.scrollIntoView({ behavior: "smooth" });

    if (!this.controls) {
      this.controls = document.createElement("div");
      this.controls.style.margin = "15px";
      this.controls.innerHTML = `
        <button onclick="PDFViewer.download()">⬇️ تحميل</button>
        <button onclick="PDFViewer.print()">🖨️ طباعة</button>
      `;
      this.iframe.insertAdjacentElement("beforebegin", this.controls);
    }
  },

  download: function() {
    if (this.file) {
      const link = document.createElement("a");
      link.href = `/pdfs/${this.file}`;
      link.download = this.file;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },

  print: function() {
    if (this.file) {
      // الكمبيوتر: زر الطباعة يعمل مباشرة
      // الموبايل: يفتح الملف في تبويب جديد والطباعة من قائمة المتصفح
      window.open(`/pdfs/${this.file}`, "_blank");
    }
  }
};
