class Othello {
  constructor(player1=null, player2=null) {
    this.moves = 60;

    this.players = [null, player1, player2]; // dummy 0th element
    for (let p = 0; p < this.players.length; ++p) {
      let player = this.players[p];
      if (player !== null) {
        player.game = this;
        player.color = p;
      }
    }

    this.lastMove = null;

    this.boardSize = 8;
    this.initialBoardState = this.initialBoardState.bind(this);
    this.initialBoardState();
    this.currentTurn = TILE_TYPE.BLACK;
    this.playPiece = this.playPiece.bind(this);
    this.flipPiece = this.flipPiece.bind(this);
    this.checkValidMove = this.checkValidMove.bind(this);
    this.checkDirection = this.checkDirection.bind(this);
    this.checkAllDirections = this.checkAllDirections.bind(this);
    this.flipDirection = this.flipDirection.bind(this);
    this.flipAllDirections = this.flipAllDirections.bind(this);
    this.canFlipAny = this.canFlipAny.bind(this);
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

  playPiece(r, c, mustCheckValid=true) {
    if (mustCheckValid) {
      if (!this.checkValidMove(r, c)) {
        return false;
      }
    }
    this.boardState[r][c] = this.currentTurn;
    this.flipAllDirections(r, c);
    this.lastMove = {r, c};
    this.currentTurn = (this.currentTurn == TILE_TYPE.BLACK) ? TILE_TYPE.WHITE : TILE_TYPE.BLACK;
    --this.moves;
    return true;
  }

  checkValidMove(r, c) {
    // Make sure the tile is empty
    if (this.boardState[r][c] != TILE_TYPE.EMPTY) {
      return false;
    }
    // Will this move flip any pieces?
    if (this.checkAllDirections(r, c) == 0) {
      // Is there a move that can flip pieces?
      if (this.canFlipAny()) {
        return false;
      }
      else if (!this.hasAdjacent(r, c)) {
        return false;
      }
      else {
        return true;
      }
    }
    return true;
  }

  // Returns the number of pieces that would flip in the given direction
  // rChange and cChange must be in [-1, 1]
  checkDirection(r, c, rChange, cChange) {
    // Check adjacent tile is in bounds
    if (
      r + rChange >= this.boardSize ||
      r + rChange < 0 ||
      c + cChange >= this.boardSize ||
      c + cChange < 0
    ) { return 0; }
    // Check adjacent tile is the opposite color
    const ajacentTile = this.boardState[r + rChange][c + cChange];
    if (ajacentTile == this.currentTurn || ajacentTile == TILE_TYPE.EMPTY) {
      return 0;
    }
    // Continue checking down the line
    for (let i = 2; i < this.boardSize; ++i) {
      const rCheck = r + i * rChange;
      const cCheck = c + i * cChange;
      // Check bounds
      if (
        rCheck < 0 || rCheck >= this.boardSize ||
        cCheck < 0 || cCheck >= this.boardSize
      ) { return 0; }

      const tileCheck = this.boardState[rCheck][cCheck];
      // If it's empty, nothing will flip
      if (tileCheck == TILE_TYPE.EMPTY) { return 0; }
      // If it's the player's color, we will flip i - 1 pieces
      if (tileCheck == this.currentTurn) { return i - 1; }
    }

    return 0;
  }

  // Returns the total number of tiles that would flip if played here
  checkAllDirections(r, c) {
    return (
      this.checkDirection(r, c, 0, 1) +
      this.checkDirection(r, c, 1, 1) +
      this.checkDirection(r, c, 1, 0) +
      this.checkDirection(r, c, 1, -1) +
      this.checkDirection(r, c, 0, -1) +
      this.checkDirection(r, c, -1, -1) +
      this.checkDirection(r, c, -1, 0) +
      this.checkDirection(r, c, -1, 1)
    );
  }

  hasAdjacent(r, c) {
    return (
      this.checkAdjacentDirection(r, c, 0, 1) ||
      this.checkAdjacentDirection(r, c, 1, 1) ||
      this.checkAdjacentDirection(r, c, 1, 0) ||
      this.checkAdjacentDirection(r, c, 1, -1) ||
      this.checkAdjacentDirection(r, c, 0, -1) ||
      this.checkAdjacentDirection(r, c, -1, -1) ||
      this.checkAdjacentDirection(r, c, -1, 0) ||
      this.checkAdjacentDirection(r, c, -1, 1)
    );
  }

  checkAdjacentDirection(r, c, rChange, cChange) {
    // Check for in bounds
    if (
      r + rChange >= this.boardSize ||
      r + rChange < 0 ||
      c + cChange >= this.boardSize ||
      c + cChange < 0
    ) { return false; }
    return (this.boardState[r + rChange][c + cChange] !== TILE_TYPE.EMPTY);
  }

  canFlipAny() {
    for (let r = 0; r < this.boardSize; ++r) {
      for (let c = 0; c < this.boardSize; ++c) {
        if (this.boardState[r][c] == TILE_TYPE.EMPTY && this.checkAllDirections(r,c) > 0) {
          // console.log(r, c);
          return true;
        }
      }
    }
    return false;
  }

  flipDirection(r, c, rChange, cChange) {
    const count = this.checkDirection(r, c, rChange, cChange);
    for (let i = 1; i <= count; ++i) {
      this.flipPiece(r + i * rChange, c + i * cChange);
    }
    return count;
  }

  flipAllDirections(r, c) {
    return (
      this.flipDirection(r, c, 0, 1) +
      this.flipDirection(r, c, 1, 1) +
      this.flipDirection(r, c, 1, 0) +
      this.flipDirection(r, c, 1, -1) +
      this.flipDirection(r, c, 0, -1) +
      this.flipDirection(r, c, -1, -1) +
      this.flipDirection(r, c, -1, 0) +
      this.flipDirection(r, c, -1, 1)
    );
  }

  flipPiece(r, c) {
    if (this.boardState[r][c] == TILE_TYPE.BLACK) {
      this.boardState[r][c] = TILE_TYPE.WHITE;
    }
    else if (this.boardState[r][c] == TILE_TYPE.WHITE) {
      this.boardState[r][c] = TILE_TYPE.BLACK;
    }
  }

  computerTurn() {
    if (this.players[this.currentTurn] !== null) {
      this.players[this.currentTurn].makeMove();
    }
    else {
      console.error(`Othello: not computer's turn`);
    }
  }

  countPieces(tiletype) {
    let count = 0;
    for (let r = 0; r < this.boardSize; ++r) {
      for (let c = 0; c < this.boardSize; ++c) {
        if (this.boardState[r][c] === tiletype) {
          ++count;
        }
      }
    }
    return count;
  }
}

const TILE_TYPE = {
  EMPTY: 0,
  BLACK: 1,
  WHITE: 2
};

module.exports = { Othello, TILE_TYPE };
