#include "../include/sudoku.h"
#include <iostream>
#include <string>
#include <limits>

void showUsage(const std::string& programName) {
    std::cout << "Usage: " << programName << " [input_file]\n";
    std::cout << "If no input file is provided, a default puzzle will be used.\n";
}

void displayHelp() {
    std::cout << "\nCommands:" << std::endl;
    std::cout << "  input format: row col value (e.g., 1 2 5 to place 5 in row 1, column 2)" << std::endl;
    std::cout << "  clear:        row col 0  (e.g., 1 2 0 to clear a cell)" << std::endl;
    std::cout << "  h:            Show this help menu" << std::endl;
    std::cout << "  hint:         Get a hint" << std::endl;
    std::cout << "  check:        Check if your solution is correct" << std::endl;
    std::cout << "  solve:        Show the solution" << std::endl;
    std::cout << "  quit:         Exit the game" << std::endl;
    std::cout << "\nNote: Rows and columns are 0-indexed (0-8)" << std::endl;
}

void playGame(Sudoku& sudoku) {
    std::string command;
    bool running = true;
    
    std::cout << "\nWelcome to Sudoku! Type 'h' for help." << std::endl;
    sudoku.printBoard();
    
    while (running) {
        std::cout << "\nEnter command or move: ";
        std::cin >> command;
        
        if (command == "h" || command == "help") {
            displayHelp();
        }
        else if (command == "hint") {
            int row, col, num;
            if (sudoku.getHint(row, col, num)) {
                std::cout << "Hint: Place " << num << " at position (" << row << ", " << col << ")" << std::endl;
                sudoku.printBoard();
            } else {
                std::cout << "No hint available." << std::endl;
            }
        }
        else if (command == "check") {
            if (sudoku.isComplete()) {
                if (sudoku.checkSolution()) {
                    std::cout << "Congratulations! Your solution is correct." << std::endl;
                } else {
                    std::cout << "Your solution is incorrect. Keep trying!" << std::endl;
                }
            } else {
                std::cout << "The board is not complete yet." << std::endl;
            }
        }
        else if (command == "solve") {
            std::cout << "Solving the puzzle for you..." << std::endl;
            auto originalBoard = sudoku.getBoard();
            if (sudoku.solveSudoku()) {
                std::cout << "Solution:" << std::endl;
                sudoku.printBoard();
            } else {
                std::cout << "This puzzle has no solution." << std::endl;
            }
            
            std::cout << "Would you like to continue playing with your current progress? (y/n): ";
            char choice;
            std::cin >> choice;
            if (choice == 'y' || choice == 'Y') {
                sudoku.setBoard(originalBoard);
                sudoku.printBoard();
            } else {
                running = false;
            }
        }
        else if (command == "quit" || command == "exit") {
            std::cout << "Thanks for playing!" << std::endl;
            running = false;
        }
        else {
            // Try to parse as move
            int row, col, value;
            try {
                row = std::stoi(command);
                std::cin >> col >> value;
                
                if (row >= 0 && row < 9 && col >= 0 && col < 9 && value >= 0 && value <= 9) {
                    if (sudoku.isFixed(row, col)) {
                        std::cout << "Cannot modify fixed cells from the original puzzle." << std::endl;
                    } else if (value == 0) {
                        sudoku.placeNumber(row, col, 0);
                        std::cout << "Cell cleared." << std::endl;
                        sudoku.printBoard();
                    } else if (sudoku.placeNumber(row, col, value)) {
                        std::cout << "Move accepted." << std::endl;
                        sudoku.printBoard();
                        
                        if (sudoku.isComplete() && sudoku.checkSolution()) {
                            std::cout << "Congratulations! You've solved the puzzle!" << std::endl;
                            std::cout << "Would you like to play again? (y/n): ";
                            char choice;
                            std::cin >> choice;
                            if (choice != 'y' && choice != 'Y') {
                                running = false;
                            } else {
                                // Reset with a new puzzle
                                std::vector<std::vector<int>> defaultPuzzle = {
                                    {5, 3, 0, 0, 7, 0, 0, 0, 0},
                                    {6, 0, 0, 1, 9, 5, 0, 0, 0},
                                    {0, 9, 8, 0, 0, 0, 0, 6, 0},
                                    {8, 0, 0, 0, 6, 0, 0, 0, 3},
                                    {4, 0, 0, 8, 0, 3, 0, 0, 1},
                                    {7, 0, 0, 0, 2, 0, 0, 0, 6},
                                    {0, 6, 0, 0, 0, 0, 2, 8, 0},
                                    {0, 0, 0, 4, 1, 9, 0, 0, 5},
                                    {0, 0, 0, 0, 8, 0, 0, 7, 9}
                                };
                                sudoku.setBoard(defaultPuzzle);
                                sudoku.printBoard();
                            }
                        }
                    } else {
                        std::cout << "Invalid move. This value conflicts with Sudoku rules." << std::endl;
                    }
                } else {
                    std::cout << "Invalid input. Row and column must be 0-8, value must be 0-9." << std::endl;
                }
            } catch (const std::exception& e) {
                std::cout << "Invalid command. Type 'h' for help." << std::endl;
                // Clear the input stream
                std::cin.clear();
                std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
            }
        }
    }
}

int main(int argc, char* argv[]) {
    Sudoku sudoku;
    
    if (argc > 1) {
        // Load from file
        if (!sudoku.loadFromFile(argv[1])) {
            std::cerr << "Failed to load puzzle from file: " << argv[1] << std::endl;
            return 1;
        }
    } else {
        // Use a default puzzle if no file is provided
        std::vector<std::vector<int>> defaultPuzzle = {
            {5, 3, 0, 0, 7, 0, 0, 0, 0},
            {6, 0, 0, 1, 9, 5, 0, 0, 0},
            {0, 9, 8, 0, 0, 0, 0, 6, 0},
            {8, 0, 0, 0, 6, 0, 0, 0, 3},
            {4, 0, 0, 8, 0, 3, 0, 0, 1},
            {7, 0, 0, 0, 2, 0, 0, 0, 6},
            {0, 6, 0, 0, 0, 0, 2, 8, 0},
            {0, 0, 0, 4, 1, 9, 0, 0, 5},
            {0, 0, 0, 0, 8, 0, 0, 7, 9}
        };
        sudoku.setBoard(defaultPuzzle);
    }
    
    std::cout << "Select mode:" << std::endl;
    std::cout << "1. Play game" << std::endl;
    std::cout << "2. Solve puzzle" << std::endl;
    std::cout << "Enter choice (1 or 2): ";
    
    int choice;
    std::cin >> choice;
    
    if (choice == 1) {
        playGame(sudoku);
    } else {
        std::cout << "Original Sudoku puzzle:" << std::endl;
        sudoku.printBoard();
        
        std::cout << "\nSolving..." << std::endl;
        if (sudoku.solveSudoku()) {
            std::cout << "\nSolution found:" << std::endl;
            sudoku.printBoard();
        } else {
            std::cout << "\nNo solution exists for this puzzle." << std::endl;
        }
    }
    
    return 0;
} 