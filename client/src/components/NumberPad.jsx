import { motion } from 'framer-motion';
import clsx from 'clsx';

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const NumberPad = ({ onInput, onClear, noteMode, compact = false }) => (
  <motion.div
    layout
    className={clsx(
      'rounded-3xl border border-white/10 bg-slate-900/60 p-4 shadow-glass backdrop-blur-xl',
      compact ? 'w-full' : 'w-full lg:w-[18rem]'
    )}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25 }}
  >
    <div className="mb-3 flex items-center justify-between text-sm text-slate-300">
      <span>{noteMode ? 'Pencil Marks Active' : 'Number Pad'}</span>
      <button
        type="button"
        onClick={onClear}
        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/10"
      >
        Clear Cell
      </button>
    </div>
    <div className="grid grid-cols-3 gap-2">
      {numbers.map((num) => (
        <button
          key={num}
          type="button"
          onClick={() => onInput(num)}
          className={clsx(
            'flex h-14 items-center justify-center rounded-2xl border border-white/10 text-lg font-semibold text-slate-100 transition',
            'bg-gradient-to-br from-slate-800/70 to-slate-900/70 hover:from-primary-500/30 hover:to-primary-600/20 hover:text-white'
          )}
        >
          {num}
        </button>
      ))}
    </div>
  </motion.div>
);

export default NumberPad;
