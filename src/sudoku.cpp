#include "../include/sudoku.h"
#include <iostream>
#include <fstream>
#include <sstream>

Sudoku::Sudoku() {
    // Initialize board with 9x9 zeros
    board = std::vector<std::vector<int>>(9, std::vector<int>(9, 0));
    // Initialize fixed cells (none are fixed initially)
    fixed = std::vector<std::vector<bool>>(9, std::vector<bool>(9, false));
}

Sudoku::Sudoku(const std::string& filename) {
    // Initialize board
    board = std::vector<std::vector<int>>(9, std::vector<int>(9, 0));
    // Initialize fixed cells
    fixed = std::vector<std::vector<bool>>(9, std::vector<bool>(9, false));
    
    // Load from file
    loadFromFile(filename);
}

bool Sudoku::loadFromFile(const std::string& filename) {
    std::ifstream file(filename);
    if (!file.is_open()) {
        std::cerr << "Error opening file: " << filename << std::endl;
        return false;
    }
    
    std::string line;
    int row = 0;
    
    while (std::getline(file, line) && row < 9) {
        if (line.empty())
            continue;
            
        for (int col = 0; col < 9 && col < line.length(); col++) {
            if (line[col] == '.' || line[col] == '0')
                board[row][col] = 0;
            else if (line[col] >= '1' && line[col] <= '9') {
                board[row][col] = line[col] - '0';
                // Mark cell as fixed since it's part of the original puzzle
                fixed[row][col] = true;
            }
        }
        row++;
    }
    
    file.close();
    return true;
}

void Sudoku::setBoard(const std::vector<std::vector<int>>& newBoard) {
    // Validate board size
    if (newBoard.size() != 9)
        return;
        
    for (const auto& row : newBoard) {
        if (row.size() != 9)
            return;
    }
    
    board = newBoard;
    
    // Update fixed cells based on new board
    fixed = std::vector<std::vector<bool>>(9, std::vector<bool>(9, false));
    for (int i = 0; i < 9; i++) {
        for (int j = 0; j < 9; j++) {
            if (board[i][j] != 0) {
                fixed[i][j] = true;
            }
        }
    }
}

std::vector<std::vector<int>> Sudoku::getBoard() const {
    return board;
}

bool Sudoku::isValid(int row, int col, int num) {
    // Check row
    for (int x = 0; x < 9; x++) {
        if (board[row][x] == num)
            return false;
    }
    
    // Check column
    for (int x = 0; x < 9; x++) {
        if (board[x][col] == num)
            return false;
    }
    
    // Check 3x3 box
    int startRow = row - row % 3;
    int startCol = col - col % 3;
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            if (board[i + startRow][j + startCol] == num)
                return false;
        }
    }
    
    return true;
}

bool Sudoku::solve() {
    // Find an empty cell
    int row = -1, col = -1;
    bool isEmpty = false;
    
    for (int i = 0; i < 9; i++) {
        for (int j = 0; j < 9; j++) {
            if (board[i][j] == 0) {
                row = i;
                col = j;
                isEmpty = true;
                break;
            }
        }
        if (isEmpty)
            break;
    }
    
    // No empty cell means we're done
    if (!isEmpty)
        return true;
    
    // Try digits 1-9 for the empty cell
    for (int num = 1; num <= 9; num++) {
        if (isValid(row, col, num)) {
            // Try this number
            board[row][col] = num;
            
            // Recursively try to solve the rest
            if (solve())
                return true;
            
            // If we get here, this number didn't work, reset and try next
            board[row][col] = 0;
        }
    }
    
    // Trigger backtracking
    return false;
}

bool Sudoku::solveSudoku() {
    return solve();
}

void Sudoku::printBoard() const {
    for (int i = 0; i < 9; i++) {
        if (i % 3 == 0 && i != 0)
            std::cout << "---------------------" << std::endl;
            
        for (int j = 0; j < 9; j++) {
            if (j % 3 == 0 && j != 0)
                std::cout << "| ";
                
            if (board[i][j] == 0)
                std::cout << ". ";
            else
                std::cout << board[i][j] << " ";
        }
        std::cout << std::endl;
    }
}

// Game playing methods
bool Sudoku::isValidMove(int row, int col, int num) const {
    // Check if cell position is valid
    if (row < 0 || row >= 9 || col < 0 || col >= 9) {
        return false;
    }
    
    // Check if the cell is fixed (part of the original puzzle)
    if (fixed[row][col]) {
        return false;
    }
    
    // Check if the number is valid (1-9)
    if (num < 1 || num > 9) {
        return false;
    }
    
    // Check row
    for (int x = 0; x < 9; x++) {
        if (board[row][x] == num) {
            return false;
        }
    }
    
    // Check column
    for (int x = 0; x < 9; x++) {
        if (board[x][col] == num) {
            return false;
        }
    }
    
    // Check 3x3 box
    int startRow = row - row % 3;
    int startCol = col - col % 3;
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            if (board[i + startRow][j + startCol] == num) {
                return false;
            }
        }
    }
    
    return true;
}

bool Sudoku::placeNumber(int row, int col, int num) {
    // Check if the position is valid
    if (row < 0 || row >= 9 || col < 0 || col >= 9) {
        return false;
    }
    
    // Check if the position is fixed
    if (fixed[row][col]) {
        return false;
    }
    
    // If num is 0, it means clear the cell
    if (num == 0) {
        board[row][col] = 0;
        return true;
    }
    
    // Check if it's a valid move
    if (!isValidMove(row, col, num)) {
        return false;
    }
    
    // Place the number
    board[row][col] = num;
    return true;
}

bool Sudoku::checkSolution() const {
    // Check if board is complete
    for (int i = 0; i < 9; i++) {
        for (int j = 0; j < 9; j++) {
            if (board[i][j] == 0) {
                return false;  // Incomplete
            }
        }
    }
    
    // Check rows
    for (int row = 0; row < 9; row++) {
        bool used[10] = {false};
        for (int col = 0; col < 9; col++) {
            int num = board[row][col];
            if (used[num]) {
                return false;  // Duplicate in row
            }
            used[num] = true;
        }
    }
    
    // Check columns
    for (int col = 0; col < 9; col++) {
        bool used[10] = {false};
        for (int row = 0; row < 9; row++) {
            int num = board[row][col];
            if (used[num]) {
                return false;  // Duplicate in column
            }
            used[num] = true;
        }
    }
    
    // Check 3x3 boxes
    for (int boxRow = 0; boxRow < 3; boxRow++) {
        for (int boxCol = 0; boxCol < 3; boxCol++) {
            bool used[10] = {false};
            for (int i = 0; i < 3; i++) {
                for (int j = 0; j < 3; j++) {
                    int row = boxRow * 3 + i;
                    int col = boxCol * 3 + j;
                    int num = board[row][col];
                    if (used[num]) {
                        return false;  // Duplicate in box
                    }
                    used[num] = true;
                }
            }
        }
    }
    
    return true;  // Valid solution
}

bool Sudoku::getHint(int& row, int& col, int& num) {
    // Save the current state of the board
    auto originalBoard = board;
    
    // Find an empty cell
    bool found = false;
    for (int i = 0; i < 9 && !found; i++) {
        for (int j = 0; j < 9 && !found; j++) {
            if (board[i][j] == 0) {
                row = i;
                col = j;
                found = true;
            }
        }
    }
    
    if (!found) {
        return false;  // No empty cell found
    }
    
    // Solve the puzzle to find the correct number
    if (solve()) {
        num = board[row][col];
        // Restore the original board except for the hint
        board = originalBoard;
        board[row][col] = num;
        return true;
    }
    
    // If no solution is found
    board = originalBoard;
    return false;
}

bool Sudoku::isFixed(int row, int col) const {
    if (row < 0 || row >= 9 || col < 0 || col >= 9) {
        return false;
    }
    return fixed[row][col];
}

bool Sudoku::isComplete() const {
    for (int i = 0; i < 9; i++) {
        for (int j = 0; j < 9; j++) {
            if (board[i][j] == 0) {
                return false;
            }
        }
    }
    return true;
} 