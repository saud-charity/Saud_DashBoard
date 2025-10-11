// backend/server.js
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
  { title: "التوقيت الزمني لدوام الطلبة", type: "pdf", filename: "timings.pdf" },
  { title: "أرقام التواصل", type: "pdf", filename: "numbers.pdf" },
  { title: "تقرير طالب", type: "page", path: "/report.html" },
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

// ===================== SUBJECTS & SKILLS BY GRADE =====================
const gradeSubjects = {
  G1: {
    " العلوم": ["الاختبارات التكوينية","استماع وتحدث","قراءة","كتابة","السلوك"],
    "اللغة الإنجليزية": ["الاختبارات التكوينية","استماع وتحدث","قراءة","كتابة","السلوك"],
    "التربية الإسلامية": ["الاختبارات التكوينية","الفهم والتفسير","الاستنتاج والربط بالواقع","حفظ النصوص والمفاهيم","السلوك"],
    "الرياضيات": ["الاختبارات التكوينية","قراءة وكتابة الأعداد حتى 20","كتابة جمل الجمع العددية","إيجاد ناتج الجمع حتى 10","السلوك"],
    "العربية": ["الاختبارات التكوينية","مهارة تصنيف الكائنات","التفرقة بين اجزاء النبات","استنتاج اوجة التشابة والاختلاف بين النباتات","السلوك"],
    "الدراسات الاجتماعية": ["الاختبارات التكوينية","فهم واستيعاب المفاهيم والمصطلحات","الاستنتاج والوصف","إنجاز المهام","السلوك"]
  },
  G2: {
    "اللغة العربية": ["الاختبارات التكوينية","استماع وتحدث","قراءة","كتابة","السلوك"],
    "اللغة الإنجليزية": ["الاختبارات التكوينية","استماع وتحدث","قراءة","كتابة","السلوك"],
    "التربية الإسلامية": ["الاختبارات التكوينية","الفهم والتفسير","الاستنتاج والربط بالواقع","حفظ النصوص والمفاهيم","السلوك"],
    "الرياضيات": ["الاختبارات التكوينية","يجمع باستخدام العد التصاعدي حتى العدد 19","يطرح باستخدام العد التنازلي حتى العدد 19","يجمع باستخدام الاستراتيجيات والأنماط المختلفة","السلوك"],
    "العلوم": ["الاختبارات التكوينية","مهارة الوصف وتفسير الأشكال والجداول","التفرقة بين اجزاء النبات","استنتاج اوجه التشابه والاختلاف","السلوك"],
    "الدراسات الاجتماعية": ["الاختبارات التكوينية","فهم واستيعاب المفاهيم والمصطلحات","الاستنتاج والوصف","حل المشكلات والتفكير الناقد","السلوك"]
  },
  G3: {
    "اللغة العربية": ["الاختبارات التكوينية","استماع وتحدث","قراءة","كتابة","السلوك"],
    "اللغة الإنجليزية": ["الاختبارات التكوينية","استماع وتحدث","قراءة","كتابة","السلوك"],
    "التربية الإسلامية": ["الاختبارات التكوينية","الفهم والتفسير","الاستنتاج والربط بالواقع","حفظ النصوص والمفاهيم","السلوك"],
    "الرياضيات": ["الاختبارات التكوينية","تقريب الأعداد","جمع الأعداد من ثلاثة وأربعة أرقام","طرح الأعداد من ثلاثة وأربعة أرقام","السلوك"],
    "العلوم": ["الاختبارات التكوينية","مهارة تصنيف الكائنات","التفرقة بين اجزاء النبات","استنتاج اوجه التشابه والاختلاف","السلوك"],
    "الدراسات الاجتماعية": ["الاختبارات التكوينية","فهم واستيعاب المفاهيم","الاستنتاج والوصف","حل المشكلات والتفكير الناقد","السلوك"]
  },
  G4: {
    "اللغة العربية": ["الاختبارات التكوينية","استماع وتحدث","قراءة","كتابة","السلوك"],
    "اللغة الإنجليزية": ["الاختبارات التكوينية","استماع وتحدث","قراءة","كتابة","السلوك"],
    "التربية الإسلامية": ["الاختبارات التكوينية","الفهم والتفسير","الاستنتاج والربط بالواقع","حفظ النصوص والمفاهيم","السلوك"],
    "الرياضيات": ["الاختبارات التكوينية","العلاقات النسبية","استخدام جداول النسبة والمعدل","حل مسائل وتطبيق مفهوم النسبة","السلوك"],
    "العلوم": ["الاختبارات التكوينية","مهارة تصنيف الكائنات","التفرقة بين اجزاء النبات","استنتاج اوجه التشابه والاختلاف","السلوك"],
    "الدراسات الاجتماعية": ["الاختبارات التكوينية","فهم واستيعاب المفاهيم","الاستنتاج والوصف","حل المشكلات والتفكير الناقد","السلوك"]
  },
  G5: {
    "اللغة العربية": ["الاختبارات التكوينية","استماع وتحدث","قراءة","كتابة","السلوك"],
    "اللغة الإنجليزية": ["الاختبارات التكوينية","استماع وتحدث","قراءة","كتابة","السلوك"],
    "التربية الإسلامية": ["الاختبارات التكوينية","الفهم والتفسير","الاستنتاج والربط بالواقع","حفظ النصوص والمفاهيم","السلوك"],
    "الرياضيات": ["الاختبارات التكوينية","القيمة المكانية","ضرب الأعداد الكبيرة والعشرية","القسمة على عدد مكون من رقم واحد","السلوك"],
    "العلوم": ["الاختبارات التكوينية","مهارة تصنيف الكائنات","التفرقة بين اجزاء النبات","استنتاج اوجه التشابه والاختلاف","السلوك"],
    "الدراسات الاجتماعية": ["الاختبارات التكوينية","فهم واستيعاب المفاهيم","الاستنتاج والوصف","حل المشكلات والتفكير الناقد","السلوك"]
  },
  G6: {
    "اللغة العربية": ["الاختبارات التكوينية","استماع وتحدث","قراءة","كتابة","السلوك"],
    "اللغة الإنجليزية": ["الاختبارات التكوينية","استماع وتحدث","قراءة","كتابة","السلوك"],
    "التربية الإسلامية": ["الاختبارات التكوينية","الفهم والتفسير","الاستنتاج والربط بالواقع","حفظ النصوص والمفاهيم","السلوك"],
    "الرياضيات": ["الاختبارات التكوينية","العلاقات النسبية","استخدام جداول النسبة والمعدل","حل مسائل كلامية","السلوك"],
    "العلوم": ["الاختبارات التكوينية","مهارة الوصف وتفسير الأشكال والجداول","التصنيف والمقارنة","الاستنتاج والاستقصاء","السلوك"],
    "الدراسات الاجتماعية": ["الاختبارات التكوينية","فهم واستيعاب المفاهيم","الاستنتاج والوصف","إنجاز المهام","السلوك"]
  }
};

// ===================== STUDENT REPORT =====================
const EXCEL_PATH = path.join(__dirname, "data", "students.xlsx");

function loadStudentsFromExcel() {
  if (!fs.existsSync(EXCEL_PATH)) {
    console.warn("⚠️ ملف Excel غير موجود:", EXCEL_PATH);
    return {};
  }

  const workbook = xlsx.readFile(EXCEL_PATH);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: "" });

  if (!rows || rows.length < 3) {
    console.warn("⚠️ بنية ملف Excel غير كافية (نحتاج 3 صفوف على الأقل).");
    return {};
  }

  const headerRow = rows[0];
  const titlesRow = rows[1];
  const dataRows = rows.slice(2);
  const totalCols = Math.max(headerRow.length, titlesRow.length);

  const students = {};

  dataRows.forEach((row) => {
    const studentIdRaw = row[0];
    if (!studentIdRaw || String(studentIdRaw).trim() === "") return;

    const studentId = String(studentIdRaw).replace(/\s/g, "").trim();
    const studentName = String(row[1] || "-").trim();
    const studentClass = String(row[2] || "-").trim();

    // 🔹 تحديد الصف الأكاديمي (G1..G6)
    let gradeKey = "G" + (studentClass.split("/")[0].trim() || "");
    if (!gradeSubjects[gradeKey]) gradeKey = "G1"; // fallback آمن

    const subjects = [];

    for (let col = 3; col < totalCols; col += 7) {
      const subjectName = (headerRow[col] || "").toString().trim();
      if (!subjectName) continue;

      // 🔹 إذا كانت المادة معرفة في gradeSubjects، استخدم المهارات من هناك
      const fieldTitles =
        (gradeSubjects[gradeKey] && gradeSubjects[gradeKey][subjectName])
          ? gradeSubjects[gradeKey][subjectName]
          : titlesRow.slice(col, col + 5).map(t => (t || "").toString().trim());

      const values = row.slice(col, col + 5);
      const subObj = { name: subjectName };

      fieldTitles.forEach((title, i) => {
        subObj[title || `حقل ${i+1}`] = values[i] !== undefined && values[i] !== "" ? values[i] : "-";
      });

      subObj.strengths = row[col + 5] || "";
      subObj.improvements = row[col + 6] || "";

      subjects.push(subObj);
    }

    // 🔹 احتفاظ بالمكتسبات السابقة كما هي
    students[studentId] = {
      student: {
        "الاسم": studentName,
        "الصف": studentClass,
        "الشعبة": studentClass
      },
      subjects
    };
  });

  console.log(`✅ تم تحميل ${Object.keys(students).length} تقرير طالب من Excel.`);
  return students;
}

let studentReports = loadStudentsFromExcel();

app.post("/api/reload-students", (req, res) => {
  studentReports = loadStudentsFromExcel();
  return res.json({ ok: true, count: Object.keys(studentReports).length });
});

app.get("/api/report/:id", (req, res) => {
  const id = String(req.params.id || "").replace(/\s/g, "").trim();
  const report = studentReports[id];
  if (!report) {
    console.warn(`⚠️ رقم الهوية ${id} غير موجود`);
    return res.status(404).send("❌ الطالب غير موجود");
  }
  return res.json(report);
});

// ===================== START SERVER =====================
app.listen(PORT, () => {
  console.log(`🚀 Server works on: http://localhost:${PORT}`);
});
