import React from 'react';
import Modal from 'react-modal';
import _ from 'lodash';

import { withRouter } from '../withRouter/withRouter';
import { connect } from 'react-redux';

import { setLocalStorage, getLocalStorage } from 'src/utils/handleLocalStorage';

import 'src/chessground/styles/chessground.scss';
import 'src/chessground/styles/normal.scss';
// import { Chessground } from 'src/chessground/chessgroundMod';

import Button from '../Button/Button';
import Select from '../Select/Select';
import Toggle from '../Toggle/Toggle';

import './Modal.scss';

import arcanaJson from 'src/data/arcana.json';

interface ModalProps {
  isOpen: boolean;
  type: string;
  imgPath?: string;
  toggleModal: () => void;
  handleClose: () => void;
  navigate: (path: string) => void;
  message?: string;
  auth: any;
  chapterNumber?: number;
  lessonBackButton?: boolean;
  disableSecondary?: boolean;
  score?: number;
  updateConfig?: (key: string, value: any) => void;
}
interface ModalState {
  config: { [key: string]: any };
  hoverArcane: string;
  whiteArcana: { [key: string]: boolean | number | string | null };
  blackArcana: { [key: string]: boolean | number | string | null };
  playerColor: string;
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

const quickPlayArcana = [
  'sumnP',
  'sumnN',
  'sumnB',
  'sumnR',
  'sumnW',
  'sumnS',
  'sumnX',
  'sumnRQ',
  'sumnRT',
  'sumnRM',
  'sumnRE',
  'swapADJ',
  'shftP',
  'shftN',
  'shftB',
  'shftR',
  'modsSUS',
  'modsIMP',
  'modsORA',
  'modsTEM',
  'modsFUT',
  'modsCON',
  'modsFUG',
  'modsINH',
];

const arcana: ArcanaMap = arcanaJson as ArcanaMap;

class UnwrappedTactoriusModal extends React.Component<ModalProps, ModalState> {
  constructor(props: ModalProps) {
    super(props);
    this.state = {
      config: {
        multiplier: 600,
        color: 'white',
        thinkingTime: 1,
        depth: 1,
        clock: true,
        blunderVision: false,
        threatVision: false,
        checkVision: false,
        hints: false,
      },
      hoverArcane: '',
      whiteArcana: {},
      blackArcana: {},
      playerColor: 'white',
    };
  }

  updateConfig = (
    value:
      | boolean
      | string
      | number
      | null
      | React.ChangeEvent<HTMLSelectElement>,
    key: string,
    multiplier: number
  ) => {
    this.setState((prevState) => ({
      config: {
        ...this.state.config,
        [key]: value,
        multiplier: prevState.config.multiplier + multiplier,
      },
    }));
  };

  // todo save to local storage and update chapter number to db on click save or submit? FC?
  // todo dyanmicize for different types
  // chapter setttings
  // endgame
  // promotion

  saveSettingsStartBook = () => {
    const currLS = getLocalStorage(this.props.auth.user.username);
    console.log(this.props);
    setLocalStorage({
      ...currLS,
      chapter: this.props.chapterNumber,
      config: this.state.config,
      nodeScores: {},
      inventory: {},
      nodeId: '',
      chapterEnd: false,
    });
    this.props.navigate('/chapter');
  };

  toggleHover = (arcane: string) => {
    this.setState({ hoverArcane: arcane });
  };

  render() {
    return (
      <div className="container">
        {this.props.type === 'bookSettings' ? (
          <Modal
            style={bookSettingsModal}
            isOpen={this.props.isOpen}
            ariaHideApp={false}
          >
            <div className="image-text">
              {/* <img className="image" src={this.props.imgPath} /> */}
            </div>
            <div className="multiplier-settings-buttons">
              <span className="multiplier">
                x{this.state.config.multiplier} points
              </span>
              <div className="settings">
                <div className="settings-block">
                  <Select
                    options={['white', 'black']}
                    title="Color"
                    type="string"
                    onChange={(val) =>
                      this.updateConfig(
                        val,
                        'color',
                        val === 'white' ? -450 : 450
                      )
                    }
                  />
                </div>
                <div className="settings-block">
                  <Select
                    title="Thinking Time"
                    type="number"
                    options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} // or to depth x?
                    onChange={(val) =>
                      this.updateConfig(
                        Number(val),
                        'thinkingTime',
                        (-this.state.config.thinkingTime * 100 +
                          Number(val) * 100) as number
                      )
                    }
                  />
                </div>
                <div className="settings-block">
                  <Toggle
                    title="Clock"
                    initialState={true}
                    callback={(val: boolean) =>
                      this.updateConfig(val, 'clock', val ? 300 : -300)
                    }
                  />
                </div>
                <div className="settings-block">
                  <Select
                    title="Autopromotion"
                    type="string"
                    options={[
                      'Select',
                      'N',
                      'Z',
                      'U',
                      'B',
                      'R',
                      'Q',
                      'T',
                      'M',
                      'W',
                      'S',
                    ]}
                    onChange={(val) =>
                      this.updateConfig(val, 'autopromotion', 0)
                    }
                  />
                </div>
                <div className="settings-block">
                  <Select
                    title="Depth"
                    type="number"
                    options={[1, 2, 3, 4, 5, 6, 7, 8]}
                    onChange={(val) =>
                      this.updateConfig(
                        Number(val),
                        'depth',
                        (-this.state.config.depth * 100 +
                          Number(val) * 100) as number
                      )
                    }
                  />
                </div>
                {/* <div className="settings-block">
                  <Toggle
                    title="Blunder Vision"
                    callback={(val: boolean) =>
                      this.updateConfig(val, 'blunderVision', val ? -200 : 200)
                    }
                  />
                </div>
                <div className="settings-block">
                  <Toggle
                    title="Threat Vision"
                    callback={(val) =>
                      this.updateConfig(val, 'threatVision', val ? -100 : 100)
                    }
                  />
                </div>
                <div className="settings-block">
                  <Toggle
                    title="Check Vision"
                    callback={(val) =>
                      this.updateConfig(val, 'checkVision', val ? -100 : 100)
                    }
                  />
                </div>
                <div className="settings-block">
                  <Toggle
                    title="Hints"
                    callback={(val) =>
                      this.updateConfig(val, 'hints', val ? -100 : 100)
                    }
                  />
                </div> */}
              </div>
              <div className="buttons">
                <Button
                  text="CANCEL"
                  className="secondary"
                  color="V"
                  onClick={() => this.props.toggleModal()}
                />
                <Button
                  text="START"
                  className="primary"
                  color="V"
                  onClick={() => this.saveSettingsStartBook()}
                />
              </div>
            </div>
          </Modal>
        ) : this.props.type === 'armory' ? (
          <Modal
            style={armoryModal}
            isOpen={this.props.isOpen}
            ariaHideApp={false}
          >
            {/* <div className="cg-wrap armory-board">
              <Chessground
                // fen={this.state.fenHistory[this.state.fenHistory.length - 1]}
                // check={this.tactorius.inCheck().isAttacked}
                // viewOnly={this.isCheckmate()}

                fen="8/8/P7/QRRRRK2"
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
                height={240}
                // inline styling for aspect ratio? OR interpolating in this case based on the page type, use a global state string?
                // don't, just go by the page type
                // width={360}
                // height={360}
                animation={{
                  enabled: true,
                  duration: 1,
                }}
                highlight={{
                  lastMove: false,
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
                dimensions={{
                  height: 4,
                  width: 8,
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
            </div> */}
          </Modal>
        ) : this.props.type === 'victory' ? (
          <Modal
            style={endgameModal}
            isOpen={this.props.isOpen}
            ariaHideApp={false}
          >
            <div className="endgame">
              <div className="left">
                <div
                  style={{
                    textAlign: 'center',
                    background: '#333333',
                    padding: '10px',
                  }}
                >
                  <h1>Victory!</h1>
                  <span>{this.props.message}</span>
                </div>
                <img
                  className="endgame-image"
                  src="public/assets/victory.jpg"
                />
                <div
                  style={{
                    textAlign: 'center',
                    background: '#333333',
                    padding: '10px',
                  }}
                >
                  You fought with great resource and conqured your opponent! You
                  are eager for the obstacles and challenges that you are
                  working hard towards. Your Progress has been saved.
                </div>
              </div>
              <div className="middle"></div>
              <div className="right">
                {this.props.score && <span>SCORE: {this.props.score}</span>}
                <div className="buttons">
                  <Button
                    text={this.props.lessonBackButton ? 'BACK' : 'ANALYZE'}
                    className="secondary"
                    color="B"
                    width={160}
                    height={90}
                    disabled={this.props.disableSecondary}
                    onClick={() => {
                      if (this.props.lessonBackButton) {
                        this.props.handleClose();
                      } else {
                        this.props.navigate('/chapter');
                      }
                    }}
                  />
                  <Button
                    text="CONTINUE"
                    className="primary"
                    width={180}
                    height={90}
                    color="B"
                    onClick={() => {
                      this.props.navigate('/chapter');
                    }}
                  />
                </div>
              </div>
            </div>
          </Modal>
        ) : this.props.type === 'defeat' ? (
          <Modal
            style={endgameModal}
            isOpen={this.props.isOpen}
            ariaHideApp={false}
          >
            <div className="endgame">
              <div className="left">
                <div
                  style={{
                    textAlign: 'center',
                    background: '#333333',
                    padding: '10px',
                  }}
                >
                  <h1>Defeat...</h1>
                  <span>{this.props.message}</span>
                </div>
                <img className="endgame-image" src="public/assets/reaper.jpg" />
                <div
                  style={{
                    textAlign: 'center',
                    background: '#333333',
                    padding: '10px',
                  }}
                >
                  You have fought honorably and accept your loss with a critical
                  yet respectful mindset. You are eager to learn from your
                  mistakes and improve.
                </div>
              </div>
              <div className="middle"></div>
              <div className="right">
                <div className="buttons">
                  <div className="left-buttons">
                    <Button
                      text="TO CHAPTER"
                      className="secondary"
                      color="B"
                      width={160}
                      height={40}
                      onClick={() => {
                        this.props.navigate('/chapter');
                      }}
                    />
                    <Button
                      text="ANALYZE"
                      className="secondary"
                      color="B"
                      width={160}
                      height={40}
                      disabled
                      // onClick={() => {
                      //   this.props.navigate('/chapter');
                      // }}
                    />
                  </div>
                  <Button
                    text="RETRY"
                    className="primary"
                    width={180}
                    height={90}
                    color="B"
                    onClick={() => {
                      location.reload();
                    }}
                  />
                </div>
              </div>
            </div>
          </Modal>
        ) : this.props.type === 'chapterEnd' ? (
          <Modal
            style={chapterEndModal}
            isOpen={this.props.isOpen}
            ariaHideApp={false}
          >
            <span>
              YOU HAVE DEFEATED THE BOSS. CHAPTER END. YOUR SCORE:{' '}
              {
                getLocalStorage(this.props.auth.user.username).auth.user
                  .campaign?.topScores[
                  getLocalStorage(this.props.auth.user.username).chapter - 1
                ]
              }
            </span>
            <Button
              text="CONTINUE"
              className="primary"
              color="V"
              width={160}
              height={40}
              onClick={() => {
                setLocalStorage({
                  ...getLocalStorage(this.props.auth.user.username),
                  chapter: 0,
                  config: {},
                  nodeScores: {},
                  inventory: {},
                  nodeId: '',
                  chapterEnd: false,
                });
                this.props.navigate('/campaign');
              }}
            />
          </Modal>
        ) : this.props.type === 'quickPlay' ? (
          <Modal
            style={quickPlayModal}
            isOpen={this.props.isOpen}
            ariaHideApp={false}
          >
            <div className="quickplay">
              <div className="setup-arcana">
                <Button
                  text={
                    this.state.playerColor === 'white' ? 'PLAYER' : 'ENGINE'
                  }
                  className="tertiary"
                  color="B"
                  backgroundColorOverride="#AAAAAA"
                  width={240}
                  height={30}
                  onClick={() =>
                    this.setState(
                      (prevState) => ({
                        playerColor:
                          prevState.playerColor === 'white' ? 'black' : 'white',
                      }),
                      () => {
                        if (this.props.updateConfig) {
                          this.props.updateConfig(
                            'playerColor',
                            this.state.playerColor === 'white'
                              ? 'white'
                              : 'black'
                          );
                          this.props.updateConfig(
                            'engineColor',
                            this.state.playerColor === 'white'
                              ? 'black'
                              : 'white'
                          );
                        }
                      }
                    )
                  }
                />
                <div className="setup">
                  <Select
                    // title="whiteSetup"
                    type="string"
                    height={'30px'}
                    width={'240px'}
                    options={[
                      'RNBQKBNR',
                      'RNBTKBNR',
                      'RBNMKBNR',
                      'RZBTKBUR',
                      'RUWMKSUR',
                      'RZSQKSZR',
                      'RUWTKWUR',
                      'RNNMKBBR',
                      'RUUBKSBR',
                      'RSBBKNZR',
                      'MNZQUBTK',
                      'UBBTUKZZ',
                    ]}
                    onChange={(val) => {
                      if (this.props.updateConfig)
                        this.props.updateConfig('whiteSetup', val);
                    }}
                  />
                </div>
                <div className="arcana">
                  {_.map(quickPlayArcana, (name: string, key: number) => {
                    return (
                      <img
                        key={key}
                        className="arcane"
                        src={`${arcana[name].imagePath}${
                          this.state.hoverArcane === `${name}-white`
                            ? '-hover'
                            : ''
                        }.svg`}
                        style={{
                          opacity:
                            _.includes(
                              Object.keys(this.state.whiteArcana),
                              name
                            ) && this.state.whiteArcana[name]
                              ? 1
                              : 0.5,
                        }}
                        onClick={() => {
                          const currentArcaneType = arcana[name].type;
                          const isEnabledOrNonNull =
                            _.includes(
                              Object.keys(this.state.whiteArcana),
                              name
                            ) && this.state.whiteArcana[name];
                          if (isEnabledOrNonNull) {
                            this.setState(
                              (prevState) => ({
                                whiteArcana: {
                                  ...prevState.whiteArcana,
                                  [name]: null,
                                },
                              }),
                              () => {
                                if (this.props.updateConfig)
                                  this.props.updateConfig(
                                    'wArcana',
                                    this.state.whiteArcana
                                  );
                              }
                            );
                          } else {
                            this.setState(
                              (prevState) => ({
                                whiteArcana: {
                                  ...prevState.whiteArcana,
                                  [name]:
                                    currentArcaneType === 'active' ||
                                    currentArcaneType === 'passive'
                                      ? 2
                                      : true,
                                },
                              }),
                              () => {
                                if (this.props.updateConfig)
                                  this.props.updateConfig(
                                    'wArcana',
                                    this.state.whiteArcana
                                  );
                              }
                            );
                          }
                        }}
                        onMouseEnter={() => this.toggleHover(`${name}-white`)}
                        onMouseLeave={() => this.toggleHover('')}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="setup-arcana">
                <Button
                  text={
                    this.state.playerColor === 'black' ? 'PLAYER' : 'ENGINE'
                  }
                  className="tertiary"
                  color="B"
                  backgroundColorOverride="#333333"
                  width={240}
                  height={30}
                  onClick={() =>
                    this.setState(
                      (prevState) => ({
                        playerColor:
                          prevState.playerColor === 'white' ? 'black' : 'white',
                      }),
                      () => {
                        if (this.props.updateConfig) {
                          this.props.updateConfig(
                            'playerColor',
                            this.state.playerColor === 'white'
                              ? 'white'
                              : 'black'
                          );
                          this.props.updateConfig(
                            'engineColor',
                            this.state.playerColor === 'white'
                              ? 'black'
                              : 'white'
                          );
                        }
                      }
                    )
                  }
                />
                <div className="setup-select">
                  <Select
                    // title="blackSetup"
                    type="string"
                    height={'30px'}
                    width={'240px'}
                    options={[
                      'rnbqkbnr',
                      'rnbtkbnr',
                      'rbnmkbnr',
                      'rzbtkbur',
                      'ruwmksur',
                      'rzsqkszr',
                      'ruwtkwur',
                      'rnnmkbbr',
                      'ruubksbr',
                      'rsbbknzr',
                      'mnzqubtk',
                      'ubbttukzz',
                    ]}
                    onChange={(val) => {
                      if (this.props.updateConfig)
                        this.props.updateConfig('blackSetup', val);
                    }}
                  />
                </div>
                <div className="arcana">
                  {_.map(quickPlayArcana, (name: string, key: number) => {
                    return (
                      <img
                        key={key}
                        className="arcane"
                        src={`${arcana[name].imagePath}${
                          this.state.hoverArcane === `${name}-black`
                            ? '-hover'
                            : ''
                        }.svg`}
                        style={{
                          opacity:
                            _.includes(
                              Object.keys(this.state.blackArcana),
                              name
                            ) && this.state.blackArcana[name]
                              ? 1
                              : 0.5,
                        }}
                        onClick={() => {
                          const currentArcaneType = arcana[name].type;
                          const isEnabledOrNonNull =
                            _.includes(
                              Object.keys(this.state.blackArcana),
                              name
                            ) && this.state.blackArcana[name];
                          if (isEnabledOrNonNull) {
                            this.setState(
                              (prevState) => ({
                                blackArcana: {
                                  ...prevState.blackArcana,
                                  [name]: null,
                                },
                              }),
                              () => {
                                if (this.props.updateConfig)
                                  this.props.updateConfig(
                                    'bArcana',
                                    this.state.whiteArcana
                                  );
                              }
                            );
                          } else {
                            this.setState(
                              (prevState) => ({
                                blackArcana: {
                                  ...prevState.blackArcana,
                                  [name]:
                                    currentArcaneType === 'active' ||
                                    currentArcaneType === 'passive'
                                      ? 2
                                      : true,
                                },
                              }),
                              () => {
                                if (this.props.updateConfig)
                                  this.props.updateConfig(
                                    'bArcana',
                                    this.state.whiteArcana
                                  );
                              }
                            );
                          }
                        }}
                        onMouseEnter={() => this.toggleHover(`${name}-black`)}
                        onMouseLeave={() => this.toggleHover('')}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="settings-start">
                <div className="arcana-detail">
                  <p>{arcana[this.state.hoverArcane.split('-')[0]]?.name}</p>
                  <p>
                    {arcana[this.state.hoverArcane.split('-')[0]]?.description}
                  </p>
                </div>
                <div className="quickplay-select">
                  <Select
                    title="Thinking Time"
                    type="number"
                    width={240}
                    height={40}
                    options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                    onChange={(val) => {
                      if (this.props.updateConfig)
                        this.props.updateConfig(
                          'thinkingTime',
                          Number(val) * 1000
                        );
                    }}
                  />
                </div>
                <div className="quickplay-select">
                  <Select
                    title="Depth"
                    type="number"
                    width={240}
                    height={40}
                    options={[1, 2, 3, 4, 5, 6, 7, 8]}
                    onChange={(val) => {
                      if (this.props.updateConfig)
                        this.props.updateConfig('engineDepth', Number(val));
                    }}
                  />
                </div>
                <div className="quickplay-select">
                  <Select
                    title="Promotion"
                    type="string"
                    width={240}
                    height={40}
                    options={[
                      'Select',
                      'N',
                      'Z',
                      'U',
                      'B',
                      'R',
                      'Q',
                      'T',
                      'M',
                      'W',
                      'S',
                    ]}
                    onChange={(val) => {
                      if (this.props.updateConfig)
                        this.props.updateConfig('placingPromotion', val);
                    }}
                  />
                </div>
                <Button
                  text="START"
                  className="primary"
                  color="B"
                  width={240}
                  height={60}
                  styles={{ marginTop: '20px' }}
                  onClick={() => {
                    this.props.handleClose();
                  }}
                />
              </div>
            </div>
          </Modal>
        ) : (
          <div>other modal</div>
        )}
      </div>
    );
  }
}

// please do mapstatetoprops stuff

function mapStateToProps({ auth }: { auth: any }) {
  return {
    auth,
  };
}

const TactoriusModal = connect(
  mapStateToProps,
  {}
)(withRouter(UnwrappedTactoriusModal));

export default TactoriusModal;

const quickPlayModal = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: 'auto',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    height: '500px',
    width: '1000px',
    background: '#000000',
    borderRadius: '10px',
    border: 'none',
  },
  overlay: {
    zIndex: 10,
    backgroundColor: '#111111',
  },
};

const bookSettingsModal = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    height: '500px',
    width: '1000px',
    background: '#000000',
    borderRadius: '10px',
    border: 'none',
  },
  overlay: {
    zIndex: 10,
    backgroundColor: '#111111',
  },
};

const armoryModal = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: 'auto',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    height: '500px',
    width: '1000px',
    background: '#111111',
    borderRadius: '10px',
    border: '2px solid #a043a2',
  },
  overlay: {
    zIndex: 10,
    backgroundColor: '#111111EE',
  },
};

const endgameModal = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: 'auto',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    height: '100%',
    maxHight: '574px',
    width: '100%',
    background: '#00000000',
    border: 'none',
    padding: '0',
    borderRadius: '0',
    // border: '2px solid #a043a2',
  },
  overlay: {
    width: '100%',
    height: '100%',
    zIndex: 10,
    backgroundColor: '#00000000',
  },
};

const chapterEndModal = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: 'auto',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    height: '500px',
    width: '1000px',
    background: '#111111',
    borderRadius: '10px',
    border: '2px solid #a043a2',
  },
  overlay: {
    zIndex: 10,
    backgroundColor: '#111111EE',
  },
};
