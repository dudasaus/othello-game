import { TILE_TYPE } from './othello.js';

// Computer player for Othello
class ComputerPlayer {
  constructor() {
    this.game = null;
    this.initializePointsGrid = this.initializePointsGrid.bind(this);
    this.initializePointsGrid();

    this.beforePlay = this.beforePlay.bind(this);
    this.afterPlay = this.afterPlay.bind(this);
    this.isCorner = this.isCorner.bind(this);
    this.setCornerValues = this.setCornerValues.bind(this);
    this.makeMove = this.makeMove.bind(this);
  }

  initializePointsGrid() {
    // How valuable a move is at a given board position
    this.pointsGrid = [
      [500, 100, 450, 300, 300, 450, 100, 500],
      [100, 100, 400, 150, 150, 400, 100, 100],
      [450, 400, 400, 200, 200, 400, 400, 450],
      [300, 150, 200, 200, 200, 200, 150, 300],
      [300, 150, 200, 200, 200, 200, 150, 300],
      [450, 400, 400, 200, 200, 400, 400, 450],
      [100, 100, 400, 150, 150, 400, 100, 100],
      [500, 100, 450, 300, 300, 450, 100, 500]
    ];
    // Make a copy
    this.lastEvaluation = [];
    for (let i of this.pointsGrid) {
      this.lastEvaluation.push(i.slice());
    }
  }

  beforePlay() {
    if (this.game.lastMove === null) return;
    // Adjust points grid based on opponent's last move
    const lastMove = this.game.lastMove;
    if (this.isCorner(lastMove.r, lastMove.c)) {
      console.log('Last play was in corner, updating grid');
      this.setCornerValues(lastMove.r, lastMove.c, 115, 125);
    }
  }

  afterPlay() {
    // Adjust points grid based on the move the computer just made
    const lastMove = this.game.lastMove;
    if (this.isCorner(lastMove.r, lastMove.c)) {
      console.log('Just played in corner, updating grid');
      this.setCornerValues(lastMove.r, lastMove.c, 475, 465);
    }
  }

  isCorner(r, c) {
    const bz = this.game.boardSize - 1;
    return (
      (r === 0 || r === bz) &&
      (c === 0 || c === bz)
    );
  }

  setCornerValues(r, c, sideVal, diagVal) {
    const bz = this.game.boardSize - 1;
    // Left and right sides of corner
    if (c == 0) {
      this.pointsGrid[r][c + 1] = sideVal;
    }
    else {
      this.pointsGrid[r][c - 1] = sideVal;
    }
    // Top and bottom sides of corner
    if (r == 0) {
      this.pointsGrid[r + 1][c] = sideVal;
      // Diag vals for top row
      if (c == 0) {
        this.pointsGrid[r + 1][c + 1] = diagVal;
      }
      else {
        this.pointsGrid[r + 1][c - 1] = diagVal;
      }
    }
    else {
      this.pointsGrid[r - 1][c] = sideVal;
      // Diag vals for bottom row
      if (c == 0) {
        this.pointsGrid[r - 1][c + 1] = diagVal;
      }
      else {
        this.pointsGrid[r - 1][c - 1] = diagVal;
      }
    }
  }

  makeMove() {
    this.beforePlay();

    let bestMoveValue = 0;
    let rPos = 0;
    let cPos = 0;

    const canFlip = this.game.canFlipAny();

    for (let r = 0; r < this.game.boardSize; ++r) {
      for (let c = 0; c < this.game.boardSize; ++c) {
        this.lastEvaluation[r][c] = 'inv';
        if (this.game.boardState[r][c] !== TILE_TYPE.EMPTY) {
          // this.lastEvaluation[r][c] = 'inv';
          continue;
        }
        let moveValue = 0;
        if (canFlip) {
          // Look for best traditional move
          moveValue = this.game.checkAllDirections(r, c);
          this.lastEvaluation[r][c] = `p ${moveValue}`;
          if (moveValue > 0 && this.game.moves > 2) {
            // Add grid value
            moveValue += this.pointsGrid[r][c];
            this.lastEvaluation[r][c] = `g ${moveValue}`;
          }
        }
        else {
          // Strictly based on grid value
          if (this.game.hasAdjacent(r, c)) {
            moveValue = this.pointsGrid[r][c];
            this.lastEvaluation[r][c] = `g ${moveValue}`;
          }
        }
        // Update most recent evaluation
        // this.lastEvaluation[r][c] = moveValue;
        // Check if we found a new best move
        if (moveValue > bestMoveValue) {
          bestMoveValue = moveValue;
          rPos = r;
          cPos = c;
        }
      }
    }

    // Play piece
    if (!this.game.playPiece(rPos, cPos)) {
      console.error(`Computer tried to play in invalid place: ${rPos + ', ' + cPos}`);
    }
    else {
      this.afterPlay();
    }
  }
}

module.exports = { ComputerPlayer };
