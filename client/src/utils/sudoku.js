const SIZE = 9;

export const cloneBoard = (board) => board.map((row) => [...row]);

export const isValidPlacement = (board, row, col, num) => {
  for (let i = 0; i < SIZE; i += 1) {
    if (board[row][i] === num || board[i][col] === num) {
      return false;
    }
  }

  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let r = 0; r < 3; r += 1) {
    for (let c = 0; c < 3; c += 1) {
      if (board[startRow + r][startCol + c] === num) {
        return false;
      }
    }
  }

  return true;
};

const findEmptyCell = (board) => {
  for (let r = 0; r < SIZE; r += 1) {
    for (let c = 0; c < SIZE; c += 1) {
      if (board[r][c] === 0) {
        return [r, c];
      }
    }
  }
  return null;
};

export const solveSudoku = (board) => {
  const working = cloneBoard(board);

  const solve = () => {
    const empty = findEmptyCell(working);
    if (!empty) {
      return true;
    }

    const [row, col] = empty;
    for (let num = 1; num <= 9; num += 1) {
      if (isValidPlacement(working, row, col, num)) {
        working[row][col] = num;
        if (solve()) {
          return true;
        }
        working[row][col] = 0;
      }
    }
    return false;
  };

  const solved = solve();
  return solved ? working : null;
};

export const getCandidates = (board, row, col) => {
  if (board[row][col] !== 0) {
    return [];
  }
  const candidates = [];
  for (let num = 1; num <= 9; num += 1) {
    if (isValidPlacement(board, row, col, num)) {
      candidates.push(num);
    }
  }
  return candidates;
};

export const describeHiddenSingle = (candidates, row, col, value) => {
  let rowCount = 0;
  let colCount = 0;
  let boxCount = 0;

  for (let idx = 0; idx < SIZE; idx += 1) {
    const rowKey = `${row}-${idx}`;
    const colKey = `${idx}-${col}`;
    if (candidates[rowKey]?.includes(value)) {
      rowCount += 1;
    }
    if (candidates[colKey]?.includes(value)) {
      colCount += 1;
    }
  }

  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = 0; r < 3; r += 1) {
    for (let c = 0; c < 3; c += 1) {
      const key = `${boxRow + r}-${boxCol + c}`;
      if (candidates[key]?.includes(value)) {
        boxCount += 1;
      }
    }
  }

  if (rowCount === 1) {
    return `Hidden Single in row ${row + 1}: only ${value} fits.`;
  }
  if (colCount === 1) {
    return `Hidden Single in column ${col + 1}: only ${value} fits.`;
  }
  if (boxCount === 1) {
    const boxLabel = `${Math.floor(row / 3) + 1}${String.fromCharCode(65 + Math.floor(col / 3))}`;
    return `Hidden Single in box ${boxLabel}: only ${value} fits.`;
  }
  return `Single candidate ${value} forced at r${row + 1}c${col + 1}.`;
};

export const createCandidateMap = (board) => {
  const map = {};
  for (let r = 0; r < SIZE; r += 1) {
    for (let c = 0; c < SIZE; c += 1) {
      if (board[r][c] === 0) {
        map[`${r}-${c}`] = getCandidates(board, r, c);
      }
    }
  }
  return map;
};
