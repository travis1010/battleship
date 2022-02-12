import { createGameboard, cpuAI } from './game.js'

let playerGB = createGameboard();
let cpuGB = createGameboard();

let placeShips = true;
let placeShipPos = 'horizontal';

function displayPlayerGameboard(gameboard) {
  const playerBoard = document.getElementById('player-board');
  while(playerBoard.firstChild) {
    playerBoard.removeChild(playerBoard.firstChild);
  }
  gameboard.grid.forEach((row, y) => {
    row.forEach((tile, x) => {
      const newTile = document.createElement('div')
      newTile.classList.add('tile');

      newTile.setAttribute('data-coords', `[${x}, ${y}]`);

      if(tile === 'miss') {
        const missPeg = document.createElement('div');
        missPeg.classList.add('peg');
        newTile.appendChild(missPeg)
      } else if(tile === 'hit') {
        const hitPeg = document.createElement('div');
        hitPeg.classList.add('peg');
        hitPeg.classList.add('hit-peg');
        newTile.classList.add('ship-tile');
        newTile.appendChild(hitPeg)
      }else if(tile === 'sunk') {
        const hitPeg = document.createElement('div');
        hitPeg.classList.add('peg');
        hitPeg.classList.add('hit-peg');
        newTile.classList.add('sunk-tile');
        newTile.appendChild(hitPeg);
      } else if(tile !== false) {
        newTile.classList.add('ship-tile');
      }

      if(y == 9 && x == 0) {
        newTile.classList.add('bottom-left-tile')
      }

      if(y == 9 && x == 9) {
        newTile.classList.add('bottom-right-tile')
      }

      if(placeShips) {
        let length = gameboard.shipsToPlace[0];
        let tileClass = 'hover-tile';

        newTile.setAttribute('onclick', `placePlayerShip([${x}, ${y}])`);
        newTile.classList.add('placing-tile');
        
        if(placeShipPos == 'horizontal') {
          newTile.addEventListener('mouseenter', function (e) {
          if (x + length > 10) {
            length = 10 - x;
            tileClass = 'illegal-tile';
          }
          if (!gameboard.shipFits(length, [x,y], 'horizontal')) {
            tileClass = 'illegal-tile';
          }
          let currentTile = newTile;
          for (let i = 0; i < length; i++) {
            currentTile.classList.add(tileClass);
            currentTile = currentTile.nextSibling;
          }
            
          });
          newTile.addEventListener('mouseleave', function (e) {
            let currentTile = newTile;
            for (let i = 0; i < length; i++) {
              currentTile.classList.remove(tileClass);
              currentTile = currentTile.nextSibling;
            }
          });
        } else if (placeShipPos == 'vertical'){

          newTile.addEventListener('mouseenter', function (e) {
        
            if (y + length > 10) {
              length = 10 - y;
              tileClass = 'illegal-tile';
            }
            if (!gameboard.shipFits(length, [x,y], 'vertical')) {
              tileClass = 'illegal-tile';
            }
            let currentTile = newTile;
            currentTile.classList.add(tileClass);
            for (let i = 1; i < length; i++) {
              currentTile = getNthSibling(currentTile, 10);
              currentTile.classList.add(tileClass);
              
            }
              
            });
            newTile.addEventListener('mouseleave', function (e) {
              let currentTile = newTile;
              currentTile.classList.remove(tileClass);
              for (let i = 1; i < length; i++) {
                currentTile = getNthSibling(currentTile, 10);
                currentTile.classList.remove(tileClass);
                
              }
            });

        }
      }
      playerBoard.appendChild(newTile);
    })
  });

}

function displayCpuGameboard(gameboard) {
  const cpuBoard = document.getElementById('cpu-board');
  while(cpuBoard.firstChild) {
    cpuBoard.removeChild(cpuBoard.firstChild);
  }
  gameboard.grid.forEach((row, y) => {
    row.forEach((tile, x) => {
      const newTile = document.createElement('div')
      newTile.classList.add('tile');
      newTile.classList.add('cpu-tile');

      newTile.setAttribute('data-coords', `[${x}, ${y}]`);

      if(tile === 'miss') {
        const missPeg = document.createElement('div');
        missPeg.classList.add('peg');
        newTile.appendChild(missPeg)
      } else if(tile === 'hit') {
        const hitPeg = document.createElement('div');
        hitPeg.classList.add('peg');
        hitPeg.classList.add('hit-peg');
        newTile.appendChild(hitPeg)
      }else if(tile === 'sunk') {
        const hitPeg = document.createElement('div');
        hitPeg.classList.add('peg');
        hitPeg.classList.add('hit-peg');
        newTile.classList.add('sunk-tile');
        newTile.appendChild(hitPeg);
      } else {
        newTile.setAttribute('onclick', `clickTile([${x}, ${y}])`)
      }

      if(y == 0 && x == 0) {
        newTile.classList.add('top-left-tile')
      }

      if(y == 0 && x == 9) {
        newTile.classList.add('top-right-tile')
      }

      cpuBoard.appendChild(newTile);
    })
  });
}

function getNthSibling(element, n) {
  let currentSibling = element;
  for (let i = 0; i < n; i++) {
    currentSibling = currentSibling.nextSibling;
  }
  return currentSibling;
}

window.clickTile = (coords) => {
  const hit = cpuGB.receiveAttack(coords);
  displayCpuGameboard(cpuGB)
  updateScore();
  if (hit) {
    if (cpuGB.allShipsSunk()) {
      console.log('you win!!!!')
      gameOver('You win!');
    }
    return;
  }
  /*
  let cpuTurn = true;
  gameOver("Opponent's turn");
  while (cpuTurn) {
    setTimeout(function() {
      console.log('delay successful');
      cpuTurn = cpuAI.takeShot(playerGB);
      console.log(cpuTurn);
      displayPlayerGameboard(playerGB);
      updateScore();
      if (playerGB.allShipsSunk()) {
        console.log('you LOSE!!!!');
        gameOver('You lose!');
        return;
      }
    }, 1000);

  }
  */

  let cpuTurn = true;

  document.getElementById('cpu-turn-banner').style.display = 'flex';

  (async () => {
    while (await new Promise(resolve => setTimeout(() => resolve(cpuTurn), 500))) {
      cpuTurn = cpuAI.takeShot(playerGB)
      displayPlayerGameboard(playerGB);
      updateScore();
      if (playerGB.allShipsSunk()) {
        document.getElementById('cpu-turn-banner').style.display = 'none';
        gameOver('You lose!');
        return;
      }
      
    }
    document.getElementById('cpu-turn-banner').style.display = 'none';
  })();


  
  displayPlayerGameboard(playerGB);
}

window.placePlayerShip = (coords) => {
  const length = playerGB.shipsToPlace[0]
  if (playerGB.placeShip(length, coords, placeShipPos)) {
    playerGB.shipsToPlace.shift();
    if(playerGB.shipsToPlace.length == 0) {
      placeShips = false;
      document.getElementById('place-ships-banner').style.display = 'none';
    }
    displayPlayerGameboard(playerGB);
  }
  updateScore();
}

document.addEventListener('keydown', event => {
  if (event.code === 'Space') {
    if (placeShipPos === 'horizontal') {
      placeShipPos = 'vertical'
    } else {
      placeShipPos = 'horizontal';
    }
    displayPlayerGameboard(playerGB);
  }
})

function gameOver(resultMsg) {
  document.getElementById('game-over-banner').style.display = 'flex';
  document.getElementById('result-message').textContent = resultMsg;
}

window.newGame = () => {
  playerGB = createGameboard();
  cpuGB = createGameboard();
  placeShips = true;
  document.getElementById('game-over-banner').style.display = 'none';
  document.getElementById('place-ships-banner').style.display = 'flex';
  displayPlayerGameboard(playerGB);

  cpuAI.placeShips(cpuGB);
  displayCpuGameboard(cpuGB);
}

function updateScore() {

  if (!placeShips) {
    const cpuScoreboard = document.getElementById('cpu-score');
    while(cpuScoreboard.firstChild) {
    cpuScoreboard.removeChild(cpuScoreboard.firstChild)
    }

    cpuGB.ships.forEach((ship) => {
      cpuScoreboard.appendChild(drawShip(ship));
    });
  }
  

  const playerScoreboard = document.getElementById('player-score');
  while(playerScoreboard.firstChild) {
    playerScoreboard.removeChild(playerScoreboard.firstChild)
  }
  
  playerGB.ships.forEach((ship) => {
    playerScoreboard.appendChild(drawShip(ship));
  });

}

function drawShip(ship) {
  const newShip = document.createElement('div');
  newShip.classList.add('mini-ship')
  for (let i = 0; i < ship.length; i++) {
    const segment = document.createElement('div');
    segment.classList.add('ship-segment')
    if (ship.sunk) {
      segment.classList.add('sunk-ship-segment')
    }
    newShip.appendChild(segment)
  }
  return newShip;
}

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

displayPlayerGameboard(playerGB);

cpuAI.placeShips(cpuGB);
displayCpuGameboard(cpuGB);






