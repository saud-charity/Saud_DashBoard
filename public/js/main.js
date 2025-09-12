// ================================
// ✅ Role selection and redirection
// ================================
function selectRole(role) {
  sessionStorage.setItem("role", role);
  if (role === "student") {
    window.location.href = "menu.html?role=student";
  } else if (role === "staff") {
    window.location.href = "staff_login.html";
  }
}

// ================================
// ✅ Load menu for menu.html
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
          btn.onclick = () => window.location.href = `policies.html?role=${role}`;
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
      pdfViewer.scrollIntoView({ behavior: "smooth" });
    } else {
      window.open(viewerUrl, "_blank");
    }
  }
}

// ================================
// ✅ DOMContentLoaded
// ================================
document.addEventListener("DOMContentLoaded", () => {
  const studentBtn = document.getElementById("studentBtn");
  const staffBtn = document.getElementById("staffBtn");

  if (studentBtn) studentBtn.onclick = () => selectRole("student");
  if (staffBtn) staffBtn.onclick = () => selectRole("staff");

  // لو نحن على menu.html نحمّل القائمة تلقائياً
  const container = document.getElementById("menuContainer");
  if (container) {
    const params = new URLSearchParams(window.location.search);
    const role = (params.get("role") || sessionStorage.getItem("role") || "").toLowerCase();
    loadMenu(role);
  }

  // أزرار PDF Controls
  const downloadBtn = document.getElementById("downloadBtn");
  const printBtn = document.getElementById("printBtn");
  const pdfViewer = document.getElementById("pdfViewer");

  if (downloadBtn && pdfViewer) {
    downloadBtn.onclick = () => {
      if (!pdfViewer.src) return alert("اختر ملف أولاً");
      window.open(pdfViewer.src, "_blank");
    };
  }

  if (printBtn && pdfViewer) {
    printBtn.onclick = () => {
      if (!pdfViewer.src) return alert("اختر ملف أولاً");
      pdfViewer.contentWindow.print();
    };
  }
});
