let currentPdfFile = null;

// ================================
// ✅ تحميل القائمة حسب الدور
// ================================
async function loadMenu(role) {
  const container = document.getElementById("menuContainer");
  if (!container) return;

  container.innerHTML = ""; // تنظيف المحتوى

  if (!role) return;

  try {
    const res = await fetch(`/api/menu/${role}`);
    if (!res.ok) throw new Error("خطأ في تحميل القائمة");

    const menu = await res.json();
    if (!menu || menu.length === 0) {
      container.innerHTML = "<p>❌ لا توجد عناصر في القائمة</p>";
      return;
    }

    menu.forEach(item => {
      const btn = document.createElement("button");
      btn.className = "menu-btn";
      btn.textContent = item.title;

      switch (item.type) {
        case "pdf": btn.onclick = () => openPdfSmart(item.filename); break;
        case "page": btn.onclick = () => window.location.href = item.path; break;
        case "external": btn.onclick = () => window.open(item.url, "_blank"); break;
        case "submenu": btn.onclick = () => window.location.href = `/policies.html?role=${role}`; break;
      }

      container.appendChild(btn);
    });

  } catch (err) {
    console.error("⚠ خطأ:", err);
    container.innerHTML = "<p>❌ تعذر تحميل القائمة</p>";
  }
}

// ================================
// ✅ فتح PDF + أدوات التحميل والطباعة
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
  link.click();
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
  currentPdfFile = null;
}

// ================================
// ✅ اختيار الدور عند الضغط على الأزرار
// ================================
function selectRole(role) {
  sessionStorage.setItem("role", role);
  document.getElementById("roleSelection").style.display = "none";
  loadMenu(role);
}

window.selectRole = selectRole;

// ================================
// ✅ عند تحميل الصفحة
// ================================
document.addEventListener("DOMContentLoaded", () => {
  const studentBtn = document.getElementById("studentBtn");
  const staffBtn = document.getElementById("staffBtn");

  if (studentBtn) studentBtn.onclick = () => selectRole("student");
  if (staffBtn) staffBtn.onclick = () => selectRole("staff");

  // في حال إعادة تحميل الصفحة بعد اختيار الدور سابقًا
  const savedRole = sessionStorage.getItem("role");
  if (savedRole) {
    document.getElementById("roleSelection").style.display = "none";
    loadMenu(savedRole);
  }
});
