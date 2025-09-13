let currentPdfFile = null;

// ================================
// ✅ قائمة السياسات (مثال)
// ================================
const studentPolicies = [
  { title: "📘 اللائحة السلوكية", filename: "Behaviour_Policy.pdf" },
  { title: "📗 الدليل الاجرائي لإدارة حضور وغياب الطلبة", filename: "Attendance_Policy.pdf" }
];
const staffPolicies = [
  { title: "📘 الميثاق المهني والأخلاقي", filename: "Ethics_Charter_Policy.pdf" }
];

// ================================
// ✅ تحميل السياسات حسب الدور
// ================================
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const role = params.get("role") || sessionStorage.getItem("role");

  const container = document.getElementById("policiesContainer");
  if (!container) return;

  let policies = role === "student" ? studentPolicies : staffPolicies;
  policies.forEach(item => {
    const btn = document.createElement("button");
    btn.className = "policy-btn";
    btn.textContent = item.title;
    btn.onclick = () => openPdfSmart(item.filename);
    container.appendChild(btn);
  });
});

// ================================
// ✅ فتح PDF داخل iframe + شريط أدوات
// ================================
function openPdfSmart(filename) {
  if (!filename) return alert("❌ لم يتم تحديد الملف");
  currentPdfFile = filename;

  const pdfViewer = document.getElementById("pdfViewer");
  const pdfToolbar = document.getElementById("pdfToolbar");

  pdfViewer.src = `/pdfjs/web/viewer.html?file=${encodeURIComponent("/pdfs/" + filename)}`;
  pdfViewer.style.display = "block";
  pdfToolbar.style.display = "flex";
  pdfViewer.scrollIntoView({ behavior: "smooth" });
}

// ================================
// ✅ تحميل PDF
// ================================
function downloadPdf() {
  if (!currentPdfFile) return;
  const link = document.createElement("a");
  link.href = `/pdfs/${currentPdfFile}`;
  link.download = currentPdfFile;
  link.click();
}

// ================================
// ✅ طباعة PDF مباشرة إن أمكن
// ================================
function printPdf() {
  if (!currentPdfFile) return;

  // نستخدم iframe للطباعة على سطح المكتب
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = `/pdfs/${currentPdfFile}`;
  document.body.appendChild(iframe);

  iframe.onload = function() {
    try {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } catch(e) {
      // fallback للموبايل: فتح نافذة جديدة
      window.open(`/pdfjs/web/viewer.html?file=${encodeURIComponent("/pdfs/" + currentPdfFile)}&print=true`, "_blank");
    }
  }
}

// ================================
// ✅ إغلاق PDF
// ================================
function closePdf() {
  document.getElementById("pdfViewer").style.display = "none";
  document.getElementById("pdfToolbar").style.display = "none";
  document.getElementById("pdfViewer").src = "";
  currentPdfFile = null;
}
