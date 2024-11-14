const grid = document.getElementById("gridContainer");
const startButton = document.getElementsByClassName("start-button")[0];

const rows = 27;
const cols = 60;
let map = [];
const duration = 200;
let time = 1;
const directions = [
    [0, 1], [1, 0], [0, -1], [-1, 0],
    [1, 1], [-1, 1], [1, -1], [-1, -1]
];

let onModeChange = () => {
  document.querySelector("body").classList.toggle("dark-mode");
  document.querySelector(".mode-button").classList.toggle("mode-light");
};

const createGrid = () => {
  for (let i = 0; i < rows; i++) {
      let row = [];
    for (let j = 0; j < cols; j++) {
      const div = document.createElement("div");
      div.classList.add("grid-item");
      div.dataset.row = i;
      div.dataset.col = j;
      if(Math.random() > 0.9)
          div.classList.add("alive");
      grid.appendChild(div);
      row.push(div.classList.contains("alive") ? '0' : ' ');
    }
    map.push(row);
  }
};

const getNeighbors = (x, y) => {
    let count = 0;
    for (let [dx, dy] of directions) {
        const newX = (x + dx + rows) % rows;
        const newY = (y + dy + cols) % cols;
        if (map[newX][newY] === '0') count++;
    }
    return count;
};

const update = () => {
    let nextMap = map.map((row) => [...row]);
    let population = 0;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const neighbors = getNeighbors(i, j);
            if (map[i][j] === '0') {
                if (neighbors < 2 || neighbors > 3) {
                    nextMap[i][j] = ' ';
                } else {
                    population++;
                }
            } else {
                if (neighbors === 3) {
                    nextMap[i][j] = '0';
                }
                if (nextMap[i][j] === '0') population++;
            }
        }
    }

    map = nextMap;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cell = getCell(i, j);
            cell.classList.toggle("alive", map[i][j] === '0');
        }
    }
    time++;

    if (population > 0 && time <= duration) {
        setTimeout(update, 50);
    }
}

const getCell = (row, col) => {
    return document.querySelector(`.grid-item[data-row="${row}"][data-col="${col}"]`);
}

document
  .getElementsByClassName("mode-button")[0]
  .addEventListener("click", onModeChange);

startButton.addEventListener("click", () => {
    time = 1;
    map = [];
    grid.innerHTML = "";
  document.querySelector(".start-button").classList.toggle("start");
  createGrid();
  update();
});


