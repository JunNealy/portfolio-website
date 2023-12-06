const canvas = document.getElementById('canvas1');
const context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

//Mouse Position
let mouse = {
  x: null,
  y: null,
  radius: (canvas.height / 125) * (canvas.width / 125),
};

window.addEventListener('mousemove', function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

//create particle
class Particle {
  constructor(x, y, directionX, directionY, size, color) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
  }
  //method to draw individual particles
  draw() {
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    context.fillStyle = '#6FA8DC';
    context.fill();
  }
  //check particle postion, check mouse positon, move particle, draw the particle
  update() {
    //check if particle is still within canvas
    if (this.x > canvas.width || this.x < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y > canvas.height || this.y < 0) {
      this.directionY = -this.directionY;
    }

    //collision detection - mouse / particle postions
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < mouse.radius + this.size) {
      if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
        this.x += 10;
      }
      if (mouse.x > this.x && this.x > canvas.width - this.size * 10) {
        this.x -= 10;
      }
      if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
        this.y += 10;
      }
      if (mouse.y > this.y && this.y > canvas.height - this.size * 10) {
        this.y -= 10;
      }
    }
    //move non colided particle
    this.x += this.directionX / 8;
    this.y += this.directionY / 8;
    //draw particle
    this.draw();
  }
}

// create particle array
function init() {
  particlesArray = [];
  let numberOfParticles = (canvas.height * canvas.width) / 20000;
  const num = Math.floor(Math.random() * 10 + 1);
  for (let i = 0; i < numberOfParticles; i++) {
    let size = Math.random() * 3 + 1;
    let x = Math.random() * (innerWidth - size * 2 - size * 2) + size * 2;
    let y = Math.random() * (innerHeight - size * 2 - size * 2) + size * 2;
    let directionX = Math.random() * 5 - 2.5;
    let directionY = Math.random() * 5 - 2.5;
    let color = '#6FA8DC';
    particlesArray.push(
      new Particle(x, y, directionX, directionY, size, color)
    );
  }
}

// check if distance between particles small enough for line draw
function connect() {
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a; b < particlesArray.length; b++) {
      let distance =
        (particlesArray[a].x - particlesArray[b].x) *
          (particlesArray[a].x - particlesArray[b].x) +
        (particlesArray[a].y - particlesArray[b].y) *
          (particlesArray[a].y - particlesArray[b].y);
      if (distance < (canvas.width / 7) * (canvas.height / 7)) {
        opacityValue = 1 - distance / 20000;
        context.strokeStyle = 'rgba(111, 168, 220,' + opacityValue + ')';
        context.lineWidth = 0.5;
        context.beginPath();
        context.moveTo(particlesArray[a].x, particlesArray[a].y);
        context.lineTo(particlesArray[b].x, particlesArray[b].y);
        context.stroke();
      }
    }
  }
}

//animation loop
function animate() {
  requestAnimationFrame(animate);
  context.clearRect(0, 0, innerWidth, innerHeight);

  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
  }
  connect();
}

//resize canvas on window resize
window.addEventListener('resize', function () {
  canvas.width = this.innerWidth;
  canvas.height = this.innerHeight;
  mouse.radius = (canvas.height / 125) * (canvas.width / 125);
  init();
});

// remove last recorded mosue position after leaving window
window.addEventListener('mouseout', function () {
  mouse.x = undefined;
  mouse.y = undefined;
});

init();
animate();
