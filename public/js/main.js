// ================================
// ✅ اختيار الدور
// ================================
function selectRole(role) {
  sessionStorage.setItem("role", role);
  if(role === "staff") {
    window.location.href = "/staff_login.html";
  } else {
    window.location.href = "/policies.html?role=" + role;
  }
}
window.selectRole = selectRole;

// ================================
// ✅ DOMContentLoaded
// ================================
document.addEventListener("DOMContentLoaded", () => {
  const studentBtn = document.getElementById("studentBtn");
  const staffBtn = document.getElementById("staffBtn");

  if(studentBtn) studentBtn.onclick = () => selectRole("student");
  if(staffBtn) staffBtn.onclick = () => selectRole("staff");
});
