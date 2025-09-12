// ================================
// ✅ Load policies list
// ================================
async function loadPolicies() {
  const container = document.getElementById("policiesContainer");
  if (!container) return;

  container.innerHTML = "<p>⏳ جاري التحميل...</p>";

  try {
    const res = await fetch("/api/policies");
    if (!res.ok) throw new Error("تعذر تحميل السياسات");

    const policies = await res.json();
    if (!policies || policies.length === 0) {
      container.innerHTML = "<p>⚠ لا توجد سياسات حالياً</p>";
      return;
    }

    container.innerHTML = "";
    policies.forEach(item => {
      const btn = document.createElement("button");
      btn.className = "menu-btn";
      btn.textContent = item.title;

      btn.onclick = () => openPdfSmart(item.filename, "pdfViewer");

      container.appendChild(btn);
    });

  } catch (err) {
    console.error("⚠ خطأ:", err);
    container.innerHTML = "<p>❌ فشل تحميل السياسات</p>";
  }
}

// ================================
// ✅ Open PDF smartly
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
document.addEventListener("DOMContentLoaded", loadPolicies);
