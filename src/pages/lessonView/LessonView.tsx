import React, { createRef } from 'react';
import _ from 'lodash';

import { connect } from 'react-redux';
import { withRouter } from 'src/components/withRouter/withRouter';
import { Link } from 'react-router-dom';

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

import 'src/pages/lessonView/LessonView.scss';
import 'src/chessground/styles/chessground.scss';
import 'src/chessground/styles/normal.scss';
import 'src/chessground/styles/lambda.scss';

import arcanaJson from 'src/data/arcana.json';

import { setLocalStorage, getLocalStorage } from 'src/utils/handleLocalStorage';

import TactoriusModal from 'src/components/Modal/Modal';

const arcana: ArcanaMap = arcanaJson as ArcanaMap;

import arcaneChess from '../../arcaneChess/arcaneChess.mjs';

import {
  InCheck,
  outputFenOfCurrentPosition,
} from '../../arcaneChess/board.mjs';
import { SearchController } from '../../arcaneChess/search.mjs';
import { editMovePiece } from '../../arcaneChess/gui.mjs';

import Button from '../../components/Button/Button';

import { Chessground, IChessgroundApi } from '../../chessground/chessgroundMod';
import { PrintMoveList } from 'src/arcaneChess/io.mjs';

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
  time: number[][];
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
      arrowsCircles?: {
        orig: string;
        brush: string;
        dest?: string | undefined;
      }[];
      // todo initRoyalties in arcaneChess return object
      royalties: {
        [key: string]: { [key: string]: number };
      };
      preset: string;
      whiteArcane?: { [key: string]: number | string };
      blackArcane?: { [key: string]: number | string };
      // orientation: string;
      config: {
        [key: string]: boolean | string | number;
      };
      correctMoves: string[];
      viewOnly: boolean;
      orientation: string;
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
  playerColor: string;
  engineColor: string;
  currPanel: number;
  thinking: boolean;
  thinkingTime: number;
  history: string[];
  fenHistory: string[];
  correctMoves: string[];
  pvLine?: string[];
  arrowsCircles: { orig: string; brush: string; dest?: string | undefined }[];
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
        [key: string]: number | string;
      }
    | undefined;
  bArcana:
    | {
        [key: string]: number | string;
      }
    | undefined;
  lastMove: string[];
  hideCompletedPage: boolean;
  viewOnly: boolean;
}

interface Props {
  auth: {
    user: {
      username: string;
    };
  };
}

class UnwrappedLessonView extends React.Component<Props, State> {
  hasMounted = false;
  arcaneChess;
  chessgroundRef = createRef<IChessgroundApi>();
  constructor(props: Props) {
    super(props);
    const LS = getLocalStorage(this.props.auth.user.username);
    this.state = {
      turn:
        booksMap[`book${LS.chapter}`]?.[`${LS.nodeId}`].panels[
          `panel-1`
        ].fen.split(' ')[0] === 'w'
          ? 'white'
          : 'black',
      playerColor:
        booksMap[`book${LS.chapter}`]?.[`${LS.nodeId}`].panels[
          `panel-1`
        ].fen.split(' ')[0] === 'w'
          ? 'black'
          : 'white',
      engineColor:
        booksMap[`book${LS.chapter}`]?.[`${LS.nodeId}`].panels[
          `panel-1`
        ].fen.split(' ')[0] === 'w'
          ? 'white'
          : 'black',
      arrowsCircles:
        booksMap[`book${LS.chapter}`]?.[`${LS.nodeId}`].panels[`panel-1`]
          .arrowsCircles || [],
      hasMounted: false,
      nodeId: LS.nodeId,
      moveNumber: 0,
      currPanel: 1,
      gameOver: false,
      gameOverType: '',
      fen: booksMap[`book${LS.chapter}`]?.[`${LS.nodeId}`].panels[`panel-1`]
        .fen,
      pvLine: [],
      history: [
        ...(booksMap[`book${LS.chapter}`]?.[`${LS.nodeId}`].panels['panel-1']
          .history || []),
      ],
      fenHistory: [
        booksMap[`book${LS.chapter}`]?.[`${LS.nodeId}`].panels['panel-1'].fen,
      ],
      correctMoves:
        booksMap[`book${LS.chapter}`]?.[`${LS.nodeId}`].panels['panel-1']
          .correctMoves,
      thinking: SearchController.thinking,
      engineLastMove: [],
      thinkingTime: 500,
      whiteFaction: 'normal',
      blackFaction: 'normal',
      selected: 'white',
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
        booksMap[`book${LS.chapter}`]?.[`${LS.nodeId}`].panels['panel-1']
          .whiteArcane,
      bArcana:
        booksMap[`book${LS.chapter}`]?.[`${LS.nodeId}`].panels['panel-1']
          .blackArcane,
      lastMove: [],
      hideCompletedPage: LS.nodeId?.split('-')[0] !== 'lesson',
      viewOnly:
        booksMap[`book${LS.chapter}`]?.[`${LS.nodeId}`].panels[`panel-1`]
          .viewOnly,
    };
    this.arcaneChess = (fen?: string) => {
      return arcaneChess({}, {}, fen);
    };
    this.chessgroundRef = React.createRef();
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  changePosition = (direction: 'inc' | 'dec') => {
    this.setState((prevState) => {
      return {
        moveNumber: prevState.moveNumber + (direction === 'inc' ? 1 : -1),
        fen: this.state.fenHistory[
          prevState.moveNumber + (direction === 'inc' ? 1 : -1)
        ],
      };
    });
  };

  changePanel = (direction: 'inc' | 'dec') => {
    this.setState(
      (prevState) => {
        const LS = getLocalStorage(this.props.auth.user.username);
        const newPanel = prevState.currPanel + (direction === 'inc' ? 1 : -1);
        this.chessgroundRef.current?.setAutoShapes([
          ...(booksMap[`book${LS.chapter}`][`${LS.nodeId}`].panels[
            `panel-${newPanel}`
          ].arrowsCircles ?? []),
        ]);
        return {
          ...prevState,
          currPanel: newPanel,
          moveNumber: 0,
          viewOnly:
            booksMap[`book${LS.chapter}`][`${LS.nodeId}`].panels[
              `panel-${newPanel}`
            ].viewOnly,
          orientation:
            booksMap[`book${LS.chapter}`][`${LS.nodeId}`].panels[
              `panel-${newPanel}`
            ].orientation,
          playerColor:
            booksMap[`book${LS.chapter}`][`${LS.nodeId}`].panels[
              `panel-${newPanel}`
            ].fen.split(' ')[0] === 'w'
              ? 'black'
              : 'white',
          engineColor:
            booksMap[`book${LS.chapter}`][`${LS.nodeId}`].panels[
              `panel-${newPanel}`
            ].fen.split(' ')[0] === 'w'
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
          arrowsCircles:
            booksMap[`book${LS.chapter}`][`${LS.nodeId}`].panels[
              `panel-${newPanel}`
            ].arrowsCircles || [],
        };
      },
      () => {
        if (!this.state.viewOnly) {
          this.arcaneChess().startGame(
            this.state.fen,
            booksMap[
              `book${getLocalStorage(this.props.auth.user.username).chapter}`
            ]?.[getLocalStorage(this.props.auth.user.username).nodeId].panels[
              'panel-1'
            ].whiteArcane,
            booksMap[
              `book${getLocalStorage(this.props.auth.user.username).chapter}`
            ]?.[getLocalStorage(this.props.auth.user.username).nodeId].panels[
              'panel-1'
            ].blackArcane,
            {},
            'CHESS'
          );
          this.setState({});
        }
        // this.setState(
        //   {
        //     turn: GameBoard.side === 0 ? 'white' : 'black',
        //     wArcana: {
        //       ...whiteArcaneConfig,
        //     },
        //     bArcana: {
        //       ...blackArcaneConfig,
        //     },
        //   },
        //   () => {
        //     if (this.state.engineColor === this.state.turn) {
        //       this.engineGo();
        //     }
        //   }
        // );
      }
    );
  };

  stepForward = () => {
    function isLastProperty(obj: object, property: string) {
      const keys = Object.keys(obj);
      const lastKey = keys[keys.length - 1];
      return property === lastKey;
    }
    if (
      this.state.moveNumber === this.state.fenHistory.length - 1 &&
      isLastProperty(
        booksMap[
          `book${getLocalStorage(this.props.auth.user.username).chapter}`
        ][`${getLocalStorage(this.props.auth.user.username).nodeId}`].panels,
        `panel-${this.state.currPanel}`
      )
    ) {
      this.handleVictory(this.props.auth);
    } else if (this.state.moveNumber === this.state.fenHistory.length - 1) {
      this.changePanel('inc');
    } else {
      this.changePosition('inc');
    }
  };

  stepBackward = () => {
    if (this.state.gameOver) {
      this.setState({ gameOver: false });
    } else if (this.state.moveNumber === 0) {
      this.changePanel('dec');
    } else {
      this.changePosition('dec');
    }
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
    const LS = getLocalStorage(this.props.auth.user.username);
    setLocalStorage({
      ...getLocalStorage(this.props.auth.user.username),
      auth,
      nodeScores: {
        ...LS.nodeScores,
        [this.state.nodeId]: 0,
      },
      lessonsCompleted: [...LS.lessonsCompleted, `${LS.chapter}-${LS.nodeId}`],
    });
    this.setState({ gameOver: true });
  };

  handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowLeft':
        if (this.state.currPanel > 1) this.stepBackward();
        break;
      case 'ArrowRight':
        this.stepForward();
        break;
      default:
        break;
    }
  }

  componentWillUnmount(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
    if (!this.state.viewOnly) {
      this.arcaneChess().startGame(
        this.state.fen,
        booksMap[
          `book${getLocalStorage(this.props.auth.user.username).chapter}`
        ]?.[getLocalStorage(this.props.auth.user.username).nodeId].panels[
          'panel-1'
        ].whiteArcane,
        booksMap[
          `book${getLocalStorage(this.props.auth.user.username).chapter}`
        ]?.[getLocalStorage(this.props.auth.user.username).nodeId].panels[
          'panel-1'
        ].blackArcane,
        {},
        'CHESS'
      );
      this.setState({});
    }
  }

  render() {
    // const greekLetters = ['X', 'Ω', 'Θ', 'Σ', 'Λ', 'Φ', 'M', 'N'];
    const { auth } = this.props;
    const LS = getLocalStorage(auth.user.username);
    console.log(PrintMoveList());
    return (
      <div className="tactorius-board fade">
        {LS.chapter === 0 ? (
          <div
            className="completed-node"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100vw',
              height: '100vh',
            }}
          >
            <Link to="/campaign">
              <Button
                text="BACK TO CAMPAIGN"
                className="primary"
                color="B"
                height={200}
                width={400}
              />
            </Link>
          </div>
        ) : this.state.hideCompletedPage ? (
          <div
            className="completed-node"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100vw',
              height: '100vh',
            }}
          >
            <Link to="/chapter">
              <Button
                text="BACK TO CHAPTER"
                className="primary"
                color="B"
                height={200}
                width={400}
              />
            </Link>
          </div>
        ) : (
          <div className="outer-lesson">
            <TactoriusModal
              isOpen={this.state.gameOver}
              handleClose={() =>
                this.setState((prevState) => ({
                  ...prevState,
                  gameOver: false,
                }))
              }
              disableSecondary={false}
              lessonBackButton={true}
              type="victory"
            />
            <div className="lesson-view">
              <div className="opponent-dialogue-arcana">
                <div className="arcana">
                  <div className="arcana-side-buttons">
                    <Button
                      className="tertiary"
                      onClick={() => {
                        this.setState({ selected: 'white' });
                      }}
                      backgroundColorOverride="#333333"
                      color="B"
                      text="WHITE"
                      width={190}
                    />
                    <Button
                      className="tertiary"
                      onClick={() => {
                        this.setState({ selected: 'black' });
                      }}
                      backgroundColorOverride="#333333"
                      color="B"
                      text="BLACK"
                      width={190}
                      disabled={false}
                    />
                  </div>
                  <div className="arcana-select">
                    {this.state.selected === 'white'
                      ? _.map(
                          this.state.wArcana,
                          (value: number, key: string) => {
                            console.log('key', key, 'value', value);
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
                          }
                        )
                      : _.map(
                          this.state.bArcana,
                          (_value: number, key: string) => {
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
                          }
                        )}
                  </div>
                </div>
              </div>
              <div className="time-board-time">
                <div className="opponent-time">{/* <h3>10:00</h3> */}</div>
                <div className="board-view">
                  <Chessground
                    forwardedRef={this.chessgroundRef}
                    fen={
                      this.state.fenHistory[this.state.fenHistory.length - 1]
                    }
                    resizable={true}
                    wFaction={this.state.whiteFaction}
                    bFaction={this.state.blackFaction}
                    width={480}
                    height={480}
                    animation={{
                      enabled: true,
                      duration: 200,
                    }}
                    highlight={{
                      lastMove: true,
                      check: true,
                    }}
                    // check={InCheck() ? true : false}
                    orientation={this.state.playerColor}
                    disableContextMenu={false}
                    turnColor={this.state.playerColor}
                    movable={{
                      free: false,
                      color: this.state.playerColor,
                      rookCastle: false,
                      dests: this.arcaneChess().getGroundMoves(),
                    }}
                    events={{
                      move: (orig: string, dest: string) => {
                        editMovePiece(orig, dest);
                        this.setState({
                          fen: outputFenOfCurrentPosition(),
                          fenHistory: [outputFenOfCurrentPosition()],
                        });
                      },
                    }}
                    selectable={{
                      enabled: true,
                    }}
                    lastMove={this.state.lastMove}
                  />
                </div>
                <div className="player-time"></div>
              </div>
              <div className="temple-clock-buttons">
                <div className="lesson-text">
                  {
                    booksMap[
                      `book${getLocalStorage(auth.user.username).chapter}`
                    ][`${getLocalStorage(auth.user.username).nodeId}`].panels[
                      `panel-${this.state.currPanel}`
                    ].panelText
                  }
                </div>
                <div className="temple-buttons">
                  <Button
                    className="tertiary"
                    onClick={() => {
                      this.stepBackward();
                    }}
                    disabled={
                      this.state.moveNumber === 0 && this.state.currPanel === 1
                        ? true
                        : false
                    }
                    color="B"
                    strong={true}
                    text="<"
                    width={180}
                    fontSize={36}
                    backgroundColorOverride="#222222"
                  />
                  <Button
                    className="tertiary"
                    onClick={() => {
                      this.stepForward();
                    }}
                    color="B"
                    strong={true}
                    text=">"
                    width={180}
                    fontSize={36}
                    backgroundColorOverride="#222222"
                  />
                </div>
              </div>
            </div>
          </div>
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

export const LessonView = connect(
  mapStateToProps,
  {}
)(withRouter(UnwrappedLessonView));
