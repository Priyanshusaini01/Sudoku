import clsx from 'clsx';
import SudokuCell from './SudokuCell';

const isSameSubgrid = (rowA, colA, rowB, colB) =>
  Math.floor(rowA / 3) === Math.floor(rowB / 3) && Math.floor(colA / 3) === Math.floor(colB / 3);

const SudokuBoard = ({
  board,
  selectedCell,
  onSelectCell,
  activeValue,
  onHoverValue,
}) => (
  <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-3 shadow-glass backdrop-blur-xl">
    <div className="grid grid-cols-9 gap-[1px] overflow-hidden rounded-2xl bg-white/10">
      {board.map((row, rowIdx) =>
        row.map((cell, colIdx) => {
          const isSelected = selectedCell && selectedCell.row === rowIdx && selectedCell.col === colIdx;
          const isRelated =
            selectedCell &&
            (selectedCell.row === rowIdx ||
              selectedCell.col === colIdx ||
              isSameSubgrid(selectedCell.row, selectedCell.col, rowIdx, colIdx));
          const isSameValue = Boolean(activeValue && cell.value === activeValue);

          const borderClasses = clsx(
            'border border-white/5',
            (colIdx + 1) % 3 === 0 && colIdx !== 8 && 'border-r-2 border-white/10',
            (rowIdx + 1) % 3 === 0 && rowIdx !== 8 && 'border-b-2 border-white/10',
          );

          return (
            <SudokuCell
              key={`${rowIdx}-${colIdx}-${cell.animationKey}`}
              cell={cell}
              isSelected={isSelected}
              isRelated={Boolean(isRelated)}
              isSameValue={isSameValue}
              borderClasses={borderClasses}
              onSelect={() => onSelectCell(rowIdx, colIdx)}
              onHoverValue={onHoverValue}
            />
          );
        }),
      )}
    </div>
  </div>
);

export default SudokuBoard;
