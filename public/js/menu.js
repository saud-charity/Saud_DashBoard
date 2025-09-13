const params = new URLSearchParams(window.location.search);
const role = (params.get("role") || sessionStorage.getItem("role") || "").toLowerCase();

const container = document.getElementById("menuContainer");
const pdfViewer = document.getElementById("pdfViewer");
const pdfControls = document.getElementById("pdfControls");
const downloadBtn = document.getElementById("downloadBtn");
const printBtn = document.getElementById("printBtn");

if (!role) {
  container.innerHTML = "<p>❌ لم يتم تحديد الدور.</p>";
} else {
  loadMenu(role);
}

// ================================
// ✅ Load student menu + policies
// ================================
async function loadMenu(role) {
  try {
    const resMenu = await fetch(`/api/menu/${role}`);
    if (!resMenu.ok) throw new Error("تعذر تحميل القائمة");

    const menuItems = await resMenu.json();
    container.innerHTML = "";

    for (let item of menuItems) {
      const btn = document.createElement("button");
      btn.className = "menu-btn";
      btn.textContent = item.title;

      // Open item action
      btn.onclick = async () => {
        switch(item.type) {
          case "pdf":
            openPdf(item.filename);
            break;
          case "page":
            window.location.href = item.path;
            break;
          case "external":
            window.open(item.url, "_blank");
            break;
          case "submenu":
            // Load policies dynamically
            await loadPolicies(role);
            break;
        }
      };

      container.appendChild(btn);
    }

  } catch(err) {
    console.error(err);
    container.innerHTML = "<p>❌ فشل تحميل القائمة</p>";
  }
}

// ================================
// ✅ Load policies dynamically
// ================================
async function loadPolicies(role) {
  try {
    const res = await fetch(`/api/policies/${role}`);
    if (!res.ok) throw new Error("تعذر تحميل السياسات");

    const policies = await res.json();
    container.innerHTML = "";

    policies.forEach(policy => {
      const btn = document.createElement("button");
      btn.className = "menu-btn";
      btn.textContent = policy.title;
      btn.onclick = () => openPdf(policy.filename);
      container.appendChild(btn);
    });

  } catch(err) {
    console.error(err);
    container.innerHTML = "<p>❌ فشل تحميل السياسات</p>";
  }
}

// ================================
// ✅ Open PDF in viewer
// ================================
function openPdf(filename) {
  if (!filename) return alert("❌ لم يتم تحديد الملف");

  const fileUrl = `/pdfs/${filename}`;
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  if (isMobile) {
    window.open(fileUrl, "_blank");
  } else {
    const viewerUrl = `/pdfjs/web/viewer.html?file=${encodeURIComponent(fileUrl)}`;
    pdfViewer.src = viewerUrl;
    pdfViewer.style.display = "block";
    pdfControls.style.display = "flex";

    downloadBtn.onclick = () => window.open(fileUrl, "_blank");
    printBtn.onclick = () => pdfViewer.contentWindow.print();
    pdfViewer.scrollIntoView({ behavior: "smooth" });
  }
}
