class Board {
  constructor(size) {
    this.size = size;
    this.grid = [];
    this.nextGrid = [];
    this.offsets = [
      [-1, -1],
      [0, -1],
      [1, -1],
      [-1, 0],
      [1, 0],
      [-1, 1],
      [0, 1],
      [1, 1]
    ];
    this.color = getRandColor();
    this.bgColor = getRandColor();

    document.body.style['background-color'] = this.bgColor;
  }

  createBoard() {
    for (let y = 0; y < this.size; y++) {
      this.grid[y] = [];
      for (let x = 0; x < this.size; x++) {
        this.grid[y].push(
          Math.random() > 0.81
        );
      }
    }

    // console.log(this.grid)
  }

  copyAndReset() {
    // console.log(this.grid)
    // console.log(this.nextGrid)
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        this.grid[y][x] = this.nextGrid[y][x];
        this.nextGrid[y][x] = false;
      }
    }
  }

  ruleOne(neighbours) {
    return neighbours.filter(n => n).length === 3;
  }

  ruleTwo(neighbours) {
    const count = neighbours.filter(n => n).length;
    return (count === 2 || count === 3); 
  }

  getNeighbours(x, y) {
    const neighbours = [];
    this.offsets.map((offset) => {
      const neighbour = this.getNeighbour(x + offset[0], y + offset[1]);
      // console.log(neighbour)
      if (neighbour != null)
        neighbours.push(neighbour);
    });
    return neighbours;
  }

  getNeighbour(x, y) {
    let _x = x, _y = y;
    if (x < 0) _x = this.grid.length - 1;
    if (x > this.grid.length - 1) _x = 0;
    if (y < 0) _y = this.grid.length - 1;
    if (y > this.grid.length - 1) _y = 0;

    // if (x < 0 || y < 0 || x > this.grid.length - 1 || y > this.grid.length - 1)
    //   return null;

    return this.grid[_y][_x];
  }

  getNewValue(x, y) {
    const neighbours = this.getNeighbours(x, y);
    
    if (!this.grid[y][x]) {
      return this.ruleOne(neighbours);
    } 
    
    return this.ruleTwo(neighbours);
  }

  update() {
    for (let y = 0; y < this.size; y++) {
      this.nextGrid[y] = [];
      for (let x = 0; x < this.size; x++) {
        this.nextGrid[y].push(
          this.getNewValue(x, y)
        );
      }
    }
    this.copyAndReset();
  }

  render(ctx, size) {
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        ctx.fillStyle = this.grid[y][x] ? this.color : this.bgColor;
        ctx.fillRect(x * size, y * size, size, size);
      }
    }
  }
}

function getRandColor() {
  const r = getRandBetween(0, 255);
  const g = getRandBetween(0, 255);
  const b = getRandBetween(0, 255);

  return `rgb(${r}, ${g}, ${b})`;
}

function getRandBetween(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function getCanvasSize() {
  return window.innerHeight > window.innerWidth ?
    window.innerWidth : window.innerHeight;
}

const SIZE = 100;
const board = new Board(SIZE);
board.createBoard();

const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const W = canvas.width = getCanvasSize();
const H = canvas.height = getCanvasSize();
const cellSize = W / SIZE;
// board.render(ctx, cellSize);
// board.update();

setInterval(() => {
  // ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, W, H);
  board.update();
  board.render(ctx, cellSize);
}, 1000 / 30);