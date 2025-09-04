// ================================
// ✅ تحميل القائمة حسب الدور
// ================================
async function loadMenu(role) {
  const container = document.getElementById("menuContainer");
  if (!container) return; // 🔑 الحل: تجاهل الصفحات اللي ما فيها container

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
          btn.onclick = () => openPdf(item.filename);
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

// ✅ فتح PDF
function openPdf(filename) {
  if (!filename) return;
  window.open(`/api/pdfs/${filename}`, "_blank");
}

// ✅ اختيار الدور
function selectRole(role) {
  sessionStorage.setItem("role", role);
  const rolePages = { staff: "staff_menu.html", student: "student_menu.html" };
  window.location.href = rolePages[role] || "/";
}
window.selectRole = selectRole;

// ✅ تحميل القائمة عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const role = params.get("role") || sessionStorage.getItem("role");
  loadMenu(role);

  const studentBtn = document.getElementById("studentBtn");
  const staffBtn = document.getElementById("staffBtn");
  if (studentBtn) studentBtn.onclick = () => selectRole("student");
  if (staffBtn) staffBtn.onclick = () => selectRole("staff");
});

// ✅ تسجيل Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js")
      .then(() => console.log("✅ Service Worker مسجل بنجاح"))
      .catch(err => console.error("❌ فشل تسجيل Service Worker:", err));
  });
}
