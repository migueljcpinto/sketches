const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const math = require("canvas-sketch-util/math");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

const sketch = ({ context, width, height }) => {
  const agents = [];

  for (let i = 0; i < 40; i++) {
    const x = random.range(0, width);
    const y = random.range(0, height);

    // A primeira partícula é inicialmente infectada
    const infected = i === 0;
    agents.push(new Agent(x, y, infected));
  }

  return ({ context, width, height }) => {
    context.fillStyle = "rgba(0, 0, 0, 0.05)"; // Fundo escuro com baixa opacidade
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];

      for (let j = i + 1; j < agents.length; j++) {
        const other = agents[j];

        const dist = agent.pos.getDistance(other.pos);

        if (dist > 100) continue;

        context.lineWidth = math.mapRange(dist, 0, 100, 6, 1);

        context.beginPath();
        context.moveTo(agent.pos.x, agent.pos.y);
        context.lineTo(other.pos.x, other.pos.y);

        // Cor baseada no estado de infecção
        context.strokeStyle = agent.infected
          ? "rgba(255, 0, 0, 0.8)"
          : "rgba(255, 255, 255, 0.8)";

        context.stroke();
      }
    }

    agents.forEach((agent) => {
      agent.update(width, height, agents);
      agent.draw(context);
    });
  };
};

canvasSketch(sketch, settings);

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getDistance(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

class Agent {
  constructor(x, y, infected = false) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(random.range(-1, 1), random.range(-1, 1));
    this.radius = random.range(4, 12);
    this.infected = infected;
  }

  update(width, height, agents) {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

    // Wrap particles around the screen
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.y < 0) this.pos.y = height;
    if (this.pos.y > height) this.pos.y = 0;

    // Infect nearby agents
    if (this.infected) {
      agents.forEach((other) => {
        if (
          !other.infected &&
          other !== this &&
          this.pos.getDistance(other.pos) < 20
        ) {
          other.infected = true;
        }
      });
    }
  }

  draw(context) {
    context.save();
    context.translate(this.pos.x, this.pos.y);

    context.lineWidth = 4;

    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);

    // Preenchimento e cor baseados no estado de infecção
    context.fillStyle = this.infected
      ? "rgba(255, 0, 0, 0.8)"
      : "rgba(255, 255, 255, 0.8)";
    context.fill();
    context.stroke();

    context.restore();
  }
}
