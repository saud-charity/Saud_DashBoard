const policies = [
  { title: "📘 اللائحة السلوكية", filename: "Behaviour_Policy.pdf" },
  { title: "📗 الدليل الاجرائي لإدارة حضور وغياب الطلبة", filename: "Attendance_Policy.pdf" },
  { title: "📕 سياسة التقييم", filename: "Assessment_Policy.pdf" },
  { title: "📙 سياسة الوقاية من التنمر", filename: "Bullying_Prevention_Policy.pdf" },
  { title: "📒 سياسة حقوق الطفل", filename: "Child_Rights_Policy.pdf" },
  { title: "📓 قانون وديمة", filename: "Behaviour_Policy1.pdf" },
  { title: "📘 دليل ولي الأمر للوقاية من المخدرات", filename: "Drug_Prevention_Guide.pdf" },
  { title: "📗 دليل ولي الأمر للصحة النفسية", filename: "Mental_Health_Guide.pdf" },
  { title: "📕 دليل ولي الأمر للطفولة المبكرة", filename: "Parents_Guide_to_Early_Childhood.pdf" },
  { title: "📙 سياسة الأمن الرقمي", filename: "Digital_Safety_Policy.pdf" }
];

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("policiesContainer");

  policies.forEach(item => {
    const div = document.createElement("div");
    div.className = "policy-item";

    div.innerHTML = `
      <div class="policy-title">${item.title}</div>
      <div class="policy-actions">
        <a class="view" href="https://docs.google.com/viewer?url=${location.origin}/pdfs/${item.filename}&embedded=true" target="_blank">
          <i class="fas fa-eye"></i> عرض
        </a>
        <a class="download" href="/pdfs/${item.filename}" download>
          <i class="fas fa-download"></i> تحميل
        </a>
      </div>
    `;

    container.appendChild(div);
  });
});
