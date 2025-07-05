const express = require("express");
const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");
const PDFDocument = require("pdfkit");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

let canvas = null;
let ctx = null;

// Initialize canvas with given dimensions
app.post("/init-canvas", (req, res) => {
  const { width, height } = req.body;
  if (!width || !height) {
    return res.status(400).json({ error: "Width and height are required" });
  }

  canvas = createCanvas(width, height);
  ctx = canvas.getContext("2d");
  console.log(`✅ Canvas initialized with size ${width}x${height}`);
  res.json({ message: "Canvas initialized" });
});

// Add rectangle to canvas
app.post("/add-rectangle", (req, res) => {
  if (!ctx) return res.status(400).json({ error: "Canvas not initialized" });

  const { x, y, width, height, color } = req.body;
  ctx.fillStyle = color || "black";
  ctx.fillRect(x, y, width, height);
  console.log("🟦 Rectangle added");
  res.json({ message: "Rectangle added" });
});

// Add circle to canvas
app.post("/add-circle", (req, res) => {
  if (!ctx) return res.status(400).json({ error: "Canvas not initialized" });

  const { x, y, radius, color } = req.body;
  ctx.fillStyle = color || "black";
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  console.log("🟠 Circle added");
  res.json({ message: "Circle added" });
});

// Add text to canvas
app.post("/add-text", (req, res) => {
  if (!ctx) return res.status(400).json({ error: "Canvas not initialized" });

  const { text, x, y, fontSize, color } = req.body;
  ctx.fillStyle = color || "black";
  ctx.font = `${fontSize || 20}px Arial`;
  ctx.fillText(text, x, y);
  console.log("📝 Text added");
  res.json({ message: "Text added" });
});

// Add image to canvas
app.post("/add-image", async (req, res) => {
  if (!ctx) return res.status(400).json({ error: "Canvas not initialized" });

  const { imageUrl, x, y, width, height } = req.body;
  try {
    console.log(`🖼️ Loading image from: ${imageUrl}`);
    const image = await loadImage(imageUrl);
    ctx.drawImage(image, x, y, width, height);
    console.log("✅ Image added");
    res.json({ message: "Image added" });
  } catch (err) {
    console.error("❌ Failed to load image:", err.message);
    res.status(500).json({ error: "Failed to load image", details: err.message });
  }
});

// Export the current canvas as a PDF
app.get("/export-pdf", (req, res) => {
  if (!canvas) return res.status(400).json({ error: "Canvas not initialized" });

  const pdf = new PDFDocument({ compress: true });
  const outputPath = path.join(__dirname, "output.pdf");
  const out = fs.createWriteStream(outputPath);

  pdf.pipe(out);

  try {
    const imgBuffer = canvas.toBuffer("image/png");
    pdf.image(imgBuffer, 0, 0, { width: canvas.width });
    console.log("📄 PDF generation started");
  } catch (err) {
    console.error("❌ Error converting canvas to PDF:", err.message);
    return res.status(500).json({ error: "Failed to generate PDF" });
  }

  pdf.end();

  out.on("finish", () => {
    console.log("✅ PDF ready to download");
    res.download(outputPath, "canvas.pdf");
  });
});

// Start server
app.listen(4000, () => {
  console.log("🚀 Backend running on http://localhost:4000");
});
