import React from 'react';
import Modal from 'react-modal';
import _ from 'lodash';

import { withRouter } from '../withRouter/withRouter';
import { connect } from 'react-redux';

import { getLocalStorage } from 'src/utils/handleLocalStorage';

import './QuickPlayModal.scss';
import 'src/chessground/styles/chessground.scss';
import 'src/chessground/styles/normal.scss';

import Button from '../Button/Button';
// import Select from '../Select/Select';

import CharacterSelect from './CharacterSelect';
import ArcanaSelect from './ArcanaSelect';
import ArmySelect from './ArmySelect';

// import {
//   characters,
//   modes,
// } from 'src/components/Modal/charactersModes';
import { startingInventory } from 'src/components/Modal/charactersModes';

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
  hoverId: string;
  whiteArcana: ArcanaDetail[];
  blackArcana: ArcanaDetail[];
  whiteSetup: string;
  blackSetup: string;
  playerColor: string;
  engineColor: string;
  animatedValue: number;
  targetValue: number;
  reducedScore: number;
  chapterNum: number;
  difficulty: string;
  difficultyDescriptions: { [key: string]: string };
  hoverDifficulty: string;
  showCharacterSelect: string;
  showArmySelect: string;
  showArcanaSelect: string;
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
      hoverId: '',
      whiteArcana: [...startingInventory],
      blackArcana: [...startingInventory],
      whiteSetup: 'RNBQKBNR',
      blackSetup: 'RNBQKBNR',
      playerColor: 'white',
      engineColor: 'black',
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
      showCharacterSelect: '',
      showArmySelect: '',
      showArcanaSelect: '',
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

  transformedInventory = (inventory: ArcanaDetail[]) => {
    const object: { [key: string]: number } = {}; // Define the object type
    _.forEach(inventory, (item) => {
      if (item.id === 'empty') return;
      if (item) {
        // Check if item exists to avoid undefined entries
        object[item.id] = 1;
      }
    });
    return object; // Return the transformed object
  };

  toggleHover = (text: string) => {
    this.setState({ hoverId: text });
  };

  componentDidMount() {}

  render() {
    return (
      <div className="container">
        <Modal
          style={quickPlayModal}
          isOpen={this.props.isOpen}
          ariaHideApp={false}
        >
          <div className="quickplay-modal">
            <div className="top-buttons">
              <Button className="tertiary" color="B" text="BACK" />
            </div>
            <div className="hover-text">
              <p>{arcana[this.state.hoverId]?.name || ''}</p>
              <p>
                {arcana[this.state.hoverId]?.description
                  ? arcana[this.state.hoverId]?.description
                  : this.state.hoverId === 'swapSides'
                  ? 'Click to swap sides.'
                  : 'Hover and click on spells to see more information or add to your bag. Hover over other settings for more information.'}
              </p>
            </div>
            <div className="player-options-text">
              <div className="sides">
                <div className="player">
                  <div className="buttons-arcana">
                    <div className="buttons">
                      <div className="color">
                        <img
                          src={`/assets/images/user.svg`}
                          style={{
                            width: '180px',
                            height: '60px',
                            background:
                              this.state.playerColor === 'white'
                                ? '#AAAAAA'
                                : '#333333',
                            cursor:
                              "url('/assets/images/cursors/pointer.svg') 12 4, pointer",
                          }}
                          onClick={() =>
                            this.setState(
                              (prevState) => ({
                                playerColor:
                                  prevState.playerColor === 'white'
                                    ? 'black'
                                    : 'white',
                                engineColor:
                                  prevState.engineColor === 'white'
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
                          onMouseEnter={() => {
                            this.setState({
                              hoverId: 'swapSides',
                            });
                          }}
                          onMouseLeave={() => {
                            this.setState({
                              hoverId: '',
                            });
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
                              showCharacterSelect:
                                this.state.playerColor ===
                                this.state.showCharacterSelect
                                  ? ''
                                  : this.state.playerColor,
                              showArcanaSelect: '',
                              showArmySelect: '',
                            });
                          }}
                        />
                        {this.state.showCharacterSelect ? (
                          <CharacterSelect
                            color={this.state.playerColor}
                            isOpen={this.state.showCharacterSelect}
                          />
                        ) : null}
                      </div>
                    </div>
                    <div className="arcana">
                      <ArcanaSelect
                        inventory={
                          this.state.playerColor === 'white'
                            ? this.state.whiteArcana
                            : this.state.blackArcana
                        }
                        isOpen={
                          this.state.showArcanaSelect === this.state.playerColor
                        }
                        handleToggle={() => {
                          this.setState({
                            showArcanaSelect:
                              this.state.playerColor ===
                              this.state.showArcanaSelect
                                ? ''
                                : this.state.playerColor,
                            showCharacterSelect: '',
                            showArmySelect: '',
                          });
                        }}
                        color={this.state.playerColor}
                        updateInventory={(inventory) => {
                          const configArcana =
                            this.transformedInventory(inventory);
                          if (this.props.updateConfig)
                            this.props.updateConfig(
                              `${
                                this.state.playerColor === 'white' ? 'w' : 'b'
                              }Arcana`,
                              configArcana
                            );
                          if (this.state.playerColor === 'white') {
                            this.setState({
                              whiteArcana: inventory,
                            });
                          }
                          if (this.state.playerColor === 'black') {
                            this.setState({
                              blackArcana: inventory,
                            });
                          }
                        }}
                        updateHover={(arcaneObject) => {
                          this.setState({
                            hoverId: arcaneObject.id,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="army-section">
                    <ArmySelect
                      army={
                        this.state.playerColor === 'white'
                          ? this.state.whiteSetup
                          : this.state.blackSetup
                      }
                      isOpen={
                        this.state.showArmySelect === this.state.playerColor
                      }
                      handleToggle={() => {
                        this.setState({
                          showArmySelect:
                            this.state.playerColor === this.state.showArmySelect
                              ? ''
                              : this.state.playerColor,
                          showCharacterSelect: '',
                          showArcanaSelect: '',
                        });
                      }}
                      color={this.state.playerColor}
                      updateArmy={(army) => {
                        if (this.props.updateConfig) {
                          this.props.updateConfig(
                            `${this.state.playerColor}Setup`,
                            army
                          );
                          if (this.state.playerColor === 'white') {
                            this.setState({
                              whiteSetup: army,
                            });
                          }
                          if (this.state.playerColor === 'black') {
                            this.setState({
                              blackSetup: army,
                            });
                          }
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="engine">
                  <div className="buttons-arcana">
                    <div className="buttons">
                      <div className="color">
                        <img
                          src={`/assets/images/engine.svg`}
                          style={{
                            width: '180px',
                            height: '60px',
                            background:
                              this.state.engineColor === 'white'
                                ? '#AAAAAA'
                                : '#333333',
                            cursor:
                              "url('/assets/images/cursors/pointer.svg') 12 4, pointer",
                          }}
                          onClick={() =>
                            this.setState(
                              (prevState) => ({
                                playerColor:
                                  prevState.playerColor === 'white'
                                    ? 'black'
                                    : 'white',
                                engineColor:
                                  prevState.engineColor === 'white'
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
                          onMouseEnter={() => {
                            this.setState({
                              hoverId: 'swapSides',
                            });
                          }}
                          onMouseLeave={() => {
                            this.setState({
                              hoverId: '',
                            });
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
                              showCharacterSelect:
                                this.state.engineColor ===
                                this.state.showCharacterSelect
                                  ? ''
                                  : this.state.engineColor,
                              showArcanaSelect: '',
                              showArmySelect: '',
                            });
                          }}
                        />
                        {this.state.showCharacterSelect ? (
                          <CharacterSelect
                            color={this.state.engineColor}
                            isOpen={this.state.showCharacterSelect}
                          />
                        ) : null}
                      </div>
                    </div>
                    <div className="arcana">
                      <ArcanaSelect
                        inventory={
                          this.state.engineColor === 'white'
                            ? this.state.whiteArcana
                            : this.state.blackArcana
                        }
                        isOpen={
                          this.state.showArcanaSelect === this.state.engineColor
                        }
                        handleToggle={() => {
                          this.setState({
                            showArcanaSelect:
                              this.state.engineColor ===
                              this.state.showArcanaSelect
                                ? ''
                                : this.state.engineColor,
                            showCharacterSelect: '',
                            showArmySelect: '',
                          });
                        }}
                        color={this.state.engineColor}
                        updateInventory={(inventory) => {
                          const configArcana =
                            this.transformedInventory(inventory);
                          if (this.props.updateConfig)
                            this.props.updateConfig(
                              `${
                                this.state.engineColor === 'white' ? 'w' : 'b'
                              }Arcana`,
                              configArcana
                            );
                          if (this.state.engineColor === 'white') {
                            this.setState({
                              whiteArcana: inventory,
                            });
                          }
                          if (this.state.engineColor === 'black') {
                            this.setState({
                              blackArcana: inventory,
                            });
                          }
                        }}
                        updateHover={(arcaneObject) => {
                          this.setState({
                            hoverId: arcaneObject.id,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="army-section">
                    <ArmySelect
                      army={
                        this.state.engineColor === 'white'
                          ? this.state.whiteSetup
                          : this.state.blackSetup
                      }
                      isOpen={
                        this.state.showArmySelect === this.state.engineColor
                      }
                      handleToggle={() => {
                        this.setState({
                          showArmySelect:
                            this.state.engineColor === this.state.showArmySelect
                              ? ''
                              : this.state.engineColor,
                          showCharacterSelect: '',
                          showArcanaSelect: '',
                        });
                      }}
                      color={this.state.engineColor}
                      updateArmy={(army) => {
                        if (this.props.updateConfig) {
                          this.props.updateConfig(
                            `${this.state.engineColor}Setup`,
                            army
                          );
                          if (this.state.engineColor === 'white') {
                            this.setState({
                              whiteSetup: army,
                            });
                          }
                          if (this.state.engineColor === 'black') {
                            this.setState({
                              blackSetup: army,
                            });
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="settings-go">
              {/* difficulty */}
              {/* promotion */}
              {/* randomize template */}
              {/* randomize */}
              {/* mode */}
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
    overflowY: 'scroll' as const,
    overflowX: 'hidden' as const,
    msOverflowStyle: 'none' as const,
    scrollbarWidth: 'none' as const,
  },
  overlay: {
    zIndex: 10,
    backgroundColor: '#111111',
  },
};
