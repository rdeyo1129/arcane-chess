import React from 'react';
import Modal from 'react-modal';
import _ from 'lodash';

import { withRouter } from '../withRouter/withRouter';
import { connect } from 'react-redux';

import { getLocalStorage } from 'src/utils/handleLocalStorage';

import 'src/chessground/styles/chessground.scss';
import 'src/chessground/styles/normal.scss';
// import { Chessground } from 'src/chessground/chessgroundMod';

import Button from '../Button/Button';
import Select from '../Select/Select';

import CharacterSelect from './CharacterSelect';
import ArcanaSelect from './ArcanaSelect';
import ArmySelect from './ArmySelect';

// import { characters, modes } from 'src/components/Modal/charactersModes';

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
  animatedValue: number;
  targetValue: number;
  reducedScore: number;
  chapterNum: number;
  difficulty: string;
  difficultyDescriptions: { [key: string]: string };
  hoverDifficulty: string;
  showCharacterPicker: boolean;
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

const arcana: ArcanaMap = arcanaJson as ArcanaMap;

// Modal.setAppElement('#root');

class UnwrappedTactoriusModal extends React.Component<ModalProps, ModalState> {
  constructor(props: ModalProps) {
    super(props);
    const LS = getLocalStorage(this.props.auth.user.username);
    this.state = {
      config: {
        multiplier: LS.config.multiplier,
        color: LS.config.color,
        thinkingTime: LS.config.thinkingTime,
        depth: LS.config.depth,
        clock: LS.config.clock,
        blunderVision: false,
        threatVision: false,
        checkVision: false,
        hints: false,
        autopromotion: 'Select',
      },
      hoverArcane: '',
      whiteArcana: {},
      blackArcana: {},
      playerColor: 'white',
      animatedValue: 0,
      targetValue: 0,
      reducedScore: _.reduce(
        LS.nodeScores,
        (accumulator, value) => {
          return accumulator + value;
        },
        0
      ),
      chapterNum: LS.chapter + 1,
      difficulty: LS.difficulty,
      difficultyDescriptions: {
        novice:
          'NOVICE: For players looking to experiement and take their time with the new rules.',
        intermediate:
          'INTERMEDIATE: The clock is enabled, with slightly stronger moves from the engine.',
        advanced:
          'ADVANCED: Players should expect to be more patient and will not have the first move.',
        expert: 'EXPERT: Full-strength challenge for veteran players.',
      },
      hoverDifficulty: LS.difficulty,
      showCharacterPicker: false,
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

  toggleHover = (arcane: string) => {
    this.setState({ hoverArcane: arcane });
  };

  componentDidMount() {}

  render() {
    return (
      <div className="container">
        {this.props.type === 'quickPlay2' ? (
          <Modal
            style={quickPlayModal}
            isOpen={this.props.isOpen}
            ariaHideApp={false}
          >
            <div className="quickplay">
              <div className="setup-arcana">
                <div
                  onMouseEnter={() => this.toggleHover('Click to swap sides.')}
                  onMouseLeave={() => this.toggleHover('')}
                >
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
                            prevState.playerColor === 'white'
                              ? 'black'
                              : 'white',
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
                </div>
                <div
                  className="setup"
                  onMouseEnter={() =>
                    this.toggleHover('Click to select a custom army setup.')
                  }
                  onMouseLeave={() => this.toggleHover('')}
                >
                  <Select
                    // title="whiteSetup"
                    type="string"
                    height={'30px'}
                    width={'240px'}
                    options={[
                      'RNBQKBNR',
                      'RNBVKBNR',
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
                  {_.map(arcana, (_arcaneObject: ArcanaDetail, key: string) => {
                    return (
                      <img
                        key={key}
                        className="arcane"
                        src={`${arcana[key].imagePath}${
                          this.state.hoverArcane === `${key}-white`
                            ? '-hover'
                            : ''
                        }.svg`}
                        style={{
                          opacity:
                            _.includes(
                              Object.keys(this.state.whiteArcana),
                              key
                            ) && this.state.whiteArcana[key]
                              ? 1
                              : 0.5,
                          cursor:
                            "url('/assets/images/cursors/pointer.svg') 12 4, pointer",
                        }}
                        onClick={() => {
                          const currentArcaneType = arcana[key].type;
                          const isEnabledOrNonNull =
                            _.includes(
                              Object.keys(this.state.whiteArcana),
                              key
                            ) && this.state.whiteArcana[key];
                          if (isEnabledOrNonNull) {
                            this.setState(
                              (prevState) => ({
                                whiteArcana: {
                                  ...prevState.whiteArcana,
                                  [key]: null,
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
                                  [key]:
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
                        onMouseEnter={() => this.toggleHover(`${key}-white`)}
                        onMouseLeave={() => this.toggleHover('')}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="setup-arcana">
                <div
                  onMouseEnter={() => this.toggleHover('Click to swap sides.')}
                  onMouseLeave={() => this.toggleHover('')}
                >
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
                            prevState.playerColor === 'white'
                              ? 'black'
                              : 'white',
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
                </div>
                <div
                  className="setup-select"
                  onMouseEnter={() =>
                    this.toggleHover('Click to select a custom army setup.')
                  }
                  onMouseLeave={() => this.toggleHover('')}
                >
                  <Select
                    // title="blackSetup"
                    type="string"
                    height={'30px'}
                    width={'240px'}
                    options={[
                      'rnbqkbnr',
                      'rnbvkbnr',
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
                  {_.map(arcana, (_arcaneObect: ArcanaDetail, key: string) => {
                    return (
                      <img
                        key={key}
                        className="arcane"
                        src={`${arcana[key].imagePath}${
                          this.state.hoverArcane === `${key}-black`
                            ? '-hover'
                            : ''
                        }.svg`}
                        style={{
                          opacity:
                            _.includes(
                              Object.keys(this.state.blackArcana),
                              key
                            ) && this.state.blackArcana[key]
                              ? 1
                              : 0.5,
                          cursor:
                            "url('/assets/images/cursors/pointer.svg') 12 4, pointer",
                        }}
                        onClick={() => {
                          const currentArcaneType = arcana[key].type;
                          const isEnabledOrNonNull =
                            _.includes(
                              Object.keys(this.state.blackArcana),
                              key
                            ) && this.state.blackArcana[key];
                          if (isEnabledOrNonNull) {
                            this.setState(
                              (prevState) => ({
                                blackArcana: {
                                  ...prevState.blackArcana,
                                  [key]: null,
                                },
                              }),
                              () => {
                                if (this.props.updateConfig)
                                  this.props.updateConfig(
                                    'bArcana',
                                    this.state.blackArcana
                                  );
                              }
                            );
                          } else {
                            this.setState(
                              (prevState) => ({
                                blackArcana: {
                                  ...prevState.blackArcana,
                                  [key]:
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
                                    this.state.blackArcana
                                  );
                              }
                            );
                          }
                        }}
                        onMouseEnter={() => this.toggleHover(`${key}-black`)}
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
                    {arcana[this.state.hoverArcane.split('-')[0]]
                      ?.description ||
                      this.state.hoverArcane ||
                      'Hover and click on spells to see more information or add to your bag. Hover over other settings for more information.'}
                  </p>
                </div>
                <div
                  className="quickplay-select"
                  onMouseEnter={() =>
                    this.toggleHover(
                      'Difficulty setting, long should the engine think for?'
                    )
                  }
                  onMouseLeave={() => this.toggleHover('')}
                >
                  <Select
                    title="Thinking Time"
                    type="number"
                    width={240}
                    height={40}
                    options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                    onChange={(val) => {
                      if (this.props.updateConfig)
                        this.props.updateConfig('thinkingTime', Number(val));
                    }}
                  />
                </div>
                <div
                  className="quickplay-select"
                  onMouseEnter={() =>
                    this.toggleHover(
                      'Difficulty setting, how many half moves should the engine look ahead?'
                    )
                  }
                  onMouseLeave={() => this.toggleHover('')}
                >
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
                <div
                  className="quickplay-select"
                  onMouseEnter={() =>
                    this.toggleHover(
                      'Choose Select to pick your promotion each time or choose an autopromotion.'
                    )
                  }
                  onMouseLeave={() => this.toggleHover('')}
                >
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
        ) : this.props.type === 'quickPlay' ? (
          <Modal
            style={quickPlayModal}
            isOpen={this.props.isOpen}
            ariaHideApp={false}
          >
            <div className="quickplay">
              <div className="top-buttons">
                <Button className="tertiary" color="B" text="BACK" />
              </div>
              <div className="player-options-text">
                <div className="sides">
                  <div className="player">
                    <div className="buttons-arcana">
                      <div className="buttons">
                        <div className="color">
                          <img
                            src={`/assets/images/blueuser.svg`}
                            style={{
                              width: '180px',
                              height: '60px',
                              background: '#4A90E2',
                            }}
                          />
                        </div>
                        <div className="character">
                          <img
                            src={`/assets/characters/viking-head.svg`}
                            style={{
                              width: '180px',
                              height: '60px',
                              background: '#4A90E2',
                            }}
                            onClick={() => {
                              this.setState({
                                showCharacterPicker: this.state
                                  .showCharacterPicker
                                  ? false
                                  : true,
                              });
                            }}
                          />
                          {this.state.showCharacterPicker ? (
                            <CharacterSelect />
                          ) : null}
                        </div>
                      </div>
                      <div className="arcana">
                        <ArcanaSelect
                          color={this.state.playerColor}
                          updateInventory={(inventory) => {
                            if (this.props.updateConfig)
                              this.props.updateConfig('wArcana', inventory);
                          }}
                        />
                      </div>
                    </div>
                    <div className="army-section">
                      <ArmySelect
                        color={this.state.playerColor}
                        updateArmy={(army) => {
                          if (this.props.updateConfig)
                            this.props.updateConfig(
                              `${this.state.playerColor}Setup`,
                              army
                            );
                        }}
                      />
                    </div>
                  </div>
                  <div className="engine">
                    <div className="buttons-arcana">
                      <div className="buttons">
                        <div className="color"></div>
                        <div className="character"></div>
                      </div>
                      <div className="arcana"></div>
                    </div>
                    <div className="army"></div>
                  </div>
                </div>
                <div className="hover-text">{/* hover text */}</div>
              </div>
              <div className="settings-go">
                {/* difficulty */}
                {/* promotion */}
                {/* randomize template */}
                {/* randomize */}
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
    height: '100%',
    width: '100vw',
    background: '#000000',
    // borderRadius: '10px',
    border: 'none',
    padding: '0px',
  },
  overlay: {
    zIndex: 10,
    backgroundColor: '#111111',
  },
};
