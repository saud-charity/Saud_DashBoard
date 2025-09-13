let currentPdfFile = null;

// ================================
// ✅ بيانات السياسات (يمكن تعديلها أو جلبها من API)
// ================================
const studentPolicies = [
  { title: "📘 اللائحة السلوكية", filename: "Behaviour_Policy.pdf" },
  { title: "📗 الدليل الاجرائي لإدارة حضور وغياب الطلبة", filename: "Attendance_Policy.pdf" },
  { title: "📕 سياسة التقييم", filename: "Assessment_Policy.pdf" }
  // أضف باقي السياسات هنا
];

const staffPolicies = [
  { title: "📘 الميثاق المهني والأخلاقي", filename: "Ethics_Charter_Policy.pdf" },
  { title: "📗 اللائحة السلوكية", filename: "Behaviour_Policy.pdf" },
  { title: "📕 الدليل الاجرائي لإدارة حضور وغياب الطلبة", filename: "Attendance_Policy.pdf" }
  // أضف باقي السياسات هنا
];

// ================================
// ✅ تحميل السياسات حسب الدور
// ================================
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const role = params.get("role") || sessionStorage.getItem("role");
  const container = document.getElementById("policiesContainer");
  if (!container) return;

  let policies = [];
  if (role === "student") policies = studentPolicies;
  else if (role === "staff") policies = staffPolicies;

  if (policies.length === 0) {
    container.innerHTML = "<p>❌ لا توجد سياسات متاحة</p>";
    return;
  }

  policies.forEach(item => {
    const btn = document.createElement("button");
    btn.className = "policy-btn";
    btn.textContent = item.title;
    btn.onclick = () => openPdfSmart(item.filename);
    container.appendChild(btn);
  });
});

// ================================
// ✅ PDF Viewer + Toolbar
// ================================
function openPdfSmart(filename) {
  if (!filename) return alert("❌ لم يتم تحديد الملف");
  currentPdfFile = filename;

  const viewerUrl = `/pdfjs/web/viewer.html?file=${encodeURIComponent("/pdfs/" + filename)}`;
  const pdfViewer = document.getElementById("pdfViewer");
  const pdfToolbar = document.getElementById("pdfToolbar");

  pdfViewer.src = viewerUrl;
  pdfViewer.style.display = "block";
  pdfToolbar.style.display = "flex";
  pdfViewer.scrollIntoView({ behavior: "smooth" });
}

function downloadPdf() {
  if (!currentPdfFile) return;
  const link = document.createElement("a");
  link.href = `/pdfs/${currentPdfFile}`;
  link.download = currentPdfFile;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function printPdf() {
  if (!currentPdfFile) return;
  const printWindow = window.open(
    `/pdfjs/web/viewer.html?file=${encodeURIComponent("/pdfs/" + currentPdfFile)}&print=true`,
    "_blank"
  );
  if (printWindow) printWindow.focus();
}

function closePdf() {
  document.getElementById("pdfViewer").style.display = "none";
  document.getElementById("pdfToolbar").style.display = "none";
  document.getElementById("pdfViewer").src = "";
}
