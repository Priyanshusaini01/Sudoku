import { useCallback, useEffect, useMemo, useState } from 'react';
import { puzzles } from '../data/puzzles';
import { cloneBoard, createCandidateMap, describeHiddenSingle, solveSudoku } from '../utils/sudoku';

const MAX_MISTAKES = 3;

const createCell = (value, row, col) => ({
  row,
  col,
  value: value !== 0 ? value : null,
  given: value !== 0,
  notes: [],
  status: 'idle',
  animationKey: 0,
});

const toMatrix = (board) => board.map((row) => row.map((cell) => cell.value ?? 0));

const buildBoardFromPuzzle = (puzzle) =>
  puzzle.map((row, rIdx) => row.map((value, cIdx) => createCell(value, rIdx, cIdx)));

const randomIndex = (length) => Math.floor(Math.random() * length);

const isBoardSolved = (board, solvedBoard) =>
  board.every((row, rIdx) => row.every((cell, cIdx) => cell.value !== null && cell.value === solvedBoard[rIdx][cIdx]));

export const difficulties = Object.keys(puzzles);

export default function useSudokuGame(initialDifficulty = 'easy') {
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [board, setBoard] = useState(() => buildBoardFromPuzzle(puzzles[difficulty][0]));
  const [solution, setSolution] = useState(() => solveSudoku(puzzles[difficulty][0]));
  const [selectedCell, setSelectedCell] = useState(null);
  const [noteMode, setNoteMode] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [message, setMessage] = useState('Select a cell to begin.');
  const [gameState, setGameState] = useState('active');

  const [lastAction, setLastAction] = useState({ key: null, type: 'idle' });

  const refreshPuzzle = useCallback(
    (level = difficulty) => {
      const pool = puzzles[level];
      const index = randomIndex(pool.length);
      const puzzle = cloneBoard(pool[index]);
      const solved = solveSudoku(puzzle);
      if (!solved) {
        throw new Error('Unable to solve puzzle for selected difficulty.');
      }
      setBoard(buildBoardFromPuzzle(puzzle));
      setSolution(solved);
      setSelectedCell(null);
      setMistakes(0);
      setNoteMode(false);
      setMessage('Select a cell to begin.');
      setGameState('active');
      setLastAction({ key: null, type: 'idle' });
    },
    [difficulty],
  );

  useEffect(() => {
    refreshPuzzle(difficulty);
  }, [difficulty, refreshPuzzle]);

  const selectCell = useCallback(
    (row, col) => {
      if (gameState !== 'active') {
        return;
      }
      setSelectedCell({ row, col });
      setMessage(`Ready for row ${row + 1}, column ${col + 1}.`);
    },
    [gameState],
  );

  const toggleNoteMode = useCallback(() => {
    setNoteMode((prev) => {
      const next = !prev;
      setMessage(next ? 'Notes enabled. Tap any number to jot a penciled mark.' : 'Notes disabled.');
      return next;
    });
  }, []);

  const clearCell = useCallback(() => {
    if (!selectedCell || gameState !== 'active') {
      return;
    }
    const { row, col } = selectedCell;
    const target = board[row][col];
    if (target.given) {
      setMessage('Locked cells cannot be cleared.');
      return;
    }
    setBoard((prev) =>
      prev.map((rowValues, rIdx) =>
        rowValues.map((cell, cIdx) => {
          if (rIdx !== row || cIdx !== col || cell.given) {
            return cell;
          }
          return {
            ...cell,
            value: null,
            notes: [],
            status: 'idle',
            animationKey: Date.now(),
          };
        }),
      ),
    );
    setMessage('Cell cleared.');
  }, [board, gameState, selectedCell]);

  const applyCellUpdate = useCallback((row, col, updater, after) => {
    setBoard((prev) => {
      const updated = prev.map((rowValues, rIdx) =>
        rowValues.map((cell, cIdx) => {
          if (rIdx !== row || cIdx !== col) {
            return cell;
          }
          return updater(cell);
        }),
      );
      if (after) {
        after(updated);
      }
      return updated;
    });
  }, []);

  const enterNumber = useCallback(
    (input) => {
      if (!selectedCell) {
        setMessage('Select a cell before entering numbers.');
        return;
      }
      if (gameState !== 'active') {
        return;
      }
      const { row, col } = selectedCell;
      applyCellUpdate(
        row,
        col,
        (cell) => {
          if (cell.given) {
            setMessage('That cell is part of the puzzle and cannot be changed.');
            return cell;
          }

          if (noteMode) {
            const notesSet = new Set(cell.notes);
            if (notesSet.has(input)) {
              notesSet.delete(input);
            } else {
              notesSet.add(input);
            }
            const notes = Array.from(notesSet).sort((a, b) => a - b);
            setMessage(`Pencil mark ${notesSet.has(input) ? 'added' : 'removed'} for ${input}.`);
            return {
              ...cell,
              notes,
              status: 'idle',
              animationKey: Date.now(),
            };
          }

          const expected = solution[row][col];
          if (input === expected) {
            setMessage(`Placed ${input}. Great find!`);
            setLastAction({ key: `${row}-${col}-${Date.now()}`, type: 'correct' });
            return {
              ...cell,
              value: input,
              notes: [],
              status: 'correct',
              animationKey: Date.now(),
            };
          }

          setMistakes((prev) => {
            if (prev >= MAX_MISTAKES) {
              return prev;
            }
            const next = prev + 1;
            if (next >= MAX_MISTAKES) {
              setGameState('failed');
              setMessage('Three strikes. Reset or request a hint to continue.');
              return MAX_MISTAKES;
            }
            setMessage(`Not quite. ${MAX_MISTAKES - next} tries left.`);
            return next;
          });
          setLastAction({ key: `${row}-${col}-${Date.now()}`, type: 'error' });
          return {
            ...cell,
            value: input,
            status: 'error',
            animationKey: Date.now(),
          };
        },
        (updatedBoard) => {
          if (isBoardSolved(updatedBoard, solution)) {
            setGameState('completed');
            setMessage('Puzzle completed! Stellar job.');
          }
        },
      );
    },
    [selectedCell, gameState, noteMode, solution, applyCellUpdate],
  );

  const requestHint = useCallback(() => {
    if (gameState !== 'active') {
      return null;
    }
    const matrix = toMatrix(board);
    const candidateMap = createCandidateMap(matrix);

    const chooseHiddenSingle = () => {
      for (const [key, candidates] of Object.entries(candidateMap)) {
        if (candidates.length === 0) {
          continue;
        }
        const [row, col] = key.split('-').map(Number);
        const solvedValue = solution[row][col];
        if (!candidates.includes(solvedValue)) {
          continue;
        }
        const reason = describeHiddenSingle(candidateMap, row, col, solvedValue);
        if (candidates.length === 1 || reason.startsWith('Hidden Single')) {
          return { row, col, value: solvedValue, reason };
        }
      }
      return null;
    };

    const hiddenSingle = chooseHiddenSingle();
    const fallbackHint = () => {
      for (const [key] of Object.entries(candidateMap)) {
        const [row, col] = key.split('-').map(Number);
        const solvedValue = solution[row][col];
        return {
          row,
          col,
          value: solvedValue,
          reason: `Strategic reveal: ${solvedValue} belongs at r${row + 1}c${col + 1}.`,
        };
      }
      return null;
    };

    const hint = hiddenSingle ?? fallbackHint();

    if (!hint) {
      setMessage('Board already complete.');
      return null;
    }

    applyCellUpdate(
      hint.row,
      hint.col,
      (cell) => {
        if (cell.given || cell.value === hint.value) {
          return cell;
        }
        setMessage(hint.reason);
        setLastAction({ key: `${hint.row}-${hint.col}-${Date.now()}`, type: 'hint' });
        return {
          ...cell,
          value: hint.value,
          notes: [],
          status: 'hint',
          animationKey: Date.now(),
        };
      },
      (updatedBoard) => {
        if (isBoardSolved(updatedBoard, solution)) {
          setGameState('completed');
          setMessage('Puzzle completed! Stellar job.');
        }
      },
    );

    return hint;
  }, [applyCellUpdate, board, gameState, solution]);

  const activeValue = useMemo(() => {
    if (!selectedCell) {
      return null;
    }
    const { row, col } = selectedCell;
    return board[row][col].value;
  }, [board, selectedCell]);

  return {
    board,
    difficulty,
    setDifficulty,
    refreshPuzzle,
    selectCell,
    selectedCell,
    enterNumber,
    clearCell,
    requestHint,
    noteMode,
    toggleNoteMode,
    mistakes,
    maxMistakes: MAX_MISTAKES,
    message,
    gameState,
    activeValue,
    lastAction,
  };
}
