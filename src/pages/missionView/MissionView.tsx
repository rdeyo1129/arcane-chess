import React, { createRef } from 'react';
import axios from 'axios';
import _, { get, set } from 'lodash';
// import { Link, withRouter } from "react-router-dom";
// import { connect } from "react-redux";

// import "../styles/front-page.css";

import { connect } from 'react-redux';
import { withRouter } from 'src/components/withRouter/withRouter';

import 'src/pages/missionView/MissionView.scss';
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

export const piecePickupArray = [
  'wP',
  'wH',
  'wS',
  'wN',
  'wZ',
  'wU',
  'wB',
  'wR',
  'wQ',
  'wT',
  'wM',
  'wV',
  'wK',
  //
  'bP',
  'bH',
  'bS',
  'bN',
  'bZ',
  'bU',
  'bB',
  'bR',
  'bQ',
  'bT',
  'bM',
  'bV',
  'bK',
];
export const royaltyPickupArray = {
  Q: 'yellow',
  T: 'blue',
  M: 'green',
  V: 'purple',
  E: 'orange',
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

const missionJson: missionJsonI = {
  'mission-1': {
    // fen: 'rnbqkbnr/sspppppp/8/7Q/2B1P2R/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
    // fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    fen: 'rnbqkbnr/pppp1ppp/4p3/8/5P2/3PPP1P/PPPPP1BP/RNBQKBNR b KQkq - 0 1',
    id: 'mission-1',
    prereq: '',
    playerClock: 5,
  },
  'mission-2': {
    fen: 'rnbqkbnr/pppp1ppp/4p3/8/5P2/3PPP1P/PPPPP1BP/RNBQKBNR b KQkq - 0 1',
    id: 'mission-2',
    prereq: 'mission-1',
    playerClock: 5,
  },
  'mission-3': {
    fen: 'rnbqkbnr/pppp1ppp/4p3/8/5P2/3PPP1P/PPPPP1BP/RNBQKBNR b KQkq - 0 1',
    id: 'mission-3',
    prereq: 'mission-2',
    playerClock: 50,
  },
  'mission-4': {
    fen: 'rnbqkbnr/pppp1ppp/4p3/8/5P2/3PPP1P/PPPPP1BP/RNBQKBNR b KQkq - 0 1',
    id: 'mission-4',
    prereq: 'mission-3',
    boss: true,
    playerClock: 150,
  },
};

interface ArcanaDetail {
  name: string;
  description: string;
  type: string;
  imagePath: string;
}

interface ArcanaMap {
  [key: string]: ArcanaDetail;
}

interface State {
  turn: string;
  playerClock: number | null;
  playerColor: string;
  engineColor: string;
  thinking: boolean;
  thinkingTime: number;
  history: string[];
  fenHistory: string[];
  pvLine?: string[];
  hasMounted: boolean;
  nodeId: string;
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
  wArcana: {
    [key: string]: number;
  };
  bArcana: {
    [key: string]: number;
  };
}

interface Props {
  auth: {
    user: {
      id: string;
    };
  };
}

class UnwrappedMissionView extends React.Component<Props, State> {
  hasMounted = false;
  arcaneChess;
  chessgroundRef = createRef<IChessgroundApi>();
  constructor(props: Props) {
    super(props);
    this.state = {
      // todo, just make this an array of fenHistory, simplify state...
      // todo make dyanamic
      turn:
        missionJson[
          `${getLocalStorage(this.props.auth.user.id).nodeId}`
        ].fen.split(' ')[1] === 'w'
          ? 'white'
          : 'black',
      playerClock:
        missionJson[`${getLocalStorage(this.props.auth.user.id).nodeId}`]
          .playerClock,
      playerColor: getLocalStorage(this.props.auth.user.id).config.color,
      engineColor:
        getLocalStorage(this.props.auth.user.id).config.color === 'white'
          ? 'black'
          : 'white',
      hasMounted: false,
      nodeId: getLocalStorage(this.props.auth.user.id).nodeId,
      gameOver: false,
      // getLocalStorage(this.props.auth.user.id).nodeScores[
      //   getLocalStorage(this.props.auth.user.id).nodeId
      // ] > 0,
      gameOverType: '',
      fen: missionJson[`${getLocalStorage(this.props.auth.user.id).nodeId}`]
        .fen,
      pvLine: [],
      history: [],
      fenHistory: [
        missionJson[`${getLocalStorage(this.props.auth.user.id).nodeId}`].fen,
      ],
      thinking: SearchController.thinking,
      engineLastMove: [],
      thinkingTime: 500,
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
      wArcana: {
        modsTEM: 3,
        modsIMP: 1,
        sumnRV: 2,
        sumnRE: 2,
        sumnRM: 2,
        modsSUS: 1,
        sumnP: 1,
        sumnX: 1,
        dyadA: 1,
        shftB: 3,
        shftR: 3,
        shftP: 3,
        shftN: 3,
        modsFUG: 1,
        modsORA: 1,
        modsINH: 1,
        modsRAN: 1,
        modsOFF: 1,
        modsCON: 1,
        modsPHA: 1,
        modsFUT: 1,
        modsPRE: 1,
        swapATK: 1,
        swapDEP: 1,
        swapADJ: 1,
      },
      bArcana: {},
      // generatedName: this.generateName(),
    };
    this.arcaneChess = (fen?: string) => {
      return arcaneChess({}, {}, fen, this.props.auth, {});
    };
    this.chessgroundRef = React.createRef();
  }

  initializeArcaneChessAndTest = (fen: string) => {
    // const start = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    // const start = '6pk/3K2p1/6p1/6p1/8/8/8/7P w - - 0 1';
    // const start = '8/8/8/4X3/8/8/8/8 w - - 0 1';
    // koh
    // const start = 'k7/8/8/8/8/8/8/7K w - - 0 1';
    // royalty mate
    // const start = '6Xk/8/8/8/8/8/R7/K7 w - - 0 1';
    // promote to unicorn
    // const start = '4pk2/4ppp1/6XP/8/8/8/8/7K w - - 0 1';
    // const start = '5pk1/5XX1/6XP/6X1/8/8/8/7K w - - 0 1';
    // rnbqk2r/p1pp1ppp/1p2pn2/8/1bPP4/2N1P3/PP3PPP/R1BQKBNR w KQkq - 0 1
    this.arcaneChess().startCreate(fen);
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

  // promise or web worker here?
  // start variation button call here
  // pair with a resest button
  calculateFen = () => {
    // this.setState({ fen });
    // todo to animate, set classnames, timeouts, clock conditionals,promise?
    // todo promise or thinking timeout time for returning makemove
    // any edge cases?
    this.setState({
      thinking: true,
    });
    // this.arcaneChess().getScoreAndLine(
    //   this.state.fenHistory[this.state.fenHistory.length - 1]
    // );

    ParseFen(this.state.fenHistory[this.state.fenHistory.length - 1]);

    // ParseFen('rnbqkbnr/pppppppp/8/4ZU2/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

    const gameBoardPowers = generatePowers();

    console.log('gameBoardPowers', gameBoardPowers);

    GenerateMoves();

    PrintMoveList();

    // this.perftTest(
    //   'rnbqkbnr/pppppppp/8/4ZU2/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    // );

    this.setState({
      pvLine: [],
      history: [],
      fenHistory: [this.state.fen],
    });
    // this.setState({
    //   thinking: false,
    // });
    // search controller
    // your own gui lines of code here here
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

  toggleHover = (arcane: string) => {
    this.setState({ arcaneHover: arcane });
  };

  handleVictory = (auth: object) => {
    setLocalStorage({
      ...getLocalStorage(this.props.auth.user.id),
      auth,
      nodeScores: {
        ...getLocalStorage(this.props.auth.user.id).nodeScores,
        [this.state.nodeId]:
          this.state.playerColor === 'white'
            ? (100000 - (GameBoard.material[0] - GameBoard.material[1])) *
              (this.state.playerClock ? this.state.playerClock : 1)
            : (100000 - (GameBoard.material[1] - GameBoard.material[0])) *
              (this.state.playerClock ? this.state.playerClock : 1),
      },
      chapterEnd: missionJson[this.state.nodeId].boss ? true : false,
    });
    if (missionJson[this.state.nodeId].boss) {
      const chapterPoints = _.reduce(
        getLocalStorage(this.props.auth.user.id).nodeScores,
        (accumulator, value) => {
          return accumulator + value;
        },
        0
      );
      // set user top score if new
      if (
        chapterPoints >
        getLocalStorage(this.props.auth.user.id).auth.user.campaign.topScores[
          getLocalStorage(this.props.auth.user.id).chapter
        ]
      ) {
        // Retrieve the entire data structure from local storage once
        const localStorageData = getLocalStorage(this.props.auth.user.id);

        // Calculate the chapter index
        const chapterIndex =
          getLocalStorage(this.props.auth.user.id).chapter - 1;

        // Update the specific chapter points in the campaign topScores array
        localStorageData.auth.user.campaign.topScores[chapterIndex] =
          chapterPoints;

        // Save the updated data back to local storage
        setLocalStorage(localStorageData);
        axios
          .post('/api/campaign/topScores', {
            userId: this.props.auth.user.id,
            chapterPoints,
            chapterNumber: getLocalStorage(this.props.auth.user.id).chapter,
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
    this.setState({
      turn:
        missionJson[
          `${getLocalStorage(this.props.auth.user.id).nodeId}`
        ].fen.split(' ')[1] === 'w'
          ? 'white'
          : 'black',
    });
    if (!this.hasMounted) {
      this.hasMounted = true;
      this.arcaneChess().startGame(this.state.fen);
      if (this.state.engineColor === this.state.turn) {
        this.engineGo();
      }
    }
  }

  componentDidUpdate(prevProps: object, prevState: { gameOver: boolean }) {
    // if (this.state.gameOver !== prevState.gameOver) {
    //   this.setState({ gameOver: true, gameOverType: CheckResult().gameResult });
    // }
  }

  render() {
    const greekLetters = ['X', 'Ω', 'Θ', 'Σ', 'Λ', 'Φ', 'M', 'N'];
    const { auth } = this.props;
    console.log(GameBoard.material);
    return (
      <div className="tactorius-board fade">
        <TactoriusModal
          isOpen={this.state.gameOver}
          // handleClose={() => this.handleModalClose()}
          // modalType={this.state.endScenario}
          // message={} // interpolate
          type={
            this.state.gameOverType.split(' ')[1] === 'mates' &&
            getLocalStorage(this.props.auth.user.id).config.color ===
              this.state.gameOverType.split(' ')[0]
              ? 'victory'
              : 'defeat'
          }
        />
        {/* <button style={{ position: "absoulte" }}>test</button> */}
        <div className="mission-view">
          {/* <div className="game-info">
            <div className="panel-left-container">
              <div className="panel-left">this is a paragraph about chess.</div>
            </div>
          </div> */}
          {/* 
            panel types lesson temple mission create... any others? puzzles (leage vs temples)
            must be true to page architecture

          */}
          {/* <div className="panel"></div> */}
          <div className="opponent-dialogue-arcana">
            <div className="info-avatar">
              <div className="avatar"></div>
              <div className="info">
                <h3 className="name">Medavas</h3>
                <div className="thinking">
                  {this.state.thinking ? <Dots /> : null}
                </div>
              </div>
            </div>
            <div className="dialogue">
              {this.state.arcaneHover !== '' ? (
                <div className="arcana-detail">
                  <h3>{arcana[this.state.arcaneHover].name}</h3>
                  <p>{arcana[this.state.arcaneHover].description}</p>
                </div>
              ) : (
                <div>dialogue</div>
                // hints, taunts, eval + or - dialogue
              )}
            </div>
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
            <div className="opponent-time">
              <h3>10:00</h3>
            </div>
            <div className="board-view">
              <Chessground
                forwardedRef={this.chessgroundRef}
                // fen={this.state.fenHistory[this.state.fenHistory.length - 1]}
                // check={this.tactorius.inCheck().isAttacked}
                // viewOnly={this.isCheckmate()}
                fen={this.state.fenHistory[this.state.fenHistory.length - 1]}
                // coordinates={true}
                // notation={true}
                // onChange={(move) => {
                //   console.log('hello', move);
                // }}
                resizable={true}
                wFaction={this.state.whiteFaction}
                bFaction={this.state.blackFaction}
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
                orientation={
                  getLocalStorage(this.props.auth.user.id).config.color
                }
                disableContextMenu={false}
                turnColor={this.state.turn}
                movable={{
                  free: false,
                  // todo swap out placeholder for comment
                  // color: "both",
                  color: this.state.playerColor,
                  // todo show summon destinations
                  dests: this.arcaneChess().getGroundMoves(),
                }}
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
                  move: (orig: string, dest: string, capturedPiece: number) => {
                    const parsed = this.arcaneChess().makeUserMove(orig, dest);
                    console.log(generatePowers());
                    console.log('captured', capturedPiece);
                    if (!PrMove(parsed)) {
                      console.log('invalid move');
                      debugger; // eslint-disable-line
                    }
                    this.setState((prevState) => ({
                      history: [...prevState.history, PrMove(parsed)],
                      fen: outputFenOfCurrentPosition(),
                      fenHistory: [
                        ...prevState.fenHistory,
                        outputFenOfCurrentPosition(),
                      ],
                    }));
                    if (CheckAndSet()) {
                      this.setState({
                        gameOver: true,
                        gameOverType: CheckResult().gameResult,
                      });
                      if (
                        CheckResult().gameResult ===
                        `${
                          getLocalStorage(this.props.auth.user.id).config.color
                        } mates`
                      ) {
                        this.handleVictory(auth);
                      }
                    } else {
                      this.setState(
                        {
                          turn: this.state.turn === 'white' ? 'black' : 'white',
                        },
                        () => {
                          this.engineGo();
                        }
                      );
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
            <div className="player-time">
              <h3>
                <ChessClock initialTime={this.state.playerClock} />
              </h3>
            </div>
          </div>
          <div className="nav-history-buttons-player">
            <div className="nav">
              <Button
                className="tertiary"
                onClick={() => {}}
                color="B"
                strong={true}
                text="<<"
                width={100}
                fontSize={30}
                backgroundColorOverride="#222222"
              />
              <Button
                className="tertiary"
                onClick={() => {}}
                color="B"
                strong={true}
                text="<"
                width={100}
                fontSize={30}
                backgroundColorOverride="#222222"
              />
              <Button
                className="tertiary"
                onClick={() => {}}
                color="B"
                strong={true}
                text=">"
                width={100}
                fontSize={30}
                backgroundColorOverride="#222222"
              />
              <Button
                className="tertiary"
                onClick={() => {}}
                color="B"
                strong={true}
                text=">>"
                width={100}
                fontSize={30}
                backgroundColorOverride="#222222"
              />
            </div>
            <div className="history">
              {this.state.history.map((move, i) => (
                <div key={i}>{move}</div>
              ))}
            </div>
            <div className="buttons">
              <Button
                className="tertiary"
                onClick={() => {}}
                color="B"
                // strong={true}
                text="1/2"
                width={100}
                // fontSize={30}
                backgroundColorOverride="#222222"
              />
              <Button
                className="tertiary"
                onClick={() => {}}
                color="B"
                // strong={true}
                text="RESIGN"
                width={100}
                // fontSize={30}
                backgroundColorOverride="#222222"
              />
            </div>
            <div className="info-avatar">
              <div className="avatar"></div>
              <div className="info">
                <h3 className="name">Medavas</h3>
                <div className="thinking">
                  {/* {this.state.turn === this.state.playerColor ? <Dots /> : null} */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ auth }: { auth: object }) {
  return {
    auth,
  };
}

export const MissionView = connect(
  mapStateToProps,
  {}
)(withRouter(UnwrappedMissionView));

// connect(mapStateToProps)(
//   withRouter(UnwrappedFrontPage)
// );

// .hero-text {
//   font-size: 48px;
//   font-weight: 800;
// }
