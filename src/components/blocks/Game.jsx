import React, { useEffect, useState } from "react";

function startGrid() {
  const startGrid = new Array(8).fill().map(() => new Array(8).fill(0));
  startGrid[3][3] = 1;
  startGrid[3][4] = 2;
  startGrid[4][3] = 2;
  startGrid[4][4] = 1;
  return startGrid;
}

function computerPlay(grid, player) {
  const moves = getValidMoves(grid, player);
  let bestMove;
  let maxScore = -Infinity;

  for (let i = 0; i < moves.length; i++) {
    const { y, x } = moves[i];

    const newGrid = makeMove(grid, x, y, player);

    const score = countPotentialMoves(newGrid, player);

    if (score > maxScore) {
      maxScore = score;
      bestMove = { x, y };
    }
  }

  return bestMove;
}

// Функция для получения списка доступных ходов для игрока на заданном уровне игры
function getValidMoves(grid, player) {
  const moves = [];

  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      if (grid[x][y] !== 0) {
        continue;
      }

      // Проверяем, можно ли поставить фишку игрока в эту клетку
      if (isValidMove(grid, x, y, player)) {
        moves.push({ x, y });
      }
    }
  }

  return moves;
}

// Функция для проверки, является ли заданный ход допустимым для данного игрока
function isValidMove(grid, x, y, player) {
  // Проверяем, что клетка находится в пределах доски
  if (x < 0 || x >= 8 || y < 0 || y >= 8) {
    return false;
  }

  // Проверяем, что выбранная клетка пустая
  if (grid[x][y] !== 0) {
    return false;
  }

  // Проверяем, можно ли захватить фишки противника при этом ходе
  let canFlip = false;

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) {
        continue;
      }

      if (canFlipDirection(grid, x, y, player, dx, dy)) {
        canFlip = true;
        break;
      }
    }

    if (canFlip) {
      break;
    }
  }

  return canFlip;
}

// Функция для проверки, можно ли захватить фишки противника в заданном направлении
function canFlipDirection(grid, x, y, player, dx, dy) {
  let i = x + dx;
  let j = y + dy;
  let foundOpponent = false;

  while (i >= 0 && i < 8 && j >= 0 && j < 8) {
    const cell = grid[i][j];

    if (cell === 0) {
      // Если мы нашли пустую клетку, то не можем захватить фишки и завершаем проверку
      return false;
    } else if (cell === player) {
      // Если мы нашли клетку с фишкой текущего игрока, то можем захватить фишки противника, если они были предварительно найдены
      return foundOpponent;
    } else {
      // Если мы нашли клетку с фишкой противника, то продолжаем поиск
      foundOpponent = true;
    }

    i += dx;
    j += dy;
  }

  return false;
}

// Функция для осуществления хода в заданной клетке
function makeMove(grid, y, x, player) {
  // Создаем новый массив, чтобы не изменять оригинальный
  const newGrid = [...grid.map((row) => [...row])];

  // Ставим фишку игрока в выбранную клетку
  newGrid[x][y] = player;

  // Захватываем фишки противника, если это возможно
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) {
        continue;
      }

      if (canFlipDirection(newGrid, x, y, player, dx, dy)) {
        flipDirection(newGrid, x, y, player, dx, dy);
      }
    }
  }

  return newGrid;
}

// Функция для захвата фишек противника в заданном направлении
function flipDirection(grid, x, y, player, dx, dy) {
  let i = x + dx;
  let j = y + dy;

  while (i >= 0 && i < 8 && j >= 0 && j < 8) {
    const cell = grid[i][j];

    if (cell === 0 || cell === player) {
      // Если мы дошли до пустой клетки или клетки с нашей фишкой, то завершаем захват фишек
      break;
    } else {
      // Если мы дошли до клетки с фишкой противника, то захватываем эту фишку и продолжаем поиск
      grid[i][j] = player;
    }

    i += dx;
    j += dy;
  }
}

// Функция для подсчета количества потенциальных ходов для заданного игрока на следующем уровне игры
function countPotentialMoves(grid, player) {
  let count = 0;

  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      if (grid[x][y] !== 0) {
        continue;
      }

      if (isValidMove(grid, x, y, player)) {
        count++;
      }
    }
  }

  return count;
}

function clearGrid(currentGrid) {
  const newGrid = currentGrid.map((row) => {
    return row.map((cell) => (cell !== 3 ? cell : 0));
  });

  return newGrid;
}

const Game = () => {
  const [whoPlay, setWhoPlay] = useState(1);
  const [gameGrid, setGameGrid] = useState(startGrid);

  const [gameScore, setGameScore] = useState([0, 0]);

  useEffect(() => {
    // загружаем состояние игры из локального хранилища
    const savedGameState = JSON.parse(localStorage.getItem("gameState"));
    console.log(savedGameState);
    if (savedGameState) {
      setGameScore(savedGameState.gameScore);
      setWhoPlay(savedGameState.whoPlay);
      setGameGrid(savedGameState.gameGrid);
    } else {
      setWhoPlay(1);
      setGameGrid(startGrid);
      setGameScore([0, 0]);
    }
  }, []);

  useEffect(() => {
    // сохраняем состояние игры в локальное хранилище при изменении
    saveGameState();
  }, [whoPlay, gameGrid]);

  function saveGameState() {
    const gameState = { gameScore, whoPlay, gameGrid };
    console.log(gameState);
    localStorage.setItem("gameState", JSON.stringify(gameState));
  }

  useEffect(() => {
    if (gameGrid) {
      switch (whoPlay) {
        case 1:
          setGameGrid((currentGrid) => {
            const newGrid = clearGrid(currentGrid);
            const moves = getValidMoves(newGrid, 1);

            if (moves.length === 0 || moves === undefined) {
              setWhoPlay("END");
              return newGrid;
            }

            moves.forEach(({ x, y }) => {
              newGrid[x][y] = 3;
            });
            return newGrid;
          });
          break;
        case 2:
          setGameGrid((currentGrid) => {
            const newGrid = clearGrid(currentGrid);

            const bestMove = computerPlay(newGrid, 2);
            if (bestMove === undefined) {
              setWhoPlay("END");
              return newGrid;
            }
            const { x, y } = bestMove;
            return makeMove(newGrid, y, x, 2);
          });
          setWhoPlay(1);
          break;
        case "END":
          console.log("end-game");

          break;
        default:
          setWhoPlay(1);
          break;
      }
      gameScore[0] = 0;
      gameScore[1] = 0;
      for (let i = 0; i < gameGrid.length; i++) {
        gameScore[0] += gameGrid[i].filter((x) => x === 1).length;
        gameScore[1] += gameGrid[i].filter((x) => x === 2).length;
      }
    }
  }, [whoPlay]);

  function playerClick(x, y) {
    const newGrid = makeMove(gameGrid, x, y, 1);
    setGameGrid(newGrid);
    setWhoPlay(2);
  }

  function startNewGame() {
    setGameGrid(startGrid());
    setWhoPlay(3);
  }

  return (
    <>
      <div className="flex-wrap game__total flex justify-center items-center m-5">
        <div className="md:mb-4 game__total__white m-3">
          Белые = {gameScore[0]}
        </div>
        <div className="md:mb-4 game__total__black m-3">
          Черные = {gameScore[1]}
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white  py-2 px-4 rounded m-3"
          onClick={startNewGame}
        >
          Новая игра
        </button>
      </div>
      <div className="game__items">
        {whoPlay == "END" && gameScore[0] > gameScore[1] && (
          <div className="game__message game__message-win">
            Конец игры <strong>ПОБЕДИЛИ БЕЛЫЕ</strong>
          </div>
        )}
        {whoPlay == "END" && gameScore[0] < gameScore[1] && (
          <div className="game__message game__message-lose">
            Конец игры <strong>ПОБЕДИЛИ ЧЕРНЫЕ</strong>
          </div>
        )}
        {whoPlay == "END" && gameScore[0] === gameScore[1] && (
          <div className="game__message game__message-draw">
            Конец игры <strong>НИЧЬЯ</strong>
          </div>
        )}
        {gameGrid &&
          gameGrid.map((row, rowIndex) => {
            return row.map((cell, cellIndex) => {
              if (cell === 0) {
                return (
                  <div
                    className="game__item game__item__empty"
                    key={`${rowIndex}-${cellIndex}`}
                  ></div>
                );
              } else if (cell === 1) {
                return (
                  <div
                    className="game__item game__item__white"
                    key={`${rowIndex}-${cellIndex}`}
                  ></div>
                );
              } else if (cell === 2) {
                return (
                  <div
                    className="game__item game__item__black"
                    key={`${rowIndex}-${cellIndex}`}
                  ></div>
                );
              } else if (cell === 3) {
                return (
                  <div
                    className="game__item game__item__can-move"
                    key={`${rowIndex}-${cellIndex}`}
                    onClick={() => playerClick(cellIndex, rowIndex)}
                  ></div>
                );
              }
            });
          })}
      </div>
    </>
  );
};

export default Game;
