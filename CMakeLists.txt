cmake_minimum_required(VERSION 3.10)
project(SudokuSolver)

set(CMAKE_CXX_STANDARD 14)

add_executable(SudokuSolver 
    src/main.cpp
    src/sudoku.cpp
)

include_directories(include) 