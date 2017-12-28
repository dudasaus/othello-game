import { TILE_TYPE } from './othello.js';

// Computer player for Othello
class SmartComputerPlayer {
  constructor() {
    this.game = null;
    this.initializePointsGrid = this.initializePointsGrid.bind(this);
    this.initializePointsGrid();

    this.beforePlay = this.beforePlay.bind(this);
    this.afterPlay = this.afterPlay.bind(this);
    this.isCorner = this.isCorner.bind(this);
    this.setCornerValues = this.setCornerValues.bind(this);
    this.evaluateEdge = this.evaluateEdge.bind(this);
    this.makeMove = this.makeMove.bind(this);
  }

  initializePointsGrid() {
    // How valuable a move is at a given board position
    this.pointsGrid = [
      [500, 100, 450, 300, 300, 450, 100, 500],
      [100, 100, 250, 150, 150, 300, 100, 100],
      [450, 250, 250, 200, 200, 250, 250, 450],
      [300, 150, 200, 200, 200, 200, 150, 300],
      [300, 150, 200, 200, 200, 200, 150, 300],
      [450, 250, 250, 200, 200, 250, 250, 450],
      [100, 100, 250, 150, 150, 250, 100, 100],
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
    this.evaluateEdge(EDGES.RIGHT);
    this.evaluateEdge(EDGES.TOP);
    this.evaluateEdge(EDGES.LEFT);
    this.evaluateEdge(EDGES.BOTTOM);
  }

  afterPlay() {
    // Do nothing
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

  evaluateEdge(edge) {
    const board = this.game.boardState;
    const me = this.color;
    const opponent = (me === TILE_TYPE.BLACK) ? TILE_TYPE.WHITE : TILE_TYPE.BLACK;
    let edgeValue = [500, 100, 450, 300, 300, 450, 100, 500];
    let edgeTiles = new Array(this.game.boardSize);

    // Get edge tiles
    if (edge === EDGES.TOP) {
      edgeTiles = board[0].slice();
    }
    else if (edge === EDGES.BOTTOM) {
      edgeTiles = board[this.game.boardSize - 1].slice();
    }
    else if (edge === EDGES.LEFT) {
      for (let i = 0; i < this.game.boardSize; ++i) {
        edgeTiles[i] = board[i][0];
      }
    }
    else if (edge === EDGES.RIGHT) {
      for (let i = 0; i < this.game.boardSize; ++i) {
        edgeTiles[i] = board[i][this.game.boardSize - 1];
      }
    }

    // Return true if one tile away from corner
    let oneAway = (x) => {
      return (x === 1 || x === this.game.boardSize - 2);
    }

    // x = -1 for left side, x = 1 for right side
    let checkSide = (mid, x) => {
      let start = 0;
      let change = 1;
      if (x === 1) {
        start = this.game.boardSize - 1;
        change = -1;
      }
      let result = {
        continuingEdge: (edgeTiles[start] === me),
        adjacentTile: edgeTiles[mid + x],
        continuingPath: edgeTiles[start],
        corner: edgeTiles[start]
      };

      let i = start + change;
      let prev = edgeTiles[start];
      while (i !== mid) {
        const tile = edgeTiles[i];
        if (tile !== me) {
          result.continuingEdge = false;
        }
        if (tile === TILE_TYPE.EMPTY) {
          result.continuingPath = TILE_TYPE.EMPTY;
        }
        else {
          if (prev === TILE_TYPE.EMPTY) {
            result.continuingPath = tile;
          }
        }
        i += change;
        prev = tile;
      }

      return result;
    }

    // Find empties
    for (let i = 1; i < edgeTiles.length - 1; ++i) {
      if (edgeTiles[i] === TILE_TYPE.EMPTY) {
        const left = checkSide(i, -1);
        const right = checkSide(i, 1);
        if (oneAway(i)) {
          if (left.continuingEdge || right.continuingEdge) {
            edgeValue[i] = 475;
          }
          else if (left.adjacentTile === opponent && left.continuingPath === opponent &&
                   right.adjacentTile === opponent && right.continuingPath === opponent) {
            edgeValue[i] = 427;
          }
          // else if ((left.corner !== opponent && right.opponent !== opponent) &&
          //         ((left.continuingPath === me && right.continuingPath !== opponent) ||
          //          (right.continuingPath === me && left.continuingPath !== opponent))) {
          //   edgeValue[i] = 300;
          // }
          else {
            edgeValue[i] = 100;
          }
        }
        else { // is middle piece
          if (left.continuingEdge || right.continuingEdge) {
            edgeValue[i] = 475;
          }
          else if (left.adjacentTile === TILE_TYPE.EMPTY && right.adjacentTile === TILE_TYPE.EMPTY) {
            edgeValue[i] = 400;
          }
          else if (left.adjacentTile === opponent && left.continuingPath === opponent &&
                   right.adjacentTile === opponent && right.continuingPath === opponent) {
            edgeValue[i] = 425;
          }
          else if ((left.corner !== opponent && right.opponent !== opponent) &&
                  ((left.continuingPath === me && right.continuingPath !== opponent) ||
                   (right.continuingPath === me && left.continuingPath !== opponent))) {
            edgeValue[i] = 300;
          }
          else if ((left.adjacentTile === opponent && right.adjacentTile === TILE_TYPE.EMPTY) ||
                   (right.adjacentTile === opponent && left.adjacentTile === TILE_TYPE.EMPTY)) {
            edgeValue[i] = 115;
          }
          else {
            edgeValue[i] = 200;
          }
        }
      }
    }

    // Assign edge values to pointsGrid
    if (edge === EDGES.TOP) {
      this.pointsGrid[0] = edgeValue.slice();
    }
    else if (edge === EDGES.BOTTOM) {
      this.pointsGrid[this.game.boardSize - 1] = edgeValue.slice();
    }
    else if (edge === EDGES.LEFT) {
      for (let i = 0; i < this.game.boardSize; ++i) {
        this.pointsGrid[i][0] = edgeValue[i];
      }
    }
    else if (edge === EDGES.RIGHT) {
      for (let i = 0; i < this.game.boardSize; ++i) {
        this.pointsGrid[i][this.game.boardSize - 1] = edgeValue[i];
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

const EDGES = { RIGHT: 0, TOP: 1, LEFT: 2, BOTTOM: 3 };

module.exports = { SmartComputerPlayer };
