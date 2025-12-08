const express = require('express');
const cors = require('cors');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs').promises;
const { PDFParse } = require('pdf-parse');

const app = express();
const PORT = 8000;

app.use(cors());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

const db = new sqlite3.Database('database.db');

const dbRun = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this);
            }
        });
    });
};

(async () => {
    try {
        await dbRun(`CREATE TABLE IF NOT EXISTS applicants (
            applicant_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phoneNumber TEXT NOT NULL
        )`);

        await dbRun(`CREATE TABLE IF NOT EXISTS resumes (
            resume_id INTEGER PRIMARY KEY AUTOINCREMENT,
            applicant_id INTEGER NOT NULL,
            file_path TEXT NOT NULL,
            FOREIGN KEY (applicant_id) REFERENCES applicants (applicant_id)
        )`);
    } catch (err) {
        console.error('Error initializing database tables:', err);
    }
})();

app.post('/api/resume/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const pdfPath = req.file.path;

    try {
        const data = await fs.readFile(pdfPath);
        const pdfParser = new PDFParse({ data: data });
        pdfParser.getText().then(async (pdfData) => {
            const fullText = pdfData.text;

            const nameRegex = /이름:\s*([가-힣]{2,4})/g;
            const nameMatches = fullText.match(nameRegex);
            const name = nameMatches[0].split(':')[1].trim();

            const phoneNumberRegex = /전화번호:\s*(\d{3}-\d{4}-\d{4})/g;
            const phoneNumberMatches = fullText.match(phoneNumberRegex);
            const phoneNumber = phoneNumberMatches[0].split(':')[1].trim();

            const applicantResult = await dbRun(`INSERT INTO applicants (name, phoneNumber) VALUES (?, ?)`, [name, phoneNumber]);
            const applicantId = applicantResult.lastID;

            const resumeResult = await dbRun(`INSERT INTO resumes (applicant_id, file_path) VALUES (?, ?)`, [applicantId, pdfPath]);
            const resumeId = resumeResult.lastID;

            res.status(200).json(
                {
                    message: 'File uploaded successfully',
                    name: name,
                    resume_id: resumeId,
                    applicant_id: applicantId,
                });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});
