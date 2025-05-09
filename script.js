const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let circles = [];
let selectedCircle = null;
let isDragging = false;
const defaultRadius = 20;
const minRadius = 5;

canvas.addEventListener("mousedown", function (e) {
  const mousePos = getMousePos(e);
  let clicked = false;

  for (let i = circles.length - 1; i >= 0; i--) {
    if (isInsideCircle(mousePos, circles[i])) {
      selectedCircle = circles[i];
      selectedCircle.color = "red";
      isDragging = true;
      clicked = true;
      break;
    }
  }

  if (!clicked) {
    deselectAll();
    const newCircle = {
      x: mousePos.x,
      y: mousePos.y,
      radius: defaultRadius,
      color: "blue"
    };
    circles.push(newCircle);
  }

  drawCircles();
});

canvas.addEventListener("mousemove", function (e) {
  if (isDragging && selectedCircle) {
    const pos = getMousePos(e);
    selectedCircle.x = pos.x;
    selectedCircle.y = pos.y;
    drawCircles();
  }
});

canvas.addEventListener("mouseup", function () {
  isDragging = false;
});

canvas.addEventListener("wheel", function (e) {
  if (selectedCircle) {
    e.preventDefault();
    selectedCircle.radius += e.deltaY < 0 ? 2 : -2;
    if (selectedCircle.radius < minRadius) {
      selectedCircle.radius = minRadius;
    }
    drawCircles();
  }
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Delete" && selectedCircle) {
    circles = circles.filter(c => c !== selectedCircle);
    selectedCircle = null;
    drawCircles();
  }
});

function getMousePos(evt) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function isInsideCircle(pos, circle) {
  const dx = pos.x - circle.x;
  const dy = pos.y - circle.y;
  return Math.sqrt(dx * dx + dy * dy) <= circle.radius;
}

function drawCircles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  circles.forEach(circle => {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.fillStyle = circle.color;
    ctx.fill();
    ctx.closePath();
  });
}

function deselectAll() {
  circles.forEach(c => c.color = "blue");
  selectedCircle = null;
}
