const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const xlsx = require("xlsx");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// ===================== MENUS =====================
const studentMenu = [
  { title: "جداول الحلقة الأولى", type: "pdf", filename: "cycle1.pdf" },
  { title: "جداول الحلقة الثانية", type: "pdf", filename: "cycle2.pdf" },
  { title: "التوقيت الزمني للحصص", type: "pdf", filename: "timings.pdf" },
  { title: "أرقام التواصل", type: "pdf", filename: "numbers.pdf" },
  { title: "تقرير الطالب", type: "page", path: "/report.html" },
  { title: "السياسات", type: "submenu", role: "student" },
  { title: "منصة ألف", type: "external", url: "https://www.alefed.com" },
  { title: "وزارة التربية والتعليم", type: "external", url: "https://moe.gov.ae/ar/Pages/home.aspx" },
  { title: "بوابة التعلم الذكي", type: "external", url: "https://lms.moe.gov.ae/" }
];

const staffMenu = [
  { title: "جداول الحلقة الأولى", type: "pdf", filename: "cycle1.pdf" },
  { title: "جداول الحلقة الثانية", type: "pdf", filename: "cycle2.pdf" },
  { title: "جداول المعلمين", type: "pdf", filename: "teachers.pdf" },
  { title: "جدول المناوبة", type: "pdf", filename: "duties.pdf" },
  { title: "التوقيت الزمني للحصص", type: "pdf", filename: "timings.pdf" },
  { title: "أرقام التواصل", type: "pdf", filename: "numbers.pdf" },
  { title: "السياسات", type: "submenu", role: "staff" },
  { title: "منصة ألف", type: "external", url: "https://www.alefed.com" },
  { title: "المنهل", type: "external", url: "https://sis.moe.gov.ae/" },
  { title: "منهاجي", type: "external", url: "https://minhaji.moe.gov.ae/library" },
  { title: "بوابة التعلم الذكي", type: "external", url: "https://lms.moe.gov.ae/" }
];

app.get("/api/menu/:role", (req, res) => {
  const { role } = req.params;
  if (role === "student") return res.json(studentMenu);
  if (role === "staff") return res.json(staffMenu);
  res.status(400).send("❌ دور غير معروف");
});

// ===================== POLICIES =====================
const studentPolicies = [
  { title: "اللائحة السلوكية", filename: "behavior_policy.pdf" },
  { title: "سياسة التقييم", filename: "assessment_policy.pdf" },
  { title: "سياسة المغادرة", filename: "leave_policy.pdf" },
  { title: "سياسة الأمن الرقمي", filename: "digital_safety_policy.pdf" },
  { title: "سياسة حقوق الطفل", filename: "child_rights_policy.pdf" },
  { title: "سياسة الحضور والغياب", filename: "attendance_policy.pdf" }
];

const staffPolicies = [
  { title: "اللائحة السلوكية", filename: "behavior_policy.pdf" },
  { title: "سياسة التقييم", filename: "assessment_policy.pdf" },
  { title: "سياسة المغادرة", filename: "leave_policy.pdf" },
  { title: "سياسة الأمن الرقمي", filename: "digital_safety_policy.pdf" },
  { title: "سياسة حقوق الطفل", filename: "child_rights_policy.pdf" },
  { title: "سياسة الحضور والانصراف", filename: "attendance_policy.pdf" },
  { title: "إطار معايير الرقابة والتقييم المدرسية", filename: "framework.pdf" },
  { title: "السياسات المهنية والأخلاقية", filename: "ethics_charter_policy.pdf" }
];

app.get("/api/policies/:role", (req, res) => {
  const { role } = req.params;
  if (role === "student") return res.json(studentPolicies);
  if (role === "staff") return res.json(staffPolicies);
  return res.status(400).send("❌ دور غير معروف");
});

// ===================== STUDENT REPORT =====================
const EXCEL_PATH = path.join(__dirname, "data", "students.xlsx");

function loadStudentsFromExcel() {
  if (!fs.existsSync(EXCEL_PATH)) return {};

  const workbook = xlsx.readFile(EXCEL_PATH);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: "-" });

  if (rows.length < 3) return {};

  const students = {};
  const dataRows = rows.slice(2); // تجاهل الصفين الأول والثاني

  dataRows.forEach((row) => {
    let studentId = String(row[0] || "").trim();
    if (!studentId) return;

    const name = String(row[1] || "-").trim();
    const className = String(row[2] || "-").trim();

    const subjects = [];
    for (let col = 3; col < row.length; col += 7) {
      const subjectName = rows[0][col] || `مادة ${Math.floor(col/7)+1}`;
      const headers = rows[1].slice(col, col + 5); // 5 أعمدة للبيانات
      const subData = row.slice(col, col + 5);     // البيانات الفعلية

      const subObj = { name: subjectName };
      headers.forEach((h, i) => {
        subObj[h] = subData[i] || "-";            // ربط العنوان بالبيانات
      });

      subObj.strengths = row[col + 5] || "";      // العمود 6: نقاط القوة
      subObj.improvements = row[col + 6] || "";  // العمود 7: جوانب التحسين

      subjects.push(subObj);
    }

    students[studentId] = {
      student: { "الاسم": name, "الشعبة": className },
      subjects
    };
  });

  return students;
}

let studentReports = loadStudentsFromExcel();

app.post("/api/reload-students", (req, res) => {
  studentReports = loadStudentsFromExcel();
  return res.json({ ok: true, count: Object.keys(studentReports).length });
});

app.get("/api/report/:id", (req, res) => {
  const id = String(req.params.id).replace(/\s/g, "").trim();
  const report = studentReports[id];
  if (!report) return res.status(404).send("❌ الطالب غير موجود");
  return res.json(report);
});

// ===================== START SERVER =====================
app.listen(PORT, () => {
  console.log(`🚀 Server works on: http://localhost:${PORT}`);
});
