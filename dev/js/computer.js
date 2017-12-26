// Computer player for Othello
class ComputerPlayer {
  constructor() {
    this.game = null;
    this.initializePointsGrid = this.initializePointsGrid.bind(this);
    this.initializePointsGrid();

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
  }

  makeMove() {
    let bestMoveValue = 0;
    let rPos = 0;
    let cPos = 0;

    const canFlip = this.game.canFlipAny();

    for (let r = 0; r < this.game.boardSize; ++r) {
      for (let c = 0; c < this.game.boardSize; ++c) {
        if (this.game.boardState[r][c] !== 0) continue;
        let moveValue = 0;
        if (canFlip) {
          // Look for best traditional move
          moveValue = this.game.checkAllDirections(r, c);
          if (moveValue > 0 && this.game.moves > 2) {
            // Add grid value
            moveValue += this.pointsGrid[r][c];
          }
        }
        else {
          // Strictly based on grid value
          if (this.game.hasAdjacent(r, c)) {
            moveValue = this.pointsGrid[r][c];
          }
        }
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
  }
}

module.exports = { ComputerPlayer };
