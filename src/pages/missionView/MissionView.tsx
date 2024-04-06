import React, { createRef } from 'react';
import axios from 'axios';
import _ from 'lodash';

import { connect } from 'react-redux';
import { withRouter } from 'src/components/withRouter/withRouter';

import 'src/pages/missionView/MissionView.scss';
import 'src/chessground/styles/chessground.scss';
import 'src/chessground/styles/normal.scss';
import 'src/chessground/styles/lambda.scss';

import { setLocalStorage, getLocalStorage } from 'src/utils/handleLocalStorage';

import TactoriusModal from 'src/components/Modal/Modal';
import PromotionModal from 'src/components/PromotionModal/PromotionModal';

import arcanaJson from 'src/data/arcana.json';

import Dots from 'src/components/Loader/Dots';

import arcaneChess from '../../arcaneChess/arcaneChess.mjs';
// import {
//   arcane as arcaneChess,
//   arcaneChessWorker,
// } from '../../arcaneChess/arcaneChessInstance.js';

import { GameBoard, InCheck, TOSQ, FROMSQ } from '../../arcaneChess/board.mjs';
import { PrMove, PrSq } from 'src/arcaneChess/io.mjs';
import {
  prettyToSquare,
  BOOL,
  PIECES,
  ARCANE_BIT_VALUES,
  COLOURS,
  RtyChar,
  PceChar,
} from '../../arcaneChess/defs.mjs';
import { outputFenOfCurrentPosition } from '../../arcaneChess/board.mjs';
import { SearchController } from '../../arcaneChess/search.mjs';
import { CheckAndSet, CheckResult } from '../../arcaneChess/gui.mjs';

import {
  whiteArcaneConfig,
  blackArcaneConfig,
} from 'src/arcaneChess/arcaneDefs.mjs';

import Button from '../../components/Button/Button';
import ChessClock from '../../components/Clock/Clock';

import { Chessground, IChessgroundApi } from '../../chessground/chessgroundMod';

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

const arcana: ArcanaMap = arcanaJson as ArcanaMap;

const pieces: PieceRoyaltyTypse = PIECES;
const royalties: PieceRoyaltyTypse = ARCANE_BIT_VALUES;
const whiteArcanaBox: arcanaBoxTypes | arcanaBoxHintTypes | object =
  whiteArcaneConfig;
const blackArcanaBox: arcanaBoxTypes | arcanaBoxHintTypes | object =
  blackArcaneConfig;

interface PieceRoyaltyTypse {
  [key: string]: number;
}
interface arcanaBoxTypes {
  [key: string]: number | string | undefined;
}
interface arcanaBoxHintTypes {
  modsIMP: number | undefined;
  modsORA: number | undefined;
  modsTEM: number | undefined;
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
  theme: string;
  opponent: string;
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
  playerClock: number | null;
  playerInc: number | null;
  playerColor: string;
  engineColor: string;
  thinking: boolean;
  thinkingTime: number;
  engineDepth: number;
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
  wArcana: {
    [key: string]: number | string | undefined;
    modsIMP?: number | undefined;
    modsORA?: number | undefined;
    modsTEM?: number | undefined;
  };
  bArcana: {
    [key: string]: number | string | undefined;
    modsIMP?: number | undefined;
    modsORA?: number | undefined;
    modsTEM?: number | undefined;
  };
  placingPiece: number;
  swapType: string;
  placingRoyalty: number;
  selectedSide: string;
  hoverArcane: string;
  royalties: {
    [key: string]: { [key: string]: number | undefined };
  };
  lastMove: string[];
  orientation: string;
  preset: string;
  promotionModalOpen: boolean;
  placingPromotion: number;
  hint: string;
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
      turn:
        booksMap[`book${getLocalStorage(this.props.auth.user.id).chapter}`][
          getLocalStorage(this.props.auth.user.id).nodeId
        ].panels['panel-1'].fen.split(' ')[1] === 'w'
          ? 'white'
          : 'black',
      playerInc:
        getLocalStorage(this.props.auth.user.id).config.color === 'white'
          ? booksMap[`book${getLocalStorage(this.props.auth.user.id).chapter}`][
              getLocalStorage(this.props.auth.user.id).nodeId
            ].time[0][1]
          : booksMap[`book${getLocalStorage(this.props.auth.user.id).chapter}`][
              getLocalStorage(this.props.auth.user.id).nodeId
            ].time[1][1],
      playerClock:
        getLocalStorage(this.props.auth.user.id).config.color === 'white'
          ? booksMap[`book${getLocalStorage(this.props.auth.user.id).chapter}`][
              getLocalStorage(this.props.auth.user.id).nodeId
            ].time[0][0]
          : booksMap[`book${getLocalStorage(this.props.auth.user.id).chapter}`][
              getLocalStorage(this.props.auth.user.id).nodeId
            ].time[1][0],
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
      fen: booksMap[`book${getLocalStorage(this.props.auth.user.id).chapter}`][
        getLocalStorage(this.props.auth.user.id).nodeId
      ].panels['panel-1'].fen,
      pvLine: [],
      history: [],
      fenHistory: [
        booksMap[`book${getLocalStorage(this.props.auth.user.id).chapter}`][
          getLocalStorage(this.props.auth.user.id).nodeId
        ].panels['panel-1'].fen,
      ],
      thinking: SearchController.thinking,
      engineLastMove: [],
      thinkingTime:
        getLocalStorage(this.props.auth.user.id).config.thinkingTime * 1000,
      engineDepth: getLocalStorage(this.props.auth.user.id).config.depth,
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
      wArcana: {},
      bArcana: {},
      placingPiece: 0,
      swapType: '',
      placingRoyalty: 0,
      selectedSide: getLocalStorage(this.props.auth.user.id).config.color,
      hoverArcane: '',
      royalties:
        booksMap[`book${getLocalStorage(this.props.auth.user.id).chapter}`][
          getLocalStorage(this.props.auth.user.id).nodeId
        ].panels['panel-1'].royalties,
      lastMove: [],
      orientation:
        booksMap[`book${getLocalStorage(this.props.auth.user.id).chapter}`][
          getLocalStorage(this.props.auth.user.id).nodeId
        ].panels['panel-1'].orientation,
      preset:
        booksMap[`book${getLocalStorage(this.props.auth.user.id).chapter}`][
          getLocalStorage(this.props.auth.user.id).nodeId
        ].panels['panel-1'].preset,
      promotionModalOpen: false,
      placingPromotion: 0,
      hint: '',
    };
    this.arcaneChess = (fen?: string) => {
      return arcaneChess({}, {}, fen);
    };

    // this.arcaneChessCallback = arcaneChess.bind(this);

    this.chessgroundRef = React.createRef();
  }

  toggleHover = (arcane: string) => {
    this.setState({ hoverArcane: arcane });
  };

  transformedPositions = (royaltyType: State['royalties']) =>
    _.reduce(
      royaltyType,
      (acc, value, key) => {
        if (typeof value === 'number') {
          acc[PrSq(Number(key))] = value;
        }
        return acc;
      },
      {} as Record<string, number>
    );

  engineGo = () => {
    this.setState({
      thinking: true,
    });

    // generatePowers();
    // GenerateMoves(true, false, 'COMP');

    // PrintMoveList();

    new Promise((resolve) => {
      setTimeout(() => {
        SearchController.thinking = BOOL.TRUE;
        const engineResult = arcaneChess().engineReply(
          this.state.thinkingTime,
          this.state.engineDepth
        );
        resolve(engineResult);
      }, this.state.thinkingTime);
    })
      .then((reply) => {
        this.setState(
          (prevState) => {
            const setEngineRoyalty =
              PrMove(reply).split('@')[0]?.length > 1
                ? {
                    [`royalty${PrMove(reply).split('')[1]}`]: {
                      ...prevState.royalties[
                        `royalty${PrMove(reply).split('')[1]}`
                      ],
                      [PrSq(TOSQ(reply))]: 8,
                    },
                  }
                : {
                    ...prevState.royalties[
                      `royalty${PrMove(reply).split('')[1]}`
                    ],
                  };
            return {
              ...prevState,
              pvLine: GameBoard.cleanPV,
              history: [...prevState.history, PrMove(reply)],
              fenHistory: [
                ...prevState.fenHistory,
                outputFenOfCurrentPosition(),
              ],
              thinking: false,
              turn: prevState.turn === 'white' ? 'black' : 'white',
              lastMove: [PrSq(FROMSQ(reply)), PrSq(TOSQ(reply))],
              hint: '',
              royalties: {
                ...prevState.royalties,
                royaltyQ: _.mapValues(prevState.royalties.royaltyQ, (value) => {
                  return typeof value === 'undefined' || value <= 0
                    ? value
                    : value - 1;
                }),
                royaltyT: _.mapValues(prevState.royalties.royaltyT, (value) => {
                  return typeof value === 'undefined' || value <= 0
                    ? value
                    : value - 1;
                }),
                royaltyM: _.mapValues(prevState.royalties.royaltyM, (value) => {
                  return typeof value === 'undefined' || value <= 0
                    ? value
                    : value - 1;
                }),
                royaltyV: _.mapValues(prevState.royalties.royaltyV, (value) => {
                  return typeof value === 'undefined' || value <= 0
                    ? value
                    : value - 1;
                }),
                royaltyE: _.mapValues(prevState.royalties.royaltyE, (value) => {
                  return typeof value === 'undefined' || value <= 0
                    ? value
                    : value - 1;
                }),
                ...setEngineRoyalty,
              },
            };
          },
          () => {
            console.log('royalty', this.state.royalties);
            if (CheckAndSet(this.state.preset)) {
              this.setState({
                gameOver: true,
                gameOverType: CheckResult(this.state.preset).gameResult,
              });
              return;
            }
          }
        );
      })
      .then(() => {
        // generatePowers();
        // GenerateMoves();
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
  };

  getHintAndScore = (level: number) => {
    this.setState({
      thinking: true,
    });
    new Promise((resolve) => {
      setTimeout(() => {
        SearchController.thinking = BOOL.TRUE;
        const engineResult = arcaneChess().engineSuggestion(
          this.state.thinkingTime,
          4,
          this.state.playerColor,
          level
        );
        resolve(engineResult);
      }, 3000);
    }).then((reply: any) => {
      const { bestMove, bestScore, temporalPincer } = reply;

      if (level === 1) {
        this.setState({
          hint: PrSq(FROMSQ(bestMove)) || PrMove(bestMove).split('@')[0],
          thinking: false,
        });
      }
      if (level === 2) {
        this.setState({
          hint: PrMove(bestMove),
          thinking: false,
        });
      }
      if (level === 3) {
        this.setState({
          hint: temporalPincer,
          thinking: false,
        });
      }
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

  handlePromotion = (piece: string) => {
    this.setState((prevState) => ({
      ...prevState,
      placingPromotion:
        pieces[`${this.state.playerColor === 'white' ? 'w' : 'b'}${piece}`],
    }));
  };

  promotionSelectAsync(callback: () => void) {
    const loop = () => {
      this.setState({ promotionModalOpen: true });
      if (!this.state.placingPromotion) {
        setTimeout(loop, 0);
      } else {
        callback();
      }
    };
    loop();
  }

  handleModalClose = (pieceType: string) => {
    this.setState({
      placingPromotion:
        pieces[`${this.state.playerColor === 'white' ? 'w' : 'b'}${pieceType}`],
      gameOver: false,
      promotionModalOpen: false,
    });
  };

  normalMoveStateAndEngineGo = (parsed: number, orig: string, dest: string) => {
    const char = RtyChar.split('')[this.state.placingRoyalty];
    this.setState(
      (prevState) => ({
        history: [...prevState.history, PrMove(parsed)],
        fen: outputFenOfCurrentPosition(),
        fenHistory: [...prevState.fenHistory, outputFenOfCurrentPosition()],
        lastMove: [orig, dest],
        placingPiece: 0,
        placingRoyalty: 0,
        placingPromotion: 0,
        promotionModalOpen: false,
        swapType: '',
        royalties: {
          ...prevState.royalties,
          royaltyQ: _.mapValues(prevState.royalties.royaltyQ, (value) => {
            return typeof value === 'undefined' ? value : (value -= 1);
          }),
          royaltyT: _.mapValues(prevState.royalties.royaltyT, (value) => {
            return typeof value === 'undefined' ? value : (value -= 1);
          }),
          royaltyM: _.mapValues(prevState.royalties.royaltyM, (value) => {
            return typeof value === 'undefined' ? value : (value -= 1);
          }),
          royaltyV: _.mapValues(prevState.royalties.royaltyV, (value) => {
            return typeof value === 'undefined' ? value : (value -= 1);
          }),
          royaltyE: _.mapValues(prevState.royalties.royaltyE, (value) => {
            return typeof value === 'undefined' ? value : (value -= 1);
          }),
          [`royalty${char}`]: {
            ...prevState.royalties[`royalty${char}`],
            [dest]: 8,
          },
        },
      }),
      () => {
        if (CheckAndSet(this.state.preset)) {
          this.setState({
            gameOver: true,
            gameOverType: CheckResult(this.state.preset).gameResult,
          });
          return;
        } else {
          this.engineGo();
        }
      }
    );
  };

  componentDidMount() {
    if (!this.hasMounted) {
      this.hasMounted = true;
      this.arcaneChess().startGame(
        this.state.fen,
        booksMap[`book${getLocalStorage(this.props.auth.user.id).chapter}`][
          getLocalStorage(this.props.auth.user.id).nodeId
        ].panels['panel-1'].whiteArcane,
        booksMap[`book${getLocalStorage(this.props.auth.user.id).chapter}`][
          getLocalStorage(this.props.auth.user.id).nodeId
        ].panels['panel-1'].blackArcane,
        this.state.royalties
        // this.state.preset
      );

      this.setState(
        {
          turn: GameBoard.side === 0 ? 'white' : 'black',
          wArcana: {
            ...whiteArcaneConfig,
          },
          bArcana: {
            ...blackArcaneConfig,
          },
        },
        () => {
          if (this.state.engineColor === this.state.turn) {
            this.engineGo();
          }
        }
      );
    }
  }

  render() {
    const greekLetters = ['X', 'Ω', 'Θ', 'Σ', 'Λ', 'Φ', 'M', 'N'];
    const { auth } = this.props;
    const gameBoardTurn = GameBoard.side === 0 ? 'white' : 'black';
    return (
      <div className="tactorius-board fade">
        <TactoriusModal
          isOpen={this.state.gameOver}
          // handleClose={() => this.handleModalClose()}
          // modalType={this.state.endScenario}
          message={this.state.gameOverType} // interpolate
          type={
            this.state.gameOverType.split(' ')[1] === 'mates' &&
            getLocalStorage(this.props.auth.user.id).config.color ===
              this.state.gameOverType.split(' ')[0]
              ? 'victory'
              : 'defeat'
          }
        />
        <PromotionModal
          isOpen={this.state.promotionModalOpen}
          playerColor={this.state.playerColor}
          playerFaction={'normal'}
          handleClose={(pieceType: string) => this.handleModalClose(pieceType)}
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
              {this.state.hint !== '' ? (
                this.state.hint
              ) : this.state.hoverArcane !== '' ? (
                <div className="arcana-detail">
                  <h3>{arcana[this.state.hoverArcane].name}</h3>
                  <p>{arcana[this.state.hoverArcane].description}</p>
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
                  onClick={() => {
                    this.setState({ selectedSide: 'white' });
                  }}
                  backgroundColorOverride="#333333"
                  color="B"
                  text="WHITE"
                  width={190}
                />
                <Button
                  className="tertiary"
                  onClick={() => {
                    this.setState({ selectedSide: 'black' });
                  }}
                  backgroundColorOverride="#333333"
                  color="B"
                  text="BLACK"
                  width={190}
                  disabled={false}
                />
              </div>
              <div className="arcana-select">
                {_.map(
                  this.state.selectedSide === 'white'
                    ? whiteArcaneConfig
                    : blackArcaneConfig,
                  (value: number, key: string) => {
                    if (value === null || value <= 0) return;
                    return (
                      <img
                        key={key}
                        className="arcane"
                        src={`${arcana[key].imagePath}${
                          this.state.hoverArcane === key ? '-hover' : ''
                        }.svg`}
                        style={{
                          opacity:
                            this.state.playerColor !== gameBoardTurn ||
                            this.state.selectedSide === this.state.engineColor
                              ? 0.5
                              : 1,
                          cursor:
                            this.state.playerColor !== gameBoardTurn ||
                            this.state.selectedSide === this.state.engineColor
                              ? 'not-allowed'
                              : 'pointer',
                        }}
                        onClick={() => {
                          if (
                            this.state.playerColor !== gameBoardTurn ||
                            this.state.selectedSide === this.state.engineColor
                          )
                            return;
                          if (
                            this.state.placingPiece > 0 ||
                            this.state.swapType !== '' ||
                            this.state.placingRoyalty !== 0
                          ) {
                            this.setState({
                              placingPiece: 0,
                              swapType: '',
                              placingRoyalty: 0,
                            });
                          } else {
                            if (key.includes('sumn')) {
                              if (key.includes('sumnR') && key !== 'sumnR') {
                                // if (key !== 'sumnRE' && InCheck()) return;
                                this.setState({
                                  placingPiece: 0,
                                  placingRoyalty:
                                    royalties[`${key.split('sumn')[1]}`],
                                  swapType: '',
                                });
                              } else {
                                this.setState({
                                  placingRoyalty: 0,
                                  placingPiece:
                                    pieces[
                                      key.split('sumn')[1].toUpperCase() === 'X'
                                        ? 'EXILE'
                                        : `${
                                            this.state.selectedSide === 'white'
                                              ? 'w'
                                              : 'b'
                                          }${key.split('sumn')[1]}`
                                    ],
                                });
                              }
                            }
                            if (key.includes('swap')) {
                              if (this.state.swapType === '') {
                                this.setState((prevState) => ({
                                  swapType: key.split('swap')[1],
                                }));
                              } else {
                                this.setState((prevState) => ({
                                  swapType: '',
                                }));
                              }
                            }
                            if (key.includes('modsSUS')) {
                              if (GameBoard.suspend > 0) return;
                              GameBoard.suspend = 6;
                            }
                            if (key === 'modsIMP') {
                              this.getHintAndScore(1);
                            }
                            if (key === 'modsORA') {
                              this.getHintAndScore(2);
                            }
                            if (key === 'modsTEM') {
                              this.getHintAndScore(3);
                            }
                          }
                        }}
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
            <div className="opponent-time">
              <h3>10:00</h3>
            </div>
            <div className="board-view">
              <Chessground
                // theme={this.state.theme}
                forwardedRef={this.chessgroundRef}
                // viewOnly={this.isCheckmate()}
                fen={this.state.fenHistory[this.state.fenHistory.length - 1]}
                resizable={true}
                wFaction={this.state.whiteFaction}
                bFaction={this.state.blackFaction}
                royalties={this.state.royalties}
                // wVisible={this.state.wVisCount === 0}
                // bVisible={this.state.bVisCount === 0}
                premovable={{
                  enabled: false,
                  // premoveFunc: () => {},
                  // showDests: true,
                  // autoCastle: true,
                  // dests: this.arcaneChess().getGroundMoves(),
                }}
                width={480}
                height={480}
                check={InCheck() ? true : false}
                animation={{
                  enabled: true,
                  duration: 200,
                }}
                highlight={{
                  lastMove: true,
                  check: true,
                  royalties: true,
                }}
                lastMove={this.state.lastMove}
                orientation={this.state.orientation}
                disableContextMenu={false}
                turnColor={gameBoardTurn}
                movable={{
                  free: false,
                  rookCastle: false,
                  color: this.state.playerColor,
                  dests:
                    this.state.placingPiece === 0
                      ? this.state.placingRoyalty === 0
                        ? this.state.swapType === ''
                          ? // ? gameBoardTurn === this.state.playerColor
                            this.arcaneChess().getGroundMoves()
                          : // : null
                            this.arcaneChess().getSwapMoves(this.state.swapType)
                        : this.arcaneChess().getSummonMoves(
                            `R${RtyChar.split('')[this.state.placingRoyalty]}`
                          )
                      : this.arcaneChess().getSummonMoves(
                          PceChar.split('')[
                            this.state.placingPiece
                          ].toUpperCase()
                        ),
                  events: {},
                }}
                selectable={{
                  enabled: true,
                  selected:
                    this.state.placingPiece !== 0
                      ? {
                          role: `${PceChar.split('')[
                            this.state.placingPiece
                          ].toLowerCase()}-piece`,
                          color: 'white',
                        }
                      : this.state.placingRoyalty !== 0
                      ? {
                          role: `r${RtyChar.split('')[
                            this.state.placingRoyalty
                          ].toLowerCase()}-piece`,
                          color: 'white',
                        }
                      : null,
                  fromPocket: false,
                }}
                events={{
                  change: () => {},
                  dropNewPiece: (piece: string, key: string) => {
                    if (
                      GameBoard.pieces[prettyToSquare(key)] === PIECES.EMPTY
                    ) {
                      const { parsed } = this.arcaneChess().makeUserMove(
                        0,
                        key,
                        this.state.placingPiece,
                        '',
                        this.state.placingRoyalty
                      );
                      if (!PrMove(parsed)) {
                        console.log('invalid move');
                      }
                      this.setState(
                        (prevState) => ({
                          history: [...prevState.history, PrMove(parsed)],
                          fen: outputFenOfCurrentPosition(),
                          fenHistory: [
                            ...prevState.fenHistory,
                            outputFenOfCurrentPosition(),
                          ],
                          lastMove: [key, key],
                          placingPiece: 0,
                          placingRoyalty: 0,
                          swapType: '',
                        }),
                        () => {
                          if (CheckAndSet(this.state.preset)) {
                            this.setState({
                              gameOver: true,
                              gameOverType: CheckResult(this.state.preset)
                                .gameResult,
                            });
                            return;
                          } else {
                            this.engineGo();
                          }
                        }
                      );
                    }
                    if (this.state.placingRoyalty !== 0) {
                      this.setState((prevState) => ({
                        ...prevState,
                        royalties: {
                          ...prevState.royalties,
                          royaltyQ: _.mapValues(
                            prevState.royalties.royaltyQ,
                            (value) => {
                              return typeof value === 'undefined'
                                ? value
                                : (value -= 1);
                            }
                          ),
                          royaltyT: _.mapValues(
                            prevState.royalties.royaltyT,
                            (value) => {
                              return typeof value === 'undefined'
                                ? value
                                : (value -= 1);
                            }
                          ),
                          royaltyM: _.mapValues(
                            prevState.royalties.royaltyM,
                            (value) => {
                              return typeof value === 'undefined'
                                ? value
                                : (value -= 1);
                            }
                          ),
                          royaltyV: _.mapValues(
                            prevState.royalties.royaltyV,
                            (value) => {
                              return typeof value === 'undefined'
                                ? value
                                : (value -= 1);
                            }
                          ),
                          royaltyE: _.mapValues(
                            prevState.royalties.royaltyE,
                            (value) => {
                              return typeof value === 'undefined'
                                ? value
                                : (value -= 1);
                            }
                          ),
                          [`royalty${
                            RtyChar.split('')[this.state.placingRoyalty]
                          }`]: {
                            ...prevState.royalties[
                              `royalty${
                                RtyChar.split('')[this.state.placingRoyalty]
                              }`
                            ],
                            [key]: 8,
                          },
                        },
                        placingRoyalty: 0,
                      }));
                    }
                  },
                  move: (orig: string, dest: string) => {
                    const { parsed, isInitPromotion = false } =
                      this.arcaneChess().makeUserMove(
                        orig,
                        dest,
                        0,
                        this.state.swapType,
                        this.state.placingRoyalty
                      );
                    if (isInitPromotion) {
                      this.promotionSelectAsync(() => {
                        const parsedPromotion = this.arcaneChess().makeUserMove(
                          orig,
                          dest,
                          this.state.placingPromotion,
                          this.state.swapType,
                          this.state.placingRoyalty
                        );
                        if (!PrMove(parsed)) {
                          console.log('invalid move');
                        }
                        this.normalMoveStateAndEngineGo(
                          parsedPromotion.parsed,
                          orig,
                          dest
                        );
                      });
                    } else {
                      if (!PrMove(parsed)) {
                        console.log('invalid move');
                      }
                      this.normalMoveStateAndEngineGo(parsed, orig, dest);
                    }
                  },
                  select: (key: string) => {
                    const char = RtyChar.split('')[this.state.placingRoyalty];
                    const whiteLimit =
                      100 - 10 * (8 - GameBoard.summonRankLimits[0]);
                    const blackLimit =
                      20 + 10 * (8 - GameBoard.summonRankLimits[1]);

                    if (this.state.placingRoyalty > 0) {
                      if (
                        ((GameBoard.side === COLOURS.WHITE &&
                          prettyToSquare(key) < whiteLimit) ||
                          (GameBoard.side === COLOURS.BLACK &&
                            prettyToSquare(key) > blackLimit)) &&
                        GameBoard.pieces[prettyToSquare(key)] !== PIECES.EMPTY
                      ) {
                        if (
                          (this.state.royalties.royaltyQ[key] as number) > 0 ||
                          (this.state.royalties.royaltyT[key] as number) > 0 ||
                          (this.state.royalties.royaltyM[key] as number) > 0 ||
                          (this.state.royalties.royaltyV[key] as number) > 0 ||
                          (this.state.royalties.royaltyE[key] as number) > 0
                        ) {
                          this.setState({
                            placingRoyalty: this.state.placingRoyalty,
                          });
                          return;
                        } else {
                          const { parsed } = this.arcaneChess().makeUserMove(
                            null,
                            key,
                            this.state.placingPiece,
                            '',
                            this.state.placingRoyalty
                          );
                          if (parsed === 0) {
                            console.log('parsed === 0');
                            this.arcaneChess().takeUserMove();
                            return;
                          }
                          this.setState(
                            (prevState) => ({
                              ...prevState,
                              history: [...prevState.history, PrMove(parsed)],
                              fen: outputFenOfCurrentPosition(),
                              fenHistory: [
                                ...prevState.fenHistory,
                                outputFenOfCurrentPosition(),
                              ],
                              royalties: {
                                ...prevState.royalties,
                                royaltyQ: _.mapValues(
                                  prevState.royalties.royaltyQ,
                                  (value) => {
                                    return typeof value === 'undefined'
                                      ? value
                                      : (value -= 1);
                                  }
                                ),
                                royaltyT: _.mapValues(
                                  prevState.royalties.royaltyT,
                                  (value) => {
                                    return typeof value === 'undefined'
                                      ? value
                                      : (value -= 1);
                                  }
                                ),
                                royaltyM: _.mapValues(
                                  prevState.royalties.royaltyM,
                                  (value) => {
                                    return typeof value === 'undefined'
                                      ? value
                                      : (value -= 1);
                                  }
                                ),
                                royaltyV: _.mapValues(
                                  prevState.royalties.royaltyV,
                                  (value) => {
                                    return typeof value === 'undefined'
                                      ? value
                                      : (value -= 1);
                                  }
                                ),
                                royaltyE: _.mapValues(
                                  prevState.royalties.royaltyE,
                                  (value) => {
                                    return typeof value === 'undefined'
                                      ? value
                                      : (value -= 1);
                                  }
                                ),
                                [`royalty${char}`]: {
                                  ...prevState.royalties[`royalty${char}`],
                                  [key]: 8,
                                },
                              },
                              lastMove: [key, key],
                              placingPiece: 0,
                              placingRoyalty: 0,
                              swapType: '',
                            }),
                            () => {
                              if (CheckAndSet(this.state.preset)) {
                                this.setState({
                                  gameOver: true,
                                  gameOverType: CheckResult(this.state.preset)
                                    .gameResult,
                                });
                                return;
                              } else {
                                this.engineGo();
                              }
                            }
                          );
                        }
                      } else {
                        this.setState({
                          placingRoyalty: this.state.placingRoyalty,
                        });
                      }
                    }
                  },
                }}
                draggable={{
                  enabled: this.state.placingRoyalty === 0 ? true : false,
                }}
              />
            </div>
            <div className="player-time">
              <h3>
                <ChessClock
                  type="inc"
                  playerTurn={gameBoardTurn === this.state.playerColor}
                  turn={gameBoardTurn}
                  time={this.state.playerClock}
                  timePrime={this.state.playerInc}
                  playerTimeout={() => {
                    this.setState({
                      gameOver: true,
                      gameOverType: 'player timed out',
                    });
                  }}
                />
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
