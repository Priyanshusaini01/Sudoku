#ifndef SUDOKU_H
#define SUDOKU_H

#include <vector>
#include <string>

class Sudoku {
private:
    // 9x9 grid to represent the Sudoku board
    std::vector<std::vector<int>> board;
    
    // Original puzzle to keep track of which cells can be modified
    std::vector<std::vector<bool>> fixed;
    
    // Helper function to check if a number can be placed in a specific position
    bool isValid(int row, int col, int num);
    
    // Helper recursive function for solving the Sudoku using backtracking
    bool solve();

public:
    // Constructor to initialize an empty board
    Sudoku();
    
    // Constructor to initialize board from a file
    Sudoku(const std::string& filename);
    
    // Load a board from a file
    bool loadFromFile(const std::string& filename);
    
    // Load a board from a 2D vector
    void setBoard(const std::vector<std::vector<int>>& newBoard);
    
    // Get the current board
    std::vector<std::vector<int>> getBoard() const;
    
    // Function to solve the Sudoku puzzle
    bool solveSudoku();
    
    // Print the current state of the board
    void printBoard() const;

    // Game playing methods
    // Check if a number can be placed at a specific position
    bool isValidMove(int row, int col, int num) const;
    
    // Place a number at a specific position
    bool placeNumber(int row, int col, int num);
    
    // Check if the current board state is a valid solution
    bool checkSolution() const;
    
    // Get a hint for the next move
    bool getHint(int& row, int& col, int& num);
    
    // Check if the position is fixed (part of original puzzle)
    bool isFixed(int row, int col) const;
    
    // Check if the board is complete
    bool isComplete() const;
};

#endif // SUDOKU_H 