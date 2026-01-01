import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import useSudokuGame, { difficulties } from './hooks/useSudokuGame';
import SudokuBoard from './components/SudokuBoard';
import ControlPanel from './components/ControlPanel';
import NumberPad from './components/NumberPad';
import GameSidebar from './components/GameSidebar';

function App() {
  const {
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
    maxMistakes,
    message,
    gameState,
    activeValue,
  } = useSudokuGame('easy');

  const [hoveredValue, setHoveredValue] = useState(null);

  const progress = useMemo(() => {
    const filled = board.flat().filter((cell) => cell.value !== null).length;
    return Math.round((filled / 81) * 100);
  }, [board]);

  const remainingCells = useMemo(() => 81 - board.flat().filter((cell) => cell.value !== null).length, [board]);

  const effectiveActiveValue = hoveredValue ?? activeValue;

  const handleKeyDown = useCallback(
    (event) => {
      const targetTag = event.target.tagName.toLowerCase();
      if (['input', 'textarea', 'select'].includes(targetTag)) {
        return;
      }
      if (event.key >= '1' && event.key <= '9') {
        event.preventDefault();
        enterNumber(Number(event.key));
      }
      if (event.key === 'Backspace' || event.key === 'Delete') {
        event.preventDefault();
        clearCell();
      }
      if (event.key.toLowerCase() === 'n') {
        event.preventDefault();
        toggleNoteMode();
      }
      if (event.key.toLowerCase() === 'h') {
        event.preventDefault();
        requestHint();
      }
    },
    [enterNumber, clearCell, toggleNoteMode, requestHint],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="min-h-screen w-full px-4 pb-16 pt-10 text-slate-100 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/50 p-6 shadow-glass backdrop-blur-2xl"
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4rem] text-slate-400">Sudoku Studio</p>
              <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
                Premium Glassmorphism Sudoku
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">
                Smooth interactions, intelligent hints, and a dark neon atmosphere crafted for focus. Highlight
                patterns, manage pencil marks, and flow through puzzles without distractions.
              </p>
            </div>
          </div>
          <ControlPanel
            difficulty={difficulty}
            difficulties={difficulties}
            onDifficultyChange={setDifficulty}
            onNewGame={() => refreshPuzzle(difficulty)}
            noteMode={noteMode}
            onToggleNotes={toggleNoteMode}
            onHint={requestHint}
            mistakes={mistakes}
            maxMistakes={maxMistakes}
            gameState={gameState}
          />
        </motion.header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex flex-col gap-6">
            <SudokuBoard
              board={board}
              selectedCell={selectedCell}
              onSelectCell={selectCell}
              activeValue={effectiveActiveValue}
              onHoverValue={setHoveredValue}
            />

            <div className="hidden lg:flex">
              <NumberPad onInput={enterNumber} onClear={clearCell} noteMode={noteMode} />
            </div>

            <div className="lg:hidden">
              <NumberPad onInput={enterNumber} onClear={clearCell} noteMode={noteMode} compact />
            </div>
          </div>

          <GameSidebar
            message={message}
            gameState={gameState}
            progress={progress}
            remainingCells={remainingCells}
            mistakes={mistakes}
            maxMistakes={maxMistakes}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
