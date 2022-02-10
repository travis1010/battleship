/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/game.js":
/*!*********************!*\
  !*** ./src/game.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"createShip\": () => (/* binding */ createShip),\n/* harmony export */   \"createGameboard\": () => (/* binding */ createGameboard),\n/* harmony export */   \"shipCounter\": () => (/* binding */ shipCounter),\n/* harmony export */   \"cpuAI\": () => (/* binding */ cpuAI)\n/* harmony export */ });\nlet shipCounter = 0;\r\n\r\nfunction createShip(length, coords, position) {\r\n  shipCounter++;\r\n  if (length < 2 || length > 5) {\r\n    throw new Error(\"Error: Invalid ship length\")\r\n  }\r\n  const hits = []\r\n  for(let i = 0; i < length; i++) {\r\n    hits.push(false);\r\n  }\r\n  return {\r\n    length: length,\r\n    sunk: false,\r\n    hits: hits,\r\n    id: shipCounter,\r\n    coords: coords,\r\n    position,\r\n\r\n    hit(index) {\r\n      if (index < 0 || index > length - 1) {\r\n        throw new Error('Error: Invalid hit index for ship!')\r\n      }\r\n      hits[index] = true;\r\n      this.isSunk();\r\n    },\r\n\r\n    isSunk() {\r\n      if (hits.every((hit) => hit === true)) {\r\n        this.sunk = true;\r\n        return true;\r\n      } else {\r\n        return false;\r\n      }\r\n    }\r\n  }\r\n}\r\n\r\n\r\nfunction createGameboard() {\r\n  const grid = []\r\n  for (let i = 0; i < 10; i++) {\r\n    const row = []\r\n    for (let j = 0; j < 10; j++) {\r\n      row.push(false);\r\n    }\r\n    grid.push(row);\r\n  }\r\n\r\n  return {\r\n    grid: grid,\r\n    misses: [],\r\n    ships: [],\r\n    shipsToPlace: [5, 4, 3, 3, 2, 2],\r\n    \r\n    placeShip(length, coords, position = 'horizontal') {\r\n      const ship = createShip(length, coords, position);\r\n      if(!this.shipFits(ship.length, coords, position)) {\r\n        console.log('ship cannot be placed there');\r\n        return false;\r\n      }\r\n\r\n      const x = coords[0];\r\n      const y = coords[1];\r\n      if (position === 'horizontal') {\r\n        for (let i = 0; i < ship.length; i++) {\r\n          grid[y][x + i] = ship.id;\r\n        }\r\n      } else if (position === 'vertical') {\r\n        for (let i = 0; i < ship.length; i++) {\r\n          grid[y + i][x] = ship.id;\r\n        }\r\n      }\r\n      this.ships.push(ship);\r\n      return true;\r\n    },\r\n\r\n    receiveAttack(coords) {\r\n      const x = coords[0];\r\n      const y = coords[1];\r\n\r\n      if (x < 0 || x > 9 || y < 0 || y > 9) {\r\n        throw new Error('Error: Invalid attack coordinates!');\r\n      }\r\n\r\n      if(grid[y][x] === false) {\r\n        grid[y][x] = 'miss';\r\n        this.misses.push(coords)\r\n        console.log('miss');\r\n        return false\r\n      } else {\r\n        const ship = this.getShip(grid[y][x]);\r\n        ship.hit(this.getHitIndex(ship, coords));\r\n        grid[y][x] = 'hit';\r\n        if (ship.isSunk()) {\r\n          this.markShipSunk(ship)\r\n        }\r\n        console.log('hit');\r\n        return true\r\n      }\r\n    },\r\n\r\n    shipFits(length, coords, position) {\r\n      const x = coords[0];\r\n      const y = coords[1];\r\n      if (position === 'horizontal') {\r\n        if(x + length > 10) {\r\n          return false;\r\n        }\r\n        for (let i = 0; i < length; i++) {\r\n          if (grid[y][x + i] !== false) {\r\n            return false;\r\n          }\r\n        }\r\n      } else if (position === 'vertical') {\r\n        if(y + length > 10) {\r\n          return false;\r\n        }\r\n        for (let i = 0; i < length; i++) {\r\n          if (grid[y + i][x] !== false) {\r\n            return false;\r\n          }\r\n        }\r\n      } else {\r\n        throw new Error('bad position given')\r\n      }\r\n      return true\r\n    },\r\n\r\n    getShip(id) {\r\n      for (let i = 0; i < this.ships.length; i ++) {\r\n        if (this.ships[i].id === id) {\r\n          return this.ships[i];\r\n        }\r\n      }\r\n    },\r\n\r\n    allShipsSunk() {\r\n      return this.ships.every((ship) => ship.sunk)\r\n    },\r\n\r\n    markShipSunk(ship) {\r\n      const x = ship.coords[0];\r\n      const y = ship.coords[1];\r\n      if (ship.position == 'horizontal') {\r\n        for (let i = 0; i < ship.length; i++) {\r\n          grid[y][x + i] = 'sunk';\r\n        }\r\n      } else {\r\n        for (let i = 0; i < ship.length; i++) {\r\n          grid[y + i][x] = 'sunk';\r\n        }\r\n      }\r\n    },\r\n    \r\n    getHitIndex(ship, coords) {\r\n      const hitX = coords[0];\r\n      const hitY = coords[1];\r\n      const shipX = ship.coords[0];\r\n      const shipY = ship.coords[1];\r\n\r\n      if(ship.position === 'horizontal') {\r\n        return hitX - shipX;\r\n      } else if(ship.position === 'vertical') {\r\n        return hitY - shipY;\r\n      } else {\r\n        throw new Error('Invalid Ship Position!')\r\n      }\r\n    }\r\n\r\n  }\r\n}\r\n\r\n\r\nconst cpuAI = {\r\n  placeShips(gameboard) {\r\n    gameboard.shipsToPlace.forEach((length) => {\r\n      let position = Math.round(Math.random()) == 1 ? 'horizontal' : 'vertical';\r\n      let x = Math.floor(Math.random() * 10);\r\n      let y = Math.floor(Math.random() * 10);\r\n      while(!gameboard.placeShip(length, [x,y], position)) {\r\n        position = Math.round(Math.random()) == 1 ? 'horizontal' : 'vertical';\r\n        x = Math.floor(Math.random() * 10);\r\n        y = Math.floor(Math.random() * 10);\r\n      }\r\n    })\r\n\r\n  },\r\n\r\n  takeShot(gameboard) {\r\n    let x = Math.floor(Math.random() * 10);\r\n    let y = Math.floor(Math.random() * 10);\r\n    while(gameboard.grid[y][x] === 'miss' || gameboard.grid[y][x] === 'hit' || \r\n      gameboard.grid[y][x] === 'sunk') {\r\n      x = Math.floor(Math.random() * 10);\r\n      y = Math.floor(Math.random() * 10);\r\n    }\r\n    console.log('ai shot taken at', x, y);\r\n    return gameboard.receiveAttack([x, y]);\r\n  }\r\n}\r\n\r\n\r\n\r\n\r\n\r\n\n\n//# sourceURL=webpack://battleship/./src/game.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _game_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game.js */ \"./src/game.js\");\n\r\n\r\nconst playerGB = (0,_game_js__WEBPACK_IMPORTED_MODULE_0__.createGameboard)();\r\nconst cpuGB = (0,_game_js__WEBPACK_IMPORTED_MODULE_0__.createGameboard)();\r\n\r\nlet placeShips = true;\r\nlet placeShipPos = 'horizontal';\r\n\r\nfunction displayPlayerGameboard(gameboard) {\r\n  const playerBoard = document.getElementById('player-board');\r\n  while(playerBoard.firstChild) {\r\n    playerBoard.removeChild(playerBoard.firstChild);\r\n  }\r\n  gameboard.grid.forEach((row, y) => {\r\n    row.forEach((tile, x) => {\r\n      const newTile = document.createElement('div')\r\n      newTile.classList.add('tile');\r\n\r\n      newTile.setAttribute('data-coords', `[${x}, ${y}]`);\r\n\r\n      if(tile === 'miss') {\r\n        const missPeg = document.createElement('div');\r\n        missPeg.classList.add('peg');\r\n        newTile.appendChild(missPeg)\r\n      } else if(tile === 'hit') {\r\n        const hitPeg = document.createElement('div');\r\n        hitPeg.classList.add('peg');\r\n        hitPeg.classList.add('hit-peg');\r\n        newTile.classList.add('ship-tile');\r\n        newTile.appendChild(hitPeg)\r\n      }else if(tile === 'sunk') {\r\n        const hitPeg = document.createElement('div');\r\n        hitPeg.classList.add('peg');\r\n        hitPeg.classList.add('hit-peg');\r\n        newTile.classList.add('sunk-tile');\r\n        newTile.appendChild(hitPeg);\r\n      } else if(tile !== false) {\r\n        newTile.classList.add('ship-tile');\r\n      }\r\n\r\n      if(y == 9 && x == 0) {\r\n        newTile.classList.add('bottom-left-tile')\r\n      }\r\n\r\n      if(y == 9 && x == 9) {\r\n        newTile.classList.add('bottom-right-tile')\r\n      }\r\n\r\n      if(placeShips) {\r\n        let length = gameboard.shipsToPlace[0];\r\n        let tileClass = 'hover-tile';\r\n\r\n        newTile.setAttribute('onclick', `placePlayerShip([${x}, ${y}])`);\r\n        newTile.classList.add('placing-tile');\r\n        \r\n        if(placeShipPos == 'horizontal') {\r\n          newTile.addEventListener('mouseenter', function (e) {\r\n          let x = Number(newTile.getAttribute('data-coords')[1]);\r\n          if (x + length > 10) {\r\n            length = 10 - x;\r\n            tileClass = 'illegal-tile';\r\n          }\r\n          let currentTile = newTile;\r\n          for (let i = 0; i < length; i++) {\r\n            currentTile.classList.add(tileClass);\r\n            currentTile = currentTile.nextSibling;\r\n          }\r\n            \r\n          });\r\n          newTile.addEventListener('mouseleave', function (e) {\r\n            let currentTile = newTile;\r\n            for (let i = 0; i < length; i++) {\r\n        \r\n              currentTile.classList.remove(tileClass);\r\n              currentTile = currentTile.nextSibling;\r\n            }\r\n          });\r\n        } else if (placeShipPos == 'vertical'){\r\n\r\n          newTile.addEventListener('mouseenter', function (e) {\r\n            let y = Number(newTile.getAttribute('data-coords')[4]);\r\n            if (y + length > 10) {\r\n              length = 10 - y;\r\n              tileClass = 'illegal-tile';\r\n            }\r\n            let currentTile = newTile;\r\n            currentTile.classList.add(tileClass);\r\n            for (let i = 1; i < length; i++) {\r\n              currentTile = getNthSibling(currentTile, 10);\r\n              currentTile.classList.add(tileClass);\r\n              \r\n            }\r\n              \r\n            });\r\n            newTile.addEventListener('mouseleave', function (e) {\r\n              let currentTile = newTile;\r\n              currentTile.classList.remove(tileClass);\r\n              for (let i = 1; i < length; i++) {\r\n                currentTile = getNthSibling(currentTile, 10);\r\n                currentTile.classList.remove(tileClass);\r\n                \r\n              }\r\n            });\r\n\r\n        }\r\n      }\r\n      playerBoard.appendChild(newTile);\r\n    })\r\n  });\r\n\r\n}\r\n\r\nfunction displayCpuGameboard(gameboard) {\r\n  const cpuBoard = document.getElementById('cpu-board');\r\n  while(cpuBoard.firstChild) {\r\n    cpuBoard.removeChild(cpuBoard.firstChild);\r\n  }\r\n  gameboard.grid.forEach((row, y) => {\r\n    row.forEach((tile, x) => {\r\n      const newTile = document.createElement('div')\r\n      newTile.classList.add('tile');\r\n      newTile.classList.add('cpu-tile');\r\n\r\n      newTile.setAttribute('data-coords', `[${x}, ${y}]`);\r\n\r\n      if(tile === 'miss') {\r\n        const missPeg = document.createElement('div');\r\n        missPeg.classList.add('peg');\r\n        newTile.appendChild(missPeg)\r\n      } else if(tile === 'hit') {\r\n        const hitPeg = document.createElement('div');\r\n        hitPeg.classList.add('peg');\r\n        hitPeg.classList.add('hit-peg');\r\n        newTile.appendChild(hitPeg)\r\n      }else if(tile === 'sunk') {\r\n        const hitPeg = document.createElement('div');\r\n        hitPeg.classList.add('peg');\r\n        hitPeg.classList.add('hit-peg');\r\n        newTile.classList.add('sunk-tile');\r\n        newTile.appendChild(hitPeg);\r\n      } else {\r\n        newTile.setAttribute('onclick', `clickTile([${x}, ${y}])`)\r\n      }\r\n\r\n      if(y == 0 && x == 0) {\r\n        newTile.classList.add('top-left-tile')\r\n      }\r\n\r\n      if(y == 0 && x == 9) {\r\n        newTile.classList.add('top-right-tile')\r\n      }\r\n\r\n      cpuBoard.appendChild(newTile);\r\n    })\r\n  });\r\n}\r\n\r\nfunction getNthSibling(element, n) {\r\n  let currentSibling = element;\r\n  for (let i = 0; i < n; i++) {\r\n    currentSibling = currentSibling.nextSibling;\r\n  }\r\n  return currentSibling;\r\n}\r\n\r\nwindow.clickTile = (coords) => {\r\n  const hit = cpuGB.receiveAttack(coords);\r\n  displayCpuGameboard(cpuGB)\r\n  \r\n  if (hit) {\r\n    if (cpuGB.allShipsSunk()) {\r\n      console.log('you win!!!!')\r\n    }\r\n    return;\r\n  }\r\n\r\n  while (_game_js__WEBPACK_IMPORTED_MODULE_0__.cpuAI.takeShot(playerGB)) {\r\n    displayPlayerGameboard(playerGB);\r\n    if (playerGB.allShipsSunk()) {\r\n      console.log('you LOSE!!!!')\r\n      return;\r\n    }\r\n  }\r\n  displayPlayerGameboard(playerGB);\r\n}\r\n\r\nwindow.placePlayerShip = (coords) => {\r\n  const length = playerGB.shipsToPlace[0]\r\n  if (playerGB.placeShip(length, coords, placeShipPos)) {\r\n    playerGB.shipsToPlace.shift();\r\n    if(playerGB.shipsToPlace.length == 0) {\r\n      placeShips = false;\r\n      document.getElementById('place-ships-banner').style.display = 'none';\r\n    }\r\n    displayPlayerGameboard(playerGB);\r\n  }\r\n}\r\n\r\ndocument.addEventListener('keydown', event => {\r\n  if (event.code === 'Space') {\r\n    if (placeShipPos === 'horizontal') {\r\n      placeShipPos = 'vertical'\r\n    } else {\r\n      placeShipPos = 'horizontal';\r\n    }\r\n    displayPlayerGameboard(playerGB);\r\n  }\r\n})\r\n\r\ndisplayPlayerGameboard(playerGB);\r\n\r\n_game_js__WEBPACK_IMPORTED_MODULE_0__.cpuAI.placeShips(cpuGB);\r\ndisplayCpuGameboard(cpuGB);\r\n\r\n\r\n\r\n\r\n\r\n\r\n\n\n//# sourceURL=webpack://battleship/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;