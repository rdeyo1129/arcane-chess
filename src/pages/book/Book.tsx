import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';

import 'src/pages/book/Book.scss';
import 'src/chessground/styles/chessground.scss';
import 'src/chessground/styles/normal.scss';

// import 'src/pages/inGameMenu/InGameMenu.scss';

import { Chessground } from 'src/chessground/chessgroundMod';

import Button from 'src/components/Button/Button';
import Spinner from 'src/components/Loader/Spinner';
import Dots from 'src/components/Loader/Dots';

// import './Dashboard.scss';

export class Book extends React.Component {
  // what type is props supposed to be
  constructor(props: object) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="book">
        <div className="top">
          <div className="chapters">chapters</div>
          <div className="messages">messages</div>
          {/* <div className="board-view"> */}
          <div className="cg-wrap tactorius-board">
            <Chessground
              // fen={this.state.fenHistory[this.state.fenHistory.length - 1]}
              // check={this.tactorius.inCheck().isAttacked}
              // viewOnly={this.isCheckmate()}
              fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
              coordinates={false}
              // notation={true}
              // onChange={(move) => {
              //   console.log('hello', move);
              // }}
              resizable={true}
              wFaction={'normal'}
              bFaction={'normal'}
              // wRoyalty={this.state.wRoyalty}
              // bRoyalty={this.state.bRoyalty}
              // wVisible={this.state.wVisCount === 0}
              // bVisible={this.state.bVisCount === 0}
              // width={520}
              // height={520}
              width={480}
              height={480}
              // inline styling for aspect ratio? OR interpolating in this case based on the page type, use a global state string?
              // don't, just go by the page type
              // width={360}
              // height={360}
              animation={{
                enabled: true,
                duration: 1,
              }}
              highlight={{
                lastMove: true,
                check: true,
              }}
              // orientation={this.state.orientation}
              disableContextMenu={false}
              // turnColor={GameBoard.side === 0 ? 'white' : 'black'}
              // movable={{
              //   free: false,
              //   // todo swap out placeholder for comment
              //   // color: "both",
              //   color: GameBoard.side === 0 ? 'white' : 'black',
              //   // todo show summon destinations
              //   dests: this.arcaneChess().getGroundMoves(),
              // }}
              events={{
                change: () => {
                  // if (this.state.)
                  // this.setState({
                  //   fen:
                  // })
                  // this.arcaneChess().engineReply();
                  // this.setState({})
                  // console.log(cg.FEN);
                  // send moves to redux store, then to server (db), then to opponent
                },
                // move: (orig, dest, capturedPiece) => {
                //   const parsed = this.arcaneChess().makeUserMove(orig, dest);
                //   console.log(generatePowers());
                //   if (!PrMove(parsed)) {
                //     console.log('invalid move');
                //     debugger; // eslint-disable-line
                //   }
                //   this.setState((prevState) => ({
                //     history: [...prevState.history, PrMove(parsed)],
                //     fenHistory: [
                //       ...prevState.fenHistory,
                //       outputFenOfCurrentPosition(),
                //     ],
                //   }));
                //   this.engineGo();
                // },
                // select: (key) => {
                //   ParseFen(this.state.fen);
                //   AddPiece(prettyToSquare(key), PIECES.wN);
                //   this.setState({
                //     fen: outputFenOfCurrentPosition(),
                //     fenHistory: [outputFenOfCurrentPosition()],
                //   });
                // },
              }}
            />
          </div>
          {/* </div> */}
          <div className="arcane-time">arcane-time</div>
        </div>
        <div className="bottom">
          {/* <div className="left"></div>
          <div className="right"></div> */}
        </div>
      </div>
    );
  }
}
