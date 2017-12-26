// Computer player for Othello
class ComputerPlayer {
  constructor() {
    this.game = null;

    this.makeMove = this.makeMove.bind(this);
  }

  makeMove() {
    let maxFlips = 0;
    let rPos = 0;
    let cPos = 0;

    // GREEDY: find the placement that will flip the most tiles
    for (let r = 0; r < this.game.boardSize; ++r) {
      for (let c = 0; c < this.game.boardSize; ++c) {
        const flips = this.game.checkAllDirections(r, c);
        if (flips > maxFlips) {
          maxFlips = flips;
          rPos = r;
          cPos = c;
        }
      }
    }

    // Play piece
    this.game.playPiece(r, c);
  }
}

module.export = { ComputerPlayer };
