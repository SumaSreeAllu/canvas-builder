// backend/index.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");
const PDFDocument = require("pdfkit");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

let canvas, ctx;

app.post("/init-canvas", (req, res) => {
  const { width, height } = req.body;
  canvas = createCanvas(width, height);
  ctx = canvas.getContext("2d");
  res.json({ message: "Canvas initialized" });
});

app.post("/add-rectangle", (req, res) => {
  const { x, y, width, height, color } = req.body;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
  res.json({ message: "Rectangle added" });
});

app.post("/add-circle", (req, res) => {
  const { x, y, radius, color } = req.body;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  res.json({ message: "Circle added" });
});

app.post("/add-text", (req, res) => {
  const { text, x, y, fontSize, color } = req.body;
  ctx.fillStyle = color;
  ctx.font = `${fontSize}px Arial`;
  ctx.fillText(text, x, y);
  res.json({ message: "Text added" });
});

app.post("/add-image", async (req, res) => {
  const { imageUrl, x, y, width, height } = req.body;
  try {
    const image = await loadImage(imageUrl);
    ctx.drawImage(image, x, y, width, height);
    res.json({ message: "Image added" });
  } catch (err) {
    res.status(500).json({ error: "Failed to load image" });
  }
});

app.get("/export-pdf", (req, res) => {
  const pdf = new PDFDocument({ compress: true });
  const outputPath = path.join(__dirname, "output.pdf");
  const out = fs.createWriteStream(outputPath);
  pdf.pipe(out);
  const img = canvas.toBuffer("image/png");
  pdf.image(img, 0, 0, { width: 600 });
  pdf.end();

  out.on("finish", () => {
    res.download(outputPath, "canvas.pdf");
  });
});

app.listen(4000, () => console.log("Backend running on port 4000"));
