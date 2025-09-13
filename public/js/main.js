// ================================
// ✅ Load menu for a specific role
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
          btn.onclick = () => loadPolicies(role);
          break;
      }

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
    window.open(fileUrl, "_blank");
  } else {
    const viewerUrl = `/pdfjs/web/viewer.html?file=${encodeURIComponent(fileUrl)}`;
    const pdfViewer = document.getElementById(viewerId);
    if (pdfViewer) {
      pdfViewer.src = viewerUrl;
      pdfViewer.style.display = "block";
      document.getElementById("pdfControls").style.display = "flex";
      pdfViewer.scrollIntoView({ behavior: "smooth" });
    } else {
      window.open(viewerUrl, "_blank");
    }
  }
}

// ================================
// ✅ Load policies for a role
// ================================
async function loadPolicies(role) {
  const container = document.getElementById("menuContainer");
  container.innerHTML = "<p>جاري تحميل السياسات...</p>";

  try {
    const res = await fetch(`/api/policies/${role}`);
    if (!res.ok) throw new Error("تعذر تحميل السياسات");

    const policies = await res.json();
    if (!policies || policies.length === 0) {
      container.innerHTML = "<p>لا توجد سياسات متاحة</p>";
      return;
    }

    container.innerHTML = "";
    policies.forEach(item => {
      const btn = document.createElement("button");
      btn.className = "menu-btn";
      btn.textContent = item.title;
      btn.onclick = () => openPdfSmart(item.filename);
      container.appendChild(btn);
    });

  } catch (err) {
    console.error("⚠ خطأ:", err);
    container.innerHTML = "<p>❌ فشل تحميل السياسات</p>";
  }
}

// ================================
// ✅ Role selection
// ================================
function selectRole(role) {
  sessionStorage.setItem("role", role);
  loadMenu(role);
}

window.selectRole = selectRole;

// ================================
// ✅ DOMContentLoaded
// ================================
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const role = params.get("role") || sessionStorage.getItem("role");

  if (role) loadMenu(role);

  const studentBtn = document.getElementById("studentBtn");
  const staffBtn = document.getElementById("staffBtn");

  if (studentBtn) studentBtn.onclick = () => selectRole("student");
  if (staffBtn) staffBtn.onclick = () => selectRole("staff");

  // ✅ PDF controls
  const downloadBtn = document.getElementById("downloadBtn");
  const printBtn = document.getElementById("printBtn");
  const pdfViewer = document.getElementById("pdfViewer");

  if (downloadBtn) {
    downloadBtn.onclick = () => {
      if (!pdfViewer.src) return alert("❌ لم يتم تحميل ملف PDF");
      window.open(pdfViewer.src, "_blank");
    };
  }

  if (printBtn) {
    printBtn.onclick = () => {
      if (!pdfViewer.src) return alert("❌ لم يتم تحميل ملف PDF");
      const w = window.open(pdfViewer.src);
      w.onload = () => w.print();
    };
  }

  // ✅ Service Worker registration
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js")
      .then(() => console.log("✅ Service Worker مسجل بنجاح"))
      .catch(err => console.error("❌ فشل تسجيل Service Worker:", err));
  }
});
