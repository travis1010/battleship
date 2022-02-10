import { createShip, createGameboard, shipCounter } from './game.js'


//createShip tests ----------------------------------------------------------------------------------
test('createShip returns ship object with length, sunk, and hits props', () => {
  expect(createShip(4)).toMatchObject({ length: 4, sunk: false, hits: [false, false, false, false]});
});


test('ship has a hit function that takes number and marks as hit', () => {
  const newShip = createShip(4);
  newShip.hit(3);
  expect(newShip).toMatchObject({ length: 4, sunk: false, hits: [false, false, false, true] });
});

test('createShip throws error if length is not 2 thru 5', () => {
  expect(() => createShip(1)).toThrow(Error);
});

test('createShip throws error if length is not 1 thru 4', () => {
  expect(() => createShip(6)).toThrow(Error);
});

test('hit function throws error if index given is out of range for that ship', () => {
  const newShip = createShip(2);
  expect(() => newShip.hit(3)).toThrow(Error);
});

test('hit function throws error if index given is out of range for that ship', () => {
  const newShip = createShip(2);
  expect(() => newShip.hit(-1)).toThrow(Error);
});

test('ship.isSunk() function returns true if ship is sunk.', () => {
  const newShip = createShip(2);
  newShip.hit(0);
  newShip.hit(1);
  expect(newShip.isSunk()).toBe(true);
});

test('ship.isSunk() function returns true if ship is sunk.', () => {
  const newShip = createShip(4);
  newShip.hit(0);
  newShip.hit(1);
  newShip.hit(3);
  newShip.hit(2);
  expect(newShip.isSunk()).toBe(true);
});


test('ship.isSunk() function changes ships "sunk" property', () => {
  const newShip = createShip(2);
  newShip.hit(0);
  newShip.hit(1);
  newShip.isSunk()
  expect(newShip.sunk).toBe(true);
});

test('ship.isSunk() function returns false if ship is not sunk.', () => {
  const newShip = createShip(3);
  newShip.hit(0);
  newShip.hit(1);
  expect(newShip.isSunk()).toBe(false);
});


test('ship.isSunk() function doesnt changes ships "sunk" property if it wasnt sunk', () => {
  const newShip = createShip(3);
  newShip.hit(0);
  newShip.hit(1);
  newShip.isSunk()
  expect(newShip.sunk).toBe(false);
});


//createGameboard tests --------------------------------------------------------------------------------
test('gameboard has 10x10 array', () => {
  const newGameboard = createGameboard();
  expect(newGameboard.grid).toEqual([
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false]
  ]);
});

test('placeShip(ship, coords) will place ship horizontally on grid', () => {
  const newGameboard = createGameboard();
  newGameboard.placeShip(4, [5,5])
  const ID = shipCounter;
  expect(newGameboard.grid).toEqual([
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, ID   , ID   , ID   , ID   , false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false]
  ]);
});

test('placeShip(ship, coords, "vertical") will place ship vertically on grid', () => {
  const newGameboard = createGameboard();
  newGameboard.placeShip(3, [5,5], 'vertical')
  const ID = shipCounter;
  expect(newGameboard.grid).toEqual([
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, ID   , false, false, false, false],
    [false, false, false, false, false, ID   , false, false, false, false],
    [false, false, false, false, false, ID   , false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false]
  ]);
});

test('placeShip throws error if ship does not fit', () => {
  const newGameboard = createGameboard();
  expect(() => newGameboard.placeShip(4, [7,0])).toThrow(Error);
});

test('placeShip throws error if ship overlaps another ship', () => {
  const newGameboard = createGameboard();
  newGameboard.placeShip(4, [5,5], 'vertical')
  expect(() => newGameboard.placeShip(1, [5,7])).toThrow(Error);
});

test('receiveAttack function records missed shots', () => {
  const newGameboard = createGameboard();
  newGameboard.receiveAttack([4,4]);
  newGameboard.receiveAttack([5,4]);
  newGameboard.receiveAttack([7,4]);
  expect(newGameboard.misses).toEqual([[4, 4], [5, 4], [7, 4]])
});

test('getShip function returns the ship', () => {
  const gb = createGameboard();
  gb.placeShip(4, [4,4], 'vertical');
  const ID = shipCounter;
  gb.getShip(ID).hits[3] = true;
  expect(gb.getShip(ID)).toMatchObject(
    { length: 4, sunk: false, hits: [false, false, false, true] }
    );
});

test('receiveAttack function records hit ship correctly', () => {
  const gb = createGameboard();
  gb.placeShip(3, [4,4]);
  gb.receiveAttack([5,4]);
  const ID = shipCounter;
  expect(gb.getShip(ID).hits).toEqual([false, true, false])
})

test('receiveAttack function records hit ship correctly (vertical ship)', () => {
  const gb = createGameboard();
  gb.placeShip(3, [4,4], 'vertical');
  gb.receiveAttack([4,5]);
  const ID = shipCounter;
  expect(gb.getShip(ID).hits).toEqual([false, true, false])
})



test('allShipsSunk function returns true if all ships are sunk', () => {
  const gb = createGameboard();
  gb.placeShip(4, [3,3]);
  gb.receiveAttack([3,3]);
  gb.receiveAttack([4,3]);
  gb.receiveAttack([5,3]);
  gb.receiveAttack([6,3]);
  expect(gb.allShipsSunk()).toBe(true);
})

test('allShipsSunk function returns false if all ships are NOT sunk', () => {
  const gb = createGameboard();
  gb.placeShip(4, [3,3]);
  gb.receiveAttack([3,3]);
  gb.receiveAttack([5,3]);
  gb.receiveAttack([6,3]);
  expect(gb.allShipsSunk()).toBe(false);
})

test('allShipsSunk function returns true if all ships are sunk', () => {
  const gb = createGameboard();
  gb.placeShip(4, [3,3]);
  gb.placeShip(2, [0,0], 'vertical');
  gb.receiveAttack([0,0]);
  gb.receiveAttack([0,1]);
  gb.receiveAttack([3,3]);
  gb.receiveAttack([4,3]);
  gb.receiveAttack([5,3]);
  gb.receiveAttack([6,3]);
  expect(gb.allShipsSunk()).toBe(true);
})

test('allShipsSunk function returns false if all ships are NOT sunk', () => {
  const gb = createGameboard();
  gb.placeShip(4, [3,3]);
  gb.placeShip(2, [0,0], 'vertical');
  gb.receiveAttack([0,0]);
  gb.receiveAttack([0,1]);
  gb.receiveAttack([3,3]);
  gb.receiveAttack([5,3]);
  gb.receiveAttack([6,3]);
  expect(gb.allShipsSunk()).toBe(false);
})