const lamp = document.getElementById("lamp");
const paper = document.getElementById("paper");
const scene = document.getElementById("scene");
const xInput = document.getElementById("x");
const yInput = document.getElementById("y");
const blurInput = document.getElementById("blur");
const spreadInput = document.getElementById("spread");
const scaleSlider = document.getElementById("scaleSlider");

let dragging = false;
let offsetX = 0;
let offsetY = 0;
let blur = 20;
let spread = 0;
let lampSize = 40;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function placeLampCenter() {
  const paperRect = paper.getBoundingClientRect();
  const sceneRect = scene.getBoundingClientRect();
  const centerX = paperRect.left + paperRect.width / 2 - sceneRect.left;
  const centerY = paperRect.top + paperRect.height / 2 - sceneRect.top;
  lamp.style.left = `${centerX - lampSize / 2}px`;
  lamp.style.top = `${centerY - lampSize / 2}px`;
  lamp.style.width = `${lampSize}px`;
  lamp.style.height = `${lampSize}px`;
  updateShadow();
}

function updateShadow() {
  const lampRect = lamp.getBoundingClientRect();
  const sceneRect = scene.getBoundingClientRect();
  const paperRect = paper.getBoundingClientRect();

  const lampCenterX = lampRect.left + lampRect.width / 2;
  const lampCenterY = lampRect.top + lampRect.height / 2;
  const paperCenterX = paperRect.left + paperRect.width / 2;
  const paperCenterY = paperRect.top + paperRect.height / 2;

  const dx = paperCenterX - lampCenterX;
  const dy = paperCenterY - lampCenterY;

  const shadowX = dx;
  const shadowY = dy;

  paper.style.boxShadow = `${shadowX}px ${shadowY}px ${blur}px ${spread}px rgba(0,0,0,0.5)`;

  xInput.value = Math.round(shadowX);
  yInput.value = Math.round(shadowY);
  blurInput.value = Math.round(blur);
  spreadInput.value = spread;
}

placeLampCenter();

lamp.addEventListener("mousedown", (e) => {
  dragging = true;
  offsetX = e.offsetX;
  offsetY = e.offsetY;
});

window.addEventListener("mouseup", () => (dragging = false));

window.addEventListener("mousemove", (e) => {
  if (!dragging) return;

  const sceneRect = scene.getBoundingClientRect();
  let x = e.clientX - sceneRect.left - offsetX;
  let y = e.clientY - sceneRect.top - offsetY;

  const minX = 0;
  const maxX = scene.offsetWidth - lamp.offsetWidth;
  const minY = 0;
  const maxY = scene.offsetHeight - lamp.offsetHeight;

  x = clamp(x, minX, maxX);
  y = clamp(y, minY, maxY);

  lamp.style.left = `${x}px`;
  lamp.style.top = `${y}px`;

  updateShadow();
});

scaleSlider.addEventListener("input", () => {
  const value = +scaleSlider.value;
  const scale = value / 100;

  const centerX = lamp.offsetLeft + lamp.offsetWidth / 2;
  const centerY = lamp.offsetTop + lamp.offsetHeight / 2;

  lampSize = 20 + scale * 40;
  spread = 60 - scale * 60;

  lamp.style.width = `${lampSize}px`;
  lamp.style.height = `${lampSize}px`;
  lamp.style.left = `${centerX - lampSize / 2}px`;
  lamp.style.top = `${centerY - lampSize / 2}px`;

  updateShadow();
});

[xInput, yInput, blurInput, spreadInput].forEach((input) => {
  input.addEventListener("change", () => {
    const x = parseInt(xInput.value);
    const y = parseInt(yInput.value);
    blur = parseInt(blurInput.value);
    spread = parseInt(spreadInput.value);
    paper.style.boxShadow = `${x}px ${y}px ${blur}px ${spread}px rgba(0,0,0,0.5)`;
  });
});
