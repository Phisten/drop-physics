const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const dots = [];

const GRAVITY = 9.8;
const MAX_MASS = 3;
const MIN_MASS = 1.5;
const MAX_FORCE = 20;
const MIN_FORCE = 5;
const FRAME_SECOND = 1 / 60;
const WALL_ATTENUATION = 0.82;

const DOT_RADIUS = MIN_FORCE + MIN_FORCE;

function draw() {
  requestAnimationFrame(draw);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  dots.forEach((dot) => {
    ctx.fillStyle = dot.color;

    ctx.beginPath();
    ctx.arc(dot.x, dot.y, 10, 0, 2 * Math.PI, false);
    ctx.fill();

    // v = gt
    const accX = 0;
    const accY = GRAVITY;
    dot.vX += accX * FRAME_SECOND
    dot.vY += accY * FRAME_SECOND

    dot.x += dot.vX ;
    dot.y += dot.vY;

    // Detect Walls
    // LEFT
    if (dot.x < DOT_RADIUS && dot.vX < 0) {
      dot.x = DOT_RADIUS;
      dot.vX = -dot.vX * WALL_ATTENUATION;

      return;
    }

    // RIGHT
    if (dot.x > canvas.width - DOT_RADIUS && dot.vX > 0) {
      dot.x = canvas.width - DOT_RADIUS;
      dot.vX = -dot.vX * WALL_ATTENUATION;

      return;
    }

    // BOTTOM
    if (dot.y > canvas.height - DOT_RADIUS && dot.vY > 0) {
      dot.y = canvas.height - DOT_RADIUS;
      dot.vY = -dot.vY * WALL_ATTENUATION;

      return;
    }
  });
}

requestAnimationFrame(draw);

canvas.addEventListener('mousedown', (event) => {
  const dot = {
    x: event.clientX - canvas.offsetLeft,
    y: event.clientY - canvas.offsetTop,
    degree: Math.random() * (Math.PI + Math.PI),
    // degree: Math.PI * 0.5,
    force: (Math.random() * (MAX_FORCE - MIN_FORCE)) + MIN_FORCE,
    mass: (Math.random() * (MAX_MASS - MIN_MASS)) + MIN_MASS,
    originX: event.clientX - canvas.offsetLeft,
    originY: event.clientY - canvas.offsetTop,
    color: `rgb(${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)}, ${Math.round(Math.random() * 255)})`,
  };

  dot.vX = ((dot.force * Math.cos(dot.degree)) / dot.mass);
  dot.vY = ((dot.force * Math.sin(dot.degree)) / dot.mass);

  dots.push(dot);
});

document.querySelector('#reset').addEventListener('click', () => {
  dots.forEach((dot) => {
    dot.x = dot.originX;
    dot.y = dot.originY;
    dot.frame = 0;
  });
});

document.querySelector('#clear').addEventListener('click', () => {
  dots.splice(0, dots.length);
});