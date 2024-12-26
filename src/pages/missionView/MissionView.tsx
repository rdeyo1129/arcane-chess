import React, { createRef } from 'react';
import axios from 'axios';
import _ from 'lodash';

import { connect } from 'react-redux';
import { withRouter } from 'src/components/withRouter/withRouter';
import { Link } from 'react-router-dom';

// import GlobalVolumeControl from 'src/utils/audio/GlobalVolumeControl';

import { audioManager } from 'src/utils/audio/AudioManager';

import 'src/pages/missionView/MissionView.scss';
import 'src/chessground/styles/chessground.scss';
import 'src/chessground/styles/normal.scss';
import 'src/chessground/styles/lambda.scss';

import { setLocalStorage, getLocalStorage } from 'src/utils/handleLocalStorage';
import { swapArmies } from 'src/utils/utils';

import TactoriusModal from 'src/components/Modal/Modal';
import PromotionModal from 'src/components/PromotionModal/PromotionModal';

import arcanaJson from 'src/data/arcana.json';

import arcaneChess from '../../arcaneChess/arcaneChess.mjs';
// import {
//   arcane as arcaneChess,
//   arcaneChessWorker,
// } from '../../arcaneChess/arcaneChessInstance.js';

import { GameBoard, InCheck, TOSQ, FROMSQ } from '../../arcaneChess/board.mjs';
import { PrMove, PrSq } from 'src/arcaneChess/io.mjs';
import {
  prettyToSquare,
  PIECES,
  ARCANE_BIT_VALUES,
  COLOURS,
  RtyChar,
  PceChar,
} from '../../arcaneChess/defs.mjs';
import {
  outputFenOfCurrentPosition,
  CAPTURED,
  ARCANEFLAG,
} from '../../arcaneChess/board.mjs';
import { SearchController } from '../../arcaneChess/search.mjs';
import { CheckAndSet, CheckResult } from '../../arcaneChess/gui.mjs';

import {
  whiteArcaneConfig,
  blackArcaneConfig,
  clearArcanaConfig,
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

const pieces: PieceRoyaltyTypes = PIECES;
const royalties: PieceRoyaltyTypes = ARCANE_BIT_VALUES;

interface PieceRoyaltyTypes {
  [key: string]: number;
}

interface ArcanaDetail {
  id: string;
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
  diagWinLose: {
    win1: string;
    win2: string;
    win3: string;
    victory: string;
    lose1: string;
    lose2: string;
    lose3: string;
    defeat: string;
  };
  prereq: string;
  opponent: string;
  hero: string;
  boss: boolean;
  theme: string;
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
      correctMoves?: string[];
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
  timeLeft: number | null;
  playerClock: number | null;
  playerInc: number | null;
  playerColor: string;
  engineColor: string;
  thinking: boolean;
  thinkingTime: number;
  engineDepth: number;
  historyPly: number;
  history: (string | string[])[];
  fenHistory: string[];
  lastMoveHistory: string[][];
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
  whiteArcana: {
    [key: string]: number | string | undefined;
    modsIMP?: number | undefined;
    modsORA?: number | undefined;
    modsTEM?: number | undefined;
  };
  blackArcana: {
    [key: string]: number | string | undefined;
    modsIMP?: number | undefined;
    modsORA?: number | undefined;
    modsTEM?: number | undefined;
  };
  placingPiece: number;
  swapType: string;
  isTeleport: boolean;
  placingRoyalty: number;
  offeringType: string;
  isDyadMove: boolean;
  normalMovesOnly: boolean;
  selectedSide: string;
  hoverArcane: string;
  royalties: {
    [key: string]: { [key: string]: number | undefined };
  };
  orientation: string;
  preset: string;
  promotionModalOpen: boolean;
  placingPromotion: number;
  hint: string;
  theme: string;
  hideCompletedPage: boolean;
  opponent: string;
  futureSightAvailable: boolean;
  victoryMessage: string;
  defeatMessage: string;
  dialogueList: Record<string, string>;
  dialogue: string[];
  glitchActive: boolean;
}

interface Props {
  auth: {
    user: {
      id: string;
      username: string;
    };
  };
  quickplayConfig: {
    color: string;
    clock: boolean;
    thinkingTime: number;
    depth: number;
    multiplier: number;
  };
}

class UnwrappedMissionView extends React.Component<Props, State> {
  hasMounted = false;
  arcaneChess;
  chessgroundRef = createRef<IChessgroundApi>();
  chessclockRef = createRef<ChessClock>();
  intervalId: NodeJS.Timeout | null = null;
  LS = getLocalStorage(this.props.auth.user.username);
  hasMissionArcana =
    Object.keys(
      booksMap[`book${this.LS.chapter}`]?.[`${this.LS.nodeId}`]?.panels[
        'panel-1'
      ].whiteArcane || {}
    ).length !== 0;
  constructor(props: Props) {
    super(props);
    const LS = getLocalStorage(this.props.auth.user.username);
    this.state = {
      turn: 'white',
      playerInc:
        getLocalStorage(this.props.auth.user.username).config.color === 'white'
          ? booksMap[
              `book${getLocalStorage(this.props.auth.user.username).chapter}`
            ]?.[getLocalStorage(this.props.auth.user.username).nodeId]
              .time[0][1]
          : booksMap[
              `book${getLocalStorage(this.props.auth.user.username).chapter}`
            ]?.[getLocalStorage(this.props.auth.user.username).nodeId]
              .time[1][1],
      timeLeft: null,
      playerClock:
        getLocalStorage(this.props.auth.user.username).config.clock === false
          ? null
          : getLocalStorage(this.props.auth.user.username).config.color ===
            'white'
          ? booksMap[
              `book${getLocalStorage(this.props.auth.user.username).chapter}`
            ]?.[getLocalStorage(this.props.auth.user.username).nodeId]
              .time[0][0]
          : booksMap[
              `book${getLocalStorage(this.props.auth.user.username).chapter}`
            ]?.[getLocalStorage(this.props.auth.user.username).nodeId]
              .time[1][0],
      playerColor: getLocalStorage(this.props.auth.user.username).config.color,
      engineColor:
        getLocalStorage(this.props.auth.user.username).config.color === 'white'
          ? 'black'
          : 'white',
      hasMounted: false,
      nodeId: getLocalStorage(this.props.auth.user.username).nodeId,
      gameOver: false,
      // getLocalStorage(this.props.auth.user.username).nodeScores[
      //   getLocalStorage(this.props.auth.user.username).nodeId
      // ] > 0,
      gameOverType: '',
      fen: this.getFen(),
      pvLine: [],
      historyPly: 0,
      history: [],
      fenHistory: [this.getFen()],
      lastMoveHistory: [],
      thinking: SearchController.thinking,
      engineLastMove: [],
      thinkingTime: getLocalStorage(this.props.auth.user.username).config
        .thinkingTime,
      engineDepth: getLocalStorage(this.props.auth.user.username).config.depth,
      whiteFaction: 'normal',
      blackFaction: 'normal',
      selected: 'a',
      config: {
        a: { disabled: false, powers: {}, picks: 0 },
        b: { disabled: false, powers: {}, picks: 0 },
        c: { disabled: false, powers: {}, picks: 0 },
        d: { disabled: false, powers: {}, picks: 0 },
        e: { disabled: false, powers: {}, picks: 0 },
        f: { disabled: false, powers: {}, picks: 0 },
      },
      // hacky code, but whiteArcana will always be player and blackArcana will always be engine
      whiteArcana:
        LS.config.color === 'white'
          ? this.hasMissionArcana
            ? booksMap[`book${LS.chapter}`]?.[`${LS.nodeId}`]?.panels['panel-1']
                .whiteArcane
            : LS.arcana
          : // black should always be engine arcana
            booksMap[`book${LS.chapter}`]?.[`${LS.nodeId}`]?.panels['panel-1']
              .blackArcane,
      blackArcana:
        LS.config.color === 'black'
          ? this.hasMissionArcana
            ? booksMap[`book${LS.chapter}`]?.[`${LS.nodeId}`]?.panels['panel-1']
                .whiteArcane
            : LS.arcana
          : // black should always be engine arcana
            booksMap[`book${LS.chapter}`]?.[`${LS.nodeId}`]?.panels['panel-1']
              .blackArcane,
      placingPiece: 0,
      swapType: '',
      isTeleport: false,
      placingRoyalty: 0,
      offeringType: '',
      isDyadMove: false,
      normalMovesOnly: false,
      selectedSide: getLocalStorage(this.props.auth.user.username).config.color,
      hoverArcane: '',
      royalties:
        booksMap[
          `book${getLocalStorage(this.props.auth.user.username).chapter}`
        ]?.[getLocalStorage(this.props.auth.user.username).nodeId].panels[
          'panel-1'
        ].royalties,
      orientation: getLocalStorage(this.props.auth.user.username).config.color,
      preset:
        booksMap[
          `book${getLocalStorage(this.props.auth.user.username).chapter}`
        ]?.[getLocalStorage(this.props.auth.user.username).nodeId].panels[
          'panel-1'
        ].preset,
      promotionModalOpen: false,
      placingPromotion:
        getLocalStorage(this.props.auth.user.username).config.autopromotion ===
        'Select'
          ? 0
          : pieces[
              `${
                getLocalStorage(this.props.auth.user.username).config.color[0]
              }${
                getLocalStorage(this.props.auth.user.username).config
                  .autopromotion
              }`
            ],
      hint: '',
      theme: booksMap[`book${LS.chapter}`]?.[`${LS.nodeId}`].theme,
      hideCompletedPage:
        _.includes(Object.keys(LS.nodeScores), LS.nodeId) ||
        LS.nodeId?.split('-')[0] !== 'mission',
      opponent: booksMap[`book${LS.chapter}`]?.[`${LS.nodeId}`].opponent,
      futureSightAvailable: true,
      victoryMessage:
        booksMap[`book${LS.chapter}`]?.[`${LS.nodeId}`].diagWinLose.victory,
      defeatMessage:
        booksMap[`book${LS.chapter}`]?.[`${LS.nodeId}`].diagWinLose.defeat,
      dialogueList: booksMap[`book${LS.chapter}`]?.[`${LS.nodeId}`].diagWinLose,
      dialogue: [],
      glitchActive: false,
    };
    this.arcaneChess = () => {
      return arcaneChess();
    };
    clearArcanaConfig();
    this.chessgroundRef = React.createRef();
    this.handleKeyDown = this.handleKeyDown.bind(this);
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
    if (this.state.gameOver) return;
    this.setState({
      thinking: true,
    });
    new Promise((resolve) => {
      if (this.state.glitchActive) {
        const glitchMove = arcaneChess().engineGlitch();
        if (CAPTURED(glitchMove) > 0 && ARCANEFLAG(glitchMove) === 0) {
          audioManager.playSound('capture');
        } else {
          audioManager.playSound('move');
        }
        resolve(glitchMove);
      } else {
        arcaneChess()
          .engineReply(
            this.state.thinkingTime,
            this.state.engineDepth,
            this.state.engineColor
          )
          .then(({ bestMove, text }) => {
            this.setState((prevState) => ({
              dialogue: [...prevState.dialogue, ...text],
            }));
            if (CAPTURED(bestMove) > 0 && ARCANEFLAG(bestMove) === 0) {
              audioManager.playSound('capture');
            } else {
              audioManager.playSound('move');
            }
            resolve(bestMove);
          });
      }
    })
      .then((reply) => {
        this.setState(
          (prevState) => {
            return {
              ...prevState,
              pvLine: GameBoard.cleanPV,
              historyPly: prevState.historyPly + 1,
              history: [...prevState.history, PrMove(reply)],
              fen: outputFenOfCurrentPosition(),
              fenHistory: [
                ...prevState.fenHistory,
                outputFenOfCurrentPosition(),
              ],
              lastMoveHistory: [
                ...prevState.lastMoveHistory,
                [PrSq(FROMSQ(reply)), PrSq(TOSQ(reply))],
              ],
              thinking: false,
              // turn: prevState.turn === 'white' ? 'black' : 'white',
              royalties: {
                ...prevState.royalties,
                ...this.arcaneChess().getPrettyRoyalties(),
              },
            };
          },
          () => {
            if (CheckAndSet()) {
              console.log('test', CheckResult());
              this.setState({
                gameOver: true,
                gameOverType: CheckResult().gameResult,
              });
              audioManager.playSound('defeat');
              return;
            }
          }
        );
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
  };

  getHintAndScore = (level: number) => {
    this.setState(
      {
        thinking: true,
      },
      () => {
        new Promise((resolve) => {
          arcaneChess()
            .engineSuggestion(this.state.playerColor, level)
            .then(resolve);
        }).then((reply: any) => {
          const { bestMove, temporalPincer } = reply;
          if (level === 1) {
            this.setState((prevState) => ({
              dialogue: [
                ...prevState.dialogue,
                PrSq(FROMSQ(bestMove)) || PrMove(bestMove).split('@')[0],
              ],
              thinking: false,
            }));
            this.chessgroundRef.current?.setAutoShapes([
              {
                orig: PrSq(FROMSQ(bestMove)) || 'a0',
                brush: 'yellow',
              },
            ]);
          }
          if (level === 2) {
            this.setState((prevState) => ({
              dialogue: [...prevState.dialogue, PrMove(bestMove)],
              thinking: false,
            }));
            this.chessgroundRef.current?.setAutoShapes([
              {
                orig: PrSq(FROMSQ(bestMove)) || PrSq(TOSQ(bestMove)),
                dest: !FROMSQ(bestMove) ? null : PrSq(TOSQ(bestMove)),
                brush: 'yellow',
              },
            ]);
          }
          if (level === 3) {
            this.setState((prevState) => ({
              dialogue: [...prevState.dialogue, temporalPincer],
              thinking: false,
            }));
          }
          this.setState({
            thinking: false,
          });
        });
      }
    );
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

  getFen() {
    let fen = '';
    if (
      getLocalStorage(this.props.auth.user.username).config.color === 'black'
    ) {
      fen = swapArmies(
        booksMap[
          `book${getLocalStorage(this.props.auth.user.username).chapter}`
        ]?.[getLocalStorage(this.props.auth.user.username).nodeId].panels[
          'panel-1'
        ].fen
      );
    } else {
      fen =
        booksMap[
          `book${getLocalStorage(this.props.auth.user.username).chapter}`
        ]?.[getLocalStorage(this.props.auth.user.username).nodeId].panels[
          'panel-1'
        ].fen;
    }
    return fen;
  }

  stopAndReturnTime = () => {
    return this.chessclockRef.current?.stopTimer();
  };

  handleVictory = (timeLeft: number | null) => {
    const LS = getLocalStorage(this.props.auth.user.username);
    audioManager.playSound('victory');
    setLocalStorage({
      ...getLocalStorage(this.props.auth.user.username),
      nodeScores: {
        ...getLocalStorage(this.props.auth.user.username).nodeScores,
        [this.state.nodeId]:
          Math.abs(
            GameBoard.material[this.state.playerColor === 'white' ? 0 : 1] -
              GameBoard.material[this.state.playerColor === 'white' ? 1 : 0]
          ) *
          (timeLeft || 1) *
          LS.config.multiplier,
      },
      chapterEnd: booksMap[`book${LS.chapter}`][this.state.nodeId].boss
        ? true
        : false,
    });
    // below updates score in modal
    this.setState({});
    if (booksMap[`book${LS.chapter}`][this.state.nodeId].boss) {
      const chapterPoints = _.reduce(
        getLocalStorage(this.props.auth.user.username).nodeScores,
        (accumulator, value) => {
          return accumulator + value;
        },
        0
      );
      // set user top score if new high
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

        // set arcana at base of local storage user to be empty object
        localStorageData.arcana = {};

        // Save the updated data back to local storage
        setLocalStorage(localStorageData);

        if (LS.auth.user.id !== '0') {
          axios
            .post('/api/campaign/topScores', {
              userId: this.props.auth.user.id,
              chapterPoints,
              chapterNumber: getLocalStorage(this.props.auth.user.username)
                .chapter,
            })
            .then(() => {
              // console.log(res);
            })
            .catch((err) => {
              console.log('top score post err: ', err);
            });
        }
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

  promotionSelectAsync(callback: () => void): Promise<void> {
    return new Promise((resolve) => {
      this.setState({ promotionModalOpen: true });
      this.intervalId = setInterval(() => {
        if (this.state.placingPromotion) {
          clearInterval(this.intervalId!);
          this.intervalId = null;
          callback();
          resolve();
        }
      }, 100);
    });
  }

  handleModalClose = (pieceType: string) => {
    this.setState({
      placingPromotion:
        pieces[`${this.state.playerColor === 'white' ? 'w' : 'b'}${pieceType}`],
      gameOver: false,
      promotionModalOpen: false,
    });
  };

  arcanaSelect = (color: string) => {
    const gameBoardTurn = GameBoard.side === 0 ? 'white' : 'black';
    return _.map(
      color === 'white' ? whiteArcaneConfig : blackArcaneConfig,
      (value: number, key: string) => {
        const futureSightAvailable =
          key === 'modsFUT' &&
          this.state.history.length >= 4 &&
          this.state.futureSightAvailable;
        if (!value || value <= 0 || !key) return;
        return (
          <img
            key={key}
            className="arcane"
            src={`${arcana[key].imagePath}${
              this.state.hoverArcane === key ? '-hover' : ''
            }.svg`}
            style={{
              opacity:
                this.state.playerColor !== color ||
                (!futureSightAvailable && key === 'modsFUT')
                  ? 0.5
                  : 1,
              cursor:
                this.state.playerColor !== color ||
                (!futureSightAvailable && key === 'modsFUT')
                  ? 'not-allowed'
                  : `url('/assets/images/cursors/pointer.svg') 12 4, pointer`,
            }}
            onClick={() => {
              if (
                this.state.playerColor !== color ||
                (!futureSightAvailable && key === 'modsFUT')
              )
                return;
              if (
                this.state.placingPiece > 0 ||
                this.state.swapType !== '' ||
                this.state.placingRoyalty !== 0 ||
                this.state.offeringType !== ''
              ) {
                this.setState({
                  placingPiece: 0,
                  swapType: '',
                  offeringType: '',
                  isTeleport: false,
                  placingRoyalty: 0,
                });
                return;
              } else {
                if (key.includes('sumn')) {
                  const dyadClock = this.arcaneChess().getDyadClock();
                  if (dyadClock > 0 || this.state.isDyadMove) return;
                  if (key.includes('sumnR') && key !== 'sumnR') {
                    // if (key !== 'sumnRE' && InCheck()) return;
                    this.setState({
                      isDyadMove: false,
                      placingPiece: 0,
                      placingRoyalty: royalties[`${key.split('sumn')[1]}`],
                      swapType: '',
                      isTeleport: false,
                    });
                  } else {
                    this.setState({
                      isDyadMove: false,
                      placingRoyalty: 0,
                      swapType: '',
                      isTeleport: false,
                      offeringType: '',
                      placingPiece:
                        pieces[
                          key.split('sumn')[1].toUpperCase() === 'X'
                            ? 'EXILE'
                            : `${
                                this.state.selectedSide === 'white' ? 'w' : 'b'
                              }${key.split('sumn')[1]}`
                        ],
                    });
                  }
                }
                if (key.includes('swap')) {
                  const dyadClock = this.arcaneChess().getDyadClock();
                  if (dyadClock > 0 || this.state.isDyadMove) return;
                  if (this.state.swapType === '') {
                    this.setState(() => ({
                      swapType: key.split('swap')[1],
                    }));
                  } else {
                    this.setState(() => ({
                      swapType: '',
                    }));
                  }
                }
                if (key.includes('offr')) {
                  const dyadClock = this.arcaneChess().getDyadClock();
                  if (dyadClock > 0 || this.state.isDyadMove) return;
                  if (this.state.offeringType === '') {
                    this.setState({
                      offeringType: key.split('offr')[1],
                    });
                  } else {
                    this.setState({
                      offeringType: '',
                    });
                  }
                }
                if (key.includes('dyad')) {
                  this.setState((prevState) => {
                    const dyadClock = this.arcaneChess().getDyadClock();
                    if (prevState.isDyadMove && dyadClock === 0) {
                      // If it's already a dyad move but no first move was made (dyadClock is 0), cancel it
                      this.arcaneChess().deactivateDyad();
                      return {
                        ...prevState,
                        isDyadMove: false,
                        normalMovesOnly: false,
                        placingPiece: 0,
                        placingRoyalty: 0,
                        swapType: '',
                        offeringType: '',
                        isTeleport: false,
                      };
                    } else if (dyadClock === 1) {
                      // If first move of dyad is already made (dyadClock is 1), deactivate the dyad and revert the move
                      this.arcaneChess().takeBackHalfDyad();
                      return {
                        ...prevState,
                        isDyadMove: true,
                        normalMovesOnly: true,
                        history: prevState.history.slice(0, -1),
                        fen: outputFenOfCurrentPosition(),
                        fenHistory: prevState.fenHistory.slice(0, -1),
                        lastMoveHistory: prevState.lastMoveHistory.slice(0, -1),
                        placingPiece: 0,
                        placingRoyalty: 0,
                        swapType: '',
                        offeringType: '',
                        isTeleport: false,
                      };
                    } else {
                      // Activate the dyad move
                      this.arcaneChess().activateDyad(key);
                      this.arcaneChess().parseCurrentFen();
                      this.arcaneChess().generatePlayableOptions();
                      const dests = this.arcaneChess().getGroundMoves();
                      if (dests.size === 0) {
                        this.arcaneChess().deactivateDyad();
                        return {
                          ...prevState,
                          isDyadMove: false,
                          normalMovesOnly: false,
                          placingPiece: 0,
                          placingRoyalty: 0,
                          swapType: '',
                          offeringType: '',
                          isTeleport: false,
                        };
                      } else {
                        return {
                          ...prevState,
                          isDyadMove: true,
                          normalMovesOnly: true,
                          placingPiece: 0,
                          placingRoyalty: 0,
                          swapType: '',
                          offeringType: '',
                          isTeleport: false,
                        };
                      }
                    }
                  });
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
                if (key === 'modsFUT') {
                  if (futureSightAvailable) {
                    this.arcaneChess().takeBackMove(
                      4,
                      this.state.playerColor,
                      this.state.history
                    );
                    this.setState((prevState) => {
                      return {
                        ...prevState,
                        historyPly: prevState.historyPly - 4,
                        fen: outputFenOfCurrentPosition(),
                        fenHistory: prevState.fenHistory.slice(0, -4),
                        lastMoveHistory: prevState.lastMoveHistory.slice(0, -4),
                        turn: gameBoardTurn,
                        royalties: {
                          ...this.arcaneChess().getPrettyRoyalties(),
                        },
                        futureSightAvailable: false,
                        isDyadMove: false,
                        normalMovesOnly: false,
                      };
                    });
                  }
                }
                if (key === 'shftT') {
                  if (this.state.isTeleport) {
                    this.setState({
                      isTeleport: false,
                    });
                  } else {
                    this.setState({
                      isTeleport: true,
                    });
                  }
                }
                if (key === 'modsSKI') {
                  const { parsed } = this.arcaneChess().makeUserMove(
                    0,
                    0,
                    31,
                    '',
                    0
                  );
                  if (CAPTURED(parsed) > 0 && ARCANEFLAG(parsed) === 0) {
                    audioManager.playSound('capture');
                  } else {
                    audioManager.playSound('move');
                  }
                  if (parsed === 0) {
                    console.log('parsed === 0');
                    // return;
                  }
                  this.setState(
                    (prevState) => ({
                      ...prevState,
                      historyPly: prevState.historyPly + 1,
                      history: [...prevState.history, 'pass'],
                      fen: outputFenOfCurrentPosition(),
                      fenHistory: [
                        ...prevState.fenHistory,
                        outputFenOfCurrentPosition(),
                      ],
                      lastMoveHistory: [...prevState.lastMoveHistory, []],
                    }),
                    () => {
                      this.engineGo();
                    }
                  );
                }
                if (key === 'modsGLI') {
                  arcaneChess().subtractArcanaUse(
                    'modsGLI',
                    this.state.playerColor
                  );
                  this.setState({
                    glitchActive: true,
                  });
                }
              }
            }}
            onMouseEnter={() => this.toggleHover(key)}
            onMouseLeave={() => this.toggleHover('')}
          />
        );
      }
    );
  };

  normalMoveStateAndEngineGo = (parsed: number, orig: string, dest: string) => {
    const char = RtyChar.split('')[this.state.placingRoyalty];
    this.setState(
      (prevState) => {
        const newHistory = [...prevState.history];
        const lastIndex = newHistory.length - 1;
        if (Array.isArray(newHistory[lastIndex])) {
          newHistory[lastIndex] = [...newHistory[lastIndex], PrMove(parsed)];
        } else {
          newHistory.push(PrMove(parsed));
        }
        return {
          historyPly: prevState.historyPly + 1,
          history: newHistory,
          fen: outputFenOfCurrentPosition(),
          fenHistory: [...prevState.fenHistory, outputFenOfCurrentPosition()],
          lastMoveHistory:
            prevState.historyPly < prevState.lastMoveHistory.length
              ? prevState.lastMoveHistory.map((moves, index) =>
                  index === prevState.historyPly
                    ? [...moves, orig, dest]
                    : moves
                )
              : [...prevState.lastMoveHistory, [orig, dest]],
          placingPiece: 0,
          placingRoyalty: 0,
          placingPromotion: 0,
          promotionModalOpen: false,
          normalMovesOnly: false,
          swapType: '',
          isTeleport: false,
          offeringType: '',
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
        };
      },
      () => {
        if (CheckAndSet()) {
          this.setState(
            {
              gameOver: true,
              gameOverType: CheckResult().gameResult,
            },
            () => {
              if (
                _.includes(
                  this.state.gameOverType,
                  `${this.state.playerColor} mates`
                )
              ) {
                this.stopAndReturnTime();
                this.handleVictory(this.stopAndReturnTime() as number | null);
              }
            }
          );
          return;
        } else {
          this.engineGo();
        }
      }
    );
  };

  navigateHistory(type: string) {
    this.setState((prevState) => {
      let newFenIndex = prevState.historyPly;
      switch (type) {
        case 'back':
          if (this.state.historyPly > 0) {
            audioManager.playSound('move');
            newFenIndex -= 1;
          }
          break;
        case 'forward':
          if (newFenIndex < prevState.fenHistory.length - 1) {
            audioManager.playSound('move');
            newFenIndex += 1;
          }
          break;
        case 'start':
          if (newFenIndex !== 0) {
            audioManager.playSound('move');
            newFenIndex = 0;
          }
          break;
        case 'end':
          if (newFenIndex !== prevState.fenHistory.length - 1) {
            audioManager.playSound('move');
            newFenIndex = prevState.fenHistory.length - 1;
          }
          break;
      }
      return {
        ...prevState,
        historyPly: newFenIndex,
        fen: prevState.fenHistory[newFenIndex],
      };
    });
  }

  handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowLeft':
        this.navigateHistory('back');
        break;
      case 'ArrowRight':
        this.navigateHistory('forward');
        break;
      default:
        break;
    }
  }

  componentWillUnmount(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    // this.arcaneChess().clearRoyalties();
    // this.setState({
    //   royalties: {
    //     royaltyQ: {},
    //     royaltyT: {},
    //     royaltyM: {},
    //     royaltyV: {},
    //     royaltyE: {},
    //   },
    // });
  }

  componentDidMount() {
    const LS = getLocalStorage(this.props.auth.user.username);
    window.addEventListener('keydown', this.handleKeyDown);
    if (!this.hasMounted && LS.chapter !== 0) {
      this.hasMounted = true;
      this.arcaneChess().init();
      this.arcaneChess().startGame(
        this.getFen(),
        this.state.whiteArcana,
        this.state.blackArcana,
        this.state.royalties,
        this.state.preset
      );
      this.setState(
        {
          turn: GameBoard.side === 0 ? 'white' : 'black',
          whiteArcana: {
            ...whiteArcaneConfig,
          },
          blackArcana: {
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
    // const greekLetters = ['X', 'Ω', 'Θ', 'Σ', 'Λ', 'Φ', 'M', 'N'];
    const gameBoardTurn = GameBoard.side === 0 ? 'white' : 'black';
    const LS = getLocalStorage(this.props.auth.user.username);
    const sortedHistory = _.chunk(this.state.history, 2);
    // const { auth } = this.props;
    const playerWins =
      this.state.gameOverType.split(' ')[1] === 'mates' &&
      getLocalStorage(this.props.auth.user.username).config.color ===
        this.state.gameOverType.split(' ')[0];
    const variantExpos: Record<string, string> = {
      XCHECK: '3 checks equals a win.',
      CRAZYHOUSE:
        'Capturing a piece gives you a friendly summon of that same piece type',
      THRONE: 'A King in the center is a win.',
      HORDE: 'The horde must checkmate, the army must capture all Pawns.',
      DELIVERANCE: 'A King on the last rank is a win.',
      CAPALL: 'Capturing all opponent pieces is a win.',
      '': '',
    };
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
              background:
                this.state.theme === 'black'
                  ? ''
                  : `url(/assets/pages/${this.state.theme}.webp)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
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
              background:
                this.state.theme === 'black'
                  ? ''
                  : `url(/assets/pages/${this.state.theme}.webp)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
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
          <div
            style={{
              width: '100vw',
              height: '100vh',
              background:
                this.state.theme === 'black'
                  ? ''
                  : `url(/assets/pages/${this.state.theme}.webp)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <TactoriusModal
              isOpen={this.state.gameOver}
              // handleClose={() => this.handleModalClose()}
              // modalType={this.state.endScenario}
              message={`${this.state.gameOverType} 
                ${
                  playerWins
                    ? this.state.victoryMessage
                    : this.state.defeatMessage
                }`}
              score={LS.nodeScores[this.state.nodeId]}
              type={playerWins ? 'victory' : 'defeat'}
            />
            <PromotionModal
              isOpen={this.state.promotionModalOpen}
              playerColor={this.state.playerColor}
              playerFaction={'normal'}
              handleClose={(pieceType: string) =>
                this.handleModalClose(pieceType)
              }
            />
            <div className="mission-view">
              <div className="opponent-dialogue-arcana">
                <div className="info-avatar">
                  <div className="avatar">
                    {this.state.opponent !== '' ? (
                      <img
                        src={`/assets/avatars/${this.state.opponent}.webp`}
                        style={{
                          width: '60px',
                          height: '60px',
                          objectFit: 'contain',
                        }}
                      />
                    ) : null}
                  </div>
                  <div className="arcana-select">
                    {this.arcanaSelect(this.state.engineColor)}
                  </div>
                </div>
                <div className="dialogue">
                  {this.state.hoverArcane !== '' ? (
                    <div className="arcana-detail">
                      <h3>{arcana[this.state.hoverArcane].name}</h3>
                      <p>{arcana[this.state.hoverArcane].description}</p>
                    </div>
                  ) : (
                    <ul style={{ padding: '0' }}>
                      <li>{variantExpos[this.state.preset]}</li>
                      {this.state.dialogue.map((item, key) => {
                        return <li key={key}>{item}</li>;
                      })}
                    </ul>
                  )}
                </div>
                <div className="buttons">
                  <Button
                    className="tertiary"
                    onClick={() => {
                      this.stopAndReturnTime();
                      this.setState({
                        gameOver: true,
                        gameOverType: `${this.state.playerColor} resigns`,
                      });
                    }}
                    color="B"
                    // strong={true}
                    text="RESIGN"
                    width={100}
                    // fontSize={30}
                    backgroundColorOverride="#222222"
                  />
                </div>
                <div className="global-volume-control">
                  {/* <GlobalVolumeControl /> */}
                </div>
              </div>
              <div className="time-board-time">
                <div className="board-frame"></div>
                <div className={`board-view ${this.state.theme}-board`}>
                  <Chessground
                    // theme={this.state.theme}
                    forwardedRef={this.chessgroundRef}
                    // viewOnly={this.isCheckmate()}
                    fen={this.state.fen}
                    resizable={true}
                    wFaction={this.state.whiteFaction}
                    bFaction={this.state.blackFaction}
                    royalties={this.state.royalties}
                    wVisible={this.arcaneChess().getInvisibility()[0] <= 0}
                    bVisible={this.arcaneChess().getInvisibility()[1] <= 0}
                    premovable={{
                      enabled: false,
                      // premoveFunc: () => {},
                      // showDests: true,
                      // autoCastle: true,
                      // dests: this.arcaneChess().getGroundMoves(),
                    }}
                    width={'100%'}
                    height={'100%'}
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
                    lastMove={
                      this.state.lastMoveHistory[this.state.historyPly - 1]
                    }
                    orientation={this.state.orientation}
                    disableContextMenu={false}
                    turnColor={gameBoardTurn}
                    movable={{
                      free: false,
                      rookCastle: false,
                      color: this.state.playerColor,
                      dests: (() => {
                        let dests;
                        if (this.state.placingPiece === 0) {
                          if (this.state.placingRoyalty === 0) {
                            if (this.state.swapType === '') {
                              if (this.state.offeringType === '') {
                                if (this.state.isTeleport) {
                                  dests =
                                    this.arcaneChess().getGroundMoves(
                                      'TELEPORT'
                                    );
                                } else {
                                  dests = this.arcaneChess().getGroundMoves();
                                }
                              } else {
                                dests = this.arcaneChess().getOfferingMoves(
                                  this.state.offeringType
                                );
                              }
                            } else {
                              dests = this.arcaneChess().getSwapMoves(
                                this.state.swapType
                              );
                            }
                          } else {
                            dests = this.arcaneChess().getSummonMoves(
                              this.state.placingRoyalty
                            );
                          }
                        } else {
                          dests = this.arcaneChess().getSummonMoves(
                            this.state.placingPiece
                          );
                        }
                        return dests;
                      })(),
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
                              color: this.state.playerColor,
                            }
                          : this.state.placingRoyalty !== 0
                          ? {
                              role: `r${RtyChar.split('')[
                                this.state.placingRoyalty
                              ].toLowerCase()}-piece`,
                              color: this.state.playerColor,
                            }
                          : this.state.offeringType !== ''
                          ? {
                              role: `o${this.state.offeringType.toLowerCase()}-piece`,
                              color: this.state.playerColor,
                            }
                          : null,
                      fromPocket: false,
                    }}
                    events={{
                      change: () => {},
                      dropNewPiece: (piece: string, key: string) => {
                        this.chessgroundRef.current?.setAutoShapes([]);
                        if (
                          GameBoard.pieces[prettyToSquare(key)] === PIECES.EMPTY
                        ) {
                          const { parsed } = this.arcaneChess().makeUserMove(
                            null,
                            key,
                            this.state.placingPiece,
                            '',
                            this.state.placingRoyalty
                          );
                          if (
                            CAPTURED(parsed) > 0 &&
                            ARCANEFLAG(parsed) === 0
                          ) {
                            audioManager.playSound('capture');
                          } else {
                            audioManager.playSound('move');
                          }
                          if (!PrMove(parsed)) {
                            console.log('invalid move', PrMove(parsed), piece);
                          }
                          this.setState(
                            (prevState) => ({
                              historyPly: prevState.historyPly + 1,
                              history: [...prevState.history, PrMove(parsed)],
                              fen: outputFenOfCurrentPosition(),
                              fenHistory: [
                                ...prevState.fenHistory,
                                outputFenOfCurrentPosition(),
                              ],
                              lastMoveHistory: [
                                ...prevState.lastMoveHistory,
                                ['a0', key],
                              ],
                              placingPiece: 0,
                              placingRoyalty: 0,
                              swapType: '',
                              isTeleport: false,
                              offeringType: '',
                              futureSightAvailable: true,
                            }),
                            () => {
                              if (CheckAndSet()) {
                                this.setState(
                                  {
                                    gameOver: true,
                                    gameOverType: CheckResult().gameResult,
                                  },
                                  () => {
                                    if (
                                      _.includes(
                                        this.state.gameOverType,
                                        `${this.state.playerColor} mates`
                                      )
                                    ) {
                                      this.handleVictory(
                                        this.stopAndReturnTime() as
                                          | number
                                          | null
                                      );
                                    }
                                  }
                                );
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
                              ...this.arcaneChess().getPrettyRoyalties(),
                            },
                            placingRoyalty: 0,
                          }));
                        }
                      },
                      move: (orig: string, dest: string) => {
                        const swapOrTeleport = this.state.isTeleport
                          ? 'TELEPORT'
                          : this.state.swapType;
                        this.chessgroundRef.current?.setAutoShapes([]);
                        const { parsed, isInitPromotion = false } =
                          this.arcaneChess().makeUserMove(
                            orig,
                            dest,
                            this.state.placingPromotion,
                            swapOrTeleport,
                            this.state.placingRoyalty
                          );
                        if (CAPTURED(parsed) > 0 && ARCANEFLAG(parsed) === 0) {
                          audioManager.playSound('capture');
                        } else {
                          audioManager.playSound('move');
                        }
                        if (this.state.isDyadMove) {
                          this.arcaneChess().parseCurrentFen();
                          this.arcaneChess().generatePlayableOptions();
                          const dests = this.arcaneChess().getGroundMoves();
                          if (dests.size === 0) {
                            this.arcaneChess().takeBackHalfDyad();
                            this.arcaneChess().deactivateDyad();
                            this.setState((prevState) => ({
                              ...prevState,
                              isDyadMove: false,
                              normalMovesOnly: false,
                            }));
                            return;
                          }
                          this.setState((prevState) => ({
                            ...prevState,
                            history: [...prevState.history, [PrMove(parsed)]],
                            fen: outputFenOfCurrentPosition(),
                            fenHistory: [
                              ...prevState.fenHistory,
                              outputFenOfCurrentPosition(),
                            ],
                            lastMoveHistory: [
                              ...prevState.lastMoveHistory,
                              [orig, dest],
                            ],
                          }));
                        }
                        if (isInitPromotion) {
                          this.promotionSelectAsync(() => {
                            const { parsed } = this.arcaneChess().makeUserMove(
                              orig,
                              dest,
                              this.state.placingPromotion,
                              swapOrTeleport,
                              this.state.placingRoyalty
                            );
                            if (
                              CAPTURED(parsed) > 0 &&
                              ARCANEFLAG(parsed) === 0
                            ) {
                              audioManager.playSound('capture');
                            } else {
                              audioManager.playSound('move');
                            }
                            if (!PrMove(parsed)) {
                              console.log('invalid move');
                            }
                            if (this.state.isDyadMove) {
                              this.setState({
                                isDyadMove: false,
                                normalMovesOnly: true,
                              });
                            } else {
                              this.normalMoveStateAndEngineGo(
                                parsed,
                                orig,
                                dest
                              );
                            }
                          });
                        } else {
                          if (!PrMove(parsed)) {
                            console.log('invalid move');
                          }
                          if (this.state.isDyadMove) {
                            this.setState({
                              isDyadMove: false,
                              normalMovesOnly: true,
                            });
                          } else {
                            this.normalMoveStateAndEngineGo(parsed, orig, dest);
                          }
                        }
                        this.setState({
                          futureSightAvailable: true,
                        });
                      },
                      select: (key: string) => {
                        let char = RtyChar.split('')[this.state.placingRoyalty];
                        const whiteLimit =
                          100 - 10 * (8 - GameBoard.summonRankLimits[0]);
                        const blackLimit =
                          20 + 10 * (8 - GameBoard.summonRankLimits[1]);

                        if (char === 'Y' || char === 'Z') {
                          char = 'E';
                        }

                        if (this.state.placingRoyalty > 0) {
                          this.chessgroundRef.current?.setAutoShapes([]);
                          if (
                            ((GameBoard.side === COLOURS.WHITE &&
                              prettyToSquare(key) < whiteLimit) ||
                              (GameBoard.side === COLOURS.BLACK &&
                                prettyToSquare(key) > blackLimit)) &&
                            GameBoard.pieces[prettyToSquare(key)] !==
                              PIECES.EMPTY
                          ) {
                            if (
                              (this.state.royalties?.royaltyQ?.[key] ?? 0) >
                                0 ||
                              (this.state.royalties?.royaltyT?.[key] ?? 0) >
                                0 ||
                              (this.state.royalties?.royaltyM?.[key] ?? 0) >
                                0 ||
                              (this.state.royalties?.royaltyV?.[key] ?? 0) >
                                0 ||
                              (this.state.royalties?.royaltyE?.[key] ?? 0) > 0
                            ) {
                              this.setState({
                                placingRoyalty: this.state.placingRoyalty,
                              });
                              return;
                            } else {
                              const { parsed } =
                                this.arcaneChess().makeUserMove(
                                  null,
                                  key,
                                  this.state.placingPiece,
                                  '',
                                  this.state.placingRoyalty
                                );
                              if (
                                CAPTURED(parsed) > 0 &&
                                ARCANEFLAG(parsed) === 0
                              ) {
                                audioManager.playSound('capture');
                              } else {
                                audioManager.playSound('move');
                              }
                              if (parsed === 0) {
                                console.log('parsed === 0');
                                // this.arcaneChess().takeUserMove();
                                // return;
                              }
                              this.setState(
                                (prevState) => ({
                                  ...prevState,
                                  historyPly: prevState.historyPly + 1,
                                  history: [
                                    ...prevState.history,
                                    PrMove(parsed),
                                  ],
                                  fen: outputFenOfCurrentPosition(),
                                  fenHistory: [
                                    ...prevState.fenHistory,
                                    outputFenOfCurrentPosition(),
                                  ],
                                  lastMoveHistory: [
                                    ...prevState.lastMoveHistory,
                                    ['a0', key],
                                  ],
                                  royalties: {
                                    ...prevState.royalties,
                                    ...this.arcaneChess().getPrettyRoyalties(),
                                  },
                                  placingPiece: 0,
                                  placingRoyalty: 0,
                                  swapType: '',
                                  isTeleport: false,
                                  offeringType: '',
                                  futureSightAvailable: true,
                                }),
                                () => {
                                  if (CheckAndSet()) {
                                    this.setState(
                                      {
                                        gameOver: true,
                                        gameOverType: CheckResult().gameResult,
                                      },
                                      () => {
                                        if (
                                          _.includes(
                                            this.state.gameOverType,
                                            `${this.state.playerColor} mates`
                                          )
                                        ) {
                                          this.handleVictory(
                                            this.stopAndReturnTime() as
                                              | number
                                              | null
                                          );
                                        }
                                      }
                                    );
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
                        } else if (this.state.offeringType !== '') {
                          const dests = this.arcaneChess().getOfferingMoves(
                            this.state.offeringType
                          );
                          if (
                            dests.has(`o${this.state.offeringType}@`) &&
                            dests
                              .get(`o${this.state.offeringType}@`)
                              .includes(key)
                          ) {
                            this.chessgroundRef.current?.setAutoShapes([]);
                            const { parsed } = this.arcaneChess().makeUserMove(
                              key,
                              null,
                              this.state.placingPiece,
                              '',
                              this.state.offeringType
                            );
                            if (
                              CAPTURED(parsed) > 0 &&
                              ARCANEFLAG(parsed) === 0
                            ) {
                              audioManager.playSound('capture');
                            } else {
                              audioManager.playSound('move');
                            }
                            if (parsed === 0) {
                              console.log('parsed === 0');
                              // return;
                            }
                            this.setState(
                              (prevState) => ({
                                ...prevState,
                                historyPly: prevState.historyPly + 1,
                                history: [...prevState.history, PrMove(parsed)],
                                fen: outputFenOfCurrentPosition(),
                                fenHistory: [
                                  ...prevState.fenHistory,
                                  outputFenOfCurrentPosition(),
                                ],
                                lastMoveHistory: [
                                  ...prevState.lastMoveHistory,
                                  ['a0', key],
                                ],
                                royalties: {
                                  ...prevState.royalties,
                                  ...this.arcaneChess().getPrettyRoyalties(),
                                },
                                placingPiece: 0,
                                placingRoyalty: 0,
                                swapType: '',
                                isTeleport: false,
                                offeringType: '',
                                futureSightAvailable: true,
                              }),
                              () => {
                                if (CheckAndSet()) {
                                  this.setState(
                                    {
                                      gameOver: true,
                                      gameOverType: CheckResult().gameResult,
                                    },
                                    () => {
                                      if (
                                        _.includes(
                                          this.state.gameOverType,
                                          `${this.state.playerColor} mates`
                                        )
                                      ) {
                                        this.handleVictory(
                                          this.stopAndReturnTime() as
                                            | number
                                            | null
                                        );
                                      }
                                    }
                                  );
                                  return;
                                } else {
                                  this.engineGo();
                                }
                              }
                            );
                          } else {
                            this.setState({
                              offeringType: this.state.offeringType,
                            });
                          }
                        }
                      },
                    }}
                    draggable={{
                      enabled:
                        this.state.placingRoyalty === 0 ||
                        this.state.offeringType === ''
                          ? true
                          : false,
                    }}
                  />
                </div>
                <div className="board-frame"></div>
              </div>
              <div className="nav-history-buttons-player">
                <div className="global-volume-control">
                  {/* <GlobalVolumeControl /> */}
                </div>
                <div className="buttons">
                  {/* <Button
                className="tertiary"
                onClick={() => {}}
                color="B"
                // strong={true}
                text="1/2"
                width={100}
                // fontSize={30}
                backgroundColorOverride="#222222"
              /> */}
                  <Button
                    className="tertiary"
                    onClick={() => {
                      audioManager.playSound('defeat');
                      this.setState({
                        gameOver: true,
                        gameOverType: `${this.state.playerColor} resigns`,
                      });
                    }}
                    color="B"
                    // strong={true}
                    text="RESIGN"
                    width={100}
                    // fontSize={30}
                    backgroundColorOverride="#222222"
                  />
                </div>
                <div className="history">
                  {sortedHistory.map((fullMove, i) => {
                    return (
                      <p className="full-move" key={i}>
                        <span className="move-number">{i + 1}.</span>
                        <span className="pgn-item">{fullMove[0]}</span>
                        <span className="pgn-item">{fullMove[1]}</span>
                      </p>
                    );
                  })}
                </div>
                <div className="nav">
                  <Button
                    className="tertiary"
                    onClick={() => this.navigateHistory('start')}
                    color="B"
                    strong={true}
                    variant="<<"
                    width={100}
                    fontSize={30}
                    backgroundColorOverride="#222222"
                  />
                  <Button
                    className="tertiary"
                    onClick={() => this.navigateHistory('back')}
                    color="B"
                    strong={true}
                    variant="<"
                    width={100}
                    fontSize={30}
                    backgroundColorOverride="#222222"
                  />
                  <Button
                    className="tertiary"
                    onClick={() => this.navigateHistory('forward')}
                    color="B"
                    strong={true}
                    variant=">"
                    width={100}
                    fontSize={30}
                    backgroundColorOverride="#222222"
                  />
                  <Button
                    className="tertiary"
                    onClick={() => this.navigateHistory('end')}
                    color="B"
                    strong={true}
                    variant=">>"
                    width={100}
                    fontSize={30}
                    backgroundColorOverride="#222222"
                  />
                </div>
                <div className="dialogue">
                  {this.state.hoverArcane !== '' ? (
                    <div className="arcana-detail">
                      <h3>{arcana[this.state.hoverArcane].name}</h3>
                      <p>{arcana[this.state.hoverArcane].description}</p>
                    </div>
                  ) : (
                    <ul style={{ padding: '0' }}>
                      <li>{variantExpos[this.state.preset]}</li>
                      {this.state.dialogue.map((item, key) => {
                        return <li key={key}>{item}</li>;
                      })}
                    </ul>
                  )}
                </div>
                <div className="info-avatar">
                  <div className="avatar">
                    <img
                      src="/assets/avatars/hero.webp"
                      style={{
                        height: '60px',
                        width: '60px',
                        objectFit: 'contain',
                      }}
                    />
                  </div>
                  <div className="info">
                    {/* or lesson hero name? though sometimes it says things like oldwoman */}
                    <div className="name"></div>
                    <div className="player-time">
                      <h3>
                        <ChessClock
                          ref={this.chessclockRef}
                          type="inc"
                          playerTurn={
                            this.state.turn === this.state.playerColor
                          }
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
                  <div className="arcana-select">
                    {this.arcanaSelect(this.state.playerColor)}
                  </div>
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

export const MissionView = connect(
  mapStateToProps,
  {}
)(withRouter(UnwrappedMissionView));
