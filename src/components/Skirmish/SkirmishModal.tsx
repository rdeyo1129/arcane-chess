import React from 'react';
import Modal from 'react-modal';
import _ from 'lodash';

import { withRouter } from '../withRouter/withRouter';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getLocalStorage } from 'src/utils/handleLocalStorage';

import 'src/components/Skirmish/SkirmishModal.scss';
import 'src/chessground/styles/chessground.scss';
import 'src/chessground/styles/normal.scss';

import ArcanaSelect from 'src/components/Modal/ArcanaSelect';
import ArmySelect from 'src/components/Modal/ArmySelect';

import {
  startingInventory,
  // modes,
  // characters,
} from 'src/components/Modal/charactersModes';

import 'src/components/Modal/Modal.scss';
import arcanaJson from 'src/data/arcana.json';

/* ---------- Types ---------- */
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
  playerColor: 'white' | 'black';
  engineColor: 'white' | 'black';
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
  playerCharacterImgPath: string;
  engineCharacterImgPath: string;
  characterDescription: string;
  selectedModeName: string;
  selectedFactionId: FactionId | null;
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
// interface Character {
//   name: string;
//   inventory: ArcanaDetail[];
//   setup: string;
//   imagePath: string;
//   color: string;
//   description: string;
// }

/* ---------- Factions mapping (POC data) ---------- */
type FactionId = 'chi' | 'gamma' | 'omega' | 'lambda' | 'sigma' | 'psi' | 'tau';

type Faction = {
  id: FactionId;
  name: string;
  army: string;
  arcana: string[];
  unlocked: boolean;
  image?: string;
  image2x?: string; // optional
  image3x?: string; // optional
  description: string;
};

const FACTIONS: Record<FactionId, Faction> = {
  chi: {
    id: 'chi',
    name: 'chi',
    army: 'RNBQKBNR',
    arcana: ['banshee', 'eclipse', 'lantern'],
    unlocked: true,
    image: '/assets/factions/chi.webp',
    description: 'Elusive control & vision denial. Punishes overextension.',
  },
  gamma: {
    id: 'gamma',
    name: 'gamma',
    army: 'RNBQKBNR',
    arcana: ['warriorsOath', 'tacticalVision', 'stepShadowDyad'],
    unlocked: true,
    image: '/assets/factions/gamma.webp',
    description: 'Pin-based tempo plays and angle traps.',
  },
  omega: {
    id: 'omega',
    name: 'omega',
    army: 'RNBQKBNR',
    arcana: ['reach', 'gloryCharge', 'inheritance'],
    unlocked: true,
    image: '/assets/factions/omega.webp',
    description: 'Clean strikes, promotions, explosive finishers.',
  },
  lambda: {
    id: 'lambda',
    name: 'lambda',
    army: 'RNBQKBNR',
    arcana: ['gravityWell', 'magnet', 'moltenShell'],
    unlocked: true,
    image: '/assets/factions/lambda.webp',
    description: 'Zone control & drag tactics; slow crush.',
  },
  sigma: {
    id: 'sigma',
    name: 'sigma',
    army: 'RNBQKBNR',
    arcana: ['futureSight', 'tempoIntercept', 'dyad'],
    unlocked: true,
    image: '/assets/factions/sigma.webp',
    description: 'Calculation & multi-step plans; precise bursts.',
  },
  psi: {
    id: 'psi',
    name: 'psi',
    army: 'RNBQKBNR',
    arcana: ['tidecaller', 'maelstrom', 'seal'],
    unlocked: true,
    image: '/assets/factions/psi.webp',
    description: 'Reactive counters; flows around pressure.',
  },
  tau: {
    id: 'tau',
    name: 'tau',
    army: 'RNBQKBNR',
    arcana: ['phase', 'entanglement', 'veil'],
    unlocked: true,
    image: '/assets/factions/tau.webp',
    description: 'Phasing & binds; strike where they least expect.',
  },
};

/* Flex-based rows for the 2-3-2 layout */
const HEX_ROWS: FactionId[][] = [
  ['lambda', 'sigma'],
  ['psi', 'tau', 'gamma'],
  ['omega', 'chi'],
];

const arcana: ArcanaMap = arcanaJson as ArcanaMap;

/* ---------- Component ---------- */
class UnwrappedSkirmishModal extends React.Component<ModalProps, ModalState> {
  constructor(props: ModalProps) {
    super(props);
    const LS = getLocalStorage(this.props.auth.user.username);

    this.state = {
      config: {
        multiplier: LS.config.multiplier,
        color: LS.config.color,
        thinkingTime: 2,
        engineDepth: 1,
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
      blackSetup: 'rnbqkbnr',
      playerColor: 'white',
      engineColor: 'black',
      animatedValue: 0,
      targetValue: 0,
      reducedScore: _.reduce(LS.nodeScores, (acc, v) => acc + v, 0),
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
      playerCharacterImgPath: '',
      engineCharacterImgPath: '',
      characterDescription: '',
      selectedModeName: '',
      selectedFactionId: null,
    };
  }

  transformedInventory = (inventory: ArcanaDetail[]) => {
    const object: { [key: string]: number } = {};
    _.forEach(inventory, (item) => {
      if (item.id === 'empty') return;
      object[item.id] = (object[item.id] || 0) + 1;
    });
    return object;
  };

  toggleHover = (key: string) => this.setState({ hoverId: key });

  descriptions = (): Record<string, string> => {
    const base = {
      engineDiff: 'Engine difficulty & knobs.',
      engineFact: 'Engine facts / status.',
      swapSides: `Swap sides: you are ${this.state.playerColor}.`,
      '': 'Choose a faction or adjust engine settings.',
    };
    const factionDescs: Record<string, string> = {};
    Object.values(FACTIONS).forEach((f) => {
      factionDescs[`faction:${f.id}`] = `${f.name}: ${f.description}`;
    });
    return { ...base, ...factionDescs };
  };

  handleFactionHover = (id: FactionId | null) => {
    this.setState({ hoverId: id ? `faction:${id}` : '' });
  };

  handleFactionClick = (id: FactionId) => {
    const faction = FACTIONS[id];
    if (!faction.unlocked) return;

    const chosenArmy = faction.army;
    const inv = faction.arcana
      .map((aid) => arcana[aid])
      .filter(Boolean)
      .slice(0, 6) as ArcanaDetail[];

    const configArc = this.transformedInventory(inv);

    if (this.props.updateConfig) {
      this.props.updateConfig('whiteSetup', chosenArmy);
      this.props.updateConfig('blackSetup', chosenArmy.toLowerCase());
      this.props.updateConfig('wArcana', configArc);
      this.props.updateConfig('bArcana', configArc);
    }

    this.setState({
      selectedFactionId: id,
      whiteSetup: chosenArmy,
      blackSetup: chosenArmy,
      whiteArcana: inv.length ? inv : this.state.whiteArcana,
      blackArcana: inv.length ? inv : this.state.blackArcana,
    });
  };

  swapSides = () => {
    const playerColor = this.state.playerColor === 'white' ? 'black' : 'white';
    const engineColor = playerColor === 'white' ? 'black' : 'white';
    this.setState({ playerColor, engineColor });
    this.toggleHover('swapSides');
  };

  render() {
    const hoverText =
      this.descriptions()[this.state.hoverId] ?? this.descriptions()[''];

    return (
      <div className="container">
        <Modal
          style={skirmishModal}
          isOpen={this.props.isOpen}
          ariaHideApp={false}
        >
          <div className="skirmish-modal">
            <div className="skirmish-header">
              <Link className="home-button" to="/">
                <img className="logo" src="/assets/logoall+.png" alt="" />
              </Link>
              <div className="description" aria-live="polite">
                {hoverText}
              </div>
            </div>
            <div
              className="buttons"
              role="group"
              aria-label="Engine & Side Controls"
            >
              <div className="engine-settings">
                <div
                  className="engine-diff"
                  onMouseEnter={() => this.toggleHover('engineDiff')}
                  onMouseLeave={() => this.toggleHover('')}
                >
                  ENGINE DIFFICULTY
                </div>
                <div
                  className="engine-fact"
                  onMouseEnter={() => this.toggleHover('engineFact')}
                  onMouseLeave={() => this.toggleHover('')}
                >
                  ENGINE FACTS
                </div>
              </div>
              <div
                className="swap-sides"
                onMouseEnter={() => this.toggleHover('swapSides')}
                onMouseLeave={() => this.toggleHover('')}
                onClick={this.swapSides}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.swapSides();
                  }
                }}
              >
                SWAP SIDES
              </div>
            </div>

            <div className="hex-setups">
              <div className="hex" role="list" aria-label="Faction grid">
                {HEX_ROWS.map((row, rowIdx) => (
                  <div className="hex-row" key={`row-${rowIdx}`}>
                    {row.map((id) => {
                      const f = FACTIONS[id];
                      const isSelected = this.state.selectedFactionId === id;
                      const isLocked = !f.unlocked;
                      return (
                        <div
                          key={id}
                          role="listitem"
                          className={[
                            'hex-cell',
                            isSelected ? 'is-selected' : '',
                            isLocked ? 'is-locked' : 'is-unlocked',
                          ].join(' ')}
                          onMouseEnter={() => this.handleFactionHover(id)}
                          onMouseLeave={() => this.handleFactionHover(null)}
                          onClick={() => this.handleFactionClick(id)}
                          aria-label={`${f.name}${isLocked ? ' (locked)' : ''}`}
                          tabIndex={isLocked ? -1 : 0}
                          onKeyDown={(e) => {
                            if (
                              !isLocked &&
                              (e.key === 'Enter' || e.key === ' ')
                            ) {
                              e.preventDefault();
                              this.handleFactionClick(id);
                            }
                          }}
                        >
                          <div className="tile">
                            <div className="img-wrap">
                              {f.image ? (
                                <img src={f.image} alt="" />
                              ) : (
                                <div className="img-placeholder" />
                              )}
                            </div>
                            {isLocked && (
                              <div className="lock" aria-hidden="true">
                                🔒
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="setups">
                <div className="engine-setup">
                  <div className="arcana">
                    <ArcanaSelect
                      inventory={this.state.blackArcana}
                      color="black"
                      isOpen={false}
                    />
                  </div>
                  <div className="army">
                    <ArmySelect
                      army={this.state.blackSetup}
                      isOpen={false}
                      color="black"
                    />
                  </div>
                </div>

                <div className="human-setup">
                  <div className="arcana">
                    <ArcanaSelect
                      inventory={this.state.whiteArcana}
                      color="white"
                      isOpen={false}
                    />
                  </div>
                  <div className="army">
                    <ArmySelect
                      army={this.state.whiteSetup}
                      isOpen={false}
                      color="white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps({ auth }: { auth: any }) {
  return { auth };
}

const SkirmishModal = connect(
  mapStateToProps,
  {}
)(withRouter(UnwrappedSkirmishModal));
export default SkirmishModal;

/* ---------- Modal base (unchanged) ---------- */
const skirmishModal = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: 'auto',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    height: '100%',
    width: '100%',
    background: '#111111',
    border: 'none',
    overflowY: 'scroll' as const,
    overflowX: 'hidden' as const,
    msOverflowStyle: 'none' as const,
    scrollbarWidth: 'none' as const,
  },
  overlay: { zIndex: 10, backgroundColor: '#111111CC' },
};
