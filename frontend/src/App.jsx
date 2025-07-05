import { useState } from 'react';
import axios from 'axios';

const API = "http://localhost:4000"; // Update to backend URL when deployed

function App() {
  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(400);
  const [canvasReady, setCanvasReady] = useState(false);

  const initCanvas = async () => {
    try {
      await axios.post(`${API}/init-canvas`, { width: Number(width), height: Number(height) });
      setCanvasReady(true);
      alert("✅ Canvas initialized");
    } catch (error) {
      alert("❌ Failed to initialize canvas");
      console.error(error);
    }
  };

  const addRect = async () => {
    try {
      await axios.post(`${API}/add-rectangle`, {
        x: 50, y: 50, width: 100, height: 100, color: "blue"
      });
    } catch (err) {
      alert("❌ Error adding rectangle");
    }
  };

  const addCircle = async () => {
    try {
      await axios.post(`${API}/add-circle`, {
        x: 200, y: 200, radius: 50, color: "red"
      });
    } catch (err) {
      alert("❌ Error adding circle");
    }
  };

  const addText = async () => {
    try {
      await axios.post(`${API}/add-text`, {
        text: "Hello!", x: 100, y: 100, fontSize: 30, color: "black"
      });
    } catch (err) {
      alert("❌ Error adding text");
    }
  };

  const addImage = async () => {
    try {
      await axios.post(`${API}/add-image`, {
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png",
        x: 300, y: 100, width: 100, height: 100
      });
    } catch (err) {
      alert("❌ Error adding image");
    }
  };

  const exportPDF = () => {
    if (!canvasReady) {
      alert("⚠️ Initialize canvas first");
      return;
    }
    window.open(`${API}/export-pdf`, "_blank");
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Canvas Builder</h1>

      <div style={{ marginBottom: 10 }}>
        <label>Canvas Width: </label>
        <input
          type="number"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <label>Canvas Height: </label>
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
        <button onClick={initCanvas} style={{ marginLeft: 10 }}>
          Init Canvas
        </button>
      </div>

      <div style={{ marginTop: 10 }}>
        <button onClick={addRect} disabled={!canvasReady}>Add Rectangle</button>
        <button onClick={addCircle} disabled={!canvasReady}>Add Circle</button>
        <button onClick={addText} disabled={!canvasReady}>Add Text</button>
        <button onClick={addImage} disabled={!canvasReady}>Add Image</button>
        <button onClick={exportPDF} disabled={!canvasReady}>Export PDF</button>
      </div>
    </div>
  );
}

export default App;
