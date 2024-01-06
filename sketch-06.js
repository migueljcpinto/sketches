const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");

const settings = {
  dimensions: [1080, 1080],
};

let manager;

let text = "A";
let fontSize = 1200;
let fontFamily = "serif";

const typeCanvas = document.createElement("canvas");
const typeContext = typeCanvas.getContext("2d");

const sketch = ({ context, width, height }) => {
  const cell = 2;
  const cols = Math.floor(width / cell);
  const rows = Math.floor(height / cell);
  const numCells = cols * rows;

  typeCanvas.width = cols;
  typeCanvas.height = rows;

  return ({ context, width, height }) => {
    typeContext.fillStyle = "black";
    typeContext.fillRect(0, 0, cols, rows);

    //The Image

    typeContext.drawImage(image, 0, 0, cols, rows);

    const typeData = typeContext.getImageData(0, 0, cols, rows).data;

    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);

    context.textBaseline = "middle";
    context.textAlign = "center";

    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cell + random.range(-cell, cell) * 0.5;
      const y = row * cell + random.range(-cell, cell) * 0.5;

      const r = typeData[i * 4 + 0];
      const g = typeData[i * 4 + 1];
      const b = typeData[i * 4 + 2];
      const a = typeData[i * 4 + 3];

      const glyph = getGlyph(r, g, b, a);

      context.fillStyle = `rgb(${r}, ${g}, ${b})`;

      context.font = `${cell * 2}px ${fontFamily}`;
      if (Math.random() < 0.1) context.font = `${cell * 10}px ${fontFamily}`;

      context.save();
      context.translate(x, y);
      context.translate(cell * 0.5, cell * 0.5);

      context.fillText(glyph, 0, 0);

      context.restore();
    }
  };
};

const getGlyph = (r, g, b, a) => {
  const brightness = (r + g + b) / 3;

  if (brightness < 50) return ".";
  if (brightness < 100) return "/";
  if (brightness < 150) return "-";
  if (brightness < 200) return "+";

  const glyphs = "101".split("");

  return random.pick(glyphs);
};

const loadMeSomeImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject();
    img.src = url;
  });
};

const start = async () => {
  const url = "./earth.jpg";
  image = await loadMeSomeImage(url);
  manager = await canvasSketch(sketch, settings);
};

start();
