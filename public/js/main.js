// ================================
// ✅ Role selection
// ================================
function selectRole(role) {
  sessionStorage.setItem("role", role);
  if(role === "student") window.location.href = "menu.html?role=student";
  else if(role === "staff") window.location.href = "menu.html?role=staff";
}

// ================================
// ✅ Load menu dynamically
// ================================
async function loadMenu(role) {
  const container = document.getElementById("menuContainer");
  if(!container) return;
  container.innerHTML = "";

  if(!role) return container.innerHTML = "<p>يرجى اختيار دور للمتابعة</p>";

  try {
    const res = await fetch(`/api/menu/${role}`);
    if(!res.ok) throw new Error("تعذر تحميل القائمة");
    const menu = await res.json();

    menu.forEach(item => {
      const btn = document.createElement("button");
      btn.className = "menu-btn";
      btn.textContent = item.title;

      btn.onclick = () => {
        switch(item.type){
          case "pdf": openPdf(item.filename); break;
          case "page": window.location.href = item.path; break;
          case "external": window.open(item.url, "_blank"); break;
          case "submenu": window.location.href = `policies.html?role=${role}`; break;
        }
      };
      container.appendChild(btn);
    });
  } catch(err){
    container.innerHTML = `<p>خطأ: ${err.message}</p>`;
  }
}

// ================================
// ✅ Load policies dynamically
// ================================
async function loadPolicies(role){
  const container = document.getElementById("policiesContainer");
  if(!container) return;
  container.innerHTML = "";

  try{
    const res = await fetch(`/api/policies/${role}`);
    if(!res.ok) throw new Error("تعذر تحميل السياسات");
    const policies = await res.json();

    policies.forEach(item=>{
      const btn = document.createElement("button");
      btn.className = "menu-btn";
      btn.textContent = item.title;
      btn.onclick = ()=> openPdf(item.filename);
      container.appendChild(btn);
    });
  }catch(err){
    container.innerHTML = `<p>خطأ: ${err.message}</p>`;
  }
}

// ================================
// ✅ Open PDF
// ================================
function openPdf(filename, viewerId="pdfViewer"){
  if(!filename) return alert("❌ لم يتم تحديد الملف");
  const fileUrl = `/pdfs/${filename}`;
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  const pdfViewer = document.getElementById(viewerId);

  if(isMobile) window.open(fileUrl, "_blank");
  else{
    pdfViewer.src = `/pdfjs/web/viewer.html?file=${encodeURIComponent(fileUrl)}`;
    pdfViewer.style.display = "block";
    pdfViewer.scrollIntoView({behavior:"smooth"});
  }
}

// ================================
// ✅ PDF Controls
// ================================
document.addEventListener("DOMContentLoaded", ()=>{
  const studentBtn = document.getElementById("studentBtn");
  const staffBtn = document.getElementById("staffBtn");

  if(studentBtn) studentBtn.onclick = ()=> selectRole("student");
  if(staffBtn) staffBtn.onclick = ()=> selectRole("staff");

  const params = new URLSearchParams(window.location.search);
  const role = params.get("role") || sessionStorage.getItem("role");

  if(document.getElementById("menuContainer")) loadMenu(role);
  if(document.getElementById("policiesContainer")) loadPolicies(role);

  // Controls
  const downloadBtn = document.getElementById("downloadBtn");
  const printBtn = document.getElementById("printBtn");
  const pdfViewer = document.getElementById("pdfViewer");

  if(downloadBtn) downloadBtn.onclick = ()=>{
    if(!pdfViewer.src) return alert("اختر ملف أولاً");
    window.open(pdfViewer.src, "_blank");
  };

  if(printBtn) printBtn.onclick = ()=>{
    if(!pdfViewer.src) return alert("اختر ملف أولاً");
    pdfViewer.contentWindow.print();
  };
});
