document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const board = document.getElementById('board');
    const messageEl = document.getElementById('message');
    const difficultySelect = document.getElementById('difficulty');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const customPuzzleBtn = document.getElementById('custom-puzzle-btn');
    const customModal = document.getElementById('custom-modal');
    const closeModalBtn = document.querySelector('.close-btn');
    const customBoard = document.getElementById('custom-board');
    const saveCustomBtn = document.getElementById('save-custom');
    const clearCustomBtn = document.getElementById('clear-custom');
    const customValidationMessage = document.getElementById('custom-validation-message');
    
    // Buttons
    const newGameBtn = document.getElementById('new-game');
    const solveBtn = document.getElementById('solve');
    const hintBtn = document.getElementById('hint');
    const checkBtn = document.getElementById('check');
    
    // Game state
    let selectedCell = null;
    let gameBoard = [];
    let originalBoard = [];
    let selectedRow = -1;
    let selectedCol = -1;
    let mistakeCount = 0;
    const MAX_MISTAKES = 3;
    let customPuzzleData = Array(9).fill().map(() => Array(9).fill(0));
    let customSelectedCell = null;
    let customSelectedRow = -1;
    let customSelectedCol = -1;
    
    // Theme handling
    function initTheme() {
        // Check for saved theme preference or use preferred color scheme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            updateThemeIcon(savedTheme);
        } else {
            // Check if user prefers dark mode
            const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDarkMode) {
                document.documentElement.setAttribute('data-theme', 'dark');
                updateThemeIcon('dark');
            }
        }
    }
    
    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }
    
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    }
    
    // Puzzle library - multiple puzzles for each difficulty
    const puzzleLibrary = {
        easy: [
            // Original easy puzzle
            [
                [5, 3, 0, 0, 7, 0, 0, 0, 0],
                [6, 0, 0, 1, 9, 5, 0, 0, 0],
                [0, 9, 8, 0, 0, 0, 0, 6, 0],
                [8, 0, 0, 0, 6, 0, 0, 0, 3],
                [4, 0, 0, 8, 0, 3, 0, 0, 1],
                [7, 0, 0, 0, 2, 0, 0, 0, 6],
                [0, 6, 0, 0, 0, 0, 2, 8, 0],
                [0, 0, 0, 4, 1, 9, 0, 0, 5],
                [0, 0, 0, 0, 8, 0, 0, 7, 9]
            ],
            // Additional easy puzzle 1
            [
                [0, 0, 0, 2, 6, 0, 0, 0, 1],
                [0, 0, 0, 7, 0, 0, 8, 4, 0],
                [0, 5, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 3, 0, 0, 6, 0, 0, 4],
                [0, 0, 0, 0, 2, 0, 6, 1, 0],
                [0, 9, 0, 0, 0, 3, 5, 0, 0],
                [6, 0, 0, 0, 0, 5, 0, 0, 8],
                [0, 0, 5, 0, 0, 8, 7, 0, 0],
                [2, 0, 0, 3, 7, 0, 0, 6, 0]
            ],
            // Additional easy puzzle 2
            [
                [0, 0, 0, 0, 3, 7, 6, 0, 0],
                [0, 0, 0, 6, 0, 0, 0, 9, 0],
                [0, 0, 8, 0, 0, 0, 0, 0, 4],
                [0, 9, 0, 0, 0, 0, 0, 0, 1],
                [6, 0, 0, 0, 0, 0, 0, 0, 9],
                [3, 0, 0, 0, 0, 0, 0, 4, 0],
                [7, 0, 0, 0, 0, 0, 8, 0, 0],
                [0, 1, 0, 0, 0, 9, 0, 0, 0],
                [0, 0, 2, 5, 4, 0, 0, 0, 0]
            ]
        ],
        medium: [
            // Original medium puzzle
            [
                [0, 0, 0, 2, 6, 0, 7, 0, 1],
                [6, 8, 0, 0, 7, 0, 0, 9, 0],
                [1, 9, 0, 0, 0, 4, 5, 0, 0],
                [8, 2, 0, 1, 0, 0, 0, 4, 0],
                [0, 0, 4, 6, 0, 2, 9, 0, 0],
                [0, 5, 0, 0, 0, 3, 0, 2, 8],
                [0, 0, 9, 3, 0, 0, 0, 7, 4],
                [0, 4, 0, 0, 5, 0, 0, 3, 6],
                [7, 0, 3, 0, 1, 8, 0, 0, 0]
            ],
            // Additional medium puzzle 1
            [
                [1, 0, 0, 0, 0, 7, 0, 0, 3],
                [0, 0, 0, 0, 0, 0, 2, 0, 0],
                [0, 0, 9, 5, 0, 0, 0, 0, 0],
                [0, 3, 0, 0, 0, 0, 0, 0, 8],
                [2, 0, 0, 0, 0, 0, 0, 0, 4],
                [9, 0, 0, 0, 0, 0, 0, 7, 0],
                [0, 0, 0, 0, 0, 3, 6, 0, 0],
                [0, 0, 4, 0, 0, 0, 0, 0, 0],
                [5, 0, 0, 6, 0, 0, 0, 0, 2]
            ],
            // Additional medium puzzle 2
            [
                [0, 0, 0, 0, 6, 0, 8, 0, 3],
                [0, 0, 0, 0, 0, 0, 0, 9, 0],
                [0, 0, 9, 0, 0, 2, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 5],
                [0, 0, 1, 6, 0, 7, 4, 0, 0],
                [7, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 8, 0, 0, 1, 0, 0],
                [0, 5, 0, 0, 0, 0, 0, 0, 0],
                [4, 0, 7, 0, 3, 0, 0, 0, 0]
            ]
        ],
        hard: [
            // Original hard puzzle
            [
                [0, 2, 0, 6, 0, 8, 0, 0, 0],
                [5, 8, 0, 0, 0, 9, 7, 0, 0],
                [0, 0, 0, 0, 4, 0, 0, 0, 0],
                [3, 7, 0, 0, 0, 0, 5, 0, 0],
                [6, 0, 0, 0, 0, 0, 0, 0, 4],
                [0, 0, 8, 0, 0, 0, 0, 1, 3],
                [0, 0, 0, 0, 2, 0, 0, 0, 0],
                [0, 0, 9, 8, 0, 0, 0, 3, 6],
                [0, 0, 0, 3, 0, 6, 0, 9, 0]
            ],
            // Additional hard puzzle 1
            [
                [8, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 3, 6, 0, 0, 0, 0, 0],
                [0, 7, 0, 0, 9, 0, 2, 0, 0],
                [0, 5, 0, 0, 0, 7, 0, 0, 0],
                [0, 0, 0, 0, 4, 5, 7, 0, 0],
                [0, 0, 0, 1, 0, 0, 0, 3, 0],
                [0, 0, 1, 0, 0, 0, 0, 6, 8],
                [0, 0, 8, 5, 0, 0, 0, 1, 0],
                [0, 9, 0, 0, 0, 0, 4, 0, 0]
            ],
            // Additional hard puzzle 2
            [
                [0, 2, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 6, 0, 0, 0, 0, 3],
                [0, 7, 4, 0, 8, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 3, 0, 0, 2],
                [0, 8, 0, 0, 4, 0, 0, 1, 0],
                [6, 0, 0, 5, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 1, 0, 7, 8, 0],
                [5, 0, 0, 0, 0, 9, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 4, 0]
            ]
        ],
        // Custom puzzles will be stored here
        custom: []
    };
    
    // Add a custom puzzle to local storage
    function saveCustomPuzzle(puzzle) {
        if (!isValidPuzzleInput(puzzle)) return false;
        
        const customPuzzles = JSON.parse(localStorage.getItem('customPuzzles') || '[]');
        customPuzzles.push(puzzle);
        localStorage.setItem('customPuzzles', JSON.stringify(customPuzzles));
        
        // Add to our library
        puzzleLibrary.custom = customPuzzles;
        
        return true;
    }
    
    // Load custom puzzles from local storage
    function loadCustomPuzzles() {
        const customPuzzles = JSON.parse(localStorage.getItem('customPuzzles') || '[]');
        puzzleLibrary.custom = customPuzzles;
        
        // Update the difficulty dropdown if we have custom puzzles
        if (customPuzzles.length > 0) {
            // Ensure the custom option exists
            let customOption = Array.from(difficultySelect.options).find(opt => opt.value === 'custom');
            if (!customOption) {
                customOption = document.createElement('option');
                customOption.value = 'custom';
                customOption.textContent = 'Custom';
                difficultySelect.appendChild(customOption);
            }
        }
    }
    
    // Create the game board UI
    function createBoard() {
        board.innerHTML = '';
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                cell.addEventListener('click', () => selectCell(cell, row, col));
                
                board.appendChild(cell);
            }
        }
    }
    
    // Create the custom puzzle board UI
    function createCustomBoard() {
        customBoard.innerHTML = '';
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('div');
                cell.classList.add('custom-cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                cell.addEventListener('click', () => selectCustomCell(cell, row, col));
                
                customBoard.appendChild(cell);
            }
        }
        
        // Reset custom puzzle data
        customPuzzleData = Array(9).fill().map(() => Array(9).fill(0));
        updateCustomBoardUI();
    }
    
    // Handle cell selection in the custom board
    function selectCustomCell(cell, row, col) {
        // Clear previous selection
        if (customSelectedCell) {
            customSelectedCell.classList.remove('selected');
        }
        
        customSelectedCell = cell;
        customSelectedCell.classList.add('selected');
        customSelectedRow = row;
        customSelectedCol = col;
    }
    
    // Update the custom board UI
    function updateCustomBoardUI() {
        const cells = document.querySelectorAll('.custom-cell');
        
        cells.forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            
            if (customPuzzleData[row][col] !== 0) {
                cell.textContent = customPuzzleData[row][col];
            } else {
                cell.textContent = '';
            }
        });
    }
    
    // Handle keyboard input for the custom board
    function handleCustomBoardKeypress(e) {
        if (!customSelectedCell) return;
        
        if (e.key >= '1' && e.key <= '9') {
            const num = parseInt(e.key);
            customPuzzleData[customSelectedRow][customSelectedCol] = num;
            customSelectedCell.textContent = num;
        } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
            customPuzzleData[customSelectedRow][customSelectedCol] = 0;
            customSelectedCell.textContent = '';
        }
    }
    
    // Check if a custom puzzle input is valid
    function isValidPuzzleInput(puzzle) {
        // Check that the puzzle has at least some numbers
        let hasSomeNumbers = false;
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (puzzle[row][col] !== 0) {
                    hasSomeNumbers = true;
                    break;
                }
            }
            if (hasSomeNumbers) break;
        }
        
        if (!hasSomeNumbers) {
            customValidationMessage.textContent = 'Puzzle must have at least one number';
            customValidationMessage.classList.add('error');
            return false;
        }
        
        // Check that the puzzle is solvable
        const puzzleCopy = JSON.parse(JSON.stringify(puzzle));
        if (!isSolvable(puzzleCopy)) {
            customValidationMessage.textContent = 'This puzzle has no solution';
            customValidationMessage.classList.add('error');
            return false;
        }
        
        return true;
    }
    
    // Check if a puzzle is solvable
    function isSolvable(puzzle) {
        // First verify that the initial configuration is valid
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const num = puzzle[row][col];
                if (num !== 0) {
                    // Temporarily set the cell to 0 to check if the number is valid
                    puzzle[row][col] = 0;
                    if (!isValidPlacement(puzzle, row, col, num)) {
                        // Reset the cell
                        puzzle[row][col] = num;
                        return false;
                    }
                    // Reset the cell
                    puzzle[row][col] = num;
                }
            }
        }
        
        // Try to solve the puzzle
        return solveSudoku(puzzle);
    }
    
    // Handle cell selection
    function selectCell(cell, row, col) {
        // Clear previous selection
        if (selectedCell) {
            selectedCell.classList.remove('selected');
        }
        
        selectedCell = cell;
        selectedCell.classList.add('selected');
        selectedRow = row;
        selectedCol = col;
        
        messageEl.textContent = `Selected cell: (${row}, ${col})`;
        messageEl.classList.remove('error', 'success');
    }
    
    // Load a puzzle
    function loadPuzzle(difficulty) {
        // Reset mistake counter when loading a new puzzle
        mistakeCount = 0;
        updateMistakeDisplay();
        
        // Get a random puzzle from the library for the selected difficulty
        const puzzles = puzzleLibrary[difficulty];
        
        // Check if we have puzzles for this difficulty
        if (!puzzles || puzzles.length === 0) {
            messageEl.textContent = 'No puzzles available for this difficulty';
            messageEl.classList.add('error');
            return;
        }
        
        const randomIndex = Math.floor(Math.random() * puzzles.length);
        const puzzle = puzzles[randomIndex];
        
        gameBoard = JSON.parse(JSON.stringify(puzzle));
        originalBoard = JSON.parse(JSON.stringify(puzzle));
        
        updateBoardUI();
    }
    
    // Update the board UI based on gameBoard
    function updateBoardUI() {
        const cells = document.querySelectorAll('.cell');
        
        cells.forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            
            // Clear previous states
            cell.classList.remove('fixed', 'invalid', 'hint');
            
            if (originalBoard[row][col] !== 0) {
                cell.classList.add('fixed');
                cell.textContent = originalBoard[row][col];
            } else if (gameBoard[row][col] !== 0) {
                cell.textContent = gameBoard[row][col];
            } else {
                cell.textContent = '';
            }
        });
    }
    
    // Update the mistake counter display
    function updateMistakeDisplay() {
        const mistakeCounter = document.getElementById('mistake-counter');
        if (mistakeCounter) {
            mistakeCounter.textContent = `Mistakes: ${mistakeCount} / ${MAX_MISTAKES}`;
            
            // Update the color based on the number of mistakes
            if (mistakeCount === 0) {
                mistakeCounter.className = '';
            } else if (mistakeCount === 1) {
                mistakeCounter.className = 'warning-low';
            } else if (mistakeCount === 2) {
                mistakeCounter.className = 'warning-high';
            } else {
                mistakeCounter.className = 'error';
            }
        }
    }
    
    // Increment the mistake counter and handle game reset if needed
    function handleMistake(message) {
        mistakeCount++;
        updateMistakeDisplay();
        
        if (mistakeCount >= MAX_MISTAKES) {
            messageEl.textContent = `Game over! You've made ${MAX_MISTAKES} mistakes. Starting a new game...`;
            messageEl.classList.add('error');
            
            // Reset the game after a short delay
            setTimeout(() => {
                const difficulty = difficultySelect.value;
                loadPuzzle(difficulty);
                selectedCell = null;
                selectedRow = -1;
                selectedCol = -1;
                messageEl.textContent = 'New game started after 3 mistakes';
                messageEl.classList.remove('error', 'success');
            }, 2000);
        } else {
            messageEl.textContent = message;
            messageEl.classList.add('error');
        }
    }
    
    // Check if a move is valid
    function isValidMove(row, col, num) {
        // Check row
        for (let x = 0; x < 9; x++) {
            if (gameBoard[row][x] === num) {
                return false;
            }
        }
        
        // Check column
        for (let x = 0; x < 9; x++) {
            if (gameBoard[x][col] === num) {
                return false;
            }
        }
        
        // Check 3x3 box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (gameBoard[boxRow + i][boxCol + j] === num) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    // Solve the puzzle using backtracking
    function solveSudoku(board) {
        const emptyCell = findEmptyCell(board);
        
        if (!emptyCell) {
            return true; // No empty cells left, puzzle solved
        }
        
        const [row, col] = emptyCell;
        
        for (let num = 1; num <= 9; num++) {
            if (isValidPlacement(board, row, col, num)) {
                board[row][col] = num;
                
                if (solveSudoku(board)) {
                    return true;
                }
                
                board[row][col] = 0; // Backtrack
            }
        }
        
        return false; // Trigger backtracking
    }
    
    // Find an empty cell
    function findEmptyCell(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    return [row, col];
                }
            }
        }
        return null; // No empty cells found
    }
    
    // Check if a number can be placed in a specific position
    function isValidPlacement(board, row, col, num) {
        // Check row
        for (let x = 0; x < 9; x++) {
            if (board[row][x] === num) {
                return false;
            }
        }
        
        // Check column
        for (let x = 0; x < 9; x++) {
            if (board[x][col] === num) {
                return false;
            }
        }
        
        // Check 3x3 box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[boxRow + i][boxCol + j] === num) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    // Get a hint
    function getHint() {
        if (selectedRow === -1 || selectedCol === -1) {
            messageEl.textContent = 'Please select a cell first';
            messageEl.classList.add('error');
            return;
        }
        
        if (originalBoard[selectedRow][selectedCol] !== 0) {
            messageEl.textContent = 'Cannot get hint for fixed cells';
            messageEl.classList.add('error');
            return;
        }
        
        // Make a copy of the current board
        const boardCopy = JSON.parse(JSON.stringify(gameBoard));
        
        // Try to solve the copy
        if (solveSudoku(boardCopy)) {
            const hintValue = boardCopy[selectedRow][selectedCol];
            gameBoard[selectedRow][selectedCol] = hintValue;
            
            // Update UI
            updateBoardUI();
            
            // Highlight the hint
            const hintCell = document.querySelector(`.cell[data-row="${selectedRow}"][data-col="${selectedCol}"]`);
            hintCell.classList.add('hint');
            
            messageEl.textContent = `Hint: ${hintValue} at (${selectedRow}, ${selectedCol})`;
            messageEl.classList.remove('error');
            messageEl.classList.add('success');
        } else {
            messageEl.textContent = 'No solution exists for this puzzle';
            messageEl.classList.add('error');
        }
    }
    
    // Check if the solution is correct
    function checkSolution(showMessages = true) {
        // Check if the board is complete
        const emptyCell = findEmptyCell(gameBoard);
        if (emptyCell && showMessages) {
            messageEl.textContent = 'The board is not complete yet';
            messageEl.classList.add('error');
            return false;
        }
        
        // Check rows
        for (let row = 0; row < 9; row++) {
            const used = new Array(10).fill(false);
            for (let col = 0; col < 9; col++) {
                const num = gameBoard[row][col];
                if (num === 0) continue; // Skip empty cells when checking partially filled board
                if (used[num]) {
                    if (showMessages) {
                        messageEl.textContent = `Duplicate ${num} in row ${row}`;
                        messageEl.classList.add('error');
                    }
                    return false;
                }
                used[num] = true;
            }
        }
        
        // Check columns
        for (let col = 0; col < 9; col++) {
            const used = new Array(10).fill(false);
            for (let row = 0; row < 9; row++) {
                const num = gameBoard[row][col];
                if (num === 0) continue; // Skip empty cells
                if (used[num]) {
                    if (showMessages) {
                        messageEl.textContent = `Duplicate ${num} in column ${col}`;
                        messageEl.classList.add('error');
                    }
                    return false;
                }
                used[num] = true;
            }
        }
        
        // Check 3x3 boxes
        for (let boxRow = 0; boxRow < 3; boxRow++) {
            for (let boxCol = 0; boxCol < 3; boxCol++) {
                const used = new Array(10).fill(false);
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        const row = boxRow * 3 + i;
                        const col = boxCol * 3 + j;
                        const num = gameBoard[row][col];
                        if (num === 0) continue; // Skip empty cells
                        if (used[num]) {
                            if (showMessages) {
                                messageEl.textContent = `Duplicate ${num} in 3x3 box`;
                                messageEl.classList.add('error');
                            }
                            return false;
                        }
                        used[num] = true;
                    }
                }
            }
        }
        
        if (showMessages) {
            messageEl.textContent = 'Congratulations! Your solution is correct';
            messageEl.classList.remove('error');
            messageEl.classList.add('success');
        }
        return true;
    }
    
    // Handle keyboard input for selected cell
    document.addEventListener('keydown', (e) => {
        if (customModal.style.display === 'block') {
            // If the custom modal is open, handle input for the custom board
            handleCustomBoardKeypress(e);
            return;
        }
        
        if (!selectedCell) return;
        
        if (e.key >= '1' && e.key <= '9') {
            const num = parseInt(e.key);
            placeNumberInCell(num);
        } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
            clearCell();
        }
    });
    
    // Place a number in the selected cell
    function placeNumberInCell(num) {
        if (!selectedCell) return;
        
        if (originalBoard[selectedRow][selectedCol] !== 0) {
            messageEl.textContent = 'Cannot modify fixed cells';
            messageEl.classList.add('error');
            return;
        }
        
        if (isValidMove(selectedRow, selectedCol, num)) {
            gameBoard[selectedRow][selectedCol] = num;
            selectedCell.textContent = num;
            
            messageEl.textContent = `Placed ${num} at (${selectedRow}, ${selectedCol})`;
            messageEl.classList.remove('error');
            
            // Check if the board is complete and correct
            if (isBoardComplete() && checkSolution(false)) {
                messageEl.textContent = 'Congratulations! You solved the puzzle!';
                messageEl.classList.add('success');
                
                // Add a celebration animation
                addCelebrationEffect();
            }
        } else {
            // This is an invalid move, count it as a mistake
            handleMistake(`Invalid move: ${num} at (${selectedRow}, ${selectedCol})`);
            
            // Highlight the cell as invalid
            selectedCell.classList.add('invalid');
            setTimeout(() => {
                selectedCell.classList.remove('invalid');
            }, 1000);
        }
    }
    
    // Clear the selected cell
    function clearCell() {
        if (!selectedCell) return;
        
        if (originalBoard[selectedRow][selectedCol] !== 0) {
            messageEl.textContent = 'Cannot modify fixed cells';
            messageEl.classList.add('error');
            return;
        }
        
        gameBoard[selectedRow][selectedCol] = 0;
        selectedCell.textContent = '';
        
        messageEl.textContent = `Cleared cell at (${selectedRow}, ${selectedCol})`;
        messageEl.classList.remove('error');
    }
    
    // Check if the board is complete (no empty cells)
    function isBoardComplete() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (gameBoard[row][col] === 0) {
                    return false;
                }
            }
        }
        return true;
    }
    
    // Add a celebration effect when the puzzle is solved
    function addCelebrationEffect() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            setTimeout(() => {
                cell.style.backgroundColor = 'var(--hint-bg)';
                setTimeout(() => {
                    if (!cell.classList.contains('fixed')) {
                        cell.style.backgroundColor = 'var(--cell-bg)';
                    } else {
                        cell.style.backgroundColor = 'var(--fixed-cell-bg)';
                    }
                }, 300);
            }, index * 20);
        });
    }
    
    // Event Listeners
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // New game button
    newGameBtn.addEventListener('click', () => {
        const difficulty = difficultySelect.value;
        loadPuzzle(difficulty);
        selectedCell = null;
        selectedRow = -1;
        selectedCol = -1;
        messageEl.textContent = 'New game started';
        messageEl.classList.remove('error', 'success');
    });
    
    // Solve button
    solveBtn.addEventListener('click', () => {
        // Make a copy of the original board to solve
        const boardToSolve = JSON.parse(JSON.stringify(originalBoard));
        
        if (solveSudoku(boardToSolve)) {
            gameBoard = boardToSolve;
            updateBoardUI();
            messageEl.textContent = 'Puzzle solved';
            messageEl.classList.remove('error');
        } else {
            messageEl.textContent = 'No solution exists for this puzzle';
            messageEl.classList.add('error');
        }
    });
    
    // Hint button
    hintBtn.addEventListener('click', getHint);
    
    // Check button
    checkBtn.addEventListener('click', () => checkSolution(true));
    
    // Custom puzzle button
    customPuzzleBtn.addEventListener('click', () => {
        createCustomBoard();
        customModal.style.display = 'block';
        customValidationMessage.textContent = '';
        customValidationMessage.classList.remove('error');
    });
    
    // Close custom modal
    closeModalBtn.addEventListener('click', () => {
        customModal.style.display = 'none';
    });
    
    // Click outside modal to close
    window.addEventListener('click', (e) => {
        if (e.target === customModal) {
            customModal.style.display = 'none';
        }
    });
    
    // Save custom puzzle
    saveCustomBtn.addEventListener('click', () => {
        if (saveCustomPuzzle(customPuzzleData)) {
            customValidationMessage.textContent = 'Puzzle saved successfully!';
            customValidationMessage.classList.remove('error');
            
            // Update the difficulty select to include custom option
            let customOption = Array.from(difficultySelect.options).find(opt => opt.value === 'custom');
            if (!customOption) {
                customOption = document.createElement('option');
                customOption.value = 'custom';
                customOption.textContent = 'Custom';
                difficultySelect.appendChild(customOption);
            }
            
            // Close the modal after a delay
            setTimeout(() => {
                customModal.style.display = 'none';
                // Select the custom difficulty and load a custom puzzle
                difficultySelect.value = 'custom';
                loadPuzzle('custom');
            }, 1500);
        }
    });
    
    // Clear custom board
    clearCustomBtn.addEventListener('click', () => {
        customPuzzleData = Array(9).fill().map(() => Array(9).fill(0));
        updateCustomBoardUI();
        customValidationMessage.textContent = '';
        customValidationMessage.classList.remove('error');
    });
    
    // Add event listeners for number pad buttons
    document.querySelectorAll('.num-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const num = parseInt(btn.dataset.num);
            if (num === 0) {
                clearCell();
            } else {
                placeNumberInCell(num);
            }
        });
    });
    
    // Difficulty change
    difficultySelect.addEventListener('change', () => {
        const difficulty = difficultySelect.value;
        loadPuzzle(difficulty);
        selectedCell = null;
        selectedRow = -1;
        selectedCol = -1;
        messageEl.textContent = `New ${difficulty} game started`;
        messageEl.classList.remove('error', 'success');
    });
    
    // Initialize
    initTheme();
    loadCustomPuzzles();
    createBoard();
    loadPuzzle('easy');
}); 