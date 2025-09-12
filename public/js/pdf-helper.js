// pdf-helper.js
// -----------------------------
// Global PDF helper for web & mobile
// -----------------------------

const pdfViewer = document.getElementById("pdfViewer");
const pdfControls = document.getElementById("pdfControls");
const downloadBtn = document.getElementById("downloadBtn");
const printBtn = document.getElementById("printBtn");

let currentPdfPath = "";

// -----------------------------
// Open PDF with controls
// -----------------------------
function openPdfWithControls(filename) {
  if (!filename) return alert("❌ لم يتم اختيار ملف");

  currentPdfPath = `/pdfs/${filename}`;

  // Show iframe and controls
  pdfViewer.style.display = "block";
  pdfViewer.src = currentPdfPath;

  if (pdfControls) pdfControls.style.display = "flex";
}

// -----------------------------
// Download PDF
// -----------------------------
if (downloadBtn) {
  downloadBtn.addEventListener("click", () => {
    if (!currentPdfPath) return alert("❌ اختر ملف أولاً");
    const link = document.createElement("a");
    link.href = currentPdfPath;
    link.download = currentPdfPath.split("/").pop();
    document.body.appendChild(link);
    link.click();
    link.remove();
  });
}

// -----------------------------
// Print PDF
// -----------------------------
if (printBtn) {
  printBtn.addEventListener("click", () => {
    if (!currentPdfPath) return alert("❌ اختر ملف أولاً");
    const printWindow = window.open(currentPdfPath, "_blank");
    printWindow.focus();
    printWindow.print();
  });
}
