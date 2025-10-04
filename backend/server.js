const express = require("express");
const path = require("path");
const fs = require("fs");
const xlsx = require("xlsx");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public"), { etag: false, maxAge: 0 }));


// ===================== سياسات عامة =====================
const studentPolicies = [
  { title: "اللائحة السلوكية", filename: "behavior_policy.pdf" },
  { title: "سياسة التقييم", filename: "assessment_policy.pdf" },
  { title: "سياسة المغادرة", filename: "leave_policy.pdf" },
  { title: "سياسة الأمن الرقمي", filename: "digital_safety_policy.pdf" },
  { title: "سياسة حقوق الطفل", filename: "child_rights_policy.pdf" },
  { title: "سياسة الحضور والغياب", filename: "attendance_policy.pdf" }
];

// ===================== المواد =====================
const subject_names = [
  "اللغة العربية",
  "اللغة الإنجليزية",
  "التربية الإسلامية",
  "الرياضيات",
  "العلوم",
  "الدراسات الاجتماعية"
];

// ===================== تحميل بيانات Excel =====================
const EXCEL_PATH = path.join(__dirname, "data", "students.xlsx");

function loadStudentsFromExcel() {
  if (!fs.existsSync(EXCEL_PATH)) {
    console.warn("⚠️ ملف Excel غير موجود:", EXCEL_PATH);
    return {};
  }

  const workbook = xlsx.readFile(EXCEL_PATH);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: "-" });
  const students = {};

  rows.slice(1).forEach((row) => {
    let id = row[0];
    if (!id || id === "-") return;
    id = String(id).trim();

    const name = row[1] ? String(row[1]).trim() : "-";
    const className = row[2] ? String(row[2]).trim() : "-";

    const subjects = subject_names.map((sub, i) => {
      const base = 3 + i * 5;
      return {
        name: sub,
        formative: row[base] || "-",
        listening: row[base + 1] || "-",
        reading: row[base + 2] || "-",
        writing: row[base + 3] || "-",
        behavior: row[base + 4] || "-"
      };
    });

    students[id] = { student: { "الاسم": name, "الصف والشعبة": className }, subjects };
  });

  console.log(`✅ تم تحميل ${Object.keys(students).length} طالب.`);
  return students;
}

let studentReports = loadStudentsFromExcel();

// ===================== API: إعادة تحميل =====================
app.post("/api/reload-students", (req, res) => {
  studentReports = loadStudentsFromExcel();
  res.json({ ok: true, count: Object.keys(studentReports).length });
});

// ===================== API: تقرير طالب =====================
app.get("/api/report/:id", (req, res) => {
  const id = String(req.params.id).trim();
  const report = studentReports[id];
  if (!report) return res.status(404).send("❌ الطالب غير موجود");
  res.json(report);
});

// ===================== API: قائمة السياسات =====================
app.get("/api/policies", (req, res) => res.json(studentPolicies));

// ===================== API: قائمة القوائم حسب الدور =====================
app.get("/api/menu/:role", (req, res) => {
  const { role } = req.params;
  if (role === "student") return res.json(studentMenu);
  if (role === "staff") return res.json(staffMenu);
  return res.status(400).send("❌ دور غير معروف");
});

// ===================== بدء الخادم =====================
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
