import { motion } from 'framer-motion';
import clsx from 'clsx';

const statusAnimation = {
  idle: { scale: 1, x: 0 },
  correct: { scale: [1, 1.08, 1], transition: { duration: 0.35, ease: 'easeOut' } },
  hint: { scale: [1, 1.05, 1], transition: { duration: 0.3, ease: 'easeOut' } },
  error: {
    x: [0, -6, 6, -6, 3, 0],
    transition: { duration: 0.45, ease: 'easeInOut' },
  },
};

const SudokuCell = ({
  cell,
  isSelected,
  isRelated,
  isSameValue,
  onSelect,
  borderClasses,
  onHoverValue,
}) => {
  const showNotes = !cell.value && cell.notes.length > 0;
  const handleMouseEnter = () => {
    if (onHoverValue && cell.value) {
      onHoverValue(cell.value);
    }
  };
  const handleMouseLeave = () => {
    if (onHoverValue) {
      onHoverValue(null);
    }
  };

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={clsx(
        'relative flex aspect-square items-center justify-center rounded-xl text-lg font-semibold transition-colors duration-150',
        'bg-white/5 text-slate-100 backdrop-blur-sm',
        borderClasses,
        cell.given && 'bg-white/10 text-slate-200',
        isRelated && !isSelected && 'bg-white/10 text-slate-100/90',
        isSameValue && 'bg-gradient-to-br from-accent-500/20 to-primary-500/10 text-accent-200 shadow-glow',
        isSelected && 'ring-2 ring-accent-400/80 ring-offset-2 ring-offset-slate-900/70 text-white',
        cell.status === 'correct' && 'text-emerald-300',
        cell.status === 'hint' && 'text-accent-200',
        cell.status === 'error' && 'bg-red-500/15 text-rose-300',
      )}
      animate={statusAnimation[cell.status] ?? statusAnimation.idle}
      whileHover={{ scale: cell.given ? 1 : 1.02 }}
      whileTap={{ scale: cell.given ? 1 : 0.97 }}
      layout
    >
      {cell.value ? (
        <span className="text-2xl font-semibold drop-shadow-[0_4px_12px_rgba(14,165,233,0.25)]">
          {cell.value}
        </span>
      ) : showNotes ? (
        <div className="grid h-full w-full grid-cols-3 gap-[1px] px-1 text-[0.6rem] font-medium text-slate-400">
          {Array.from({ length: 9 }, (_, idx) => idx + 1).map((num) => (
            <span key={num} className={clsx('flex items-center justify-center', !cell.notes.includes(num) && 'opacity-0')}>
              {num}
            </span>
          ))}
        </div>
      ) : null}
    </motion.button>
  );
};

export default SudokuCell;
