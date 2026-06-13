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
{ title: "📘 جداول الحلقة الأولى", type: "pdf", filename: "cycle1.pdf" },
  { title: "📗 جداول الحلقة الثانية", type: "pdf", filename: "cycle2.pdf" },
  { title: "⏰ التوقيت الزمني لدوام الطلبة", type: "pdf", filename: "timings.pdf" },
  { title: "📞 أرقام التواصل", type: "pdf", filename: "numbers.pdf" },
  { title: "✉️ ايميل طالب", type: "page", path: "/emails.html" },
  { title: "📄 تقرير طالب شهر فبراير", type: "page", path: "/report.html" },
  { title: "📄 تقرير طالب شهر مايو", type: "page", path: "/report1.html" },
  { title: "📑 السياسات", type: "submenu", role: "student" },
  { title: "💻 منصة ألف", type: "external", url: "https://www.alefed.com" },
  { title: "🏛️ وزارة التربية والتعليم", type: "external", url: "https://moe.gov.ae/ar/Pages/home.aspx" },
  { title: "🎓 بوابة التعلم الذكي", type: "external", url: "https://lms.moe.gov.ae/" },
   { title: "🗓️ المكتبة الرقمية", type: "external", url: "https://books.arabreadingchallenge.com/ar/Login"}
];

const staffMenu = [
  { title: "🧑‍💼 حقيبة المعلم الرقمية المتكاملة", type: "external", url:"https://teacher-toolkit-app.vercel.app/"},  
  { title: "📘 جداول الحلقة الأولى", type: "pdf", filename: "cycle1.pdf" },
  { title: "📗 جداول الحلقة الثانية", type: "pdf", filename: "cycle2.pdf" },
  { title: "👩‍🏫 جداول المعلمين", type: "pdf", filename: "teachers.pdf" },
  { title: "🧑‍💼 جدول المناوبة", type: "pdf", filename: "duties.pdf" },
  { title: "⏰ التوقيت الزمني للحصص", type: "pdf", filename: "timings.pdf" },
  { title: "📞 أرقام التواصل", type: "pdf", filename: "numbers.pdf" },
  { title: "📑 السياسات", type: "submenu", role: "staff" },
  { title: "💻 منصة ألف", type: "external", url: "https://www.alefed.com" },
  { title: "🔗 المنهل", type: "external", url: "https://sis.moe.gov.ae/" },
  { title: "📚 منهاجي", type: "external", url: "https://minhaji.moe.gov.ae/library" },
  { title: "🚪بوابة التعلم الذكي", type: "external", url: "https://lms.moe.gov.ae/" }
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
  { title: "🧾 سياسة التقييم1", filename: "assessment_policy.pdf" },
  { title: "🧾 سياسة التقييم2", filename: "assess_policy.pdf" },
  { title: "🚪 سياسة المغادرة", filename: "leave_policy.pdf" },
  { title: "💻 سياسة استخدام الذكاء الاصطناعي في العملية التعليمية" , filename: "artificial.pdf" },
  { title: "🌍 سياسة الأمن الرقمي", filename: "digital_safety_policy.pdf" },
  { title: "👶 سياسة حقوق الطفل", filename: "child_rights_policy.pdf" },
  { title: "🚨 سياسة الطوارئ", filename: "Emergency_Policy.pdf" },
  { title: "👨‍🏫 الدليل الاجرائي لحضور وغياب الطلبة", filename: "attendance_policy.pdf" },
  { title: "🚫 دليل مكافحة الغش والاخلال بنظام الاختبارات", filename: "exam_policy.pdf" },
  { title: "🛎️ دليل إجراءات التبليغ", filename: "processes.pdf" },
  { title: "🚫 سياسة التنمر", filename: "pullying.pdf" },
  { title: "🌍 الدليل الارشادي للدراسات الدولية ",filename: "International_assessment_guide.pdf"},
  { title: "🛡️ دليل الوقاية من المخدرات", filename: "Drug_Prevention_Guide.pdf" },
  { title: "🗓️ التقويم الاكاديمي", filename: "calendar.pdf" },
];

const staffPolicies = [
  { title: "📘 اللائحة السلوكية", filename: "behavior_policy.pdf" },
  { title: "🧾 سياسة التقييم", filename: "assessment_policy.pdf" },
  { title: "🚪 سياسة المغادرة", filename: "leave_policy.pdf" },
  { title: "💻 سياسة الأمن الرقمي", filename: "digital_safety_policy.pdf" },
  { title: "👶 سياسة حقوق الطفل", filename: "child_rights_policy.pdf" },
  { title: "🚨 سياسة الطوارئ", filename: "Emergency_Policy.pdf" },
  { title: "⏰ سياسة الحضور والانصراف", filename: "attendance_policy.pdf" },
  { title: "💻 سياسة استخدام الذكاء الاصطناعي في العملية التعليمية الرقمي", filename: "artificial.pdf" },  
  { title: "🚫 دليل مكافحة الغش والاخلال بنظام الاختبارات", filename: "exam_policy.pdf" },
  { title: "🛎️ دليل إجراءات التبليغ", filename: "processes.pdf" },
  { title: "🗓️ التقويم الاكاديمي", filename: "calendar.pdf" },
  { title: "🌍 الدليل الارشادي للدراسات الدولية ",filename: "International_assessment_guide.pdf"},
  { title: "📊 إطار معايير الرقابة والتقييم المدرسية", filename: "framework.pdf" },
  { title: "⚖️ السياسات المهنية والأخلاقية", filename: "ethics_charter_policy.pdf" }
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
    "اللغة العربية": ["الاختبارات التكوينية","استماع وتحدث","قراءة","كتابة","السلوك"],
    "اللغة الإنجليزية": ["الاختبارات التكوينية","استماع وتحدث","قراءة","كتابة","السلوك"],
    "التربية الإسلامية": ["الاختبارات التكوينية","الفهم والتفسير","الاستنتاج والربط بالواقع","حفظ النصوص والمفاهيم","السلوك"],
    "الرياضيات": ["الاختبارات التكوينية","العد تنازليا لعملية الطرح","استخدام خط الاعداد لايجاد عملية الطرح","ايجاد عائلة الحقائق","السلوك"],
    "العلوم": ["الاختبارات التكوينية","تميز أنواع المواطن البرية (غابة و صحراء )","التصنيف والمقارنه","المقارنة بين الموطن المائي و الموطن البري","السلوك"],
    "الدراسات الاجتماعية": ["الاختبارات التكوينية","فهم واستيعاب المفاهيم والمصطلحات","الاستنتاج والوصف","حل المشكلات والتفكير الناقد","السلوك"]
  },
  G2: {
    "اللغة العربية": ["الاختبارات التكوينية","استماع وتحدث","قراءة","كتابة","السلوك"],
    "اللغة الإنجليزية": ["الاختبارات التكوينية","استماع وتحدث","قراءة","كتابة","السلوك"],
    "التربية الإسلامية": ["الاختبارات التكوينية","الفهم والتفسير","الاستنتاج والربط بالواقع","حفظ النصوص والمفاهيم","السلوك"],
    "الرياضيات": ["الاختبارات التكوينية","يكتب ويقرا الأعداد باستخدام القيمة المكانية","يكتب الأعداد باستخدام النماذج ويقارن بينها","يجد  الأعداد الترتيبية","السلوك"],
    "العلوم": ["الاختبارات التكوينية","تحديد أشكال اليابسة و الماء","فهم العمليات البيطة (التجوية و التعرية)","الاستنتاج واللاستقصاء","السلوك"],
    "الدراسات الاجتماعية": ["الاختبارات التكوينية","فهم واستيعاب المفاهيم والمصطلحات","الاستنتاج والوصف","حل المشكلات والتفكير الناقد","السلوك"]
  },
  G3: {
    "اللغة العربية": ["الاختبارات التكوينية","استماع وتحدث","قراءة","كتابة","السلوك"],
    "اللغة الإنجليزية": ["الاختبارات التكوينية","استماع وتحدث","قراءة","كتابة","السلوك"],
    "التربية الإسلامية": ["الاختبارات التكوينية","الفهم والتفسير","الاستنتاج والربط بالواقع","حفظ النصوص والمفاهيم","السلوك"],
    "الرياضيات": ["الاختبارات التكوينية","تقريب الأعداد","جمع الأعداد من ثلاثة وأربعة أرقام","طرح الأعداد من ثلاثة وأربعة أرقام","السلوك"],
    "العلوم": ["الاختبارات التكوينية","مهارة الوصف  وتفسير الاشكال والجداول","التصنيف والمقارنه","الاستنتاج واللاستقصاء","السلوك"],
    "الدراسات الاجتماعية": ["الاختبارات التكوينية","فهم واستيعاب المفاهيم","الاستنتاج والوصف","حل المشكلات والتفكير الناقد","السلوك"]
  },
  G4: {
    "اللغة العربية": ["الاختبارات التكوينية","استماع وتحدث","قراءة","كتابة","السلوك"],
    "اللغة الإنجليزية": ["الاختبارات التكوينية","استماع وتحدث","قراءة","كتابة","السلوك"],
    "التربية الإسلامية": ["الاختبارات التكوينية","الفهم والتفسير","الاستنتاج والربط بالواقع","حفظ النصوص والمفاهيم","السلوك"],
    "الرياضيات": ["الاختبارات التكوينية","يكتب ويقرا الأعداد باستخدام القيمة المكانية","يكتب الأعداد باستخدام النماذج ويقارن بينها","يجد  الأعداد الترتيبية","السلوك"],
    "العلوم": ["الاختبارات التكوينية","مهارة الوصف وتفسير الاشكال والجداول","التصنيف والمقارنه","الاستنتاج واللاستقصاء","السلوك"],
    "الدراسات الاجتماعية": ["الاختبارات التكوينية","فهم واستيعاب المفاهيم","الاستنتاج والوصف","حل المشكلات والتفكير الناقد","السلوك"]
  },
  G5: {
    "اللغة العربية": ["الاختبارات التكوينية","استماع وتحدث","قراءة","كتابة","السلوك"],
    "اللغة الإنجليزية": ["الاختبارات التكوينية","استماع وتحدث","قراءة","كتابة","السلوك"],
    "التربية الإسلامية": ["الاختبارات التكوينية","الفهم والتفسير","الاستنتاج والربط بالواقع","حفظ النصوص والمفاهيم","السلوك"],
    "الرياضيات": ["الاختبارات التكوينية","العوامل والمضاعفات ","جمع وطرح الكسور ","ضرب وتقدير الكسور ","السلوك"],
    "العلوم": ["الاختبارات التكوينية","ممهارة الوصف وتفسير الاشكال والجداول","التصنيف والمقارنه","الاستنتاج واللاستقصاء","السلوك"],
    "الدراسات الاجتماعية": ["الاختبارات التكوينية","فهم واستيعاب المفاهيم","الاستنتاج والوصف","حل المشكلات والتفكير الناقد","السلوك"]
  },
  G6: {
    "اللغة العربية": ["الاختبارات التكوينية","استماع وتحدث","قراءة","كتابة","السلوك"],
    "اللغة الإنجليزية": ["الاختبارات التكوينية","استماع وتحدث","قراءة","كتابة","السلوك"],
    "التربية الإسلامية": ["الاختبارات التكوينية","الفهم والتفسير","الاستنتاج والربط بالواقع","حفظ النصوص والمفاهيم","السلوك"],
    "الرياضيات": ["الاختبارات التكوينية","كتابة الكسر في صورة كسر عشري منته او دوري","ترتيب ومقارنة الاعداد الصحيحة","التمثيل البياني لنقطة وايجاد صورتها بالانعكاس في المحاور","السلوك"],
    "العلوم": ["الاختبارات التكوينية","مهارة الوصف وتفسير الأشكال والجداول","التصنيف والمقارنة","الاستنتاج والاستقصاء","السلوك"],
    "الدراسات الاجتماعية": ["الاختبارات التكوينية","فهم واستيعاب المفاهيم","الاستنتاج والوصف","إنجاز المهام","السلوك"]
  }
};

// ===================== STUDENT REPORT =====================
const EXCEL_PATH = path.join(__dirname, "data", "students1.xlsx");

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

// ===================== SUBJECT NAMES =====================
const subject_names = [
  "اللغة العربية",
  "اللغة الإنجليزية",
  "التربية الإسلامية",
  "الرياضيات",
  "العلوم",
  "الدراسات الاجتماعية"

];
// ===================== LOAD STUDENTS FUNCTION =====================
function loadStudentsFromExcel1() {
  const EXCEL_PATH1 = path.join(__dirname, "data", "students.xlsx");

  if (!fs.existsSync(EXCEL_PATH1)) {
    console.warn("⚠️ ملف Excel غير موجود:", EXCEL_PATH1);
    return {};
  }

  const workbook = xlsx.readFile(EXCEL_PATH1, { cellText: false, cellDates: false });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: "-" });

  const students = {};
  const dataRows = rows.slice(1);

  dataRows.forEach((row) => {
    let studentId = row[0];
    if (!studentId || studentId === "-") return;
    studentId = String(studentId).replace(/[^\d]/g, "").trim();
    if (!studentId) return;

    const name = row[1] ? String(row[1]).trim() : "-";
    const className = row[2] ? String(row[2]).trim() : "-";

    const subjects = subject_names.map((sub, i) => {
      const base = 3 + i * 5; // من العمود الرابع تبدأ المواد
      return {
        name: sub,
        formative: row[base] || "-",
        participation: row[base + 1] || "-",
        task: row[base + 2] || "-",
        commitment: row[base + 3] || "-",
        note: row[base + 4] || ""
      };
    });

    students[studentId] = {
      student: { "الاسم": name, "الشعبة": className },
      subjects
    };
  });

  return students;
}

// ===================== LOAD DATA ON START =====================
let studentReports1 = loadStudentsFromExcel1();

// ===================== API: GET REPORT =====================
app.get("/api/report1/:id", (req, res) => {
  const id = String(req.params.id).trim();

  const student1 = studentReports1[id];
  if (!student1) {
    return res.status(404).json({ error: "❌ الطالب غير موجود" });
  }

  res.json(student1);
});


// ===================== E-mail REPORT =====================

const EXCEL_PATH2 = path.join(__dirname, "data", "emails.xlsx");
function loadEmailsFromExcel() {
  if (!fs.existsSync(EXCEL_PATH2)) {
    console.warn("⚠️ ملف Excel غير موجود:", EXCEL_PATH2);
    return {};
  }

  const workbook = xlsx.readFile(EXCEL_PATH2);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: "" });

  if (!rows || rows.length < 3) {
    console.warn("⚠️ بنية ملف Excel غير كافية (نحتاج 3 صفوف على الأقل).");
    return {};
  }

  const dataRows = rows.slice(2);
  const students = {};

  dataRows.forEach((row) => {
    const studentIdRaw = row[0];
    if (!studentIdRaw || String(studentIdRaw).trim() === "") return;

    const studentId = String(studentIdRaw).replace(/\s/g, "").trim();
    const studentName = String(row[1] || "-").trim();
    const studentClass = String(row[2] || "-").trim();
    const studentEmail = String(row[3] || "-").trim();
    const studentPw = String(row[4] || "-").trim();

    students[studentId] = {
      student: {
        "الاسم": studentName,
        "الصف": studentClass,
        "الايميل": studentEmail,
        "الباسوورد": studentPw
      },
    };
  });

  console.log(`✅ تم تحميل ${Object.keys(students).length} طالب من Excel.`);
  return students;
}

let studentsemail = loadEmailsFromExcel();

// 🔁 إعادة تحميل البيانات
app.post("/api/reload-students", (req, res) => {
  studentsemail = loadEmailsFromExcel();
  return res.json({ ok: true, count: Object.keys(studentsemail).length });
});

// 🔍 جلب بيانات طالب واحد
app.get("/api/emails/:id", (req, res) => {
  const id = String(req.params.id || "").replace(/\s/g, "").trim();
  const report = studentsemail[id];
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
