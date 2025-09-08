function openPdfSmart(filename){
  if(!filename){ alert("❌ لم يتم تحديد الملف"); return; }

  const url = `/pdfs/${filename}`;
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  if(isMobile){
    // 📱 موبايل → فتح في تبويب جديد
    window.open(url,"_blank");
  } else {
    // 💻 كمبيوتر → iframe مع pdf.js
    const viewerUrl=`/pdfjs/web/viewer.html?file=${encodeURIComponent(url)}`;
    const iframe=document.getElementById("pdfViewer");
    if(iframe){
      iframe.src=viewerUrl;
      iframe.style.display="block";
      iframe.scrollIntoView({behavior:"smooth"});
    } else {
      window.open(viewerUrl,"_blank");
    }
  }
}
