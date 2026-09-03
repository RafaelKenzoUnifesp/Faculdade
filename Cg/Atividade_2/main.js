const TAM_PIXEL = 6; 

let canvas;
let ctx;
let colunas;
let linhas;

let modoAtual = "reta";
let corAtualIndex = 0;

let pontosClicados = [];

let figuraAtual = {
  modo: "reta",
  pontos: [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ],
};

const paleta = [
  "#2563eb", // 0: Azul
  "#dc2626", // 1: Vermelho
  "#16a34a", // 2: Verde
  "#eab308", // 3: Amarelo
  "#c026d3", // 4: Magenta
  "#0891b2", // 5: Ciano
  "#ea580c", // 6: Laranja
  "#7c3aed", // 7: Roxo
  "#92400e", // 8: Marrom
  "#f8fafc", // 9: Branco
];

function bresenham(x0, y0, x1, y1) {
  const pixels = [];

  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1; 
  const sy = y0 < y1 ? 1 : -1; 

  let x = x0;
  let y = y0;

  if (dx >= dy) {
    let p = 2 * dy - dx;
    const incInf = 2 * dy;
    const incSup = 2 * (dy - dx);

    pixels.push({ x, y });
    for (let i = 0; i < dx; i++) {
      x += sx;
      if (p < 0) {
        p += incInf;
      } else {
        p += incSup;
        y += sy;
      }
      pixels.push({ x, y });
    }
  } else {
    let p = 2 * dx - dy;
    const incInf = 2 * dx;
    const incSup = 2 * (dx - dy);

    pixels.push({ x, y });
    for (let i = 0; i < dy; i++) {
      y += sy;
      if (p < 0) {
        p += incInf;
      } else {
        p += incSup;
        x += sx;
      }
      pixels.push({ x, y });
    }
  }

  return pixels;
}

function pixelsTriangulo(a, b, c) {
  return [
    ...bresenham(a.x, a.y, b.x, b.y),
    ...bresenham(b.x, b.y, c.x, c.y),
    ...bresenham(c.x, c.y, a.x, a.y),
  ];
}

function writePixel(x, y, cor) {
  const yTela = linhas - 1 - y;
  if (x < 0 || x >= colunas || yTela < 0 || yTela >= linhas) return;
  ctx.fillStyle = cor;
  ctx.fillRect(x * TAM_PIXEL, yTela * TAM_PIXEL, TAM_PIXEL, TAM_PIXEL);
}

function desenharGrade() {
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 1;
  for (let cx = 0; cx <= colunas; cx++) {
    ctx.beginPath();
    ctx.moveTo(cx * TAM_PIXEL + 0.5, 0);
    ctx.lineTo(cx * TAM_PIXEL + 0.5, linhas * TAM_PIXEL);
    ctx.stroke();
  }
  for (let cy = 0; cy <= linhas; cy++) {
    ctx.beginPath();
    ctx.moveTo(0, cy * TAM_PIXEL + 0.5);
    ctx.lineTo(colunas * TAM_PIXEL, cy * TAM_PIXEL + 0.5);
    ctx.stroke();
  }
}

function desenharClicksParciais() {
  const cor = paleta[corAtualIndex];
  ctx.fillStyle = cor;
  for (const p of pontosClicados) {
    const yTela = linhas - 1 - p.y;
    ctx.beginPath();
    ctx.arc(
      p.x * TAM_PIXEL + TAM_PIXEL / 2,
      yTela * TAM_PIXEL + TAM_PIXEL / 2,
      TAM_PIXEL * 1.4,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
}

function redesenhar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  desenharGrade();

  const cor = paleta[corAtualIndex];
  const { modo, pontos } = figuraAtual;

  let pixels;
  if (modo === "reta") {
    pixels = bresenham(pontos[0].x, pontos[0].y, pontos[1].x, pontos[1].y);
  } else {
    pixels = pixelsTriangulo(pontos[0], pontos[1], pontos[2]);
  }

  for (const px of pixels) {
    writePixel(px.x, px.y, cor);
  }

  desenharClicksParciais();
}

function coordenadasDoEvento(ev) {
  const rect = canvas.getBoundingClientRect();
  const xTela = Math.floor((ev.clientX - rect.left) / TAM_PIXEL);
  const yTela = Math.floor((ev.clientY - rect.top) / TAM_PIXEL);
  const x = Math.min(Math.max(xTela, 0), colunas - 1);
  const yDispositivo = Math.min(Math.max(linhas - 1 - yTela, 0), linhas - 1);
  return { x, y: yDispositivo };
}

function aoClicar(ev) {
  const ponto = coordenadasDoEvento(ev);
  pontosClicados.push(ponto);

  const necessarios = modoAtual === "reta" ? 2 : 3;

  if (pontosClicados.length === necessarios) {
    figuraAtual = { modo: modoAtual, pontos: [...pontosClicados] };
    pontosClicados = [];
  }

  redesenhar();
}

function aoApertarTecla(ev) {
  const key = ev.key;

  if (key >= "0" && key <= "9") {
    corAtualIndex = parseInt(key, 10);
    redesenhar();
    return;
  }

  if (key === "r" || key === "R") {
    modoAtual = "reta";
    pontosClicados = [];
    redesenhar();
    return;
  }

  if (key === "t" || key === "T") {
    modoAtual = "triangulo";
    pontosClicados = [];
    redesenhar();
    return;
  }
}

function iniciar() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  colunas = Math.floor(canvas.width / TAM_PIXEL);
  linhas = Math.floor(canvas.height / TAM_PIXEL);

  canvas.addEventListener("click", aoClicar);
  window.addEventListener("keydown", aoApertarTecla);

  redesenhar();
}

window.addEventListener("DOMContentLoaded", iniciar);