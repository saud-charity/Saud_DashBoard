let currentPdfFile = null;

// ================================
// ✅ بيانات السياسات
// ================================
const studentPolicies = [
  { title: "📘 اللائحة السلوكية", filename: "Behaviour_Policy.pdf" },
  { title: "📗 الدليل الاجرائي لإدارة حضور وغياب الطلبة", filename: "Attendance_Policy.pdf" },
  { title: "📕 سياسة التقييم", filename: "Assessment_Policy.pdf" }
];

const staffPolicies = [
  { title: "📘 الميثاق المهني والأخلاقي", filename: "Ethics_Charter_Policy.pdf" },
  { title: "📗 اللائحة السلوكية", filename: "Behaviour_Policy.pdf" },
  { title: "📕 الدليل الاجرائي لإدارة حضور وغياب الطلبة", filename: "Attendance_Policy.pdf" }
];

// ================================
// ✅ تحميل السياسات
// ================================
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const role = params.get("role") || sessionStorage.getItem("role");
  const container = document.getElementById("policiesContainer");
  if (!container) return;

  let policies = (role === "student") ? studentPolicies : staffPolicies;
  if (policies.length === 0) { container.innerHTML = "<p>❌ لا توجد سياسات متاحة</p>"; return; }

  policies.forEach(item => {
    // Desktop Button
    const btnDesktop = document.createElement("button");
    btnDesktop.className = "policy-btn-desktop";
    btnDesktop.textContent = item.title + "  ⬇️";
    btnDesktop.onclick = () => openPdfSmart(item.filename);
    container.appendChild(btnDesktop);

    // Mobile Dropdown
    const btnGroup = document.createElement("div");
    btnGroup.className = "btn-group-mobile";

    const mainBtn = document.createElement("button");
    mainBtn.innerHTML = `${item.title} <i class="fas fa-chevron-down"></i>`;
    mainBtn.onclick = () => toggleDropdown(dropdown, mainBtn);
    btnGroup.appendChild(mainBtn);

    const dropdown = document.createElement("div");
    dropdown.className = "dropdown-menu";

    const actions = [
      { label: "فتح", func: () => openPdfSmart(item.filename), icon: "fas fa-folder-open" },
      { label: "تحميل", func: () => { currentPdfFile = item.filename; downloadPdf(); }, icon: "fas fa-download" },
      { label: "طباعة", func: () => { currentPdfFile = item.filename; printPdf(); }, icon: "fas fa-print" }
    ];

    actions.forEach(act => {
      const a = document.createElement("a");
      a.href = "#";
      a.innerHTML = `<i class="${act.icon}"></i> ${act.label}`;
      a.onclick = (e) => { e.preventDefault(); act.func(); dropdown.style.display = "none"; mainBtn.querySelector("i").style.transform="rotate(0deg)"; };
      dropdown.appendChild(a);
    });

    btnGroup.appendChild(dropdown);
    container.appendChild(btnGroup);
  });
});

// ================================
// ✅ Toggle Dropdown Mobile
// ================================
function toggleDropdown(dropdown, mainBtn){
  const isOpen = dropdown.style.display === "block";
  dropdown.style.display = isOpen ? "none" : "block";
  mainBtn.querySelector("i").style.transform = isOpen ? "rotate(0deg)" : "rotate(180deg)";
}

// ================================
// ✅ PDF Viewer + Toolbar
// ================================
function openPdfSmart(filename){
  if(!filename) return alert("❌ لم يتم تحديد الملف");
  currentPdfFile = filename;
  const viewerUrl = `/pdfjs/web/viewer.html?file=${encodeURIComponent("/pdfs/" + filename)}`;
  const pdfViewer = document.getElementById("pdfViewer");
  const pdfToolbar = document.getElementById("pdfToolbar");
  pdfViewer.src = viewerUrl;
  pdfViewer.style.display = "block";
  pdfToolbar.style.display = "flex";
  pdfViewer.scrollIntoView({behavior:"smooth"});
}

function downloadPdf(){
  if(!currentPdfFile) return;
  const link = document.createElement("a");
  link.href = `/pdfs/${currentPdfFile}`;
  link.download = currentPdfFile;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function printPdf(){
  if(!currentPdfFile) return;
  const printWindow = window.open(
    `/pdfjs/web/viewer.html?file=${encodeURIComponent("/pdfs/"+currentPdfFile)}&print=true`,
    "_blank"
  );
  if(printWindow) printWindow.focus();
}

function closePdf(){
  document.getElementById("pdfViewer").style.display = "none";
  document.getElementById("pdfToolbar").style.display = "none";
  document.getElementById("pdfViewer").src = "";
}
