import React, { createRef } from 'react';
import _ from 'lodash';
import fs from 'fs';
import axios from 'axios';
// import { Link, withRouter } from "react-router-dom";
// import { connect } from "react-redux";

// import "../styles/front-page.css";

import 'src/styles/main.scss';
import 'src/pages/inGameMenu/InGameMenu.scss';
import 'src/pages/inGameMenu/Create.scss';
import 'src/chessground/styles/chessground.scss';
import 'src/chessground/styles/normal.scss';
import 'src/chessground/styles/lambda.scss';

import arcanaJson from 'src/data/arcana.json';
const arcana = arcanaJson as ArcanaMap;

// import Hero from "../components/Hero";

// import arcaneChess from "./././validation-engine/arcaneChess";

import arcaneChess from '../../arcaneChess/arcaneChess.mjs';
import { PerftTest } from '../../arcaneChess/perft.mjs';

import {
  GameBoard,
  ParseFen,
  PrintBoard,
  PrintPieceLists,
  FROMSQ,
  TOSQ,
  ResetBoard,
} from '../../arcaneChess/board.mjs';
import {
  MovePiece,
  AddPiece,
  ClearPiece,
} from '../../arcaneChess/makemove.mjs';
import { PrMove, PrintMoveList, PrSq } from 'src/arcaneChess/io.mjs';
import { GenerateMoves, generatePowers } from '../../arcaneChess/movegen.mjs';
import {
  prettyToSquare,
  BOOL,
  PIECES,
  PceChar,
} from '../../arcaneChess/defs.mjs';
import {
  outputFenOfCurrentPosition,
  randomize,
  InCheck,
} from '../../arcaneChess/board.mjs';
import { SearchController } from '../../arcaneChess/search.mjs';
import {
  editAddPiece,
  editClearPiece,
  editMovePiece,
  validSummonMoves,
} from '../../arcaneChess/gui.mjs';

// import engine
// import arcaneChess from '../../arcaneChess/arcaneChess.mjs';

import { SinglePlayer } from '../singlePlayer/SinglePlayer';

// import arcaneChess correctly
// import arcaneChess from "@shared/arcaneChess/arcaneChess";

import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Toggle from '../../components/Toggle/Toggle';
import Select from '../../components/Select/Select';

import { Chessground, IChessgroundApi } from '../../chessground/chessgroundMod';
import e from 'express';

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

import { blackArcaneConfig } from 'src/arcaneChess/arcaneDefs.mjs';

// interface FrontPageProps {
//   // whiteFaction: Faction;
//   // blackFaction: Faction;
//   // arcaneChess: () => void;
// }

export const whitePiecePickupArray = [
  'wP',
  'wH',
  'wS',
  'wW',
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
];
export const blackPiecePickupArray = [
  'bP',
  'bH',
  'bS',
  'bW',
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
export const extraPickupArray = {
  Q: 'yellow',
  T: 'blue',
  M: 'green',
  V: 'purple',
  E: 'orange',
};
export const factionColorMap: { [key: string]: string } = {
  R: '#c53939',
  O: '#c77c35',
  Y: '#d6be44',
  G: '#34aa48',
  B: '#3f48cc',
  V: '#a043a2',
  W: '#888888',
  BK: '#222222',
};

const pieces: Pieces = PIECES;

interface Pieces {
  [key: string]: number;
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
  id: string; // 'lesson-1';
  title: string;
  time: number[]; // seconds
  nodeText: string;
  reward: (number | string)[];
  prereq: string;
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
  title: string;
  time: number[];
  thinking: boolean;
  thinkingTime: number;
  history: string[];
  fenHistory: string[];
  pvLine?: string[];
  fen: string;
  lastMove: string[];
  whiteFaction: string;
  blackFaction: string;
  selectedFaction: string;
  selectedSide: string;
  hoverArcane: string;
  orientation: string;
  config: {
    [key: string | number]: {
      disabled: boolean;
      arcana: {
        [key: string | number]: string | number | readonly string[] | undefined;
      };
      picks: number;
      setting: string;
    };
  };
  description: string;
  nodeText: string;
  panelText: string;
  playing: boolean;
  currBook: string;
  bookObject: { [key: string]: Node };
  nodeObject: Node['panels'];
  panelObject: {
    fen: string;
    fenHistory: string[];
    history: string[];
    panelText: string;
    // is arrows this a map?
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
  selectedBook: number;
  newNodeName: string;
  newBoardName: string;
  currNode: string;
  currPanel: string;
  correctMoves: string[];
  arcaneHover: string;
  placingPiece: number;
  swapType: string;
  arrowsCircles?: { orig: string; brush: string; dest?: string | undefined }[];
  royalties: {
    [key: string]: { [key: string]: number };
  };
  preset: string;
  reward: (number | string)[];
  prereq: string;
  opponent: string;
  puzzleEpsilon: string;
  puzzleNum: number;
  puzzleResponse: any[];
}

interface Props {
  // fen: string;
  // ... other props
}

class UnwrappedInGameMenu extends React.Component<object, State> {
  arcaneChess;
  // private puzzleWorker: Worker;
  chessgroundRef = createRef<IChessgroundApi>();
  booksMap: { [key: string]: { [key: string]: Node } } = {
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
  constructor(props: Props) {
    super(props);
    this.state = {
      // todo, just make this an array of fenHistory, simplify state...
      // todo make dyanamic
      title: this.booksMap['book1']['lesson-1'].title,
      fen: this.booksMap['book1']['lesson-1']['panels']['panel-1'].fen,
      pvLine: [],
      history: this.booksMap['book1']['lesson-1']['panels']['panel-1'].history,
      fenHistory:
        this.booksMap['book1']['lesson-1']['panels']['panel-1'].fenHistory,
      thinking: false,
      lastMove: [],
      thinkingTime: 1500,
      whiteFaction: 'normal',
      blackFaction: 'normal',
      selectedFaction: 'R',
      selectedSide: 'W',
      hoverArcane: '',
      orientation: 'white',
      config: {
        // todo disable if no abilities selected
        R: { disabled: false, arcana: {}, picks: 0, setting: 'zero' },
        O: { disabled: false, arcana: {}, picks: 0, setting: 'zero' },
        Y: { disabled: false, arcana: {}, picks: 0, setting: 'zero' },
        G: { disabled: false, arcana: {}, picks: 0, setting: 'zero' },
        B: { disabled: false, arcana: {}, picks: 0, setting: 'zero' },
        V: { disabled: false, arcana: {}, picks: 0, setting: 'zero' },
        W: {
          disabled: false,
          arcana: {
            ...this.booksMap['book1']['lesson-1'].panels['panel-1'].whiteArcane,
          },
          picks: 0,
          setting: 'zero',
        },
        BK: {
          disabled: false,
          arcana: {
            ...this.booksMap['book1']['lesson-1'].panels['panel-1'].blackArcane,
          },
          picks: 0,
          setting: 'zero',
        },
      },
      // generatedName: this.generateName(),
      description: '',
      playing: false,
      bookObject: book1,
      nodeObject: this.booksMap['book1']['lesson-1'].panels,
      panelObject: {} as State['panelObject'],
      selectedBook: 1,
      newNodeName: '',
      newBoardName: '',
      currBook: 'book1',
      currNode: 'lesson-1',
      currPanel: 'panel-1',
      preset: 'CLEAR',
      correctMoves: [],
      arcaneHover: '',
      placingPiece: 0,
      swapType: '',
      arrowsCircles: [],
      royalties: {
        ...this.booksMap['book1']['lesson-1']['panels']['panel-1'].royalties,
      },
      nodeText: this.booksMap['book1']['lesson-1'].nodeText,
      reward: this.booksMap['book1']['lesson-1'].reward,
      prereq: '',
      panelText: this.booksMap['book1']['lesson-1'].panels['panel-1'].panelText,
      time: this.booksMap['book1']['lesson-1'].time,
      opponent: this.booksMap['book1']['lesson-1'].opponent,
      // rating: 1500,
      // keyword: '',
      puzzleEpsilon: '1500 mate',
      puzzleNum: 0,
      puzzleResponse: [],
    };

    this.arcaneChess = (fen?: string) => arcaneChess({}, {}, fen);
    this.chessgroundRef = React.createRef();

    // this.puzzleWorker = new Worker(
    //   new URL('src/utils/puzzleWorker.mjs', import.meta.url),
    //   {
    //     type: 'module',
    //   }
    // );
    // this.puzzleWorker.onmessage = this.handleWorkerMessage.bind(this);
  }

  // userflow
  // select level (book)
  // select node (chapter)
  // select board (only need multiple for lessons and temples, not missions)
  // edit a board to your desire
  // play test the board
  // save the board (save board button)
  // // this saves the board and adds to the fen history
  // then, when using the arrows, it will go through the fen history of

  // description is for each panel
  // each panel has text, you might not be able to dress it up the way you want, this is where the writing needs to be concise and clear and gets the point across

  // handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   this.setState({ [event.target.name]: event.target.value });
  // };

  // handleProcessCSV = () => {
  //   const rating = Number(this.state.puzzleEpsilon.split(' ')[0]);
  //   const keyword = this.state.puzzleEpsilon.split(' ').slice(1).join(' ');
  //   this.puzzleWorker.postMessage({ action: 'processCSV', rating, keyword });
  // };

  // handleWorkerMessage = (e: MessageEvent) => {
  //   console.log('Processed data:', e.data);
  // };

  // initializeArcaneChessAndTest = (fen: string) => {
  //   // const start = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  //   // const start = '6pk/3K2p1/6p1/6p1/8/8/8/7P w - - 0 1';
  //   // const start = '8/8/8/4X3/8/8/8/8 w - - 0 1';
  //   // koh
  //   // const start = 'k7/8/8/8/8/8/8/7K w - - 0 1';
  //   // royalty mate
  //   // const start = '6Xk/8/8/8/8/8/R7/K7 w - - 0 1';
  //   // promote to unicorn
  //   // const start = '4pk2/4ppp1/6XP/8/8/8/8/7K w - - 0 1';
  //   // const start = '5pk1/5XX1/6XP/6X1/8/8/8/7K w - - 0 1';
  //   // rnbqk2r/p1pp1ppp/1p2pn2/8/1bPP4/2N1P3/PP3PPP/R1BQKBNR w KQkq - 0 1
  //   this.arcaneChess().startCreate(fen);
  // };

  perftTest = (fen: string) => {
    PrintPieceLists();
    PrintBoard();
    PerftTest(3, fen);
  };

  setFen = (fen: string) => {
    this.setState({ fen, fenHistory: [fen] });
    ParseFen(fen);
  };

  engineGo = () => {
    this.setState({
      thinking: true,
      // fenHistory: GameBoard.fenHistory,
    });

    generatePowers();
    GenerateMoves(true, false, 'COMP', 'COMP');

    SearchController.thinking = BOOL.TRUE;

    new Promise((resolve) => {
      setTimeout(() => {
        const engineResult = this.arcaneChess().engineReply(
          this.state.thinkingTime
        );
        resolve(engineResult);
      }, this.state.thinkingTime);
    })
      .then((reply) => {
        this.setState((prevState) => ({
          pvLine: GameBoard.cleanPV,
          history: [...prevState.history, PrMove(reply)],
          fenHistory: [...prevState.fenHistory, outputFenOfCurrentPosition()],
          thinking: false,
          lastMove: [PrSq(FROMSQ(reply)), PrSq(TOSQ(reply))],
        }));
      })
      .then(() => {
        generatePowers();
        GenerateMoves(true, false, 'COMP', 'COMP');
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });

    // new Promise((resolve, reject) => {
    //   resolve()
    // });
  };

  // promise or web worker here?
  // start variation button call here
  // pair with a resest button
  calculateFen = () => {
    // this.setState({ fen });
    // todo to animate, set classnames, timeouts, clock conditionals,promise?
    // todo promise or thinking timeout time for returning makemove
    // any edge cases?
    // this.setState({
    //   thinking: true,
    // });
    // this.arcaneChess().getScoreAndLine(
    //   this.state.fenHistory[this.state.fenHistory.length - 1]
    // );

    ParseFen(this.state.fen);

    // ParseFen('rnbqkbnr/pppppppp/8/4ZU2/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

    generatePowers();

    GenerateMoves(true, false, 'COMP', 'COMP');

    // PrintMoveList();

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

  onChangeUses = (e: React.ChangeEvent<HTMLSelectElement>, arcane: string) => {
    const uses = Number(e.target.value) || e.target.value;
    this.setState((prevState) => ({
      ...prevState,
      config: {
        ...prevState.config,
        [this.state.selectedFaction]: {
          ...prevState.config[this.state.selectedFaction],
          arcana: {
            ...prevState.config[this.state.selectedFaction].arcana,
            [arcane]: uses,
          },
        },
        [this.state.selectedSide]: {
          ...prevState.config[this.state.selectedSide],
          arcana: {
            ...prevState.config[this.state.selectedSide].arcana,
            [arcane]: uses,
          },
        },
      },
    }));
  };

  toggleHover = (arcane: string) => {
    this.setState({ hoverArcane: arcane });
  };

  selectFaction = (color: string) => {
    if (
      color === 'R' ||
      color === 'O' ||
      color === 'Y' ||
      color === 'G' ||
      color === 'B' ||
      color === 'V'
    ) {
      this.setState({ selectedFaction: color });
    }
  };

  selectSide = (color: string) => {
    if (color === 'BK' || color === 'W') {
      this.setState({ selectedSide: color });
    }
  };

  componentDidMount(): void {
    const arcanaKeys = Object.keys(arcana);
    ParseFen(this.state.fen);
    // this.chessgroundRef.current?.setAutoShapes([{ orig: 'e2', brush: 'blue' }]);
  }

  toggleAndRandomizeArcana(color: string) {
    if (color !== 'W' && color !== 'BK') {
      console.error('Invalid color. Only W and BK are allowed.');
      return;
    }

    this.setState((prevState) => {
      const newConfig = { ...prevState.config };
      const currentSetting = newConfig[color].setting;
      const arcanaKeys = Object.keys(arcana);

      arcanaKeys.forEach((key) => {
        newConfig[color].arcana[key];
        const isBooleanString =
          newConfig[color].arcana[key] === 'true' ||
          newConfig[color].arcana[key] === 'false';

        if (currentSetting === 'zero') {
          if (isBooleanString) {
            newConfig[color].arcana[key] = 'true';
          } else {
            newConfig[color].arcana[key] = 1;
          }
        } else if (currentSetting === 'one') {
          if (isBooleanString) {
            newConfig[color].arcana[key] =
              Math.random() < 0.5 ? 'true' : 'false';
          } else {
            newConfig[color].arcana[key] = Math.floor(Math.random() * 9);
          }
        } else {
          if (isBooleanString) {
            newConfig[color].arcana[key] = 'false';
          } else {
            newConfig[color].arcana[key] = 0;
          }
        }
      });

      newConfig[color].setting =
        currentSetting === 'zero'
          ? 'one'
          : currentSetting === 'one'
          ? 'rand'
          : 'zero';

      return { config: newConfig };
    });
  }

  render() {
    const greekLetters = ['X', 'Ω', 'Θ', 'Σ', 'Λ', 'Φ', 'M', 'N'];
    // const { auth } = this.props;
    return (
      <div className="creator">
        {/* <TactoriusModal
            isOpen={this.state.isOpen}
            handleClose={() => this.handleModalClose()}
            modalType={this.state.endScenario}
            message="test1" // interpolate
          /> */}
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

        <div className="top-left">
          <div className="arcane-history">
            <div className="arcane-input">
              {this.state.playing ? (
                <div className="arcana">
                  <div className="arcana-side-buttons">
                    <Button
                      className="tertiary"
                      onClick={() => {
                        this.setState({ selectedSide: 'W' });
                      }}
                      backgroundColorOverride="#333333"
                      color="B"
                      text="WHITE"
                      width={190}
                    />
                    <Button
                      className="tertiary"
                      onClick={() => {
                        this.setState({ selectedSide: 'BK' });
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
                      this.state.config[this.state.selectedSide].arcana,
                      (value: number, key: string) => {
                        return (
                          <img
                            key={key}
                            className="arcane"
                            src={`${arcana[key].imagePath}${
                              this.state.hoverArcane === key ? '-hover' : ''
                            }.svg`}
                            onClick={() => {
                              if (
                                this.state.placingPiece > 0 ||
                                this.state.swapType !== ''
                              ) {
                                // this.chessgroundRef.current?.unselect();
                                this.setState({
                                  placingPiece: 0,
                                  swapType: '',
                                });
                              } else {
                                // this.chessgroundRef.current?.selectPocket({
                                //   // role: 't-piece',
                                //   // color: 'white',
                                // });
                                if (key.includes('sumn')) {
                                  this.setState({
                                    placingPiece:
                                      pieces[
                                        key.split('sumn')[1].toUpperCase() ===
                                        'X'
                                          ? 'EXILE'
                                          : `${
                                              this.state.selectedSide === 'W'
                                                ? 'w'
                                                : 'b'
                                            }${key.split('sumn')[1]}`
                                      ],
                                  });
                                  // todo royalty
                                }
                                if (key.includes('swap')) {
                                  if (this.state.swapType === '') {
                                    this.setState((prevState) => ({
                                      swapType: key.split('swap')[1],
                                    }));
                                    // generatePowers();
                                    // GenerateMoves(
                                    //   true,
                                    //   false,
                                    //   false,
                                    //   key.split('swap')[1]
                                    // );
                                  } else {
                                    this.setState((prevState) => ({
                                      swapType: '',
                                    }));
                                    // generatePowers();
                                    // GenerateMoves();
                                  }
                                }
                                if (key.includes('modsSUS')) {
                                  if (GameBoard.suspend > 0) return;
                                  GameBoard.suspend = 6;
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
              ) : (
                _.map(arcanaJson, (arcane, arcaneId) => {
                  return (
                    <div
                      className="create-arcane-item"
                      key={arcaneId}
                      onMouseEnter={() => {
                        this.setState({ hoverArcane: arcaneId });
                      }}
                      onMouseLeave={() => this.setState({ hoverArcane: '' })}
                    >
                      <span className="title">{arcane['name']}</span>
                      <div className="select-extension">
                        <div className="uses">
                          <span>
                            {this.state.config[this.state.selectedSide][
                              'arcana'
                            ][arcaneId]
                              ? this.state.config[this.state.selectedSide][
                                  'arcana'
                                ][arcaneId]
                              : arcane.type === 'active' ||
                                arcane.type === 'passive'
                              ? 0
                              : 'false'}
                          </span>
                        </div>
                        <select
                          className="arcane-use-drop"
                          value={
                            this.state.config[this.state.selectedSide][
                              'arcana'
                            ][arcaneId]
                              ? this.state.config[this.state.selectedSide][
                                  'arcana'
                                ][arcaneId]
                              : arcane.type === 'active' ||
                                arcane.type === 'passive'
                              ? 0
                              : 'false'
                          }
                          onChange={(e) => {
                            console.log(e, arcaneId);
                            this.onChangeUses(e, arcaneId.toString());
                          }}
                        >
                          {arcane.type === 'active' || arcane.type === 'passive'
                            ? Array.from({ length: 9 }, (_, index) => (
                                <option key={index} value={index}>
                                  {index}
                                </option>
                              ))
                            : ['false', 'true'].map((value, i) => (
                                <option key={i} value={value}>
                                  {value}
                                </option>
                              ))}
                        </select>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="history">
              {this.state.playing ? (
                this.state.history.map((move, i) => <div key={i}>{move}</div>)
              ) : (
                <div>
                  <Select
                    options={[
                      'book1',
                      'book2',
                      'book3',
                      'book4',
                      'book5',
                      'book6',
                      'book7',
                      'book8',
                      'book9',
                      'book10',
                      'book11',
                      'book12',
                    ]}
                    onChange={(val) => {
                      this.setState({
                        currBook: val,
                        bookObject: this.booksMap[val],
                      });
                    }}
                  />
                  {/* bookmark */}
                  {_.map(this.state.bookObject, (node: any, key: string) => {
                    return (
                      <div
                        className="book-node"
                        key={key}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          background:
                            this.state.currNode === key
                              ? 'darkblue'
                              : '#444444',
                        }}
                        onClick={() => {
                          // this.state.nodeObject[key];
                          const nodeA = this.state.bookObject[key];
                          // this.booksMap[this.state.currBook][node.id];
                          this.setState({
                            currNode: node.id,
                            currPanel: '',
                            nodeObject: nodeA.panels,
                            panelObject: nodeA.panels['panel-1'],
                            title: nodeA.title,
                            time: nodeA.time,
                            nodeText: nodeA.nodeText,
                            panelText: nodeA.panels['panel-1'].panelText,
                            reward: nodeA.reward,
                            prereq: '', // split node name and decrement
                            opponent: nodeA.opponent,
                          });
                        }}
                      >
                        {node.id}
                        {/* <div
                          className="delete-node"
                          // delete node
                          onClick={() => {
                            this.setState((prevState) => ({
                              ...prevState,
                              bookObject: _.omit(prevState.bookObject, node.id),
                            }));
                          }}
                        >
                          -
                        </div> */}
                      </div>
                    );
                  })}
                  <Input
                    color="B"
                    value={this.state.newNodeName}
                    width={110}
                    onChange={(value) => {
                      this.setState({ newNodeName: value });
                    }}
                    placeholder="mission-x"
                  />
                  <Button
                    text="+"
                    className="tertiary"
                    color="G"
                    height={31}
                    width={110}
                    onClick={() => {
                      this.setState((prevState) => ({
                        ...prevState,
                        currNode: this.state.newNodeName,
                        bookObject: {
                          ...prevState.bookObject,
                          [this.state.newNodeName]: {
                            id: this.state.newNodeName,
                            title: 'Example Title',
                            time: [100, 100],
                            nodeText: 'First Description',
                            panelText: 'Second Description',
                            reward: [500, 'a', 'b', 'c'],
                            prereq: 'Some prerequisite',
                            opponent: 'Opponent Name',
                            panels: {},
                          },
                        },
                        nodeObject: {},
                      }));
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="preset-correct-moves">
            {/* <Select
              options={['LESSON', 'STANDARD', 'UYA', 'PUZZLE']}
              onChange={(value) => {
                this.setState({ preset: value });
              }}
              type="string"
            /> */}
            <Select
              options={[
                'CHESS',
                'CLEAR',
                'HORDE',
                '960',
                'KOH',
                '3CHECK',
                'CRAZYHOUSE',
              ]}
              onChange={(value) => {
                if (value === 'CLEAR') {
                  this.setState({
                    fen: '8/8/8/8/8/8/8/8 w - - 0 1',
                    fenHistory: ['8/8/8/8/8/8/8/8 w - - 0 1'],
                  });
                  ParseFen('8/8/8/8/8/8/8/8 w - - 0 1');
                }
                if (value === 'CHESS') {
                  this.setState({
                    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
                    fenHistory: [
                      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
                    ],
                  });
                  ParseFen(
                    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
                  );
                }
                if (value === 'HORDE') {
                  this.setState({
                    fen: 'rnbkqbnr/pppppppp/8/1PP2PP1/PPPPPPPP/PPPPPPPP/PPPPPPPP/PPPPPPPP w KQkq - 0 1',
                    fenHistory: [
                      'rnbkqbnr/pppppppp/8/1PP2PP1/PPPPPPPP/PPPPPPPP/PPPPPPPP/PPPPPPPP w KQkq - 0 1',
                    ],
                  });
                  ParseFen(
                    'rnbkqbnr/pppppppp/8/1PP2PP1/PPPPPPPP/PPPPPPPP/PPPPPPPP/PPPPPPPP w KQkq - 0 1'
                  );
                }
                if (value === '960') {
                  // todo
                  console.log('960', value);
                  this.setState((prevState) => ({
                    ...prevState,
                    // fen: fischer,
                    // fenHistory: [fischer],
                    preset: '960',
                    config: {
                      ...prevState.config,
                      W: {
                        ...prevState.config.W,
                        arcana: {
                          ...prevState.config.W.arcana,
                          modsRAN: 'true',
                        },
                      },
                      BK: {
                        ...prevState.config.BK,
                        arcana: {
                          ...prevState.config.BK.arcana,
                          modsRAN: 'true',
                        },
                      },
                    },
                  }));
                }
              }}
              type="string"
            />
            <div className="puzzle-input">
              <Input
                color="B"
                value={this.state.puzzleEpsilon}
                width={160}
                height={60}
                onChange={(value) => {
                  this.setState({
                    puzzleEpsilon: value,
                  });
                }}
                placeholder="rating and keyword"
              />
              <Button
                text="<"
                onClick={() => {
                  if (!this.state.puzzleResponse.length) return;
                  if (this.state.puzzleNum === 0) return;
                  if (this.state.playing) return;
                  this.setState((prevState) => {
                    const newPuzzleNum = prevState.puzzleNum - 1;
                    return {
                      puzzleNum: newPuzzleNum,
                      fen: this.state.puzzleResponse[newPuzzleNum].FEN,
                      fenHistory: [this.state.puzzleResponse[newPuzzleNum].FEN],
                      correctMoves:
                        this.state.puzzleResponse[newPuzzleNum].Moves.split(
                          ' '
                        ),
                    };
                  });
                  ParseFen(this.state.puzzleResponse[this.state.puzzleNum].FEN);
                }}
                className="tertiary"
                color="B"
                height={60}
                width={20}
              />
              <Button
                text=">"
                onClick={() => {
                  if (!this.state.puzzleResponse.length) return;
                  if (
                    this.state.puzzleNum ===
                    this.state.puzzleResponse.length - 1
                  )
                    return;
                  if (this.state.playing) return;
                  this.setState((prevState) => {
                    const newPuzzleNum = prevState.puzzleNum + 1;
                    return {
                      puzzleNum: newPuzzleNum,
                      fen: this.state.puzzleResponse[newPuzzleNum].FEN,
                      fenHistory: [this.state.puzzleResponse[newPuzzleNum].FEN],
                      correctMoves:
                        this.state.puzzleResponse[newPuzzleNum].Moves.split(
                          ' '
                        ),
                    };
                  });
                  ParseFen(this.state.puzzleResponse[this.state.puzzleNum].FEN);
                }}
                className="tertiary"
                color="B"
                height={60}
                width={20}
              />
            </div>
            <div className="nav">
              <Button
                text="<<"
                onClick={() => {
                  // this.setState((prevState) => ({
                  //   ...prevState,
                  //   correctMoves: [],
                  // }));
                }}
                className="tertiary"
                color="B"
                height={60}
                width={50}
              />
              <Button
                text="<"
                onClick={() => {
                  // this.setState((prevState) => ({
                  //   ...prevState,
                  //   correctMoves: [],
                  // }));
                }}
                className="tertiary"
                color="B"
                height={60}
                width={50}
              />
              <Button
                text=">"
                onClick={() => {
                  // this.setState((prevState) => ({
                  //   ...prevState,
                  //   correctMoves: [],
                  // }));
                }}
                className="tertiary"
                color="B"
                height={60}
                width={50}
              />
              <Button
                text=">>"
                onClick={() => {
                  // this.setState((prevState) => ({
                  //   ...prevState,
                  //   correctMoves: [],
                  // }));
                }}
                className="tertiary"
                color="B"
                height={60}
                width={50}
              />
            </div>
            <Input
              color="B"
              value={this.state.correctMoves.join(' ')}
              width={200}
              height={60}
              onChange={(value) => {
                this.setState({
                  puzzleEpsilon: value,
                });
              }}
              placeholder="correct moves"
            />
          </div>
        </div>
        <div className="board-view tactorius-board">
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
            royalties={this.state.royalties}
            // wVisible={this.state.wVisCount === 0}
            // bVisible={this.state.bVisCount === 0}
            // width={520}
            // height={520}
            width={480}
            height={480}
            check={InCheck() ? true : false}
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
              royalties: true,
            }}
            lastMove={this.state.lastMove}
            orientation={this.state.orientation}
            disableContextMenu={false}
            turnColor={
              this.state.playing
                ? GameBoard.side === 0
                  ? 'white'
                  : 'black'
                : ''
            }
            movable={{
              free: this.state.playing ? false : true,
              rookCastle: false,
              // todo swap out placeholder for comment
              // color: "both",
              color: this.state.playing
                ? GameBoard.side === 0
                  ? 'white'
                  : 'black'
                : 'both',
              // todo show summon destinations
              dests:
                this.state.placingPiece === 0
                  ? this.state.swapType === ''
                    ? this.arcaneChess().getGroundMoves()
                    : this.arcaneChess().getSwapMoves(this.state.swapType)
                  : this.arcaneChess().getSummonMoves(
                      PceChar.split('')[this.state.placingPiece]
                    ),
              events: {
                afterNewPiece: (role: string, key: string) => {
                  // console.log('after new piece', role, key);
                  // console.log(key);
                  // const parsed = this.arcaneChess().makeUserMove(0, key);
                  // // console.log(orig, dest);
                  // // console.log('captured', capturedPiece);
                  // if (!PrMove(parsed)) {
                  //   console.log('invalid move');
                  //   // debugger; // eslint-disable-line
                  // }
                  // this.setState((prevState) => ({
                  //   history: [...prevState.history, PrMove(parsed)],
                  //   fen: outputFenOfCurrentPosition(),
                  //   fenHistory: [
                  //     ...prevState.fenHistory,
                  //     outputFenOfCurrentPosition(),
                  //   ],
                  //   lastMove: [key, key],
                  // }));
                  // // this.engineGo();
                },
              },
            }}
            selectable={{
              enabled: true, // disable to enforce dragging over click-click move
              selected: {
                role: `${PceChar[this.state.placingPiece].toLowerCase()}-piece`, // class name of chess piece
                color: 'white', // color of chess piece
              }, // square or piece currently selected "a1"
              fromPocket: false, // whether the selected piece is from the pocket
            }}
            pocketRoles={{
              white: 't-piece',
              black: 'b-piece',
            }}
            events={{
              change: () => {},
              dropNewPiece: (piece: string, key: string) => {
                const parsed = this.arcaneChess().makeUserMove(
                  null,
                  key,
                  this.state.placingPiece
                );
                if (!PrMove(parsed)) {
                  console.log('invalid move');
                }
                // this.chessgroundRef.current?.unselect();
                this.setState((prevState) => ({
                  history: [...prevState.history, PrMove(parsed)],
                  fen: outputFenOfCurrentPosition(),
                  fenHistory: [
                    ...prevState.fenHistory,
                    outputFenOfCurrentPosition(),
                  ],
                  lastMove: [key, key],
                  placingPiece: 0,
                }));
                if (this.state.playing) {
                  this.engineGo();
                }
              },
              move: (orig: string, dest: string) => {
                if (this.state.playing) {
                  // to pass promotion to makeusermove epsilon
                  // console.log(capturedPiece);
                  const parsed = this.arcaneChess().makeUserMove(
                    orig,
                    dest,
                    0,
                    this.state.swapType
                  );
                  if (!PrMove(parsed)) {
                    console.log('invalid move');
                    debugger;
                  }
                  this.setState((prevState) => ({
                    history: [...prevState.history, PrMove(parsed)],
                    fen: outputFenOfCurrentPosition(),
                    fenHistory: [
                      ...prevState.fenHistory,
                      outputFenOfCurrentPosition(),
                    ],
                    lastMove: [orig, dest],
                    placingPiece: 0,
                    swapType: '',
                  }));
                  this.engineGo();
                } else {
                  editMovePiece(orig, dest);
                  this.setState({
                    fen: outputFenOfCurrentPosition(),
                    fenHistory: [outputFenOfCurrentPosition()],
                  });
                }
              },
              // dropNewPiece: (piece: string, key: string) => {},
              select: (key: string) => {
                if (this.state.playing) {
                  // console.log('select', key);
                } else {
                  if (this.state.placingPiece === 0) return;
                  if (this.state.placingPiece === 333)
                    ClearPiece(prettyToSquare(key));
                  else {
                    AddPiece(prettyToSquare(key), this.state.placingPiece);
                  }
                  this.setState({
                    fen: outputFenOfCurrentPosition(),
                    fenHistory: [outputFenOfCurrentPosition()],
                  });
                }
                ('');
              },
            }}
          />
        </div>
        <div className="top-right">
          <div className="panels-title-description">
            <div className="panels">
              {_.map(this.state.nodeObject, (panel: any, key: string) => {
                return (
                  <div
                    className="panel"
                    key={key}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      background:
                        this.state.currPanel === key ? 'darkblue' : '#444444',
                    }}
                    onClick={() => {
                      const nodeA = this.state.bookObject[this.state.currNode];
                      const panelA = this.state.nodeObject[key];

                      // No need to retrieve newPanelData using a function unless it's coming from outside this onClick handler's scope.
                      // If panelA already contains the data you need, just use it directly.

                      // Deep clone objects that you're going to update to ensure immutability.
                      // This includes royalties, whiteArcane, and blackArcane.
                      // Adjust the cloning method based on your data structure and what you need to copy (shallow vs. deep clone).
                      const newRoyalties = JSON.parse(
                        JSON.stringify(panelA.royalties)
                      );
                      const newWhiteArcane = JSON.parse(
                        JSON.stringify(panelA.whiteArcane)
                      );
                      const newBlackArcane = JSON.parse(
                        JSON.stringify(panelA.blackArcane)
                      );

                      this.chessgroundRef.current?.setAutoShapes([
                        ...(panelA.arrowsCircles ?? []),
                      ]);

                      this.setState((prevState) => ({
                        ...prevState,
                        currPanel: key,
                        panelObject: {
                          ...panelA,
                          royalties: newRoyalties,
                          whiteArcane: newWhiteArcane,
                          blackArcane: newBlackArcane,
                        },
                        royalties: newRoyalties,
                        panelText: panelA.panelText,
                        fen: panelA.fen,
                        fenHistory: [...panelA.fenHistory],
                        history: [...panelA.history],
                        preset: panelA.preset,
                        config: {
                          ...prevState.config,
                          W: {
                            ...prevState.config.W,
                            arcana: newWhiteArcane,
                          },
                          BK: {
                            ...prevState.config.BK,
                            arcana: newBlackArcane,
                          },
                        },
                        correctMoves: [...panelA.correctMoves],
                      }));
                      ParseFen(panelA.fen);
                    }}
                  >
                    {key}
                    {/* <div
                      className="delete-panel"
                      onClick={() => {
                        this.setState((prevState) => ({
                          ...prevState,
                          nodeObject: _.omit(
                            this.booksMap[this.state.currBook]['lesson-1'].panels,
                            key
                          ),
                        }));
                      }}
                    >
                      -
                    </div> */}
                  </div>
                );
              })}
              <Input
                placeholder="panel-x"
                color="B"
                value={this.state.newBoardName}
                width={110}
                onChange={(value) => {
                  this.setState({ newBoardName: value });
                }}
              />
              <Button
                text="+"
                className="tertiary"
                color="G"
                height={31}
                width={110}
                onClick={() => {
                  this.setState((prevState) => ({
                    ...prevState,
                    currNode: this.state.newNodeName,
                    currPanel: this.state.newBoardName,
                    bookObject: {
                      ...prevState.bookObject,
                      [this.state.currNode]: {
                        ...prevState.bookObject[this.state.currNode],
                        panels: {
                          ...prevState.bookObject[this.state.currNode].panels,
                          [this.state.newBoardName]: {
                            fen: '8/8/8/8/8/8/8/8 w - - 0 1',
                            fenHistory: ['8/8/8/8/8/8/8/8 w - - 0 1'],
                            history: [],
                            panelText: 'Panel Description ;soihgasog1',
                            arrowsCircles: [],
                            royalties: {
                              royaltyQ: {},
                              royaltyT: {},
                              royaltyM: {},
                              royaltyV: {},
                              royaltyE: {},
                            },
                            preset: 'CLEAR',
                            whiteArcane: {},
                            blackArcane: {},
                            config: {},
                            correctMoves: [],
                          },
                        },
                      },
                    },
                    nodeObject: {
                      ...prevState.nodeObject,
                      [this.state.newBoardName]: {
                        fen: '8/8/8/8/8/8/8/8 w - - 0 1',
                        fenHistory: ['8/8/8/8/8/8/8/8 w - - 0 1'],
                        history: [],
                        panelText: 'Panel Description ;soihgasog2',
                        arrowsCircles: [],
                        royalties: {
                          royaltyQ: {},
                          royaltyT: {},
                          royaltyM: {},
                          royaltyV: {},
                          royaltyE: {},
                        },
                        preset: 'CLEAR',
                        whiteArcane: {},
                        blackArcane: {},
                        config: {},
                        correctMoves: [],
                      },
                    },
                    panelObject: this.state.nodeObject[this.state.newBoardName],
                  }));
                }}
              />
            </div>
            <div className="title-description">
              <Input
                // id="test"
                className="input title"
                color="B"
                height={40}
                width={280}
                placeholder="TITLE"
                value={this.state.title}
                onChange={(value) => this.setState({ title: value })}
              />
              <Input
                // id="test"
                className="input title"
                color="B"
                height={40}
                width={280}
                placeholder="OPPONENT"
                value={this.state.opponent}
                onChange={(value) => this.setFen(value)}
              />
              {/* <input
                className="input description"
                color="B"
                height={280}
                width={280}
                placeholder="DESCRIPTION"
                // current
                value={this.state.fen} // Changed to use the value prop
                onChange={(value) => this.setFen(value)}
                // textArg={this.state.fenHistory[this.state.fenHistory.length - 1]}
                // setTextArg={() => this.setFen}
              /> */}
              <textarea
                className="description"
                placeholder="NODE DESCRIPTIONS"
                style={{
                  color: 'white',
                  background: '#333333',
                  border: 'solid #555555 2px',
                  borderRadius: '5px',
                  resize: 'none',
                }}
                value={this.state.nodeText}
                onChange={(event) =>
                  this.setState({ nodeText: event.target.value })
                }
              ></textarea>
              <textarea
                className="description"
                placeholder="PANEL TEXT"
                style={{
                  color: 'white',
                  background: '#333333',
                  border: 'solid #555555 2px',
                  borderRadius: '5px',
                  resize: 'none',
                }}
                value={this.state.panelText}
                onChange={(event) =>
                  this.setState({ panelText: event.target.value })
                }
              ></textarea>
            </div>
          </div>
          <div className="piece-pickup">
            <div className="piece-pickup-white">
              {whitePiecePickupArray.map((piece, index) => (
                <div
                  className="piece-pickup-square"
                  key={index}
                  onClick={() => {
                    this.setState({ placingPiece: pieces[piece] });
                  }}
                >
                  <div
                    className={`${piece
                      .substring(1, 2)
                      .toLocaleLowerCase()}-piece ${
                      piece.substring(0, 1) === 'w'
                        ? `white ${this.state.whiteFaction}`
                        : `black ${this.state.blackFaction}`
                    }`}
                    style={{
                      position: 'relative',
                      top: '4px',
                      left: '4px',
                      width: '40px',
                      height: '40px',
                      transform: 'scale(1.25)',
                    }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="piece-pickup-extra">
              {_.map(extraPickupArray, (value, key) => (
                <div key={key} className="piece-pickup-square">
                  <div
                    style={{
                      width: '50px',
                      height: '50px',
                      background: '#333333',
                      position: 'relative',
                      backgroundImage: `radial-gradient(
          circle at 50% 50%,
          ${value} 0%,
          rgba(0, 0, 0, 0) 100%
        )`,
                    }}
                  ></div>
                </div>
              ))}
              <div className="piece-pickup-square">
                <div
                  className="x-piece"
                  style={{
                    position: 'relative',
                    top: '-25px',
                    left: '-25px',
                    width: '100px',
                    height: '100px',
                    transform: 'scale(.4)',
                  }}
                  onClick={() => {
                    this.setState({ placingPiece: pieces.EXILE });
                  }}
                ></div>
              </div>
            </div>
            <div className="piece-pickup-black">
              {blackPiecePickupArray.map((piece, index) => (
                <div
                  className="piece-pickup-square"
                  key={index}
                  onClick={() => {
                    this.setState({ placingPiece: pieces[piece] });
                  }}
                >
                  <div
                    className={`${piece
                      .substring(1, 2)
                      .toLocaleLowerCase()}-piece ${
                      piece.substring(0, 1) === 'w'
                        ? `white ${this.state.whiteFaction}`
                        : `black ${this.state.blackFaction}`
                    }`}
                    style={{
                      position: 'relative',
                      top: '4px',
                      left: '4px',
                      width: '40px',
                      height: '40px',
                      transform: 'scale(1.25)',
                    }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bottom-left">
          <div className="faction-input">
            {['R', 'O', 'W', 'Y', 'G', 'BK', 'B', 'V'].map((color, index) => (
              <Button
                text={greekLetters[index]}
                key={index}
                // className=""
                className={`faction-swatch${
                  this.state.selectedSide === color ||
                  this.state.selectedFaction === color
                    ? '-selected'
                    : ''
                } tertiary`}
                color={color}
                width={50}
                height={46}
                onClick={() => {
                  this.selectFaction(color);
                  this.selectSide(color);
                }}
                backgroundColorOverride={
                  this.state.selectedSide === color ||
                  this.state.selectedFaction === color
                    ? factionColorMap[color]
                    : ''
                }
              ></Button>
            ))}
          </div>
          <div className="pv-line">
            {this.state.hoverArcane ? (
              <div className="arcana-detail">
                <p>{arcana[this.state.hoverArcane].name}</p>
                <p>{arcana[this.state.hoverArcane].description}</p>
              </div>
            ) : (
              this.state.pvLine
            )}
          </div>
        </div>
        <div className="bottom-center">
          <div className="fen-input">
            <Input
              // id="test"
              className="input fen-text-box"
              color="B"
              height={31}
              width={360}
              placeholder="FEN"
              // current
              value={this.state.fen} // Changed to use the value prop
              onChange={(value) => {
                this.setFen(value);
              }}
              // textArg={this.state.fenHistory[this.state.fenHistory.length - 1]}
              // setTextArg={() => this.setFen}
            />
            {this.state.playing ? (
              <Button
                text="RESET"
                onClick={() => {
                  // this.calculateFen();
                  this.setState({
                    playing: false,
                    fen: this.booksMap[this.state.currBook][
                      this.state.currNode
                    ]['panels'][this.state.currPanel].fen,
                    fenHistory: [
                      this.booksMap[this.state.currBook][this.state.currNode][
                        'panels'
                      ][this.state.currPanel].fen,
                    ],
                    history:
                      this.booksMap[this.state.currBook][this.state.currNode][
                        'panels'
                      ][this.state.currPanel].history,
                    arrowsCircles:
                      this.booksMap[this.state.currBook][this.state.currNode][
                        'panels'
                      ][this.state.currPanel].arrowsCircles,
                    royalties:
                      this.booksMap[this.state.currBook][this.state.currNode][
                        'panels'
                      ][this.state.currPanel].royalties,
                    preset:
                      this.booksMap[this.state.currBook][this.state.currNode][
                        'panels'
                      ][this.state.currPanel].preset,
                  });
                }}
                className="primary"
                color="B"
                height={31}
                width={120}
                // disabled={this.state.fen === ''}
                disabled={false}
                // strong={true}
              />
            ) : (
              <Button
                text="PLAY"
                onClick={() => {
                  const fischer = randomize(
                    this.state.config.W.arcana,
                    this.state.config.BK.arcana
                  );
                  this.arcaneChess().startGame(
                    this.state.fen,
                    this.state.config.W.arcana,
                    this.state.config.BK.arcana,
                    this.state.royalties,
                    this.state.preset
                  );
                  if (this.state.fen.split(' ')[1] === 'b') {
                    this.engineGo();
                  }
                  this.setState({
                    playing: true,
                    placingPiece: 0,
                    // fen: fischer,
                    // fenHistory: [fischer],
                  });
                }}
                className="primary"
                color="B"
                height={31}
                width={120}
                // disabled={this.state.fen === ''}
                disabled={false}
                // strong={true}
              />
            )}
          </div>
          <div className="time-input">
            {/* // todo white time */}
            <Select
              type="number"
              width={180}
              options={[20, 30, 45, 60, 90, 120, 180, 300, 600]}
              onChange={(value) => {}}
            />
            {/* // todo black time */}
            <Select
              type="number"
              width={180}
              options={[20, 30, 45, 60, 90, 120, 180, 300, 600]}
              onChange={(value) => {}}
            />
          </div>
          <Button
            text="SIM"
            onClick={() => this.arcaneChess().gameSim(100)}
            className="primary"
            color="B"
            height={31}
            width={120}
            // disabled={this.state.fen === ''}
            disabled={false}
            // strong={true}
          />
          <div className="reward-input">
            <Input
              color="B"
              value={this.state.reward.toString()}
              placeholder="REWARD"
              width={180}
              height={31}
              onChange={(value) => {
                this.setState({ thinkingTime: Number(value) });
              }}
            ></Input>
            <div className="material">
              <div className="white-material">
                {GameBoard.material[0] ? GameBoard.material[0] - 150000 : 0}
              </div>
              <div className="black-material">
                {GameBoard.material[1] ? GameBoard.material[1] - 150000 : 0}
              </div>
            </div>
            {/* <Input
              color="B"
              value={''}
              placeholder='Thinking Time "500"'
              width={180}
              onChange={(value) => {
                this.setState({ thinkingTime: Number(value) });
              }}
            ></Input> */}
          </div>

          <Button
            text="FACTIONIZE"
            onClick={() => this.calculateFen()}
            className="primary"
            color="B"
            height={31}
            width={120}
            // disabled={this.state.fen === ''}
            disabled={false}
            // strong={true}
          />
        </div>
        <div className="bottom-right">
          <div className="create-buttons">
            <div className="content">
              <Button
                text="PUZZLE"
                onClick={() => {
                  const rating = this.state.puzzleEpsilon.split(' ')[0];
                  const keyword = this.state.puzzleEpsilon
                    .split(' ')
                    .slice(1)
                    .join(' ');

                  axios
                    .get(
                      `http://localhost:8080/api/puzzles?rating=${rating}&keyword=${keyword}`
                    )
                    .then((response) => {
                      // todo to be looped through
                      this.setState((prevState) => ({
                        fen: response.data[prevState.puzzleNum].FEN,
                        fenHistory: [response.data[prevState.puzzleNum].FEN],
                        // history: response.data.history,
                        // arrowsCircles: response.data.arrowsCircles,
                        // royalities: response.data.royalties,
                        // preset: response.data.preset,
                        // config: {
                        //   W: {
                        //     arcana: { ...response.data.whiteArcane },
                        //   },
                        //   BK: {
                        //     arcana: { ...response.data.blackArcane },
                        //   },
                        // },
                        correctMoves:
                          response.data[prevState.puzzleNum].Moves.split(' '),
                        puzzleResponse: [...response.data],
                      }));
                      ParseFen(response.data[this.state.puzzleNum].FEN);
                    })
                    .catch((error) => console.error('Error:', error));
                }}
                className="tertiary"
                color="B"
                height={46}
                width={100}
                disabled={false}
              />
              <Button
                text="RAND"
                className="tertiary"
                color="B"
                height={46}
                width={100}
                disabled={false}
                onClick={() => {
                  this.toggleAndRandomizeArcana(
                    this.state.selectedSide === 'W' ? 'W' : 'BK'
                  );
                  // this.toggleAndRandomizeArcana('BK');
                }}
              />
            </div>
            <div className="picker-extension">
              <Button
                className="tertiary"
                color="B"
                text="MOUSE"
                height={46}
                onClick={() => this.setState({ placingPiece: 0 })}
              />
              <Button
                className="tertiary"
                color="B"
                text="TRASH"
                height={46}
                onClick={() => this.setState({ placingPiece: 333 })}
              />
            </div>
            <div className="reset-output">
              <Button
                text="RESET PANEL"
                onClick={() => null}
                className="tertiary"
                color="B"
                height={46}
                width={133}
                disabled={false}
              />
              <Button
                text="OUTPUT PANEL"
                onClick={() => {
                  const elements = document.getElementsByTagName('g');
                  const arrowsCircles = [];

                  for (let i = 0; i < elements.length; i++) {
                    const children = elements[i].children;
                    for (let j = 0; j < children.length; j++) {
                      const items = children[j].getAttribute('cgHash');
                      const itemsArray = items?.split(',');
                      if (itemsArray?.length === 4) {
                        arrowsCircles.push({
                          orig: itemsArray[2],
                          brush: itemsArray[3],
                        });
                      }
                      if (itemsArray?.length === 5) {
                        arrowsCircles.push({
                          orig: itemsArray[2],
                          dest: itemsArray[3],
                          brush: itemsArray[4],
                        });
                      }
                    }
                  }
                  console.log({
                    [this.state.currPanel]: {
                      ...this.state.nodeObject[this.state.currPanel],
                      fen: this.state.fen,
                      fenHistory: [...this.state.fenHistory],
                      history: [...this.state.history],
                      panelText: this.state.panelText,
                      arrowsCircles: [...arrowsCircles],
                      royalties: { ...this.state.royalties },
                      preset: this.state.preset,
                      whiteArcane: { ...this.state.config.W.arcana },
                      blackArcane: { ...this.state.config.BK.arcana },
                      // config: { ...this.state.config },
                      correctMoves: [...this.state.correctMoves],
                    },
                  });
                }}
                className="tertiary"
                color="B"
                height={46}
                width={133}
                disabled={false}
              />
              <Button
                text="OUTPUT NODE"
                onClick={() => {
                  console.log({
                    [this.state.currNode]: {
                      ...this.state.bookObject[this.state.currNode],
                      missionType: 'NORMAL / VARIANT / UYA',
                    },
                  });
                }}
                className="tertiary"
                color="B"
                height={46}
                width={133}
                disabled={false}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// function mapStateToProps({}) {
//   return {};
// }

export const InGameMenu = UnwrappedInGameMenu;
// connect(mapStateToProps)(
//   withRouter(UnwrappedFrontPage)
// );

// .hero-text {
//   font-size: 48px;
//   font-weight: 800;
// }
