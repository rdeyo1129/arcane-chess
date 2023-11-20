import React from 'react';
import _ from 'lodash';
import fs from 'fs';
// import { Link, withRouter } from "react-router-dom";
// import { connect } from "react-redux";

// import "../styles/front-page.css";

import 'src/pages/inGameMenu/InGameMenu.scss';
import 'src/pages/inGameMenu/Create.scss';
import 'src/chessground/styles/chessground.scss';
import 'src/chessground/styles/normal.scss';
import 'src/chessground/styles/lambda.scss';

import ArcanaJson from 'src/data/arcana.json';

// import Hero from "../components/Hero";

// import arcaneChess from "./././validation-engine/arcaneChess";

import arcaneChess from '../../arcaneChess/arcaneChess.mjs';
import { PerftTest } from '../../arcaneChess/perft.mjs';

import {
  GameBoard,
  ParseFen,
  PrintBoard,
  PrintPieceLists,
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
// import engine
// import arcaneChess from '../../arcaneChess/arcaneChess.mjs';

import { SinglePlayer } from '../singlePlayer/SinglePlayer';

// import arcaneChess correctly
// import arcaneChess from "@shared/arcaneChess/arcaneChess";

import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Toggle from '../../components/Toggle/Toggle';

import { Chessground } from '../../chessground/chessgroundMod';
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

// interface FrontPageProps {
//   // whiteFaction: Faction;
//   // blackFaction: Faction;
//   // arcaneChess: () => void;
// }

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

interface Node {
  id: string; // 'lesson-1';
  title: string;
  time: [number, number]; // seconds
  description1: string;
  description2: string;
  reward: (number | string[])[];
  prereq: string;
  opponent: string;
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
      varVar: string;
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

interface State {
  thinking: boolean;
  thinkingTime: number;
  history: string[];
  fenHistory: string[];
  pvLine?: string[];
  fen: string;
  engineLastMove: string[];
  whiteFaction: string;
  blackFaction: string;
  selected: string;
  hoverArcane: string | null;
  config: {
    [key: string | number]: {
      disabled: boolean;
      powers: {
        [key: string | number]: string | number | readonly string[] | undefined;
      };
      picks: number;
    };
  };
  description: string;
  playing: boolean;
  bookObject: object;
  nodeObject: object;
  panelObject: object;
  selectedBook: number;
  newNodeName: string;
  newBoardName: string;
  currNode: string;
  currPanel: string;
  books: {
    [key: number]: object;
  };
}

interface Props {
  // fen: string;
  // ... other props
}

class UnwrappedInGameMenu extends React.Component<object, State> {
  arcaneChess;
  constructor(props: Props) {
    super(props);
    this.state = {
      // todo, just make this an array of fenHistory, simplify state...
      // todo make dyanamic
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      pvLine: [],
      history: [],
      fenHistory: ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'],
      thinking: false,
      engineLastMove: [],
      thinkingTime: 500,
      whiteFaction: 'normal',
      blackFaction: 'normal',
      selected: 'a',
      hoverArcane: null,
      config: {
        // todo disable if no abilities selected
        a: { disabled: false, powers: {}, picks: 0 },
        b: { disabled: false, powers: {}, picks: 0 },
        c: { disabled: false, powers: {}, picks: 0 },
        d: { disabled: false, powers: {}, picks: 0 },
        e: { disabled: false, powers: {}, picks: 0 },
        f: { disabled: false, powers: {}, picks: 0 },
      },
      // generatedName: this.generateName(),
      description: '',
      playing: false,
      bookObject: book1,
      nodeObject: {},
      panelObject: {},
      selectedBook: 1,
      newNodeName: '',
      newBoardName: '',
      currNode: '',
      currPanel: '',
      books: {
        1: book1,
        2: book2,
        3: book3,
        4: book4,
        5: book5,
        6: book6,
        7: book7,
        8: book8,
        9: book9,
        10: book10,
        11: book11,
        12: book12,
      },
    };
    this.arcaneChess = (fen?: string) => arcaneChess({}, {}, fen);
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
      // fenHistory: GameBoard.fenHistory,
    });

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
        console.log('reply', reply);
        this.setState((prevState) => ({
          pvLine: GameBoard.cleanPV,
          history: [...prevState.history, PrMove(reply)],
          fenHistory: [...prevState.fenHistory, outputFenOfCurrentPosition()],
          thinking: false,
        }));
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });

    generatePowers();
    GenerateMoves();

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

  componentDidMount(): void {
    // uncomment for moving pieces freely? Or just conditionalize based on whether in variation or not
    // this.initializeArcaneChessAndTest(
    //   this.state.fenHistory[this.state.fenHistory.length - 1]
    // );
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
              {_.map(ArcanaJson, (arcane, arcaneId) => {
                return (
                  <div
                    className="create-arcane-item"
                    key={arcaneId}
                    onMouseEnter={() =>
                      this.setState({ hoverArcane: arcaneId })
                    }
                    onMouseLeave={() => this.setState({ hoverArcane: null })}
                  >
                    <span className="title">{arcane['name']}</span>
                    <div className="select-extension">
                      <div className="uses">
                        <span>
                          {this.state.config[this.state.selected]['powers'][
                            arcaneId
                          ]
                            ? this.state.config[this.state.selected]['powers'][
                                arcaneId
                              ]
                            : arcane.type === 'active' ||
                              arcane.type === 'passive'
                            ? 0
                            : 'false'}
                        </span>
                      </div>
                      {arcane.type === 'active' || arcane.type === 'passive' ? (
                        <select
                          className="arcane-use-drop"
                          onChange={(e) => {
                            this.onChangeUses(e, arcaneId.toString());
                          }}
                        >
                          {Array.from({ length: 9 }, (_, index) => {
                            return (
                              <option
                                key={index}
                                value={
                                  this.state.config[this.state.selected][
                                    'powers'
                                  ][arcaneId]
                                }
                              >
                                {index}
                              </option>
                            );
                          })}
                        </select>
                      ) : arcane.type === 'inherent' ? (
                        <select
                          className="arcane-use-drop"
                          // value={
                          //   this.state.config[this.state.selected]['powers'][
                          //     arcaneId
                          //   ]
                          // }
                          onChange={(e) =>
                            this.onChangeUses(e, arcaneId.toString())
                          }
                        >
                          {['false', 'true'].map((value, i) => (
                            <option
                              key={i}
                              value={
                                this.state.config[this.state.selected][
                                  'powers'
                                ][arcaneId]
                              }
                            >
                              {value}
                            </option>
                          ))}
                        </select>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="history">
              {this.state.playing ? (
                this.state.history.map((move, i) => <div key={i}>{move}</div>)
              ) : (
                <div>
                  {_.map(this.state.bookObject, (node: any) => {
                    return (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        {node.id}
                        <div
                          style={{
                            textAlign: 'center',
                            width: '30px',
                            height: '30px',
                            padding: '4px',
                            background: 'darkred',
                            cursor: 'pointer',
                          }}
                          // delete node
                          onClick={() => {
                            this.setState((prevState) => ({
                              ...prevState,
                              bookObject: _.omit(prevState.bookObject, node.id),
                            }));
                          }}
                        >
                          -
                        </div>
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
                        bookObject: {
                          ...prevState.bookObject,
                          [this.state.newNodeName]: {
                            id: this.state.newNodeName,
                            boards: {},
                          },
                        },
                      }));
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="board-view tactorius-board">
          <Chessground
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
            // orientation={this.state.orientation}
            disableContextMenu={false}
            turnColor={GameBoard.side === 0 ? 'white' : 'black'}
            movable={{
              free: false,
              // todo swap out placeholder for comment
              // color: "both",
              color: GameBoard.side === 0 ? 'white' : 'black',
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
                this.engineGo();
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
        <div className="top-right">
          <div className="boards-title-description">
            <div className="boards">
              {_.map(this.state.panelObject, (panel: any) => {
                return (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    {panel.id}
                    <div
                      style={{
                        textAlign: 'center',
                        width: '30px',
                        height: '30px',
                        padding: '4px',
                        background: 'darkred',
                        cursor: 'pointer',
                      }}
                      // delete node
                      onClick={() => {
                        this.setState((prevState) => ({
                          ...prevState,
                          panelObject: _.omit(prevState.panelObject, panel.id),
                        }));
                      }}
                    >
                      -
                    </div>
                  </div>
                );
              })}
              <Input
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
                    panelObject: {
                      ...prevState.panelObject,
                      [this.state.newBoardName]: {
                        id: this.state.newBoardName,
                      },
                    },
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
                value={this.state.fen}
                onChange={(value) => this.setFen(value)}
              />
              <Input
                // id="test"
                className="input title"
                color="B"
                height={40}
                width={280}
                placeholder="TITLE"
                value={this.state.fen}
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
                style={{ color: 'white' }}
                onChange={(event) =>
                  this.setState({ description: event.target.value })
                }
              ></textarea>
            </div>
          </div>
          <div className="piece-pickup">
            {piecePickupArray.map((piece, index) => (
              <div
                className="piece-pickup-square"
                style={{
                  width: '50px',
                  height: '50px',
                  background: '#555555',
                }}
                key={index}
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
            <div
              className="piece-pickup-square"
              style={{
                width: '50px',
                height: '50px',
                background: '#555555',
              }}
            >
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
              ></div>
            </div>
            {_.map(royaltyPickupArray, (value, key) => (
              <div
                key={key}
                className="piece-pickup-square"
                style={{
                  width: '50px',
                  height: '50px',
                  background: '#555555',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    backgroundImage: `radial-gradient(
          circle at 50% 50%,
          ${value} 0%,
          rgba(0, 0, 0, 0) 100%
        )`,
                    width: '50px',
                    height: '50px',
                  }}
                ></div>
              </div>
            ))}
          </div>
        </div>
        <div className="bottom-left">
          <div className="faction-input">
            {['R', 'O', 'W', 'Y', 'G', 'BK', 'B', 'V'].map((color, index) => (
              <Button
                text={greekLetters[index]}
                key={index}
                className="tertiary"
                color={color} // Ensure this prop is used to set the background color in Button's styles
                width={50}
                height={46}
              ></Button>
            ))}
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
              onChange={(value) => this.setFen(value)}
              // textArg={this.state.fenHistory[this.state.fenHistory.length - 1]}
              // setTextArg={() => this.setFen}
            />
            <Button
              text="PLAY"
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
          <div></div>
          <div className="time-input">
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
          </div>
          <div></div>
          <div></div>
        </div>
        <div className="bottom-right">
          <div className="create-buttons">
            <div className="content">
              <Button
                text="PUZZLE"
                onClick={() => null}
                className="tertiary"
                color="B"
                height={46}
                width={100}
                disabled={false}
              />
              <Button
                text="RAND"
                onClick={() => null}
                className="tertiary"
                color="B"
                height={46}
                width={100}
                disabled={false}
              />
            </div>
            <div className="picker-extension">
              <Button className="tertiary" color="B" text="MOUSE" height={46} />
              <Button className="tertiary" color="B" text="TRASH" height={46} />
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
                text="SAVE PANEL"
                onClick={() => null}
                className="tertiary"
                color="B"
                height={46}
                width={133}
                disabled={false}
              />
              <Button
                text="SAVE NODE"
                onClick={() => null}
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
