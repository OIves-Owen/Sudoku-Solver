# Sudoku-Solver
p5.js project for solving sudoku puzzles

Work in progress 

Currently upon reaching a non-obvious solution, the solver will make a single random guess.
If this does not lead to the correct solution, the sketch resets until the solution is found.
This is mostly successful for solving basic sudokus but will require more work to solve more complex puzzles.

Edit: working on adding a stack of previous moves in order to pop from when a guess was incorrect.
