document.addEventListener("DOMContentLoaded", () => {

  const studentBtn = document.getElementById("studentBtn");
  const staffBtn = document.getElementById("staffBtn");

  function selectRole(role) {
    sessionStorage.setItem("role", role);  // store role in session
    window.location.href = `/menu.html?role=${role}`;  // redirect to menu.html
  }

  if (studentBtn) studentBtn.onclick = () => selectRole("student");
  if (staffBtn) staffBtn.onclick = () => selectRole("staff");

});
