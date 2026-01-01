import { motion } from 'framer-motion';
import clsx from 'clsx';

const StatCard = ({ label, value, accent }) => (
  <div className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
    <span className="text-xs uppercase tracking-wide text-slate-400">{label}</span>
    <span className={clsx('text-2xl font-semibold text-white', accent)}>{value}</span>
  </div>
);

const GameSidebar = ({
  message,
  gameState,
  progress,
  remainingCells,
  mistakes,
  maxMistakes,
}) => (
  <motion.aside
    layout
    className="flex h-full flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/50 p-5 shadow-glass backdrop-blur-2xl"
    initial={{ opacity: 0, x: 30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.35, ease: 'easeOut' }}
  >
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-primary-500/20 to-accent-500/20 p-4 text-sm text-slate-100 shadow-inner">
      <p className="text-xs uppercase tracking-wide text-slate-300">Assistant</p>
      <p className="mt-2 text-base font-medium leading-relaxed text-white">{message}</p>
      <p className="mt-3 text-xs uppercase tracking-wide text-slate-300">
        Status:{' '}
        <span className="font-semibold text-white">
          {gameState === 'active' && 'Playing'}
          {gameState === 'completed' && 'Solved'}
          {gameState === 'failed' && 'Locked'}
        </span>
      </p>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <StatCard label="Progress" value={`${progress}%`} accent="text-accent-200" />
      <StatCard label="Cells Remaining" value={remainingCells} accent="text-primary-200" />
      <StatCard label="Mistakes" value={`${mistakes} / ${maxMistakes}`} accent={mistakes >= maxMistakes ? 'text-rose-300' : 'text-emerald-300'} />
      <StatCard label="Focus Mode" value="Glass" accent="text-slate-200" />
    </div>

    <div className="mt-auto rounded-2xl border border-white/5 bg-white/5 p-4 text-xs leading-relaxed text-slate-400">
      <p className="font-semibold uppercase tracking-wide text-slate-300">Pro Tip</p>
      <p className="mt-2">
        Use pencil marks to track candidates. Hidden singles are highlighted by Smart Hint—try spotting them before
        you ask for help.
      </p>
    </div>
  </motion.aside>
);

export default GameSidebar;
