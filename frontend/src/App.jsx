import { useState } from 'react';
import axios from 'axios';

const API = "http://localhost:4000"; // Update to your backend URL when deployed

function App() {
  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(400);

  const initCanvas = () => {
    axios.post(`${API}/init-canvas`, { width, height });
  };

  const addRect = () => {
    axios.post(`${API}/add-rectangle`, {
      x: 50, y: 50, width: 100, height: 100, color: "blue"
    });
  };

  const addCircle = () => {
    axios.post(`${API}/add-circle`, {
      x: 200, y: 200, radius: 50, color: "red"
    });
  };

  const addText = () => {
    axios.post(`${API}/add-text`, {
      text: "Hello!", x: 100, y: 100, fontSize: 30, color: "black"
    });
  };

  const addImage = () => {
    axios.post(`${API}/add-image`, {
      imageUrl: "https://via.placeholder.com/100",
      x: 300, y: 100, width: 100, height: 100
    });
  };

  const exportPDF = () => {
    window.open(`${API}/export-pdf`, "_blank");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Canvas Builder</h1>
      <div>
        <input value={width} onChange={e => setWidth(e.target.value)} />
        <input value={height} onChange={e => setHeight(e.target.value)} />
        <button onClick={initCanvas}>Init Canvas</button>
      </div>
      <button onClick={addRect}>Add Rectangle</button>
      <button onClick={addCircle}>Add Circle</button>
      <button onClick={addText}>Add Text</button>
      <button onClick={addImage}>Add Image</button>
      <button onClick={exportPDF}>Export PDF</button>
    </div>
  );
}

export default App;
