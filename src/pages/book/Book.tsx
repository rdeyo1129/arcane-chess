import React, { createRef } from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import 'src/pages/book/Book.scss';
import 'src/chessground/styles/chessground.scss';
import 'src/chessground/styles/normal.scss';

import { Chessground, IChessgroundApi } from 'src/chessground/chessgroundMod';

import TactoriusModal from 'src/components/Modal/Modal';
import Button from 'src/components/Button/Button';
import ArcanaSelect from 'src/pages/book/ArcanaSelect';

import arcanaJson from 'src/data/arcana.json';

import { swapArmies } from 'src/utils/utils';
import { setLocalStorage, getLocalStorage } from 'src/utils/handleLocalStorage';

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

const arcana: ArcanaMap = arcanaJson as ArcanaMap;

interface ArcanaDetail {
  name: string;
  description: string;
  type: string;
  imagePath: string;
}

interface ArcanaMap {
  [key: string]: ArcanaDetail;
}

interface BookProps {
  auth: { user: { id: string; username: string } };
}
interface BookState {
  [key: string]: any;
  endChapterOpen: boolean;
  selectedTab: string;
  hoverArcane: string;
}

interface Node {
  id: string; // 'lesson-1';
  title: string;
  storyTitle: string;
  time: number[][]; // seconds
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
  theme: string;
  bookTheme: string;
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
    const LS = getLocalStorage(this.props.auth.user.username);
    this.state = {
      allNodesUnlocked: false,
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
      multiplier: getLocalStorage(this.props.auth.user.username)?.config
        .multiplier,
      nodeScores: getLocalStorage(this.props.auth.user.username)?.nodeScores,
      inventory: getLocalStorage(this.props.auth.user.username)?.inventory,
      endChapterOpen: getLocalStorage(this.props.auth.user.username)
        ?.chapterEnd,
      playerColor: getLocalStorage(this.props.auth.user.username)?.config.color,
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
      creditsAnimation: 0,
      theme: this.booksMap[`book${LS.chapter}`]?.[`${LS.nodeId}`]?.theme,
      bookTheme:
        this.booksMap[`book${LS.chapter}`]?.[`${LS.nodeId}`]?.bookTheme,
      selectedTab: 'chess',
      hoverArcane: '',
    };
    this.toggleAllNodesUnlocked = this.toggleAllNodesUnlocked.bind(this);
  }

  toggleAllNodesUnlocked() {
    this.setState((prevState) => ({
      allNodesUnlocked: !prevState.allNodesUnlocked,
    }));
  }

  toggleHover = (arcane: string) => {
    this.setState({ hoverArcane: arcane });
  };

  getFen() {
    let fen = '';
    if (!this.state.selectedSwatch.split('-')[0]) {
      fen = '8/8/8/8/8/8/8/8 w - - 0 1';
    } else if (
      this.state.playerColor === 'black' &&
      this.state.selectedSwatch.split('-')[0] === 'mission'
    ) {
      fen = swapArmies(
        this.state.book[this.state.selectedSwatch]?.panels['panel-1'].fen
      );
    } else {
      fen = this.state.book[this.state.selectedSwatch]?.panels['panel-1'].fen;
    }
    return fen;
  }

  getTimeDisplay() {
    const { selectedSwatch, book } = this.state;
    const LS = getLocalStorage(this.props.auth.user.username);
    const color = LS.config.color;

    if (!selectedSwatch || selectedSwatch.split('-')[0] === 'lesson') {
      return null;
    }

    const swatchKey = book[selectedSwatch];
    if (!swatchKey || !swatchKey.time || !swatchKey.time[0]) {
      return null;
    }

    // Determine the index based on color
    const index = color === 'black' ? 1 : 0;
    const selectedTime = swatchKey.time[index];

    const timeOperator =
      selectedSwatch.split('-')[0] === 'mission'
        ? '+'
        : selectedSwatch.split('-')[0] === 'temple'
        ? '-'
        : '';

    return (
      <>
        {selectedTime[0]} {timeOperator} {selectedTime[1]}
      </>
    );
  }

  cubicEaseOut(t: number) {
    return 1 - Math.pow(1 - t, 3);
  }

  updateMultiplier(value: number, setDirectly: boolean = false) {
    const newMultiplier = setDirectly ? value : this.state.multiplier + value;
    const LS = getLocalStorage(this.props.auth.user.username);
    setLocalStorage({
      auth: LS.auth,
      chapter: LS.chapter,
      config: {
        ...LS.config,
        multiplier: newMultiplier,
      },
      arcana: LS.arcana,
      nodeScores: LS.nodeScores,
      inventory: LS.inventory,
      nodeId: LS.nodeId,
      chapterEnd: LS.chapterEnd,
    });
    this.setState({
      multiplier: newMultiplier,
    });
  }

  toggleTab = () => {
    this.setState((prevState) => ({
      selectedTab: prevState.selectedTab === 'story' ? 'chess' : 'story',
    }));
  };

  componentDidUpdate(_prevProps: BookProps, prevState: BookState) {
    if (this.state.allNodesUnlocked && !prevState.allNodesUnlocked) {
      if (process.env.NODE_ENV === 'development') {
        this.setState({ allNodesUnlocked: !prevState.allNodesUnlocked });
      }
    }
  }

  componentDidMount() {
    const targetValue = this.state.reducedScore;
    this.setState({ targetValue });

    (window as any).toggleAllNodesUnlocked = this.toggleAllNodesUnlocked;

    const startAnimation = () => {
      const startTime = Date.now();
      const duration = 2000;

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
    };

    const pauseDuration = 1000;
    setTimeout(startAnimation, pauseDuration);
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
    const isMission = this.state.selectedSwatch.split('-')[0] === 'mission';
    return (
      <>
        {LS.chapter === 0 ? (
          <div
            className="completed-node"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100vw',
              height: '100vh',
              // background:
              //   this.state.bookTheme === 'black'
              //     ? ''
              //     : `url(/assets/pages/${this.state.bookTheme}.webp)`,
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
        ) : (
          <div
            className="outer-book"
            style={
              {
                // height: '100vh',
                // width: '100vw',
                // background:
                //   this.state.bookTheme === 'black'
                //     ? ''
                //     : `url(/assets/${this.state.bookTheme}.webp)`,
                // backgroundSize: 'cover',
                // backgroundPosition: 'center',
                // backgroundRepeat: 'no-repeat',
              }
            }
          >
            <TactoriusModal
              isOpen={this.state.armoryOpen}
              type="armory"
              // imgPath="public/assets/treeBoat.jpg"
            />
            <TactoriusModal
              isOpen={this.state.endChapterOpen}
              type="chapterEnd"
              // imgPath="public/assets/treeBoat.jpg"
            />
            <div className="book">
              <div className="hud">
                <div className="left">
                  <Link to="/campaign">
                    <Button
                      text="BACK"
                      className="tertiary"
                      color="B"
                      width={200}
                      disabled={false}
                      backgroundColorOverride="#33333388"
                    />
                  </Link>
                </div>
                <div className="center"></div>
                <div className="right">
                  <div className="buttons">
                    <div className="toggle-tab">
                      <Button
                        text={
                          this.state.selectedTab === 'chess' ? 'STORY' : 'CHESS'
                        }
                        className="tertiary"
                        color="B"
                        width={200}
                        backgroundColorOverride={'#33333388'}
                        onClick={this.toggleTab}
                      />
                    </div>
                    <Link to={`/${this.state.selectedSwatch.split('-')[0]}`}>
                      <Button
                        text="START"
                        className="tertiary"
                        color="B"
                        width={200}
                        disabled={this.state.selectedSwatch === ''}
                        backgroundColorOverride="#33333388"
                      />
                    </Link>
                  </div>
                  <div className="score">
                    <span className="multiplier">x{this.state.multiplier}</span>
                    <div className="points">
                      <span className="digit-box">{digits}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="content">
                <div className="nodes">
                  {_.filter(this.state.book, (node) => {
                    const currLS = getLocalStorage(
                      this.props.auth.user.username
                    );
                    if (this.state.allNodesUnlocked) {
                      return true;
                    }
                    if (
                      (_.includes(node.id, 'mission') ||
                        _.includes(node.id, 'temple')) &&
                      currLS.nodeScores[node.id]
                    ) {
                      return false;
                    }
                    if (
                      !_.includes(node.id, 'lesson') &&
                      currLS.nodeScores &&
                      currLS.nodeScores[node.id]
                    ) {
                      return false;
                    }
                    if (
                      node.prereq &&
                      !_.includes(Object.keys(currLS.nodeScores), node.prereq)
                    ) {
                      return false;
                    }
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
                        backgroundColorOverride={
                          _.includes(Object.keys(LS.nodeScores), node.id)
                            ? '#11111100'
                            : '#55555588'
                        }
                        onClick={() => {
                          const currLS = getLocalStorage(
                            this.props.auth.user.username
                          );
                          this.setState(
                            {
                              selectedSwatch: node.id,
                              bookTheme: node.bookTheme,
                              theme: node.theme,
                              config: currLS.config,
                            },
                            () => {
                              const missionArcanaDelta =
                                this.booksMap[`book${LS.chapter}`]?.[
                                  this.state.selectedSwatch
                                ]?.panels['panel-1'].whiteArcane;
                              const arcanaToStore = Object.keys(
                                missionArcanaDelta || {}
                              ).length
                                ? {}
                                : currLS.arcana;
                              if (
                                Object.keys(missionArcanaDelta || {}).length
                              ) {
                                this.updateMultiplier(80, true);
                              }
                              setLocalStorage({
                                auth: currLS.auth,
                                chapter: currLS.chapter,
                                config: currLS.config,
                                arcana: arcanaToStore,
                                nodeScores: currLS.nodeScores,
                                inventory: currLS.inventory,
                                nodeId: node.id,
                                chapterEnd: currLS.chapterEnd,
                              });
                            }
                          );
                        }}
                      />
                    );
                  })}
                </div>
                {this.state.selectedTab === 'story' ? (
                  <div
                    key={this.state.bookTheme}
                    className="description-inventory story-column"
                    style={{
                      display: 'flex',
                      width: '880px',
                      height: '480px',
                      background:
                        this.state.bookTheme === 'black'
                          ? ''
                          : `url(/assets/pages/${this.state.bookTheme}.webp)`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  >
                    <div
                      className="story-text"
                      style={{
                        width: '880px',
                        height: '480px',
                        background: '#11111188',
                        padding: '20px',
                      }}
                    >
                      {this.state.selectedSwatch !== '' ? (
                        <div className="node">
                          <b className="node-title">
                            {
                              this.state.book[this.state.selectedSwatch]
                                .storyTitle
                            }
                          </b>
                          <div className="node-description">
                            {this.state.book[
                              this.state.selectedSwatch
                            ].panelText
                              .split('\n\n')
                              .map((p: string, i: number) => (
                                <p className="description-paragraph" key={i}>
                                  {p}
                                </p>
                              ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : this.state.selectedTab === 'chess' ? (
                  <div
                    key={this.state.bookTheme}
                    style={{
                      display: 'flex',
                      width: '880px',
                      height: '480px',
                      background:
                        this.state.bookTheme === 'black'
                          ? ''
                          : `url(/assets/pages/${this.state.bookTheme}.webp)`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  >
                    <div
                      className={`cg-wrap tactorius-board ${this.state.theme}-board`}
                    >
                      <Chessground
                        // fen={this.state.fenHistory[this.state.fenHistory.length - 1]}
                        // check={this.tactorius.inCheck().isAttacked}
                        // viewOnly={this.isCheckmate()}
                        forwardedRef={this.chessgroundRef}
                        fen={this.getFen()}
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
                        orientation={
                          this.state.playerColor === 'black' &&
                          this.state.selectedSwatch.split('-')[0] === 'mission'
                            ? 'black'
                            : 'white'
                        }
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
                    <div
                      className="description-inventory"
                      // style={{ zIndex: 100 }}
                    >
                      <div className="description">
                        {this.state.selectedSwatch !== '' ? (
                          <div className="node">
                            {this.state.hoverArcane !== '' ? (
                              <>
                                <b className="node-title">
                                  {arcana[this.state.hoverArcane].name}
                                </b>
                                <div className="node-description">
                                  <p className="description-paragraph">
                                    {arcana[this.state.hoverArcane].description}
                                  </p>
                                </div>
                              </>
                            ) : (
                              <>
                                <b className="node-title">
                                  {
                                    this.state.book[this.state.selectedSwatch]
                                      .title
                                  }
                                </b>
                                <div className="node-description">
                                  {this.state.book[
                                    this.state.selectedSwatch
                                  ].nodeText
                                    .split('\n\n')
                                    .map((p: string, i: number) => (
                                      <p
                                        className="description-paragraph"
                                        key={i}
                                      >
                                        {p}
                                        {this.state.book[
                                          this.state.selectedSwatch
                                        ].boss && (
                                          <span style={{ color: 'red' }}>
                                            This is a boss level. Completing
                                            this mission will reset your
                                            progress in this chapter.
                                          </span>
                                        )}
                                      </p>
                                    ))}
                                </div>
                              </>
                            )}
                          </div>
                        ) : null}
                      </div>
                      <div className="inventory">
                        <div
                          className="time-arcana"
                          style={{ background: '#77777788' }}
                        >
                          <h2 className="time">{this.getTimeDisplay()}</h2>
                          <div className="arcana">
                            {this.state.selectedSwatch === '' ? null : this
                                .state.playerColor === 'white' ? (
                              <ArcanaSelect
                                auth={this.props.auth}
                                isPlayerArcana
                                isMission={isMission}
                                updateBookMultiplier={(value) =>
                                  this.updateMultiplier(value)
                                }
                                missionArcana={{
                                  ...this.booksMap[`book${LS.chapter}`]?.[
                                    this.state.selectedSwatch
                                  ]?.panels['panel-1'].whiteArcane,
                                }}
                                onToggleHover={(arcane: string) => {
                                  this.toggleHover(arcane);
                                }}
                              />
                            ) : (
                              <ArcanaSelect
                                auth={this.props.auth}
                                isPlayerArcana={false}
                                engineArcana={{
                                  ...this.booksMap[`book${LS.chapter}`]?.[
                                    this.state.selectedSwatch
                                  ]?.panels['panel-1'].blackArcane,
                                }}
                                isMission={isMission}
                                updateBookMultiplier={(value) =>
                                  this.updateMultiplier(value)
                                }
                                onToggleHover={(arcane: string) => {
                                  this.toggleHover(arcane);
                                }}
                              />
                            )}
                          </div>
                        </div>
                        <div
                          className="time-arcana"
                          style={{ background: '#33333388' }}
                        >
                          <h2 className="time">{this.getTimeDisplay()}</h2>
                          <div className="arcana">
                            {this.state.selectedSwatch === '' ? null : this
                                .state.playerColor === 'black' ? (
                              <ArcanaSelect
                                auth={this.props.auth}
                                isPlayerArcana
                                isMission={isMission}
                                updateBookMultiplier={(value) =>
                                  this.updateMultiplier(value)
                                }
                                missionArcana={{
                                  ...this.booksMap[`book${LS.chapter}`]?.[
                                    this.state.selectedSwatch
                                  ]?.panels['panel-1'].whiteArcane,
                                }}
                                onToggleHover={(arcane: string) => {
                                  this.toggleHover(arcane);
                                }}
                              />
                            ) : (
                              <ArcanaSelect
                                auth={this.props.auth}
                                isPlayerArcana={false}
                                engineArcana={{
                                  ...this.booksMap[`book${LS.chapter}`]?.[
                                    this.state.selectedSwatch
                                  ]?.panels['panel-1'].blackArcane,
                                }}
                                isMission={isMission}
                                updateBookMultiplier={(value) =>
                                  this.updateMultiplier(value)
                                }
                                onToggleHover={(arcane: string) => {
                                  this.toggleHover(arcane);
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

function mapStateToProps({ auth }: { auth: any }) {
  return {
    auth,
  };
}

export const Book = connect(mapStateToProps, {})(UnwrappedBook);
