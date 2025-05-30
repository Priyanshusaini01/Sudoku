# Sudoku Solver

A versatile Sudoku solver and game implementation available in both web and C++ versions. This project provides an interactive way to play, solve, and create Sudoku puzzles.

## Features

### Web Version
- Interactive 9x9 Sudoku board
- Multiple difficulty levels (Easy, Medium, Hard)
- Custom puzzle creation and saving
- Dark/Light theme support
- Number pad for easy input
- Hint system
- Mistake tracking (limited to 3 mistakes)
- Solution checking
- Auto-solver capability
- Responsive design

### C++ Version
- Command-line interface
- File-based puzzle loading
- Interactive gameplay
- Hint system
- Solution verification
- Auto-solver
- Custom puzzle support

## Getting Started

### Web Version
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Open your browser and navigate to `http://localhost:3000`

### C++ Version
1. Clone the repository
2. Build the project:
   ```bash
   mkdir build
   cd build
   cmake ..
   make
   ```
3. Run the program:
   ```bash
   ./sudoku-solver [optional_input_file]
   ```

## How to Play

### Web Version
1. Select a difficulty level
2. Click "New Game" to start
3. Click on an empty cell
4. Enter a number (1-9) using keyboard or number pad
5. Use the controls:
   - "Get Hint" - Get help with the next move
   - "Check Solution" - Verify your progress
   - "Solve Puzzle" - See the complete solution
   - "Create Custom" - Make your own puzzle

### C++ Version
1. Choose game mode (1 for play, 2 for solve)
2. Enter moves in format: `row col value`
   - Example: `1 2 5` places 5 in row 1, column 2
   - Use `row col 0` to clear a cell
3. Available commands:
   - `h` - Show help menu
   - `hint` - Get a hint
   - `check` - Verify solution
   - `solve` - Show complete solution
   - `quit` - Exit game

## Project Structure

```
Sudoku-solver/
├── web/                 # Web version
│   ├── index.html      # Main HTML file
│   ├── style.css       # Styling
│   └── script.js       # Game logic
├── src/                # C++ version
│   └── main.cpp        # Main program
├── include/            # C++ headers
│   └── sudoku.h        # Sudoku class definition
├── server.js           # Web server
└── package.json        # Node.js dependencies
```

## Technologies Used

### Web Version
- HTML5
- CSS3
- JavaScript
- Node.js
- Express.js

### C++ Version
- C++17
- CMake
- Standard Template Library (STL)

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the ISC License. 