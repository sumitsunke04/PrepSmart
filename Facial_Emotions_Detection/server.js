const express = require("express");
const multer = require("multer");
const path = require("path");
const { spawn } = require("child_process");
const unzipper = require("unzipper");
const fs = require("fs");
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

// Enhanced CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Disposition']
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions)); // Enable preflight for all routes

// Configure storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Improved Python script execution function
async function runPythonScript(scriptPath, args) {
  return new Promise((resolve, reject) => {
    const python = spawn('python', [scriptPath, ...args]);
    let output = '';
    let errorOutput = '';

    python.stderr.on('data', (data) => {
      errorOutput += data.toString();
      console.error('Python stderr:', data.toString());
    });

    python.stdout.on('data', (data) => {
      const text = data.toString();
      if (text.trim().startsWith('{') || text.trim().startsWith('[')) {
        output += text;
      }
    });

    python.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`Python script exited with code ${code}: ${errorOutput}`));
      }
      
      try {
        const result = JSON.parse(output);
        resolve(result);
      } catch (e) {
        reject(new Error(`Failed to parse Python output: ${e.message}\nOutput: ${output}`));
      }
    });
  });
}

app.post("/upload", upload.single("zipfile"), async (req, res) => {
  try {
    console.log("Upload request received");

    // Set CORS headers manually for this endpoint
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Create temp directory
    const tempDir = path.join(__dirname, "temp", `upload_${Date.now()}`);
    await fs.promises.mkdir(tempDir, { recursive: true });

    // Save and extract zip
    const zipPath = path.join(tempDir, "upload.zip");
    await fs.promises.writeFile(zipPath, req.file.buffer);

    await fs.createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: tempDir }))
      .promise();

    // Run Python script
    const result = await runPythonScript(
      path.join(__dirname, 'analyze_emotion.py'),
      [tempDir]
    );

    // Clean up
    await fs.promises.rm(tempDir, { recursive: true });
    console.log('result:', result)
    // Send response
    res.json({
      success: true,
      insights: result.insights,
      statistics: result.statistics || null
    });
  } catch (error) {
    console.error("Error in upload handler:", error);
    res.status(500).json({ 
      success: false,
      error: "Processing failed",
      message: error.message
    });
  }
});

// Health check endpoint
app.get("/", (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.send("Emotion Analysis Server is running");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Upload endpoint: http://localhost:${PORT}/upload`);
});