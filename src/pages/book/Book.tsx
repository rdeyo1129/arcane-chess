import React from 'react';
import _, { get } from 'lodash';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import 'src/pages/book/Book.scss';
import 'src/chessground/styles/chessground.scss';
import 'src/chessground/styles/normal.scss';

// import 'src/pages/inGameMenu/InGameMenu.scss';

import { Chessground } from 'src/chessground/chessgroundMod';

import TactoriusModal from 'src/components/Modal/Modal';
import Button from 'src/components/Button/Button';
import Spinner from 'src/components/Loader/Spinner';
import Dots from 'src/components/Loader/Dots';

import { setLocalStorage, getLocalStorage } from 'src/utils/handleLocalStorage';
/*
  // // DYNAMIC IMPORTS \\ \\ THIS RUNS INTO AN ISSUE, JUST IMPORT THEM ALL
*/

// import instead, use ex here
const jsonChpater1 = { a: 1 };
const jsonChapter2 = { a: 2, inbox: ['test', 'test2'] };

interface BookProps {
  auth: { user: { id: string } };
}
interface BookState {
  [key: string]: any;
}

interface lessonNode {
  id: string; // 'lesson-1';
  title: string;
  time: [number, number]; // seconds
  chatLog: [string | null, string | null];
  reward: (number | string[])[];
  boards: {
    [key: string]: {
      fen: string;
      fenHistory: string[];
      history: string[];
      // is arrows this a map?
      arrows?: string[][];
      // todo initRoyalties in arcaneChess return object
      royalties: {
        royaltyQ: string[];
        royaltyM: string[];
        royaltyT: string[];
        royaltyV: string[];
        royaltyE: string[];
      };
      whiteArcane?: { [key: string]: number };
      blackArcane?: { [key: string]: number };
      // orientation: string;
      config: {
        [key: string]: boolean | string | number;
      };
      dialogue: [
        // [ 'narrator', 'message']
        // [ 'medavas', 'message']
        // no text from creator, just put in a blank message that doesn't add anything to the ui
        [string | null, string | null],
      ];
    };
  };
}

const templeNode = {};

// JSON STRUCTURE
// todo to be generated / automated from creator
interface missionNode {
  id: string; // 'mission-1';
  title: string;
  time: [number, number]; // seconds
  chatLog: [string | null, string | null];
  fen: string;
  fenHistory: string[];
  history: string[];
  // is arrows this a map?
  arrows?: string[][];
  // todo initRoyalties in arcaneChess return object
  royalties: {
    royaltyQ: string[];
    royaltyM: string[];
    royaltyT: string[];
    royaltyV: string[];
    royaltyE: string[];
  };
  whiteArcane?: { [key: string]: number };
  blackArcane?: { [key: string]: number };
  orientation: string;
  handicaps: {
    [key: string]: boolean | string | number;
  };
  dialogue: [
    // [ 'narrator', 'message']
    // [ 'medavas', 'message']
    // no text from creator, just put in a blank message that doesn't add anything to the ui
    [string | null, string | null],
  ];
}

export class UnwrappedBook extends React.Component<BookProps, BookState> {
  constructor(props: BookProps) {
    super(props);
    this.state = {
      armoryOpen: false,
      // get all nodes from json import and .map in render
      // to conditionally render right side of view depending on current node id]
      pointsEx: 3552,
      inboxEx: ['lesson-1', 'temple-1', 'mission-1', 'mission-2'],
      dialogueEx: [
        ['sidian', 'message'],
        ['narrator', 'message'],
        ['hero', 'message'],
      ],
      chapter: [
        `jsonChapter${getLocalStorage(this.props.auth.user.id)?.chapter}`,
      ],
      selectedSwatch: '',
      config: getLocalStorage(this.props.auth.user.id)?.config,
      nodeScores: getLocalStorage(this.props.auth.user.id)?.nodeScores,
      inventory: getLocalStorage(this.props.auth.user.id)?.inventory,
    };
  }
  render() {
    const { auth } = this.props;
    return (
      <div className="book">
        <div className="top">
          <div className="inbox">
            {this.state.inboxEx.map((mission: string, i: number) => {
              return (
                <div
                  key={i}
                  className={`swatch${
                    this.state.selectedSwatch === mission ? '-selected' : ''
                  }`}
                  onClick={() => {
                    const currLS = getLocalStorage(this.props.auth.user.id);
                    this.setState({
                      selectedSwatch: mission,
                    });
                    setLocalStorage({
                      auth: auth,
                      chapter: currLS.chapter,
                      config: currLS.config,
                      nodeScores: currLS.nodeScores,
                      inventory: currLS.inventory,
                      nodeId: mission,
                    });
                  }}
                >
                  <div className="title">{mission}</div>
                  <div className="time">time</div>
                </div>
              );
            })}
          </div>
          <div className="messages">
            {this.state.dialogueEx.map((message: string[], i: number) => {
              return (
                <div
                  key={i}
                  className={`message${
                    message[0] === 'narrator'
                      ? '-narrator'
                      : message[0] === 'hero'
                      ? '-hero'
                      : ''
                  }`}
                >
                  <div className="name">{message[0]}</div>
                  <div className="text">{message[1]}</div>
                </div>
              );
            })}
          </div>
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
          <div className="left">
            <Link to="/campaign">
              <Button
                text="BACK"
                className="secondary"
                color="V"
                width={120}
                height={40}
                disabled={false}
              />
            </Link>
            <Button
              text="ARMORY"
              className="secondary"
              color="V"
              width={120}
              height={40}
              disabled={false}
              onClick={() => {
                this.setState({ armoryOpen: true });
              }}
            />
          </div>
          <div className="center">
            <span>
              {/* {this.state.inventory.points} */}
              {this.state.pointsEx} X {this.state.config?.multiplier} ={' '}
              {this.state.pointsEx * this.state.config?.multiplier} kudos
            </span>
          </div>
          <div className="right">
            <Link to={`/${this.state.selectedSwatch.split('-')[0]}`}>
              <Button
                text="START"
                className="primary"
                color="V"
                width={120}
                height={40}
                // todo until clickthrough messages are done, keep button disabled
                disabled={this.state.selectedSwatch === ''}
              />
            </Link>
          </div>
        </div>
        <TactoriusModal
          // toggleModal={() => {
          //   setLocalStorage(auth, 0, {}, {}, {}, '');
          //   this.setState({ configModalOpen: false, chapter: 0 });
          // }}
          chapterNumber={this.state.chapter}
          isOpen={this.state.armoryOpen}
          type="armory"
          // imgPath="public/assets/treeBoat.jpg"
        />
      </div>
    );
  }
}

function mapStateToProps({ auth }: { auth: any }) {
  return {
    auth,
  };
}

export const Book = connect(mapStateToProps, {})(UnwrappedBook);
