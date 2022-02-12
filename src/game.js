let shipCounter = 0;

function createShip(length, coords, position) {
  shipCounter++;
  if (length < 2 || length > 5) {
    throw new Error("Error: Invalid ship length")
  }
  const hits = []
  for(let i = 0; i < length; i++) {
    hits.push(false);
  }
  return {
    length: length,
    sunk: false,
    hits: hits,
    id: shipCounter,
    coords: coords,
    position,

    hit(index) {
      if (index < 0 || index > length - 1) {
        throw new Error('Error: Invalid hit index for ship!')
      }
      hits[index] = true;
      this.isSunk();
    },

    isSunk() {
      if (hits.every((hit) => hit === true)) {
        this.sunk = true;
        return true;
      } else {
        return false;
      }
    }
  }
}


function createGameboard() {
  const grid = []
  for (let i = 0; i < 10; i++) {
    const row = []
    for (let j = 0; j < 10; j++) {
      row.push(false);
    }
    grid.push(row);
  }

  return {
    grid: grid,
    misses: [],
    ships: [],
    shipsToPlace: [5, 4, 3, 3, 2, 2],
    
    placeShip(length, coords, position = 'horizontal') {
      const ship = createShip(length, coords, position);
      if(!this.shipFits(ship.length, coords, position)) {
        return false;
      }

      const x = coords[0];
      const y = coords[1];
      if (position === 'horizontal') {
        for (let i = 0; i < ship.length; i++) {
          grid[y][x + i] = ship.id;
        }
      } else if (position === 'vertical') {
        for (let i = 0; i < ship.length; i++) {
          grid[y + i][x] = ship.id;
        }
      }
      this.ships.push(ship);
      return true;
    },

    receiveAttack(coords) {
      const x = coords[0];
      const y = coords[1];

      if (x < 0 || x > 9 || y < 0 || y > 9) {
        throw new Error('Error: Invalid attack coordinates!');
      }

      if(grid[y][x] === false) {
        grid[y][x] = 'miss';
        this.misses.push(coords)
        console.log('miss');
        return false
      } else {
        const ship = this.getShip(grid[y][x]);
        ship.hit(this.getHitIndex(ship, coords));
        grid[y][x] = 'hit';
        if (ship.isSunk()) {
          this.markShipSunk(ship)
        }
        console.log('hit');
        return true
      }
    },

    shipFits(length, coords, position) {
      const x = coords[0];
      const y = coords[1];
      if (position === 'horizontal') {
        if(x + length > 10) {
          return false;
        }
        for (let i = 0; i < length; i++) {
          if (grid[y][x + i] !== false) {
            return false;
          }
        }
      } else if (position === 'vertical') {
        if(y + length > 10) {
          return false;
        }
        for (let i = 0; i < length; i++) {
          if (grid[y + i][x] !== false) {
            return false;
          }
        }
      } else {
        throw new Error('bad position given')
      }
      return true
    },

    getShip(id) {
      for (let i = 0; i < this.ships.length; i ++) {
        if (this.ships[i].id === id) {
          return this.ships[i];
        }
      }
    },

    allShipsSunk() {
      return this.ships.every((ship) => ship.sunk)
    },

    markShipSunk(ship) {
      const x = ship.coords[0];
      const y = ship.coords[1];
      if (ship.position == 'horizontal') {
        for (let i = 0; i < ship.length; i++) {
          grid[y][x + i] = 'sunk';
        }
      } else {
        for (let i = 0; i < ship.length; i++) {
          grid[y + i][x] = 'sunk';
        }
      }
    },
    
    getHitIndex(ship, coords) {
      const hitX = coords[0];
      const hitY = coords[1];
      const shipX = ship.coords[0];
      const shipY = ship.coords[1];

      if(ship.position === 'horizontal') {
        return hitX - shipX;
      } else if(ship.position === 'vertical') {
        return hitY - shipY;
      } else {
        throw new Error('Invalid Ship Position!')
      }
    },

    isHittableTile(coords) {
      const x = coords[0];
      const y = coords[1];

      if(x > 9 || y > 9 || x < 0 || y < 0) {
        return false;
      }

      const tile = this.grid[y][x];

      if(tile === 'hit' || tile === 'miss' || tile === 'sunk') {
        return false
      } else {
        console.log(coords, 'was deemed hittable for AI')
        return true;
      }
      
    }

  }
}


const cpuAI = {
  placeShips(gameboard) {
    gameboard.shipsToPlace.forEach((length) => {
      let position = Math.round(Math.random()) == 1 ? 'horizontal' : 'vertical';
      let x = Math.floor(Math.random() * 10);
      let y = Math.floor(Math.random() * 10);
      while(!gameboard.placeShip(length, [x,y], position)) {
        position = Math.round(Math.random()) == 1 ? 'horizontal' : 'vertical';
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
      }
    })

  },

  takeShot(gameboard) {
    let nextToHit = this.findNextToHit(gameboard);
    if (nextToHit) {
      return gameboard.receiveAttack(nextToHit);
    }
    
    return gameboard.receiveAttack(this.getRandom(gameboard));
  },

  findNextToHit(gameboard) {
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        if (gameboard.grid[y][x] === 'hit') {
          if(gameboard.isHittableTile([x + 1, y])) {
            return [x + 1, y];
          } else if(gameboard.isHittableTile([x - 1, y])) {
            return [x - 1, y];
          } else if(gameboard.isHittableTile([x, y - 1])) {
            return [x, y - 1];
          } else if(gameboard.isHittableTile([x, y + 1])) {
            return [x, y + 1];
          }
        }
      }
    }
    return false
  },

  getRandom(gameboard) {
    let x = Math.floor(Math.random() * 10);
    let y = Math.floor(Math.random() * 10);
    while(gameboard.grid[y][x] === 'miss' || gameboard.grid[y][x] === 'hit' || 
      gameboard.grid[y][x] === 'sunk') {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
    }
    return [x, y];
  }
 
}



export { createShip, createGameboard, shipCounter, cpuAI };

