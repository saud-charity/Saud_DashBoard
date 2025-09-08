const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const xlsx = require("xlsx");

const app = express();
app.use(cors());
app.use(express.json());

// -----------------------------
// ✅ Serve static files
// -----------------------------
app.use(express.static(path.join(__dirname, "../public")));
app.use("/pdfs", express.static(path.join(__dirname, "../public/pdfs")));
app.use("/js", express.static(path.join(__dirname, "../public/js")));
app.use("/pdfjs", express.static(path.join(__dirname, "../public/pdfjs")));

// -----------------------------
// ✅ Home page
// -----------------------------
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

// -----------------------------
// ✅ Staff login data
// -----------------------------
const STAFF_USERS = [
  { username: "admin", password: "1234" },
  { username: "staff", password: "abcd" }
];

// -----------------------------
// ✅ Login API
// -----------------------------
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = STAFF_USERS.find(
    u => u.username === username && u.password === password
  );
  if (user) return res.json({ success: true });
  res.json({ success: false, message: "اسم المستخدم أو كلمة المرور خاطئة" });
});

// -----------------------------
// ✅ Menu definitions
// -----------------------------
const studentMenu = [
  { title: "جداول الحلقة الأولى", type: "pdf", filename: "cycle2.pdf" },
  { title: "جداول الحلقة الثانية", type: "pdf", filename: "cycle3.pdf" },
  { title: "التوقيت الزمني للحصص", type: "pdf", filename: "timings.pdf" },
  { title: "أرقام التواصل", type: "pdf", filename: "contact_numbers.pdf" },
  { title: "تقرير متابعة الطالب", type: "page", path: "/report.html" },
  { title: "السياسات والأدلة", type: "submenu", role: "student" },
  { title: "منصة ألف", type: "external", url: "https://www.alefed.com" },
  { title: "بوابة التعلم الذكي", type: "external", url: "https://lms.ese.gov.ae/" },
  { title: "وزارة التربية والتعليم", type: "external", url: "https://moe.gov.ae/ar/Pages/home.aspx" }
];

const staffMenu = [
  { title: "جداول الحلقة الأولى", type: "pdf", filename: "cycle2.pdf" },
  { title: "جداول الحلقة الثانية", type: "pdf", filename: "cycle3.pdf" },
  { title: "جداول المعلمين", type: "pdf", filename: "teachers.pdf" },
  { title: "جداول المناوبة", type: "pdf", filename: "duties.pdf" },
  { title: "التوقيت الزمني للحصص", type: "pdf", filename: "timings.pdf" },
  { title: "السياسات والأدلة", type: "submenu", role: "staff" },
  { title: "منصة ألف", type: "external", url: "https://www.alefed.com" },
  { title: "المنهل", type: "external", url: "https://sis.ese.gov.ae/" },
  { title: "بوابة التعلم الذكي", type: "external", url: "https://lms.ese.gov.ae/" },
  { title: "رحلتي", type: "external", url: "https://idh.ese.gov.ae/" }
];

// -----------------------------
// ✅ Menu API
// -----------------------------
app.get("/api/menu/:role", (req, res) => {
  const { role } = req.params;
  if (role === "student") return res.json(studentMenu);
  if (role === "staff") return res.json(staffMenu);
  res.status(400).send("دور غير معروف");
});

// -----------------------------
// ✅ PDF protection (inline view)
// -----------------------------
app.get("/pdfs/:filename", (req, res) => {
  const filename = req.params.filename;
  const safeName = /^[a-zA-Z0-9_.-]+\.pdf$/;
  if (!safeName.test(filename)) return res.status(400).send("اسم ملف غير صالح");

  const filePath = path.join(__dirname, "../public/pdfs", filename);
  if (!fs.existsSync(filePath)) return res.status(404).send("الملف غير موجود");

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `inline; filename="${path.basename(filename)}"`
  );
  res.sendFile(filePath);
});

// -----------------------------
// ✅ Policies
// -----------------------------
const studentPolicies = [
  { title: "اللائحة السلوكية", filename: "Behaviour_Policy.pdf" },
  { title: "الدليل الاجرائي لإدارة حضور وغياب الطلبة", filename: "Attendance_Policy.pdf" },
  { title: "سياسة التقييم", filename: "Assessment_Policy.pdf" },
  { title: "سياسة الوقاية من التنمر", filename: "Bullying_Prevention_Policy.pdf" },
  { title: "سياسة حقوق الطفل", filename: "Child_Rights_Policy.pdf" },
  { title: "قانون وديمة", filename: "Behaviour_Policy1.pdf" },
  { title: "دليل الوقاية من التنمر", filename: "Bullying_Prevention_Policy.pdf" },
  { title: "دليل ولي الأمر للوقاية من المخدرات", filename: "Drug_Prevention_Guide.pdf" },
  { title: "دليل ولي الأمر للصحة النفسية", filename: "Mental_Health_Guide.pdf" },
  { title: "دليل ولي الأمر للطفولة المبكرة", filename: "Parents_Guide_to_Early_Childhood.pdf" },
  { title: "سياسة الأمن الرقمي", filename: "Digital_Safety_Policy.pdf" }
];

const staffPolicies = [
  { title: "الميثاق المهني والأخلاقي", filename: "Ethics_Charter_Policy.pdf" },
  ...studentPolicies
];

app.get("/api/policies/:role", (req, res) => {
  const { role } = req.params;
  if (role === "student") return res.json(studentPolicies);
  if (role === "staff") return res.json(staffPolicies);
  res.status(400).send("❌ دور غير معروف");
});

// -----------------------------
// ✅ Load student reports from Excel
// -----------------------------
const EXCEL_PATH = path.join(__dirname, "data", "students.xlsx");
const SUBJECTS = [
  "اللغة العربية",
  "اللغة الإنجليزية",
  "التربية الإسلامية",
  "الرياضيات",
  "العلوم",
  "الدراسات الاجتماعية",
  "التصميم والتكنولوجيا"
];

function loadStudentsFromExcel() {
  if (!fs.existsSync(EXCEL_PATH)) {
    console.warn("⚠️ ملف Excel غير موجود:", EXCEL_PATH);
    return {};
  }
