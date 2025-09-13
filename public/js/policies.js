let currentPdfFile = null;

const studentPolicies = [
  { title: "📘 اللائحة السلوكية", filename: "Behaviour_Policy.pdf" },
  { title: "📗 الدليل الاجرائي لإدارة حضور وغياب الطلبة", filename: "Attendance_Policy.pdf" },
  { title: "📕 سياسة التقييم", filename: "Assessment_Policy.pdf" },
  { title: "📙 سياسة الوقاية من التنمر", filename: "Bullying_Prevention_Policy.pdf" },
  { title: "📒 سياسة حقوق الطفل", filename: "Child_Rights_Policy.pdf" },
  { title: "📓 قانون وديمة", filename: "Behaviour_Policy1.pdf" },
  { title: "📘 دليل الوقاية من التنمر", filename: "Bullying_Prevention_Policy.pdf" },
  { title: "📗 دليل ولي الأمر للوقاية من المخدرات", filename: "Drug_Prevention_Guide.pdf" },
  { title: "📕 دليل ولي الأمر للصحة النفسية", filename: "Mental_Health_Guide.pdf" },
  { title: "📙 دليل ولي الأمر للطفولة المبكرة", filename: "Parents’_Guide_to_Early_Childhood.pdf" },
  { title: "📒 سياسة الأمن الرقمي", filename: "Digital_Safety_Policy.pdf" }
];

const staffPolicies = [
  { title: "📘 الميثاق المهني والأخلاقي", filename: "Ethics_Charter_Policy.pdf" },
  { title: "📗 اللائحة السلوكية", filename: "Behaviour_Policy.pdf" },
  { title: "📕 الدليل الاجرائي لإدارة حضور وغياب الطلبة", filename: "Attendance_Policy.pdf" },
  { title: "📙 سياسة التقييم", filename: "Assessment_Policy.pdf" },
  { title: "📒 سياسة الوقاية من التنمر", filename: "Bullying_Prevention_Policy.pdf" },
  { title: "📓 سياسة حقوق الطفل", filename: "Child_Rights_Policy.pdf" },
  { title: "📔 قانون وديمة", filename: "Behaviour_Policy1.pdf" },
  { title: "📘 دليل الوقاية من التنمر", filename: "Bullying_Prevention_Policy.pdf" },
  { title: "📗 دليل ولي الأمر للوقاية من المخدرات", filename: "Drug_Prevention_Guide.pdf" },
  { title: "📕 دليل ولي الأمر للصحة النفسية", filename: "Mental_Health_Guide.pdf" },
  { title: "📙 دليل ولي الأمر للطفولة المبكرة", filename: "Parents’_Guide_to_Early_Childhood.pdf" },
  { title: "📒 سياسة الأمن الرقمي", filename: "Digital_Safety_Policy.pdf" }
];

function openPdfSmart(filename) {
  if(!filename) return alert("❌ لم يتم تحديد الملف");
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
  if(!currentPdfFile) return;
  const link = document.createElement("a");
  link.href = `/pdfs/${currentPdfFile}`;
  link.download = currentPdfFile;
  link.click();
}

function printPdf() {
  if(!currentPdfFile) return;
  const printWindow = window.open(
    `/pdfjs/web/viewer.html?file=${encodeURIComponent("/pdfs/" + currentPdfFile)}&print=true`,
    "_blank"
  );
  if(printWindow) printWindow.focus();
}

function closePdf() {
  document.getElementById("pdfViewer").style.display = "none";
  document.getElementById("pdfToolbar").style.display = "none";
  document.getElementById("pdfViewer").src = "";
}

document.addEventListener("DOMContentLoaded", () => {
  const role = new URLSearchParams(window.location.search).get("role") || sessionStorage.getItem("role");
  const container = document.getElementById("policiesContainer");
  const policies = role === "staff" ? staffPolicies : studentPolicies;

  policies.forEach(item => {
    const btn = document.createElement("button");
    btn.className = "policy-btn";
    btn.textContent = item.title;
    btn.onclick = () => openPdfSmart(item.filename);
    container.appendChild(btn);
  });
});
