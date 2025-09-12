// -----------------------------
// PDF Helper
// -----------------------------
const pdfViewer = document.getElementById("pdfViewer");
const pdfControls = document.getElementById("pdfControls");
const downloadBtn = document.getElementById("downloadBtn");
const printBtn = document.getElementById("printBtn");

let currentPdf = "";

// فتح ملف PDF مع التحكم في الأزرار
function openPdfWithControls(filename){
  if(!filename) return;

  currentPdf = filename;
  pdfViewer.src = `/api/pdfs/${filename}`;
  pdfViewer.style.display = "block";
  pdfControls.style.display = "flex";
}

// تحميل PDF
downloadBtn.addEventListener("click", ()=>{
  if(!currentPdf){
    alert("اختر ملف أولا");
    return;
  }
  const link = document.createElement("a");
  link.href = `/api/pdfs/${currentPdf}`;
  link.download = currentPdf;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// طباعة PDF
printBtn.addEventListener("click", ()=>{
  if(!currentPdf){
    alert("اختر ملف أولا");
    return;
  }
  const iframe = document.createElement("iframe");
  iframe.style.display="none";
  iframe.src = `/api/pdfs/${currentPdf}`;
  document.body.appendChild(iframe);
  iframe.onload = ()=>{
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    document.body.removeChild(iframe);
  };
});

// للتوافق مع الأجهزة المحمولة
window.addEventListener("resize", ()=>{
  if(window.innerWidth < 768){
    pdfViewer.style.height = "400px";
  } else {
    pdfViewer.style.height = "600px";
  }
});
