// ================================
// ✅ عناصر عالمية
// ================================
let currentPdfFile = null;

// ================================
// ✅ فتح PDF بطريقة ذكية
// ================================
function openPdfSmart(filename, viewerId = "pdfViewer") {
    if (!filename) return alert("❌ لم يتم تحديد الملف");
    currentPdfFile = filename;

    const pdfViewer = document.getElementById(viewerId);
    if (!pdfViewer) return window.open(`/pdfs/${filename}`, "_blank");

    const viewerUrl = `/pdfjs/web/viewer.html?file=${encodeURIComponent("/pdfs/" + filename)}`;
    pdfViewer.src = viewerUrl;
    pdfViewer.style.display = "block";
    pdfViewer.scrollIntoView({ behavior: "smooth" });
}

// ================================
// ✅ تحميل قائمة حسب الدور
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
// ✅ تحميل السياسات
// ================================
async function loadPolicies(role) {
    const container = document.getElementById("policiesContainer");
    if (!container) return;

    try {
        const res = await fetch(`/api/policies/${role}`);
        if (!res.ok) throw new Error("خطأ في تحميل السياسات");

        const policies = await res.json();
        if (!policies || policies.length === 0) {
            container.innerHTML = "<p>❌ لا توجد سياسات متاحة</p>";
            return;
        }

        policies.forEach(item => {
            const div = document.createElement("div");
            div.className = "policy-item";

            const spanTitle = document.createElement("span");
            spanTitle.textContent = item.title;
            div.appendChild(spanTitle);

            // زر العرض
            const btnView = document.createElement("button");
            btnView.className = "policy-btn";
            btnView.textContent = "عرض";
            btnView.onclick = () => openPdfSmart(item.filename);
            div.appendChild(btnView);

            // زر التحميل
            const btnDownload = document.createElement("a");
            btnDownload.className = "policy-btn";
            btnDownload.href = `/pdfs/${item.filename}`;
            btnDownload.download = item.filename;
            btnDownload.textContent = "تحميل";
            div.appendChild(btnDownload);

            container.appendChild(div);
        });

    } catch (err) {
        console.error(err);
        container.innerHTML = "<p>❌ فشل تحميل السياسات</p>";
    }
}

// ================================
// ✅ اختيار الدور
// ================================
function selectRole(role) {
    sessionStorage.setItem("role", role);
    // التحقق من وجود عناصر قبل تغيير خصائصها
    const menuContainer = document.getElementById("menuContainer");
    if (menuContainer) menuContainer.style.display = "block";

    window.location.href = `/menu.html?role=${role}`;
}

// ================================
// ✅ عند تحميل الصفحة
// ================================
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const role = params.get("role") || sessionStorage.getItem("role");

    // تحميل القائمة أو السياسات حسب الصفحة
    if (document.getElementById("menuContainer")) loadMenu(role);
    if (document.getElementById("policiesContainer")) loadPolicies(role);

    // إعداد أزرار الطالب والموظف
    const studentBtn = document.getElementById("studentBtn");
    const staffBtn = document.getElementById("staffBtn");
    if (studentBtn) studentBtn.onclick = () => selectRole("student");
    if (staffBtn) staffBtn.onclick = () => selectRole("staff");

    // تسجيل Service Worker إذا موجود
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/service-worker.js")
            .then(() => console.log("✅ Service Worker مسجل بنجاح"))
            .catch(err => console.error("❌ فشل تسجيل Service Worker:", err));
    }
});

window.selectRole = selectRole;
