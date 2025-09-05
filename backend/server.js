const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const xlsx = require("xlsx");


const app = express();
app.use(cors());
app.use(express.json());

// ✅ نخلي Express يخدم الملفات من المجلد public (الموجود خارج backend)
app.use(express.static(path.join(__dirname, "../public")));

// ✅ نخلي الصفحة الرئيسية index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

// ✅ مستخدمو الموظفين
const STAFF_USERS = [
  { username: "admin", password: "1234" },
  { username: "staff", password: "abcd" }
];

// ✅ تسجيل الدخول
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = STAFF_USERS.find(u => u.username===username && u.password===password);
  if (user) res.json({ success: true });
  else res.json({ success: false, message: "اسم المستخدم أو كلمة المرور خاطئة" });
});

// ✅ API لتقرير طالب واحد
app.get("/api/report/:id", (req, res) => {
  const id = String(req.params.id).trim();
  const report = studentReports[id];
  if (!report) return res.status(404).send("❌ الطالب غير موجود");
  res.json(report);
});

// ✅ قوائم الطلاب
const studentMenu = [
  { title: "جداول الحلقة الأولى", type: "pdf", filename: "cycle2.pdf" },
  { title: " جداول الحلقة الثانية", type: "pdf", filename: "cycle3.pdf" },
  { title: "التوقيت الزمني للحصص", type: "pdf", filename: "timings.pdf" },
  { title: "تقرير طالب", type: "page", path: "/report.html" },
  { title: "السياسات والأدلة", type: "submenu", role: "student" }
];

// ✅ قوائم الموظفين
const staffMenu = [
  { title: "جداول الحلقة الأولى", type: "pdf", filename: "cycle2.pdf" },
  { title: "جداول الحلقة الثانية", type: "pdf", filename: "cycle3.pdf" },
  { title: "جداول المعلمين", type: "pdf", filename: "teachers.pdf" },
  { title: "جداول المناوبة", type: "pdf", filename: "duties.pdf" },
  { title: "التوقيت الزمني للحصص", type: "pdf", filename: "timings.pdf" },
  { title: "السياسات والأدلة", type: "submenu", role: "staff" }
];

// ✅ API للقوائم
app.get("/api/menu/:role", (req, res) => {
  const { role } = req.params;
  if (role === "student") return res.json(studentMenu);
  if (role === "staff") return res.json(staffMenu);
  res.status(400).send("دور غير معروف");
});

// ✅ حماية ملفات PDF
app.get("/api/pdfs/:filename", (req, res) => {
  const safe = /^[a-zA-Z0-9_.-]+\.pdf$/;
  const { filename } = req.params;
  if (!safe.test(filename)) return res.status(400).send("اسم ملف غير صالح");

  const filePath = path.join(__dirname, "../public/pdfs", filename);
  if (!fs.existsSync(filePath)) return res.status(404).send("الملف غير موجود");

  res.sendFile(filePath);
});

// ✅ السياسات
const studentPolicies = [
  { title: "سياسة التقييم", filename: "Assessment_Policy.pdf" },
  { title: "سياسة الأمن الرقمي", filename: "Digital_Safety_Policy.pdf" },
  { title: "سياسة حقوق الطفل", filename: "Child_Rights_Policy.pdf" },
  { title: "سياسة الوقاية من التنمر", filename: "Bullying_Prevention_Policy.pdf" },
  { title: "اللائحة السلوكية", filename: "Behavior_Policy.pdf" },
  { title: "قانون وديمة", filename: "Behavior_Policy1.pdf" },
  { title: "الدليل الاجرائي لإدارة حضور وغياب الطلبة", filename: "Attendance_Policy.pdf" },
  { title: "دليل الوقاية من التنمر", filename: "Bullying_Prevention_Policy.pdf" },
  { title: "دليل ولي الأمر للوقاية من المخدرات", filename: "Drug_Prevention_Guide.pdf" },
  { title: "دليل ولي الأمر للصحة النفسية", filename: "Mental_Health_Guide.pdf" },
  { title: "دليل ولي الأمر للطفولة المبكرة", filename: "leave_policy.pdf" }
];

const staffPolicies = [
  { title: "سياسة التقييم", filename: "Assessment_Policy.pdf" },
  { title: "سياسة الأمن الرقمي", filename: "Digital_Safety_Policy.pdf" },
  { title: "سياسة حقوق الطفل", filename: "Child_Rights_Policy.pdf" },
  { title: "سياسة الوقاية من التنمر", filename: "Bullying_Prevention_Policy.pdf" },
  { title: "اللائحة السلوكية", filename: "Behavior_Policy.pdf" },
  { title: "قانون وديمة", filename: "Behavior_Policy1.pdf" },
  { title: "الدليل الاجرائي لإدارة حضور وغياب الطلبة", filename: "Attendance_Policy.pdf" },
  { title: "دليل الوقاية من التنمر", filename: "Bullying_Prevention_Policy.pdf" },
  { title: "دليل ولي الأمر للوقاية من المخدرات", filename: "Drug_Prevention_Guide.pdf" },
  { title: "دليل ولي الأمر للصحة النفسية", filename: "Mental_Health_Guide.pdf" },
  { title: "دليل ولي الأمر للطفولة المبكرة", filename: "leave_policy.pdf" },
  { title: "الميثاق المهني والأخلاقي", filename: "Ethics_Charter_Policy.pdf" }
];

app.get("/api/policies/:role", (req, res) => {
  const { role } = req.params;
  if (role === "student") return res.json(studentPolicies);
  if (role === "staff") return res.json(staffPolicies);
  res.status(400).send("❌ دور غير معروف");
});

// ✅ إعداد Excel و تحميل بيانات الطلاب

const EXCEL_PATH = path.join(__dirname, "data", "students.xlsx");

const subject_names = [
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

  const workbook = xlsx.readFile(EXCEL_PATH);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet, { defval: "-" });

  const students = {};

  rows.forEach((row) => {
    const possibleIdKeys = ["ID","Id","id","الهوية","رقم الهوية","NationalID"];
    let id = possibleIdKeys.map(k => row[k]).find(v => v && String(v).trim() !== "");
    if (!id) return;
    id = String(id).trim();

    const possibleNameKeys = ["الاسم","اسم","Name","student_name"];
    let name = possibleNameKeys.map(k => row[k]).find(v => v && String(v).trim() !== "") || "-";

    const possibleClassKeys = ["الشعبة","Class","الفصل"];
    let className = possibleClassKeys.map(k => row[k]).find(v => v && String(v).trim() !== "") || "-";

    const allCols = Object.keys(row);
    const dataCols = allCols.slice(4);

    const subjects = subject_names.map((sub, i) => {
      const base = i*6;
      return {
        name: sub,
        formative: row[dataCols[base]] || "-",
        academic: row[dataCols[base+1]] || "-",
        participation: row[dataCols[base+2]] || "-",
        alef: row[dataCols[base+3]] || "-",
        behavior: row[dataCols[base+4]] || "-",
        commitment: row[dataCols[base+5]] || "-"
      };
    });

    students[id] = {
      student: { "الاسم": String(name).trim(), "الشعبة": String(className).trim() },
      subjects
    };
  });

  return students;
}

let studentReports = loadStudentsFromExcel();
console.log(`✅ Loaded ${Object.keys(studentReports).length} student reports.`);

app.post("/api/reload-students", (req, res) => {
  studentReports = loadStudentsFromExcel();
  res.json({ ok: true, count: Object.keys(studentReports).length });
});

// ✅ Start server
const PORT = 3000;
app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);
