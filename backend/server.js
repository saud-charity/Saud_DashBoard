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
  const user = STAFF_USERS.find(u => u.username===username && u.password===password);
  if(user) return res.json({ success: true });
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
app.get("/api/menu/:role", (req,res)=>{
  const { role } = req.params;
  if(role==="student") return res.json(studentMenu);
  if(role==="staff") return res.json(staffMenu);
  res.status(400).send("دور غير معروف");
});

// -----------------------------
// ✅ PDF protection
// -----------------------------
app.get("/api/pdfs/:filename",(req,res)=>{
  const safe = /^[a-zA-Z0-9_.-]+\.pdf$/;
  const { filename } = req.params;
  if(!safe.test(filename)) return res.status(400).send("اسم ملف غير صالح");

  const filePath = path.join(__dirname,"../public/pdfs",filename);
  if(!fs.existsSync(filePath)) return res.status(404).send("الملف غير موجود");

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
  { title: "دليل ولي الأمر للطفولة المبكرة", filename: "Parents’_Guide_to_Early_Childhood.pdf" },
  { title: "سياسة الأمن الرقمي", filename: "Digital_Safety_Policy.pdf" }
];

const staffPolicies = [
  { title: "الميثاق المهني والأخلاقي", filename: "Ethics_Charter_Policy.pdf" },
  ...studentPolicies
];

app.get("/api/policies/:role",(req,res)=>{
  const { role } = req.params;
  if(role==="student") return res.json(studentPolicies);
  if(role==="staff") return res.json(staffPolicies);
  res.status(400).send("دور غير معروف");
});

// -----------------------------
// ✅ Excel student reports
// -----------------------------
const EXCEL_PATH = path.join(__dirname,"data","students.xlsx");
const subjects=["اللغة العربية","اللغة الإنجليزية","التربية الإسلامية","الرياضيات","العلوم","الدراسات الاجتماعية","التصميم والتكنولوجيا"];

function loadStudentsFromExcel(){
  if(!fs.existsSync(EXCEL_PATH)) return {};

  const workbook = xlsx.readFile(EXCEL_PATH);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet,{defval:"-"});

  const students = {};
  rows.forEach(row=>{
    const idKeys = ["ID","Id","id","الهوية","رقم الهوية","NationalID"];
    let id = idKeys.map(k=>row[k]).find(v=>v && String(v).trim()!=="");
    if(!id) return;
    id=String(id).trim();

    const nameKeys = ["الاسم","اسم","Name","student_name"];
    const classKeys = ["الشعبة","Class","الفصل"];
    const name = nameKeys.map(k=>row[k]).find(v=>v && String(v).trim()!=="")||"-";
    const className = classKeys.map(k=>row[k]).find(v=>v && String(v).trim()!=="")||"-";

    const allCols = Object.keys(row).slice(4);
    const subjectData = subjects.map((sub,i)=>{
      const base=i*6;
      return {
        name: sub,
        formative: row[allCols[base]]||"-",
        academic: row[allCols[base+1]]||"-",
        participation: row[allCols[base+2]]||"-",
        alef: row[allCols[base+3]]||"-",
        behavior: row[allCols[base+4]]||"-",
        commitment: row[allCols[base+5]]||"-"
      };
    });

    students[id] = { student: { "الاسم":name.trim(), "الشعبة":className.trim() }, subjects: subjectData };
  });

  return students;
}

let studentReports = loadStudentsFromExcel();

app.get("/api/report/:id",(req,res)=>{
  const id = String(req.params.id).trim();
  const report = studentReports[id];
  if(!report) return res.status(404).send("الطالب غير موجود");
  res.json(report);
});

app.post("/api/reload-students",(req,res)=>{
  studentReports = loadStudentsFromExcel();
  res.json({ok:true,count:Object.keys(studentReports).length});
});

// -----------------------------
// ✅ Start server
// -----------------------------
const PORT=3000;
app.listen(PORT,()=>console.log(`✅ Server running at http://localhost:${PORT}`));
