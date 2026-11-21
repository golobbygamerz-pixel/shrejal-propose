
"use strict";

require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const basicAuth = require("express-basic-auth");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const app = express();
const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "responses.json");

const PORT = Number(process.env.PORT || 3000);

app.disable("x-powered-by");
app.use(helmet({
  crossOriginResourcePolicy: { policy: "same-site" }
}));
app.use(express.json({ limit: "10kb" }));

// Never expose .env, backend files or private response storage.
// Only explicitly serve the public website files.
app.get("/", (req, res) => {
  res.sendFile(path.join(ROOT, "index.html"));
});
app.get("/style.css", (req, res) => {
  res.sendFile(path.join(ROOT, "style.css"));
});
app.get("/script.js", (req, res) => {
  res.sendFile(path.join(ROOT, "script.js"));
});
app.use("/assets", express.static(path.join(ROOT, "assets"), {
  dotfiles: "deny",
  index: false
}));

// Persistent local JSON storage.
function readResponses() {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const content = fs.readFileSync(DATA_FILE, "utf8");
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Could not read response storage:", error);
    throw new Error("Response storage is unavailable.");
  }
}

function writeResponses(responses) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const temporaryFile = `${DATA_FILE}.tmp`;
  fs.writeFileSync(temporaryFile, JSON.stringify(responses, null, 2), {
    mode: 0o600
  });
  fs.renameSync(temporaryFile, DATA_FILE);
}

function hasMailConfiguration() {
  return Boolean(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    process.env.OWNER_EMAIL
  );
}

function createTransporter() {
  if (!hasMailConfiguration()) return null;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

const yesLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many requests. Please try again later."
  }
});

app.post("/api/yes", yesLimiter, async (req, res) => {
  if (!req.is("application/json")) {
    return res.status(415).json({
      message: "JSON content type required."
    });
  }

  if (!req.body || req.body.response !== "YES") {
    return res.status(400).json({
      message: "An explicit YES response is required."
    });
  }

  let responses;

  try {
    responses = readResponses();
  } catch {
    return res.status(500).json({
      message: "Response storage is unavailable."
    });
  }

  // Only the first YES is recorded. Further clicks do not send more emails.
  const existing = responses.find(item => item.type === "YES");

  if (existing) {
    return res.status(200).json({
      saved: true,
      duplicate: true,
      emailSent: existing.emailSent,
      message: "A YES response has already been recorded."
    });
  }

  const record = {
    type: "YES",
    receivedAt: new Date().toISOString(),
    emailSent: false
  };

  responses.push(record);

  try {
    // Save the response before attempting email delivery.
    writeResponses(responses);
  } catch (error) {
    console.error("Could not save YES response:", error);
    return res.status(500).json({
      message: "The response could not be saved."
    });
  }

  const transporter = createTransporter();

  if (!transporter) {
    return res.status(200).json({
      saved: true,
      emailSent: false,
      message: "Response saved. Email settings are not configured."
    });
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.OWNER_EMAIL,
      subject: "A YES response — Rihan × Shrejal",
      text:
        "An explicit YES response was submitted on the Rihan × Shrejal website.\n\n" +
        `Server timestamp: ${record.receivedAt}\n\n` +
        "This notification records the button response only."
    });

    record.emailSent = true;
    writeResponses(responses);

    return res.status(200).json({
      saved: true,
      emailSent: true,
      receivedAt: record.receivedAt,
      message: "Response saved and email notification sent."
    });
  } catch (error) {
    console.error("Email delivery failed:", error);

    // The YES remains saved. Do not send duplicate emails automatically.
    return res.status(200).json({
      saved: true,
      emailSent: false,
      receivedAt: record.receivedAt,
      message: "Response saved, but email delivery could not be confirmed."
    });
  }
});

// Admin dashboard: HTTP Basic Authentication.
const adminAuth = basicAuth({
  users: {
    [process.env.ADMIN_USERNAME || "disabled"]:
      process.env.ADMIN_PASSWORD || "disabled"
  },
  challenge: true,
  realm: "Rihan Shrejal Private Dashboard",
  unauthorizedResponse: "Authentication required."
});

app.get("/admin", adminAuth, (req, res) => {
  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
    return res.status(503).send("Admin login is not configured.");
  }

  res.type("html").send(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Private Response Dashboard</title>
<style>
body{font-family:Arial,sans-serif;background:#fff0f6;color:#702342;padding:25px}
main{max-width:650px;margin:40px auto;background:white;padding:25px;border-radius:20px}
h1{font-family:Georgia,serif}
.item{padding:16px;margin:12px 0;background:#fff5f9;border-radius:12px}
small{color:#98647a}
</style>
</head>
<body>
<main>
<h1>Private Dashboard ❤️</h1>
<p>Rihan × Shrejal</p>
<div id="result">Loading response...</div>
<script>
fetch('/api/admin/responses')
.then(r=>{if(!r.ok)throw new Error('Could not load');return r.json()})
.then(data=>{
 const el=document.getElementById('result');
 if(!data.responses.length){
   el.textContent='No YES response has been recorded.';
   return;
 }
 el.innerHTML=data.responses.map(item=>
  '<div class="item"><strong>'+item.type+'</strong><br>'+
  '<small>'+new Date(item.receivedAt).toLocaleString()+'</small><br>'+
  'Email notification: '+(item.emailSent?'Sent':'Not confirmed')+
  '</div>'
 ).join('');
})
.catch(()=>document.getElementById('result').textContent='Could not load responses.');
</script>
</main>
</body>
</html>`);
});

app.get("/api/admin/responses", adminAuth, (req, res) => {
  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
    return res.status(503).json({ message: "Admin login is not configured." });
  }

  try {
    const responses = readResponses();
    res.set("Cache-Control", "no-store");
    return res.json({
      responses: responses.map(item => ({
        type: item.type,
        receivedAt: item.receivedAt,
        emailSent: item.emailSent
      }))
    });
  } catch {
    return res.status(500).json({
      message: "Could not read response storage."
    });
  }
});

app.use((req, res) => {
  res.status(404).send("Page not found.");
});

app.listen(PORT, () => {
  console.log(`Rihan × Shrejal website running on port ${PORT}`);
});
