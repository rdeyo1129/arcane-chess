import React, { createRef } from 'react';
import _, { get } from 'lodash';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import 'src/pages/book/Book.scss';
import 'src/chessground/styles/chessground.scss';
import 'src/chessground/styles/normal.scss';

// import 'src/pages/inGameMenu/InGameMenu.scss';

import { Chessground, IChessgroundApi } from 'src/chessground/chessgroundMod';

import TactoriusModal from 'src/components/Modal/Modal';
import Button from 'src/components/Button/Button';
import Spinner from 'src/components/Loader/Spinner';
import Dots from 'src/components/Loader/Dots';

import { setLocalStorage, getLocalStorage } from 'src/utils/handleLocalStorage';
/*
  // // DYNAMIC IMPORTS \\ \\ THIS RUNS INTO AN ISSUE, JUST IMPORT THEM ALL
*/
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

import arcanaJson from 'src/data/arcana.json';

const arcana: ArcanaMap = arcanaJson as ArcanaMap;

interface ArcanaMap {
  [key: string]: ArcanaDetail;
}

interface ArcanaDetail {
  name: string;
  description: string;
  type: string;
  imagePath: string;
}

interface BookProps {
  auth: { user: { id: string; username: string } };
}
interface BookState {
  [key: string]: any;
  endChapterOpen: boolean;
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

export class UnwrappedBook extends React.Component<BookProps, BookState> {
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
        `jsonChapter${getLocalStorage(this.props.auth.user.username)?.chapter}`,
      ],
      book: this.booksMap[
        `book${getLocalStorage(this.props.auth.user.username)?.chapter}`
      ],
      selectedSwatch: '',
      config: getLocalStorage(this.props.auth.user.username)?.config,
      nodeScores: getLocalStorage(this.props.auth.user.username)?.nodeScores,
      inventory: getLocalStorage(this.props.auth.user.username)?.inventory,
      endChapterOpen: getLocalStorage(this.props.auth.user.username)
        ?.chapterEnd,
      reducedScore: _.reduce(
        getLocalStorage(this.props.auth.user.username).nodeScores,
        (accumulator, value) => {
          return accumulator + value;
        },
        0
      ),
      animatedValue: 0,
      targetValue: 0,
      credits: 4000,
      // _.reduce(
      //   getLocalStorage(this.props.auth.user.username).nodeScores,
      //   (accumulator, value) => {
      //     return accumulator + value;
      //   },
      //   0
      // ),
      creditsAnimation: 0,
    };
  }

  cubicEaseOut(t: number) {
    return 1 - Math.pow(1 - t, 3);
  }

  componentDidMount() {
    const targetValue = this.state.reducedScore;
    this.setState({ targetValue });

    const startTime = Date.now();
    const duration = 1000;

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const normalizedTime = elapsed / duration;

      if (normalizedTime < 1) {
        const easedTime = normalizedTime;
        const nextValue = targetValue * easedTime;
        this.setState({ animatedValue: nextValue });
        requestAnimationFrame(animate);
      } else {
        this.setState({ animatedValue: targetValue });
      }
    };

    requestAnimationFrame(animate);
  }

  render() {
    const { auth } = this.props;
    const LS = getLocalStorage(auth.user.username);
    // Convert number to string with comma formatting
    const formattedNumber = Math.round(
      this.state.animatedValue
    ).toLocaleString();
    // Split formatted number into individual characters
    const digits = formattedNumber.split('').map((char, index) => (
      <span key={index} className="digit-box">
        {char}
      </span>
    ));
    return (
      <div className="book">
        {LS.chapter === 0 ? (
          <>NO CHAPTER SELECTED, NAGIVATE TO CAMPAIGN</>
        ) : (
          <>
            {' '}
            <div className="top">
              <div className="nodes">
                {this.state.selectedSwatch !== '' ? (
                  <div className="node">
                    <Button
                      className="tertiary"
                      text="BACK"
                      color="B"
                      width={160}
                      height={60}
                      disabled={false}
                      onClick={() => {
                        this.setState({ selectedSwatch: '' });
                      }}
                    />
                    <div className="node-title">
                      {this.state.book[this.state.selectedSwatch].title}
                    </div>
                    <div className="node-description">
                      {this.state.book[this.state.selectedSwatch].nodeText
                        .split('\n\n')
                        .map((p: string, i: number) => (
                          <p className="description-paragraph" key={i}>
                            {p}
                          </p>
                        ))}
                    </div>
                  </div>
                ) : (
                  _.filter(this.state.book, (node) => {
                    const currLS = getLocalStorage(
                      this.props.auth.user.username
                    );

                    // Exclude nodes that are already in nodeScores
                    if (currLS.nodeScores && currLS.nodeScores[node.id]) {
                      return false;
                    }

                    // Check for prerequisites
                    // if (node.prereq && !currLS.nodeScores[node.prereq]) {
                    //   return false;
                    // }
                    if (_.includes(node.id, 'lesson')) return true;
                    return true;
                  }).map((node, i) => {
                    return (
                      <Button
                        text={node.title}
                        color="B"
                        width={'100%'}
                        height={60}
                        disabled={false}
                        key={i}
                        className={`select-node tertiary`}
                        backgroundColorOverride="#444444"
                        onClick={() => {
                          const currLS = getLocalStorage(
                            this.props.auth.user.username
                          );
                          this.setState({
                            selectedSwatch: node.id,
                          });
                          setLocalStorage({
                            auth: currLS.auth,
                            chapter: currLS.chapter,
                            config: currLS.config,
                            nodeScores: currLS.nodeScores,
                            inventory: currLS.inventory,
                            nodeId: node.id,
                            chapterEnd: currLS.chapterEnd,
                          });
                        }}
                      />
                    );
                  })
                )}
              </div>
              {/* <div className="board-view"> */}
              <div className="cg-wrap tactorius-board">
                <Chessground
                  // fen={this.state.fenHistory[this.state.fenHistory.length - 1]}
                  // check={this.tactorius.inCheck().isAttacked}
                  // viewOnly={this.isCheckmate()}
                  forwardedRef={this.chessgroundRef}
                  fen={
                    this.state.book[this.state.selectedSwatch]?.panels[
                      'panel-1'
                    ].fen || '8/8/8/8/8/8/8/8 w KQkq - 0 1'
                  }
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
                  // highlight={{
                  //   lastMove: true,
                  //   check: true,
                  // }}
                  // orientation={this.state.orientation}
                  // disableContextMenu={false}
                  // turnColor={GameBoard.side === 0 ? 'white' : 'black'}
                  // movable={{
                  //   free: false,
                  // }}
                  viewOnly={true}
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
              <div className="arcane-time">
                {/* todo column reverse inline style for when playing as black? */}
                <div className="white-arcana">
                  {_.map(
                    this.state.book[this.state.selectedSwatch]?.panels[
                      'panel-1'
                    ].whiteArcane || {},
                    (value: number, key: string) => {
                      return (
                        <img
                          key={key}
                          className="arcane"
                          src={`${arcana[key].imagePath}${
                            this.state.arcaneHover === key ? '-hover' : ''
                          }.svg`}
                          // onMouseEnter={() => this.toggleHover(key)}
                          // onMouseLeave={() => this.toggleHover('')}
                        />
                      );
                    }
                  )}
                </div>
                <div className="white-time">10:00</div>
                <div className="black-time">10:00</div>
                <div className="black-arcana">
                  {_.map(
                    this.state.book[this.state.selectedSwatch]?.panels[
                      'panel-1'
                    ].blackArcane || {},
                    (value: number, key: string) => {
                      return (
                        <img
                          key={key}
                          className="arcane"
                          src={`${arcana[key].imagePath}${
                            this.state.arcaneHover === key ? '-hover' : ''
                          }.svg`}
                          // onMouseEnter={() => this.toggleHover(key)}
                          // onMouseLeave={() => this.toggleHover('')}
                        />
                      );
                    }
                  )}
                </div>
              </div>
            </div>
            <div className="bottom">
              <div className="left">
                <div className="points">
                  <span className="digit-box">{digits}</span>
                </div>
                kudos
              </div>
              {/* <div className="center"></div> */}
              <div className="right">
                <Link to="/campaign">
                  <Button
                    text="BACK"
                    className="secondary"
                    color="B"
                    width={160}
                    height={50}
                    disabled={false}
                  />
                </Link>
                {/* <Button
                text="ARMORY"
                className="secondary"
                color="B"
                width={160}
                height={60}
                disabled={false}
                onClick={() => {
                  this.setState({ armoryOpen: true });
                }}
              /> */}
                <Link to={`/${this.state.selectedSwatch.split('-')[0]}`}>
                  <Button
                    text="START"
                    className="primary"
                    color="B"
                    width={160}
                    height={50}
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
              // chapterNumber={this.state.chapter}
              isOpen={this.state.armoryOpen}
              type="armory"
              // imgPath="public/assets/treeBoat.jpg"
            />
            <TactoriusModal
              // toggleModal={() => {
              //   setLocalStorage(auth, 0, {}, {}, {}, '');
              //   this.setState({ configModalOpen: false, chapter: 0 });
              // }}
              isOpen={this.state.endChapterOpen}
              type="chapterEnd"
              // imgPath="public/assets/treeBoat.jpg"
            />
          </>
        )}
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
