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
          btn.onclick = () => window.location.href = `/policies.html?role=${role}`;
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
// ✅ Role selection
// ================================
function selectRole(role) {
  sessionStorage.setItem("role", role);
  const rolePages = { student: "student_menu.html", staff: "staff_login.html" };
  window.location.href = rolePages[role] || "/";
}

window.selectRole = selectRole;

// ================================
// ✅ DOMContentLoaded
// ================================
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const role = params.get("role") || sessionStorage.getItem("role");

  loadMenu(role);

  const studentBtn = document.getElementById("studentBtn");
  const staffBtn = document.getElementById("staffBtn");

  if (studentBtn) studentBtn.onclick = () => selectRole("student");
  if (staffBtn) staffBtn.onclick = () => window.location.href = "staff_login.html";

  // Service Worker registration
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js")
      .then(() => console.log("✅ Service Worker مسجل بنجاح"))
      .catch(err => console.error("❌ فشل تسجيل Service Worker:", err));
  }
});
