import React, { createRef } from 'react';
import axios from 'axios';
import _, { get, set } from 'lodash';
// import { Link, withRouter } from "react-router-dom";
// import { connect } from "react-redux";

// import "../styles/front-page.css";

import { connect } from 'react-redux';
import { withRouter } from 'src/components/withRouter/withRouter';

import book1 from 'src/data/books/book1.json';
import book2 from 'src/data/books/book2.json';
import book3 from 'src/data/books/book3.json';
import book4 from 'src/data/books/book4.json';
import book5 from 'src/data/books/book5.json';
import book6 from 'src/data/books/book6.json';
import book7 from 'src/data/books/book7.json';
import book8 from 'src/data/books/book8.json';
import book9 from 'src/data/books/book9.json';
import book10 from 'src/data/books/book10.json';
import book11 from 'src/data/books/book11.json';
import book12 from 'src/data/books/book12.json';

import 'src/pages/templeView/TempleView.scss';
import 'src/chessground/styles/chessground.scss';
import 'src/chessground/styles/normal.scss';
import 'src/chessground/styles/lambda.scss';

import arcanaJson from 'src/data/arcana.json';

import { setLocalStorage, getLocalStorage } from 'src/utils/handleLocalStorage';

import TactoriusModal from 'src/components/Modal/Modal';

const arcana: ArcanaMap = arcanaJson as ArcanaMap;

import Dots from 'src/components/Loader/Dots';

// import Hero from "../components/Hero";

// import arcaneChess from "./././validation-engine/arcaneChess";

import arcaneChess from '../../arcaneChess/arcaneChess.mjs';
import { PerftTest } from '../../arcaneChess/perft.mjs';

import {
  GameBoard,
  GameController,
  ParseFen,
  PrintBoard,
  PrintPieceLists,
  ResetBoard,
} from '../../arcaneChess/board.mjs';
import {
  MovePiece,
  AddPiece,
  ClearPiece,
} from '../../arcaneChess/makemove.mjs';
import { PrMove, PrintMoveList } from 'src/arcaneChess/io.mjs';
import { GenerateMoves, generatePowers } from '../../arcaneChess/movegen.mjs';
import { prettyToSquare, BOOL, PIECES } from '../../arcaneChess/defs.mjs';
import { outputFenOfCurrentPosition } from '../../arcaneChess/board.mjs';
import { SearchController } from '../../arcaneChess/search.mjs';
import { CheckAndSet, CheckResult } from '../../arcaneChess/gui.mjs';
import { TakeMove } from '../../arcaneChess/makemove.mjs';
// import engine
// import arcaneChess from '../../arcaneChess/arcaneChess.mjs';

import { SinglePlayer } from '../singlePlayer/SinglePlayer';

// import arcaneChess correctly
// import arcaneChess from "@shared/arcaneChess/arcaneChess";

import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Toggle from '../../components/Toggle/Toggle';
import ChessClock from '../../components/Clock/Clock';

import { Chessground, IChessgroundApi } from '../../chessground/chessgroundMod';

const booksMap: { [key: string]: { [key: string]: Node } } = {
  book1,
  book2,
  book3,
  book4,
  book5,
  book6,
  book7,
  book8,
  book9,
  book10,
  book11,
  book12,
};

interface missionJsonI {
  [key: string]: {
    fen: string;
    id: string;
    prereq: string;
    boss?: boolean;
    playerClock: number | null;
  };
}

interface ArcanaDetail {
  name: string;
  description: string;
  type: string;
  imagePath: string;
}

interface ArcanaMap {
  [key: string]: ArcanaDetail;
}

interface Node {
  id: string;
  title: string;
  time: [number[], number[]];
  nodeText: string;
  reward: (number | string)[];
  prereq: string;
  opponent: string;
  boss: boolean;
  panels: {
    [key: string]: {
      fen: string;
      fenHistory: string[];
      history: string[];
      panelText: string;
      // is arrows this a map?
      arrowsCircles?: string[][] | undefined;
      // todo initRoyalties in arcaneChess return object
      royalties: {
        [key: string]: { [key: string]: number };
      };
      preset: string;
      whiteArcane?: { [key: string]: number };
      blackArcane?: { [key: string]: number };
      // orientation: string;
      config: {
        [key: string]: boolean | string | number;
      };
      correctMoves: string[];
      // dialogue: [
      //   // [ 'narrator', 'message']
      //   // [ 'medavas', 'message']
      //   // no text from creator, just put in a blank message that doesn't add anything to the ui
      //   [string | null, string | null],
      // ];
    };
  };
}

interface State {
  turn: string;
  playerClock: number | null;
  timeLeft: number | null;
  playerDec: number | null;
  playerColor: string;
  engineColor: string;
  currPanel: number;
  thinking: boolean;
  thinkingTime: number;
  history: string[];
  fenHistory: string[];
  correctMoves: string[];
  pvLine?: string[];
  hasMounted: boolean;
  nodeId: string;
  moveNumber: number;
  fen: string;
  engineLastMove: string[];
  whiteFaction: string;
  blackFaction: string;
  selected: string;
  config: {
    [key: string | number]: {
      disabled: boolean;
      powers: {
        [key: string | number]: string | number | readonly string[] | undefined;
      };
      picks: number;
    };
  };
  gameOver: boolean;
  gameOverType: string;
  arcaneHover: string;
  wArcana:
    | {
        [key: string]: number;
      }
    | undefined;
  bArcana:
    | {
        [key: string]: number;
      }
    | undefined;
  lastMove: string[];
  royalties: {
    [key: string]: { [key: string]: number };
  };
  hideCompletedPage: boolean;
}

interface Props {
  auth: {
    user: {
      username: string;
    };
  };
}

class UnwrappedTempleView extends React.Component<Props, State> {
  hasMounted = false;
  arcaneChess;
  chessgroundRef = createRef<IChessgroundApi>();
  chessclockRef = createRef<ChessClock>();
  constructor(props: Props) {
    super(props);
    const LS = getLocalStorage(this.props.auth.user.username);
    this.state = {
      playerClock:
        LS.config.color === 'white'
          ? booksMap[`book${LS.chapter}`][LS.nodeId].time[0][0]
          : booksMap[`book${LS.chapter}`][LS.nodeId].time[1][0],
      timeLeft: null,
      playerDec:
        LS.config.color === 'white'
          ? booksMap[`book${LS.chapter}`][LS.nodeId].time[0][1]
          : booksMap[`book${LS.chapter}`][LS.nodeId].time[1][1],
      turn:
        booksMap[`book${LS.chapter}`][`${LS.nodeId}`].panels[
          `panel-1`
        ].fen.split(' ')[1] === 'w'
          ? 'white'
          : 'black',
      playerColor:
        booksMap[`book${LS.chapter}`][`${LS.nodeId}`].panels[
          `panel-1`
        ].fen.split(' ')[1] === 'w'
          ? 'black'
          : 'white',
      engineColor:
        booksMap[`book${LS.chapter}`][`${LS.nodeId}`].panels[
          `panel-1`
        ].fen.split(' ')[1] === 'w'
          ? 'white'
          : 'black',
      hasMounted: false,
      nodeId: LS.nodeId,
      moveNumber: 0,
      gameOver: false,
      // getLocalStorage(this.props.auth.user.username).nodeScores[
      //   getLocalStorage(this.props.auth.user.username).nodeId
      // ] > 0,
      gameOverType: '',
      fen: booksMap[`book${LS.chapter}`][`${LS.nodeId}`].panels[`panel-1`].fen,
      pvLine: [],
      history: [],
      fenHistory: [
        booksMap[`book${LS.chapter}`][`${LS.nodeId}`].panels['panel-1'].fen,
      ],
      correctMoves:
        booksMap[`book${LS.chapter}`][`${LS.nodeId}`].panels['panel-1']
          .correctMoves,
      thinking: SearchController.thinking,
      engineLastMove: [],
      thinkingTime: 500,
      currPanel: 1,
      whiteFaction: 'normal',
      blackFaction: 'normal',
      selected: 'a',
      config: {
        // todo disable if no abilities selected
        a: { disabled: false, powers: {}, picks: 0 },
        b: { disabled: false, powers: {}, picks: 0 },
        c: { disabled: false, powers: {}, picks: 0 },
        d: { disabled: false, powers: {}, picks: 0 },
        e: { disabled: false, powers: {}, picks: 0 },
        f: { disabled: false, powers: {}, picks: 0 },
      },
      arcaneHover: '',
      wArcana:
        booksMap[`book${LS.chapter}`][`${LS.nodeId}`].panels['panel-1']
          .whiteArcane,
      bArcana:
        booksMap[`book${LS.chapter}`][`${LS.nodeId}`].panels['panel-1']
          .blackArcane,
      lastMove: [],
      royalties:
        booksMap[`book${LS.chapter}`][LS.nodeId].panels['panel-1'].royalties,
      hideCompletedPage:
        _.includes(Object.keys(LS.nodeScores), LS.nodeId) ||
        LS.nodeId.split('-')[0] !== 'temple',
    };
    this.arcaneChess = (fen?: string) => {
      return arcaneChess({}, {}, fen, this.props.auth, {});
    };
    this.chessgroundRef = React.createRef();
  }

  incrementMove = () => {
    this.setState((prevState) => {
      return {
        moveNumber: prevState.moveNumber + 1,
      };
    });
  };

  incrementPanel = () => {
    const LS = getLocalStorage(this.props.auth.user.username);
    if (
      this.state.currPanel ===
      Object.keys(booksMap[`book${LS.chapter}`][`${LS.nodeId}`].panels).length
    ) {
      const timeLeft = this.stopAndReturnTime() as number | null;
      this.handleVictory(this.props.auth, timeLeft);
      return;
    }
    this.setState(
      (prevState) => {
        const newPanel = prevState.currPanel + 1;
        this.chessgroundRef.current?.setAutoShapes([
          ...(booksMap[`book${LS.chapter}`][`${LS.nodeId}`].panels[
            `panel-${newPanel}`
          ].arrowsCircles ?? []),
        ]);
        return {
          gameOver: false,
          currPanel: newPanel,
          moveNumber: 0,
          turn:
            booksMap[`book${LS.chapter}`][`${LS.nodeId}`].panels[
              `panel-${newPanel}`
            ].fen.split(' ')[1] === 'w'
              ? 'white'
              : 'black',
          playerColor:
            booksMap[`book${LS.chapter}`][`${LS.nodeId}`].panels[
              `panel-${newPanel}`
            ].fen.split(' ')[1] === 'w'
              ? 'black'
              : 'white',
          engineColor:
            booksMap[`book${LS.chapter}`][`${LS.nodeId}`].panels[
              `panel-${newPanel}`
            ].fen.split(' ')[1] === 'w'
              ? 'white'
              : 'black',
          fen: booksMap[`book${LS.chapter}`][`${LS.nodeId}`].panels[
            `panel-${newPanel}`
          ].fen,
          fenHistory: [
            booksMap[`book${LS.chapter}`][`${LS.nodeId}`].panels[
              `panel-${newPanel}`
            ].fen,
          ],
          correctMoves:
            booksMap[`book${LS.chapter}`][`${LS.nodeId}`].panels[
              `panel-${newPanel}`
            ].correctMoves,
          wArcana:
            booksMap[`book${LS.chapter}`][`${LS.nodeId}`].panels[
              `panel-${newPanel}`
            ].whiteArcane,
          bArcana:
            booksMap[`book${LS.chapter}`][`${LS.nodeId}`].panels[
              `panel-${newPanel}`
            ].blackArcane,
          royalties:
            booksMap[`book${LS.chapter}`][`${LS.nodeId}`].panels[
              `panel-${newPanel}`
            ].royalties,
          // orientation
        };
      },
      () => {
        this.arcaneChess().startGame(
          this.state.fen,
          this.state.wArcana,
          this.state.bArcana,
          this.state.royalties
          // this.state.preset
        );
        this.compTempleMove();
      }
    );
  };

  perftTest = (fen: string) => {
    PrintPieceLists();
    PrintBoard();
    PerftTest(3, fen);
  };

  setFen = (fen: string) => {
    this.setState({ fen });
  };

  engineGo = () => {
    this.setState({
      thinking: true,
    });

    generatePowers();
    GenerateMoves();

    new Promise((resolve) => {
      setTimeout(() => {
        SearchController.thinking = BOOL.TRUE;
        const engineResult = this.arcaneChess().engineReply(
          this.state.thinkingTime
        );
        resolve(engineResult);
      }, this.state.thinkingTime);
    })
      .then((reply) => {
        this.setState(
          (prevState) => ({
            pvLine: GameBoard.cleanPV,
            history: [...prevState.history, PrMove(reply)],
            fenHistory: [...prevState.fenHistory, outputFenOfCurrentPosition()],
            thinking: false,
            turn: prevState.turn === 'white' ? 'black' : 'white',
          }),
          () => {
            if (CheckAndSet()) {
              this.setState({
                gameOver: true,
                gameOverType: CheckResult().gameResult,
              });
              return;
            }
          }
        );
      })
      .then(() => {
        generatePowers();
        GenerateMoves();
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
  };

  onChangeUses = (e: React.ChangeEvent<HTMLSelectElement>, power: string) => {
    const uses = Number(e.target.value) || e.target.value;
    this.setState((prevState) => ({
      ...prevState,
      config: {
        ...prevState.config,
        [this.state.selected]: {
          ...prevState.config[this.state.selected],
          powers: {
            ...prevState.config[this.state.selected].powers,
            [power]: uses,
          },
        },
      },
    }));
  };

  handleWrongMove = () => {
    this.chessclockRef.current?.templeTimeHandler();
    TakeMove();
    this.setState((prevState) => ({
      fen: outputFenOfCurrentPosition(),
      fenHistory: [...prevState.fenHistory, outputFenOfCurrentPosition()],
    }));
  };

  stopAndReturnTime = () => {
    return this.chessclockRef.current?.stopTimer();
  };

  toggleHover = (arcane: string) => {
    this.setState({ arcaneHover: arcane });
  };

  compTempleMove = () => {
    if (this.state.engineColor === this.state.turn) {
      const parsed = this.arcaneChess().makeUserMove(
        this.state.correctMoves[this.state.moveNumber].slice(0, 2),
        this.state.correctMoves[this.state.moveNumber].slice(2, 4)
      );
      if (!PrMove(parsed)) {
        console.log('invalid move');
      }
      this.setState((prevState) => ({
        history: [...prevState.history, PrMove(parsed)],
        fen: outputFenOfCurrentPosition(),
        fenHistory: [...prevState.fenHistory, outputFenOfCurrentPosition()],
        lastMove: [
          this.state.correctMoves[prevState.moveNumber].slice(0, 2),
          this.state.correctMoves[prevState.moveNumber].slice(2, 4),
        ],
        moveNumber: prevState.moveNumber + 1,
      }));
    }
  };

  handleVictory = (auth: object, timeLeft: number | null) => {
    const LS = getLocalStorage(this.props.auth.user.username);
    this.setState({
      gameOver: true,
      gameOverType: 'puzzle victory',
    });
    setLocalStorage({
      ...getLocalStorage(this.props.auth.user.username),
      nodeScores: {
        ...getLocalStorage(this.props.auth.user.username).nodeScores,
        [this.state.nodeId]:
          this.state.playerColor === 'white'
            ? (timeLeft ? timeLeft : 1) * LS.config.multiplier
            : (timeLeft ? timeLeft : 1) * LS.config.multiplier,
      },
      chapterEnd: booksMap[`book${LS.chapter}`][this.state.nodeId].boss
        ? true
        : false,
    });
    if (booksMap[`book${LS.chapter}`][this.state.nodeId].boss) {
      const chapterPoints = _.reduce(
        getLocalStorage(this.props.auth.user.username).nodeScores,
        (accumulator, value) => {
          return accumulator + value;
        },
        0
      );
      // set user top score if new
      if (
        chapterPoints >
        getLocalStorage(this.props.auth.user.username).auth.user.campaign
          .topScores[getLocalStorage(this.props.auth.user.username).chapter]
      ) {
        // Retrieve the entire data structure from local storage once
        const localStorageData = getLocalStorage(this.props.auth.user.username);

        // Calculate the chapter index
        const chapterIndex =
          getLocalStorage(this.props.auth.user.username).chapter - 1;

        // Update the specific chapter points in the campaign topScores array
        localStorageData.auth.user.campaign.topScores[chapterIndex] =
          chapterPoints;

        // Save the updated data back to local storage
        setLocalStorage(localStorageData);
        axios
          .post('/api/campaign/topScores', {
            userId: this.props.auth.user.username,
            chapterPoints,
            chapterNumber: getLocalStorage(this.props.auth.user.username)
              .chapter,
          })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log('top score post err: ', err);
          });
      }
    }
  };

  componentDidMount() {
    if (this.state.hideCompletedPage) {
      return;
    }
    if (!this.hasMounted) {
      this.hasMounted = true;
      this.arcaneChess().startGame(
        this.state.fen,
        this.state.wArcana,
        this.state.bArcana,
        this.state.royalties
        // this.state.preset)
      );
      this.compTempleMove();
    }
  }

  render() {
    const greekLetters = ['X', 'Ω', 'Θ', 'Σ', 'Λ', 'Φ', 'M', 'N'];
    const { auth } = this.props;
    const gameBoardTurn = GameBoard.side === 0 ? 'white' : 'black';
    return (
      <div className="tactorius-board fade">
        {this.state.hideCompletedPage ? (
          <div className="completed-node">
            <div className="completed-node-text">Node Completed</div>
          </div>
        ) : (
          <>
            <TactoriusModal
              isOpen={this.state.gameOver}
              // handleClose={() => this.handleModalClose()}
              // modalType={this.state.endScenario}
              // message={} // interpolate
              message={this.state.gameOverType} // interpolate
              type={
                this.state.gameOverType === 'puzzle victory'
                  ? 'victory'
                  : 'defeat'
              }
            />
            <div className="temple-view">
              <div className="opponent-dialogue-arcana">
                <div className="arcana">
                  <div className="arcana-side-buttons">
                    <Button
                      className="tertiary"
                      // onClick={() => {
                      //   this.setState({ selected: 'a' });
                      // }}
                      backgroundColorOverride="#333333"
                      color="B"
                      text="WHITE"
                      width={190}
                    />
                    <Button
                      className="tertiary"
                      // onClick={() => {
                      //   this.setState({ selected: 'a' });
                      // }}
                      backgroundColorOverride="#333333"
                      color="B"
                      text="BLACK"
                      width={190}
                      disabled={false}
                    />
                  </div>
                  <div className="arcana-select">
                    {_.map(this.state.wArcana, (value: number, key: string) => {
                      return (
                        <img
                          key={key}
                          className="arcane"
                          src={`${arcana[key].imagePath}${
                            this.state.arcaneHover === key ? '-hover' : ''
                          }.svg`}
                          onMouseEnter={() => this.toggleHover(key)}
                          onMouseLeave={() => this.toggleHover('')}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="time-board-time">
                <div className="opponent-time">{/* <h3>10:00</h3> */}</div>
                <div className="board-view">
                  <Chessground
                    forwardedRef={this.chessgroundRef}
                    // fen={this.state.fenHistory[this.state.fenHistory.length - 1]}
                    // check={this.tactorius.inCheck().isAttacked}
                    // viewOnly={this.isCheckmate()}
                    fen={
                      this.state.fenHistory[this.state.fenHistory.length - 1]
                    }
                    // coordinates={true}
                    // notation={true}
                    // onChange={(move) => {
                    //   console.log('hello', move);
                    // }}
                    resizable={true}
                    wFaction={this.state.whiteFaction}
                    bFaction={this.state.blackFaction}
                    royalties={this.state.royalties}
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
                      duration: 200,
                    }}
                    highlight={{
                      lastMove: true,
                      check: true,
                    }}
                    orientation={this.state.playerColor}
                    disableContextMenu={false}
                    turnColor={GameBoard.side === 0 ? 'white' : 'black'}
                    movable={{
                      free: false,
                      // todo swap out placeholder for comment
                      // color: "both",
                      color: this.state.playerColor,
                      // todo show summon destinations
                      dests: this.arcaneChess().getGroundMoves(),
                    }}
                    lastMove={this.state.lastMove}
                    viewOnly={false}
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
                      move: (
                        orig: string,
                        dest: string,
                        capturedPiece: number
                      ) => {
                        console.log('todo promotion');
                        const parsed = this.arcaneChess().makeUserMove(
                          orig,
                          dest
                        );
                        if (
                          `${orig}${dest}` ===
                          this.state.correctMoves[this.state.moveNumber]
                        ) {
                          this.setState(
                            (prevState) => ({
                              history: [...prevState.history, PrMove(parsed)],
                              fen: outputFenOfCurrentPosition(),
                              fenHistory: [
                                ...prevState.fenHistory,
                                outputFenOfCurrentPosition(),
                              ],
                              moveNumber: prevState.moveNumber + 1,
                              lastMove: [orig, dest],
                            }),
                            () => {
                              if (
                                this.state.moveNumber ===
                                this.state.correctMoves.length
                              ) {
                                this.incrementPanel();
                              } else {
                                this.compTempleMove();
                              }
                            }
                          );
                        } else {
                          this.handleWrongMove();
                        }
                      },
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
                <div className="player-time"></div>
              </div>
              <div className="temple-clock-buttons">
                <div className="temple-clock">
                  <ChessClock
                    ref={this.chessclockRef}
                    type="dec"
                    playerTurn={gameBoardTurn === this.state.playerColor}
                    turn={gameBoardTurn}
                    time={this.state.playerClock}
                    timePrime={this.state.playerDec}
                    playerTimeout={() => {
                      this.setState({
                        gameOver: true,
                        gameOverType: 'player timed out',
                      });
                    }}
                  />
                </div>
                <div className="temple-buttons">
                  <Button
                    className="tertiary"
                    onClick={() => {
                      this.setState({ selected: 'a' });
                    }}
                    color="B"
                    text=""
                    width={160}
                    disabled={this.state.config.a.disabled}
                  />
                  <Button
                    className="tertiary"
                    onClick={() => {
                      this.setState({
                        gameOver: true,
                        gameOverType: `${this.state.playerColor} resigns`,
                      });
                    }}
                    color="B"
                    // strong={true}
                    text="RESIGN"
                    width={160}
                    // fontSize={30}
                    backgroundColorOverride="#222222"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
}

function mapStateToProps({ auth }: { auth: object }) {
  return {
    auth,
  };
}

export const TempleView = connect(
  mapStateToProps,
  {}
)(withRouter(UnwrappedTempleView));

// connect(mapStateToProps)(
//   withRouter(UnwrappedFrontPage)
// );

// .hero-text {
//   font-size: 48px;
//   font-weight: 800;
// }
