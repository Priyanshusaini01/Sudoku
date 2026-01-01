import clsx from 'clsx';
import { motion } from 'framer-motion';

const ControlPanel = ({
  difficulty,
  difficulties,
  onDifficultyChange,
  onNewGame,
  noteMode,
  onToggleNotes,
  onHint,
  mistakes,
  maxMistakes,
  gameState,
}) => (
  <motion.div
    layout
    className="flex flex-wrap items-center gap-3 rounded-3xl border border-white/10 bg-slate-900/50 p-4 shadow-glass backdrop-blur-xl"
  >
    <div className="flex flex-col text-xs uppercase tracking-wide text-slate-400">
      <span>Difficulty</span>
      <select
        value={difficulty}
        onChange={(event) => onDifficultyChange(event.target.value)}
        className="mt-1 rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm font-medium text-slate-200 shadow-inner focus:outline-none focus:ring-2 focus:ring-accent-400/70"
      >
        {difficulties.map((level) => (
          <option key={level} value={level} className="capitalize">
            {level}
          </option>
        ))}
      </select>
    </div>

    <div className="ml-auto flex items-center gap-3">
      <button
        type="button"
        onClick={onToggleNotes}
        className={clsx(
          'rounded-xl border px-4 py-2 text-sm font-semibold transition',
          noteMode
            ? 'border-accent-400/60 bg-accent-500/20 text-accent-200'
            : 'border-white/10 bg-white/5 text-slate-200 hover:border-white/20 hover:bg-white/10',
        )}
      >
        {noteMode ? 'Notes: On' : 'Notes: Off'}
      </button>
      <button
        type="button"
        onClick={onHint}
        disabled={gameState !== 'active'}
        className="rounded-xl border border-white/10 bg-gradient-to-br from-primary-500/30 to-accent-500/20 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:from-primary-500/40 hover:to-accent-500/30 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Smart Hint
      </button>
      <button
        type="button"
        onClick={onNewGame}
        className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-white/20 hover:bg-white/20"
      >
        New Game
      </button>
    </div>

    <div className="flex w-full items-center justify-between pt-3 text-sm text-slate-300">
      <span>
        Mistakes:{' '}
        <span className={clsx('ml-1 font-semibold', mistakes >= maxMistakes ? 'text-rose-400' : 'text-accent-200')}>
          {mistakes} / {maxMistakes}
        </span>
      </span>
      {gameState === 'failed' && <span className="text-rose-400">Locked. Reset or use Smart Hint.</span>}
      {gameState === 'completed' && <span className="text-emerald-300">Solved! Start a new challenge.</span>}
    </div>
  </motion.div>
);

export default ControlPanel;
