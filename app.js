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
  }

  createBoard() {
    for (let y = 0; y < this.size; y++) {
      this.grid[y] = [];
      for (let x = 0; x < this.size; x++) {
        this.grid[y].push(
          Math.random() > 0.94
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
    return neighbours.filter(n => n.isAlive).length === 3;
  }

  ruleTwo(neighbours) {
    const count = neighbours.filter(n => n.isAlive).length;
    return (count === 2 || count === 3); 
  }

  getNeighbours(x, y) {
    const neighbours = [];
    this.offsets.map((offset) => {
      const neighbour = this.getNeighbour(this.grid, x + offset[0], y + offset[1]);
      if (neighbour)
        neighbours.push(neighbour);
    });

    return neighbours;
  }

  getNeighbour(x, y) {
    if (x < 0 || y < 0 || x > this.grid.length - 1 || y > this.grid.length - 1)
      return null;
   
    return this.grid[y][x];
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
        ctx.fillStyle = this.grid[y][x] ? '#000' : '#fff';
        ctx.fillRect(x * size, y * size, size, size);
      }
    }
  }
}

const SIZE = 10;
const board = new Board(SIZE);
board.createBoard();

const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;
const cellSize = W / SIZE;
// board.update();

setInterval(() => {
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, W, H);
  board.update();
  board.render(ctx, cellSize);
}, 1000 / 30);