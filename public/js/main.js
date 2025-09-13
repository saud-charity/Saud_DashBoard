let currentPdfFile = null;

// ✅ تحميل القائمة
async function loadMenu(role) {
  const container = document.getElementById("menuContainer");
  if (!container) return;

  container.innerHTML = "";

  try {
    const res = await fetch(`/api/menu/${role}`);
    if (!res.ok) throw new Error("خطأ في تحميل القائمة");

    const menu = await res.json();
    menu.forEach(item => {
      const btn = document.createElement("button");
      btn.className = "menu-btn";
      btn.textContent = item.title;

      switch (item.type) {
        case "pdf":
          btn.onclick = () => openPdfSmart(item.filename);
          break;
        case "page":
          btn.onclick = () => window.location.href = item.path;
          break;
        case "external":
          btn.onclick = () => window.open(item.url, "_blank");
          break;
        case "submenu":
          btn.onclick = () => window.location.href = `/policies.html?role=${role}`;
          break;
      }

      container.appendChild(btn);
    });

  } catch (err) {
    container.innerHTML = "<p>❌ فشل تحميل القائمة</p>";
  }
}

// ✅ فتح PDF
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

// ✅ تحميل PDF
function downloadPdf() {
  if (!currentPdfFile) return;
  const link = document.createElement("a");
  link.href = `/pdfs/${currentPdfFile}`;
  link.download = currentPdfFile;
  link.click();
}

// ✅ طباعة PDF
function printPdf() {
  if (!currentPdfFile) return;
  const printWindow = window.open(
    `/pdfjs/web/viewer.html?file=${encodeURIComponent("/pdfs/" + currentPdfFile)}&print=true`,
    "_blank"
  );
  if (printWindow) printWindow.focus();
}

// ✅ إغلاق PDF
function closePdf() {
  document.getElementById("pdfViewer").style.display = "none";
  document.getElementById("pdfToolbar").style.display = "none";
  document.getElementById("pdfViewer").src = "";
}

// ✅ اختيار الدور
function selectRole(role) {
  sessionStorage.setItem("role", role);
  if (role === "staff") {
    window.location.href = "/staff_login.html";
  } else {
    window.location.href = `/menu.html?role=${role}`;
  }
}

window.selectRole = selectRole;

// ✅ عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const role = params.get("role") || sessionStorage.getItem("role");
  if (role) loadMenu(role);
});
