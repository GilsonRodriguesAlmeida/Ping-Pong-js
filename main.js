//variaveis
const canvasElemento = document.querySelector("canvas"),
  canvasContext = canvasElemento.getContext("2d"),
  gapX = 10;

const mouse = { x: 0, y: 0}

const field = {
  w: window.innerWidth,
  h: window.innerHeight,
  draw: function () {
    canvasContext.fillStyle = "#286047";
    canvasContext.fillRect(0, 0, this.w, this.h);
  },
};

const line = {
  w: 15,
  h: field.h,
  draw: function () {
    canvasContext.fillStyle = "#ffffff";
    canvasContext.fillRect(field.w / 2 - this.w / 2, 0, this.w, this.h);
  },
};

const leftPaddle = {
  x: gapX,
  y: 0,
  w: line.w,
  h: 200,
  _move: function() {
    this.y = mouse.y - this.h / 2;
  },

  draw: function () {
    canvasContext.fillStyle = "#ffffff";
    canvasContext.fillRect(this.x, this.y, this.w, this.h);

    this._move();
  },
};

const rightPaddle = {
  x: field.w - line.w - gapX,
  y: 100,
  w: line.w,
  h: 200,
  speed: 5,
  _move: function() {

    if(this.y + this.h / 2 < ball.y + ball.r) {
      this.y += this.speed;
    } else {
      this.y -= this.speed;
    }
  },
  speedUp: function() {
    this.speed += 2
  },
  draw: function () {
    canvasContext.fillStyle = "#ffffff";
    canvasContext.fillRect(this.x, this.y, this.w, this.h);

    this._move();
  },
};

const score = {
  human: 0,
  computer: 0,
  increaseHuman: function() {
    this.human++;
  },
  increaseComputer: function() {
    this.computer++;
  },
  draw: function () {
    canvasContext.font = "bold 72px Arial";
    canvasContext.textAlign = "center";
    canvasContext.textBaseline = "top";
    canvasContext.fillStyle = "#01341D";
    canvasContext.fillText(this.human, field.w / 4, 50);
    canvasContext.fillText(this.computer, field.w / 4 + field.w / 2, 50);
  },
};

const ball = {
  x: 0,
  y: 0,
  r: 20,
  speed: 5,
  directionX: 1,
  directionY: 1,
  _calcPosition: function() {
    // verifica se o jogador 1 fez um ponto (x > largura do campo)
    if(this.x > field.w - this.r - rightPaddle.w - gapX) {
      // verifica se a raquete direita está na posição y da bola
      if(this.y + this.r > rightPaddle.y && this.y - this.r < rightPaddle.y + rightPaddle.h) {
        // rebate a bola invertendo o sinal de X
        this._reverseX()
      } else {
        //pontuar jogador 1
        score.increaseHuman();
        this._pointUp();
      }
    }
    // verifica se o jogador 2 fez um ponto (x < 0)
    if(this.x < this.r + leftPaddle.w + gapX) {
      // verifica se a raquete esquerda esta na posição y da bola
      if(this.y + this.r > leftPaddle.y && this.y - this.r < leftPaddle.y + leftPaddle.h) {
        //rebate a bola invertendo o sinal de X
        this._reverseX();
      } else {
        score.increaseComputer();
        this._pointUp();
      }
    }

    if(
      (this.y -this.r < 0 && this.directionY < 0) ||
      (this.y > field.h -this.r && this.directionY > 0)
    ) {
      this._reverseY();
    }
  },
  _reverseX: function() {
    this.directionX *= -1;
  },
  _reverseY: function() {
    this.directionY *= -1;
  },
  _speedUp: function() {
    this.speed += 1;
  },
  _pointUp: function() {
    this._speedUp();
    rightPaddle.speedUp();

    this.x = field.w / 2;
    this.y = field.h / 2;
  },
  _move: function() {
    this.x += this.directionX * this.speed;
    this.y += this.directionY * this.speed;
  },

  draw: function () {
    canvasContext.fillStyle = "#ffffff";
    canvasContext.beginPath();
    canvasContext.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
    canvasContext.fill();

    this._move();
    this._calcPosition();
  },
};

function setup() {
  canvasElemento.width = canvasContext.width = field.w;
  canvasElemento.height = canvasContext.height = field.h;
}

function draw() {
  //Campo
  field.draw();
  //linhas
  line.draw();
  //Raquete
  leftPaddle.draw();
  rightPaddle.draw();
  //Placar
  score.draw();
  //Bola
  ball.draw();
}

window.animateFrame = (function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            return window.setTimeout(callback, 1000 / 60)
        }
    )
})()

function main() {
    animateFrame(main)
    draw()
}

setup();
main();

canvasElemento.addEventListener('mousemove', function (e) {
  mouse.x = e.pageX;
  mouse.y = e.pageY;
})