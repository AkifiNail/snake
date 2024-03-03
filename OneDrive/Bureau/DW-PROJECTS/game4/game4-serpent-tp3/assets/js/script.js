//   ___ _  _   _   _  _____
//  / __| \| | /_\ | |/ / __|
//  \__ \ .` |/ _ \| ' <| _|
//  |___/_|\_/_/ \_\_|\_\___|

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

let survivantMode = false;

function getRandomColor() {
  const red = getRandomInt(256);
  const blue = getRandomInt(256);
  const green = getRandomInt(256);
  return "rgb(" + red + "," + green + "," + blue + ")";
}

function getRandomInt2(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const oppositeDirections = [2, 3, 0, 1];
let scoreContent = document.querySelector(".scorecontent");

let canvas = document.getElementById("terrain");
let ctx = canvas.getContext("2d");
let tab = [
  { di: 0, dj: -1 },
  { di: 1, dj: 0 },
  { di: 0, dj: 1 },
  { di: -1, dj: 0 },
];

class Terrain {
  constructor(largeur, hauteur) {
    this.largeur = largeur;
    this.hauteur = hauteur;
    this.sol = new Array(largeur);

    for (let i = 0; i < largeur; i++) {
      this.sol[i] = new Array(hauteur);
      for (let j = 0; j < hauteur; j++) {
        this.sol[i][j] = 1;
      }
    }

    //bordure
    for (let j = 0; j < hauteur; j++) {
      this.sol[0][j] = 0;
      this.sol[largeur - 1][j] = 0;
    }
    for (let i = 0; i < largeur; i++) {
      this.sol[i][hauteur - 1] = 0;
      this.sol[i][0] = 0;
    }

    let rocher = 30;
    let rocherValue = 2;

    console.log(survivantMode);

    console.log(rocher);

    for (let k = 0; k < rocher; k++) {
      let i = getRandomInt2(1, largeur - 1);
      let j = getRandomInt2(1, hauteur - 1);
      this.sol[i][j] = rocherValue;
    }
  }

  draw(ctx) {
    for (let i = 0; i < this.largeur; i++) {
      for (let j = 0; j < this.hauteur; j++) {
        if (this.sol[i][j] === 0) {
          ctx.fillStyle = "black";
        } else if (this.sol[i][j] === 1) {
          ctx.fillStyle = "white";
        } else if (this.sol[i][j] === 2) {
          ctx.fillStyle = "grey";
        }
        let x = i * 20;
        let y = j * 20;
        ctx.fillRect(x, y, 20, 20);
      }
    }
  }
  read(i, j) {
    if (i >= 0 && i < this.largeur && j >= 0 && j < this.hauteur) {
      return this.sol[i][j];
    } else {
      return undefined;
    }
  }

  write(i, j, value) {
    this.sol[i][j] = value;
  }
}

const terrain = new Terrain(20, 20);

class Anneau {
  constructor(i, j, couleur) {
    this.i = i;
    this.j = j;
    this.couleur = couleur;
  }

  draw() {
    ctx.fillStyle = this.couleur;
    let x = this.i * 20;
    let y = this.j * 20;
    ctx.fillRect(x, y, 20, 20);
  }

  move(d) {
    this.i += tab[d].di;
    this.j += tab[d].dj;

    if (this === serpent1) {
      if (this.i < 0) {
        console.log("perdu");
      } else if (this.i >= terrain.largeur) {
        console.log("perdu");
      }
      if (this.j < 0) {
        console.log("perdu");
      } else if (this.j >= terrain.hauteur) {
        console.log("perdu");
      }
    } else {
      if (this.i < 0) {
        this.i = terrain.largeur - 1;
      } else if (this.i >= terrain.largeur) {
        this.i = 0;
      }
      if (this.j < 0) {
        this.j = terrain.hauteur - 1;
      } else if (this.j >= terrain.hauteur) {
        this.j = 0;
      }
    }
  }

  copie(a) {
    this.i = a.i;
    this.j = a.j;
  }

  read(direction) {
    let nextI = this.i + tab[direction].di;
    let nextJ = this.j + tab[direction].dj;
    if (
      nextI < 0 ||
      nextI >= terrain.largeur ||
      nextJ < 0 ||
      nextJ >= terrain.hauteur
    ) {
      return undefined;
    }
    return terrain.read(nextI, nextJ);
  }
}

class Serpent {
  constructor(longueur, i, j, direction) {
    this.longueur = longueur;
    this.i = i;
    this.j = j;
    this.direction = direction;
    this.anneaux = [];
    this.anneaux.push(new Anneau(i, j, "red"));
    for (let k = 1; k < this.longueur; k++) {
      this.anneaux.push(new Anneau(i - k, j, "green"));
    }
  }

  draw() {
    for (let anneau of this.anneaux) {
      anneau.draw();
    }
  }

  move() {
    let serpentBodyValue = 2;
    let serpentHeadValue = 2;
    let serpentEndValue = 1;
    let foodValue = 3;
    for (let n = this.longueur - 1; n > 0; n--) {
      if (this.anneaux[n]) {
        let serpentBody = this.anneaux[n].copie(
          new Anneau(
            this.anneaux[n - 1].i,
            this.anneaux[n - 1].j,
            this.anneaux[n].couleur
          )
        );
        serpentBody = serpentBodyValue;
      }
    }
    let head = this.anneaux[0];
    let nextCellValue = head.read(this.direction);
    let last = this.anneaux[this.anneaux.length - 1];

    if (
      last.i == 0 ||
      last.i == terrain.largeur - 1 ||
      last.j == 0 ||
      last.j == terrain.hauteur - 1
    ) {
      serpentEndValue = 0;
    }

    let randomNumber = getRandomInt(10);
    let newDirection = getRandomInt(4);

    terrain.write(head.i, head.j, serpentHeadValue);
    terrain.write(last.i, last.j, serpentEndValue);
    terrain.write(food.i, food.j, foodValue);

    if (nextCellValue === 3) {
      this.extend();
      food.place();
      food.draw();
      this.longueur++;
      terrain.write(food.i, food.j, 3);
      score++;
      scoreContent.textContent = score;
    }

    if (this === serpent1 && nextCellValue === 2) {
      console.log("ok");
    }

    if (this === serpent1) {
      head.move(this.direction);
      return;
    }

    if (
      nextCellValue === 1 ||
      nextCellValue === 0 ||
      nextCellValue === undefined
    ) {
      head.move(this.direction);
    }

    if (randomNumber < 2 && nextCellValue !== 2) {
      while (newDirection === oppositeDirections[this.direction]) {
        newDirection = getRandomInt(4);
      }
      this.direction = newDirection;
    }

    if (nextCellValue === 0) {
      // console.log("mur");
    } else if (nextCellValue === 1) {
      // console.log("air");
    } else if (nextCellValue === 2) {
      head.move((this.direction + 1) % 4);
      // console.log("roche");
    }
  }

  changeDirection(newDirection) {
    if (newDirection !== oppositeDirections[this.direction]) {
      this.direction = newDirection;
    }
  }

  extend() {
    let last = this.anneaux[this.anneaux.length - 1];
    this.anneaux.push(new Anneau(last.i, last.j, "yellow"));
    this.longueur++;
  }
}

let score = 0;

class Food {
  constructor(i, j) {
    this.i = i;
    this.j = j;
  }

  draw() {
    ctx.fillStyle = "blue";
    let x = this.i * 20;
    let y = this.j * 20;
    ctx.fillRect(x, y, 20, 20);
  }
  place() {
    let validLocation = false;
    while (!validLocation) {
      this.i = getRandomInt(terrain.largeur);
      this.j = getRandomInt(terrain.hauteur);
      if (terrain.read(this.i, this.j) === 1) {
        validLocation = true;
      }
    }
  }
}

// Création de plusieurs serpents
let serpent1 = new Serpent(5, 10, 10, 0);
let serpent2 = new Serpent(7, 15, 5, 2);
let serpent3 = new Serpent(9, 5, 15, 1);

function drawSnake() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  terrain.draw(ctx);
  serpent1.move();
  serpent2.move();
  serpent3.move();
  serpent1.draw();
  serpent2.draw();
  serpent3.draw();
  key();
}

let food = new Food(5, 5);

function drawSnake2() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  terrain.draw(ctx);
  serpent1.move();
  serpent1.draw();
  food.draw();
  key();
}

function key() {
  document.addEventListener("keydown", function (e) {
    switch (e.key) {
      case "ArrowUp":
        serpent1.changeDirection(0);
        break;
      case "ArrowRight":
        serpent1.changeDirection(1);
        break;
      case "ArrowDown":
        serpent1.changeDirection(2);
        break;
      case "ArrowLeft":
        serpent1.changeDirection(3);
        break;
    }
  });
}

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen().catch((err) => {
      alert("Erreur lors du passage en mode plein écran");
    });
  } else {
    document.exitFullscreen();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  let classique = document.querySelector(".classique");
  let survivant = document.querySelector(".survivant");

  survivant.addEventListener("click", function () {
    setInterval(drawSnake, 100);
  });

  classique.addEventListener("click", function () {
    // survivantMode = true;
    setInterval(drawSnake2, 100);
  });
});
