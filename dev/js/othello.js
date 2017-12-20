class Othello {
  constructor() {
    this.boardSize = 8;
    this.initialBoardState = this.initialBoardState.bind(this);
    this.initialBoardState();
    this.currentTurn = 0;
  }

  initialBoardState() {
    this.boardState = new Array(this.boardSize);
    for (let i = 0; i < this.boardSize; ++i) {
      this.boardState[i] = new Array(this.boardSize);
      for (let j = 0; j < this.boardSize; ++j) {
        this.boardState[i][j] = TILE_TYPE.EMPTY;
      }
    }
    const mid = Math.floor(this.boardSize / 2) - 1;
    this.boardState[mid][mid] = TILE_TYPE.WHITE;
    this.boardState[mid][mid + 1] = TILE_TYPE.BLACK;
    this.boardState[mid + 1][mid] = TILE_TYPE.BLACK;
    this.boardState[mid + 1][mid + 1] = TILE_TYPE.WHITE;
  }

  printBoard() {
    for (let r = 0; r < this.boardSize; ++r) {
      let line = '';
      for (let c = 0; c < this.boardSize; ++c) {
        switch (this.boardState[r][c]) {
          case TILE_TYPE.BLACK:
            line += 'X';
            break;
          case TILE_TYPE.WHITE:
            line += 'O';
            break;
          default:
            line += '.';
            break;
        }
      }
      console.log(line);
    }
  }
}

const TILE_TYPE = {
  EMPTY: 0,
  BLACK: 1,
  WHITE: 2
}

module.exports = { Othello }
