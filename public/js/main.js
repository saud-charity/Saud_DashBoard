// ================================
// ✅ Load menu for a specific role (students/staff)
// ================================
async function loadMenu(role) {
  const container = document.getElementById("menuContainer");
  if (!container) return;

  container.innerHTML = "";

  if (!role) {
    container.innerHTML = "<p>يرجى اختيار دور للمتابعة</p>";
    return;
  }

  try {
    const res = await fetch(`/api/menu/${role}`);
    if (!res.ok) throw new Error("خطأ في تحميل القائمة");

    const menu = await res.json();
    if (!menu || menu.length === 0) {
      container.innerHTML = "<p>لا توجد عناصر في القائمة</p>";
      return;
    }

    menu.forEach(item => {
      const btn = document.createElement("button");
      btn.className = "menu-btn";
      btn.textContent = item.title;

      btn.onclick = () => {
        switch (item.type) {
          case "pdf":
            openPdfSmart(item.filename);
            break;
          case "page":
            window.location.href = item.path;
            break;
          case "external":
            window.open(item.url, "_blank");
            break;
          case "submenu":
            // Policies page for both roles
            window.location.href = `/policies.html?role=${role}`;
            break;
        }
      };

      container.appendChild(btn);
    });

  } catch (err) {
    console.error("⚠ خطأ:", err);
    container.innerHTML = "<p>تعذر تحميل القائمة، يرجى المحاولة لاحقًا</p>";
  }
}

// ================================
// ✅ Open PDF smartly (desktop/mobile)
// ================================
function openPdfSmart(filename, viewerId = "pdfViewer") {
  if (!filename) return alert("❌ لم يتم تحديد الملف");

  const fileUrl = `/pdfs/${filename}`;
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  if (isMobile) {
    // افتح PDF في نافذة جديدة على الموبايل
    window.open(fileUrl, "_blank");
  } else {
    // سطح المكتب: استخدم PDF.js داخل iframe
    const viewerUrl = `/pdfjs/web/viewer.html?file=${encodeURIComponent(fileUrl)}`;
    const pdfViewer = document.getElementById(viewerId);
    const pdfControls = document.getElementById("pdfControls");
    const downloadBtn = document.getElementById("downloadBtn");
    const printBtn = document.getElementById("printBtn");

    if (pdfViewer) {
      pdfViewer.src = viewerUrl;
      pdfViewer.style.display = "block";
      pdfViewer.scrollIntoView({ behavior: "smooth" });

      // إظهار أزرار التحكم
      if (pdfControls) pdfControls.style.display = "flex";

      if (downloadBtn) downloadBtn.onclick = () => {
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      if (printBtn) printBtn.onclick = () => {
        const printWindow = window.open(fileUrl, "_blank");
        if (printWindow) printWindow.print();
      };
    } else {
      // fallback
      window.open(viewerUrl, "_blank");
    }
  }
}

// ================================
// ✅ Role selection
// ================================
function selectRole(role) {
  sessionStorage.setItem("role", role);
  window.location.href = "menu.html?role=" + role;
}

window.selectRole = selectRole;

// ================================
// ✅ Initialize on DOMContentLoaded
// ================================
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const role = params.get("role") || sessionStorage.getItem("role");

  loadMenu(role);

  const studentBtn = document.getElementById("studentBtn");
  const staffBtn = document.getElementById("staffBtn");

  if (studentBtn) studentBtn.onclick = () => selectRole("student");
  if (staffBtn) staffBtn.onclick = () => selectRole("staff");

  // Register Service Worker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js")
      .then(() => console.log("✅ Service Worker مسجل بنجاح"))
      .catch(err => console.error("❌ فشل تسجيل Service Worker:", err));
  }
});
