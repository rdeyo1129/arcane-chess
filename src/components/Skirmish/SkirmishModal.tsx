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
import 'src/chessground/styles/chi.scss';
import 'src/chessground/styles/lambda.scss';
import 'src/chessground/styles/sigma.scss';
import 'src/chessground/styles/omega.scss';
import 'src/chessground/styles/psi.scss';
import 'src/chessground/styles/gamma.scss';

import ArcanaSelect from 'src/components/Modal/ArcanaSelect';
import ArmySelect from 'src/components/Modal/ArmySelect';

import { startingInventory } from 'src/components/Modal/charactersModes';

import 'src/components/Modal/Modal.scss';
import arcanaJson from 'src/data/arcana.json';
import Select from 'src/components/Select/Select';

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

  whiteArcana: ArcanaDetail[];
  blackArcana: ArcanaDetail[];
  whiteSetup: string;
  blackSetup: string;

  playerColor: 'white' | 'black';
  engineColor: 'white' | 'black';

  engineFactionId: FactionId | null;
  playerFactionId: FactionId | null;

  reducedScore: number;
  chapterNum: number;
  difficulty: string;

  hoverId: string;
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

type FactionId = 'chi' | 'gamma' | 'omega' | 'lambda' | 'sigma' | 'psi' | 'tau';

type Faction = {
  id: FactionId;
  name: string;
  army: string;
  arcana: string[];
  unlocked: boolean;
  image?: string;
  description: string;
};

const FACTIONS: Record<FactionId, Faction> = {
  chi: {
    id: 'chi',
    name: 'chi',
    army: 'RNBQKBNR',
    arcana: ['dyadB', 'modsGLU'],
    unlocked: true,
    image: '/assets/factions/chi.webp',
    description: 'Elusive control & vision denial. Punishes overextension.',
  },
  gamma: {
    id: 'gamma',
    name: 'gamma',
    army: 'RNBTKBNR',
    arcana: ['shftP', 'modsDIM'],
    unlocked: true,
    image: '/assets/factions/gamma.webp',
    description: 'Pin-based tempo plays and angle traps.',
  },
  omega: {
    id: 'omega',
    name: 'omega',
    army: 'RNBMKBNR',
    arcana: ['sumnRM', 'sumnRT', 'modsEXT'],
    unlocked: true,
    image: '/assets/factions/omega.webp',
    description: 'Clean strikes, promotions, explosive finishers.',
  },
  lambda: {
    id: 'lambda',
    name: 'lambda',
    army: 'RNWQKWNR',
    arcana: ['modsREA'],
    unlocked: true,
    image: '/assets/factions/lambda.webp',
    description: 'Zone control & drag tactics; slow crush.',
  },
  sigma: {
    id: 'sigma',
    name: 'sigma',
    army: 'RNBMKBNR',
    arcana: ['sumnRE', 'sumnRE', 'modsSIL'],
    unlocked: true,
    image: '/assets/factions/sigma.webp',
    description: 'Calculation & multi-step plans; precise bursts.',
  },
  psi: {
    id: 'psi',
    name: 'psi',
    army: 'RSBQKBSR',
    arcana: ['modsBAN'],
    unlocked: true,
    image: '/assets/factions/psi.webp',
    description: 'Reactive counters; flows around pressure.',
  },
  tau: {
    id: 'tau',
    name: 'tau',
    army: '2WVKW2',
    arcana: ['modsREA'],
    unlocked: true,
    image: '/assets/factions/tau.webp',
    description: 'Phasing & binds; strike where they least expect.',
  },
};

const HEX_ROWS: FactionId[][] = [
  ['omega', 'sigma'],
  ['chi', 'tau', 'lambda'],
  ['psi', 'gamma'],
];

const arcana: ArcanaMap = arcanaJson as ArcanaMap;

const GREEK_CAP: Record<FactionId, string> = {
  chi: 'Χ',
  gamma: 'Γ',
  omega: 'Ω',
  lambda: 'Λ',
  sigma: 'Σ',
  psi: 'Ψ',
  tau: 'Τ',
};

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

      whiteArcana: [...startingInventory],
      blackArcana: [...startingInventory],
      whiteSetup: 'RNBQKBNR',
      blackSetup: 'rnbqkbnr',

      playerColor: 'white',
      engineColor: 'black',

      engineFactionId: null,
      playerFactionId: null,

      reducedScore: _.reduce(LS.nodeScores, (acc, v) => acc + v, 0),
      chapterNum: LS.chapter + 1,
      difficulty: LS.difficulty,

      hoverId: '',
    };
  }

  componentDidMount() {
    const unlocked = Object.values(FACTIONS)
      .filter((f) => f.unlocked)
      .map((f) => f.id);
    if (unlocked.length) {
      const rnd = (arr: FactionId[]) =>
        arr[Math.floor(Math.random() * arr.length)];
      this.setFactionForRole('engine', rnd(unlocked));
      this.setFactionForRole('player', rnd(unlocked));
    }
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
    const object: { [key: string]: number } = {};
    _.forEach(inventory, (item) => {
      if (item.id === 'empty') return;
      object[item.id] = (object[item.id] || 0) + 1;
    });
    return object;
  };

  setDifficulty = (
    label: 'Novice' | 'Intermediate' | 'Advanced' | 'Expert'
  ) => {
    const mapping: Record<
      typeof label,
      { thinkingTime: number; engineDepth: number }
    > = {
      Novice: { thinkingTime: 2, engineDepth: 1 },
      Intermediate: { thinkingTime: 4, engineDepth: 3 },
      Advanced: { thinkingTime: 6, engineDepth: 5 },
      Expert: { thinkingTime: 8, engineDepth: 7 },
    } as any;

    const { thinkingTime, engineDepth } = mapping[label];
    this.props.updateConfig?.('thinkingTime', thinkingTime);
    this.props.updateConfig?.('engineDepth', engineDepth);

    this.setState((prev) => ({
      difficulty: label.toLowerCase(),
      config: { ...prev.config, thinkingTime, engineDepth },
    }));
  };

  descriptions = (): Record<string, string> => {
    const base = {
      engineDiff: 'Engine difficulty & knobs.',
      engineFact: 'Choose an Engine faction.',
      swapSides: `Swap sides: you are ${this.state.playerColor}.`,
      '': 'Choose a faction or adjust engine settings.',
    };
    const factionDescs: Record<string, string> = {};
    Object.values(FACTIONS).forEach((f) => {
      factionDescs[`faction:${f.id}`] = `${f.name}: ${f.description}`;
    });
    return { ...base, ...factionDescs };
  };

  setFactionForRole = (role: 'engine' | 'player', id: FactionId) => {
    const f = FACTIONS[id];
    if (!f || !f.unlocked) return;

    const inv = f.arcana
      .map((aid) => arcana[aid])
      .filter(Boolean)
      .slice(0, 6) as ArcanaDetail[];
    const invCounts = this.transformedInventory(inv);

    const roleColor =
      role === 'engine' ? this.state.engineColor : this.state.playerColor;

    const next: Partial<ModalState> = {};
    if (roleColor === 'white') {
      next.whiteSetup = f.army;
      next.whiteArcana = inv.length ? inv : this.state.whiteArcana;
    } else {
      next.blackSetup = f.army.toLowerCase();
      next.blackArcana = inv.length ? inv : this.state.blackArcana;
    }
    if (role === 'engine') next.engineFactionId = id;
    else next.playerFactionId = id;

    this.setState(next as ModalState, () => {
      if (this.props.updateConfig) {
        if (roleColor === 'white') {
          this.props.updateConfig('whiteSetup', f.army);
          this.props.updateConfig('whiteArcana', invCounts);
          this.props.updateConfig('whiteFaction', id);
        } else {
          this.props.updateConfig('blackSetup', f.army.toLowerCase());
          this.props.updateConfig('blackArcana', invCounts);
          this.props.updateConfig('blackFaction', id);
        }
      }
    });
  };

  handleHexHover = (id: FactionId | null) => {
    this.setState({ hoverId: id ? `faction:${id}` : '' });
  };
  handleHexClick = (id: FactionId) => {
    this.setFactionForRole('player', id);
  };

  swapSides = () => {
    const prevPlayerColor = this.state.playerColor;
    const prevEngineColor = this.state.engineColor;

    const nextPlayerColor = prevPlayerColor === 'white' ? 'black' : 'white';
    const nextEngineColor = prevEngineColor === 'white' ? 'black' : 'white';

    const playerArmy =
      prevPlayerColor === 'white'
        ? this.state.whiteSetup
        : this.state.blackSetup;
    const playerInv =
      prevPlayerColor === 'white'
        ? this.state.whiteArcana
        : this.state.blackArcana;

    const engineArmy =
      prevEngineColor === 'white'
        ? this.state.whiteSetup
        : this.state.blackSetup;
    const engineInv =
      prevEngineColor === 'white'
        ? this.state.whiteArcana
        : this.state.blackArcana;

    // enforce casing by color
    const nextWhiteSetup = (
      nextPlayerColor === 'white' ? playerArmy : engineArmy
    ).toUpperCase();
    const nextBlackSetup = (
      nextPlayerColor === 'black' ? playerArmy : engineArmy
    ).toLowerCase();

    const nextWhiteArc = nextPlayerColor === 'white' ? playerInv : engineInv;
    const nextBlackArc = nextPlayerColor === 'black' ? playerInv : engineInv;

    this.setState(
      {
        playerColor: nextPlayerColor,
        engineColor: nextEngineColor,
        whiteSetup: nextWhiteSetup,
        blackSetup: nextBlackSetup,
        whiteArcana: nextWhiteArc,
        blackArcana: nextBlackArc,
      },
      () => {
        const wCounts = this.transformedInventory(this.state.whiteArcana);
        const bCounts = this.transformedInventory(this.state.blackArcana);

        this.props.updateConfig?.('whiteSetup', this.state.whiteSetup);
        this.props.updateConfig?.('blackSetup', this.state.blackSetup);
        this.props.updateConfig?.('whiteArcana', wCounts);
        this.props.updateConfig?.('blackArcana', bCounts);

        const whiteFaction =
          this.state.playerColor === 'white'
            ? this.state.playerFactionId
            : this.state.engineFactionId;

        const blackFaction =
          this.state.playerColor === 'black'
            ? this.state.playerFactionId
            : this.state.engineFactionId;

        if (whiteFaction)
          this.props.updateConfig?.('whiteFaction', whiteFaction);
        if (blackFaction)
          this.props.updateConfig?.('blackFaction', blackFaction);
      }
    );
  };

  start = () => {
    const wCounts = this.transformedInventory(this.state.whiteArcana);
    const bCounts = this.transformedInventory(this.state.blackArcana);
    if (this.props.updateConfig) {
      this.props.updateConfig('whiteSetup', this.state.whiteSetup);
      this.props.updateConfig('blackSetup', this.state.blackSetup);
      this.props.updateConfig('whiteArcana', wCounts);
      this.props.updateConfig('blackArcana', bCounts);
      this.props.updateConfig('playerColor', this.state.playerColor);
      this.props.updateConfig('engineColor', this.state.engineColor);
    }
    this.props.handleClose();
  };

  render() {
    const hoverText =
      this.descriptions()[this.state.hoverId] ?? this.descriptions()[''];

    const canStart = Boolean(
      this.state.engineFactionId && this.state.playerFactionId
    );

    const engineFactionOptions = Object.values(FACTIONS)
      .filter((f) => f.unlocked)
      .map((f) => f.name[0].toUpperCase() + f.name.slice(1));
    const factionIdByName = (name: string): FactionId =>
      name.toLowerCase() as FactionId;

    const engineFactionLabel = this.state.engineFactionId
      ? FACTIONS[this.state.engineFactionId].name[0].toUpperCase() +
        FACTIONS[this.state.engineFactionId].name.slice(1)
      : 'Select Engine Faction';

    const engineImg =
      this.state.engineFactionId && FACTIONS[this.state.engineFactionId].image;
    const playerImg =
      this.state.playerFactionId && FACTIONS[this.state.playerFactionId].image;

    const engineGreek = this.state.engineFactionId
      ? GREEK_CAP[this.state.engineFactionId]
      : '';
    const playerGreek = this.state.playerFactionId
      ? GREEK_CAP[this.state.playerFactionId]
      : '';

    console.log(this.state.engineFactionId);
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
            <div className="buttons" role="group" aria-label="Controls">
              <div className="engine-settings">
                <div
                  onMouseEnter={() => this.setState({ hoverId: 'engineDiff' })}
                  onMouseLeave={() => this.setState({ hoverId: '' })}
                >
                  <Select
                    title="Difficulty"
                    type="number"
                    width={240}
                    height={40}
                    defaultOption={'Novice'}
                    options={['Novice', 'Intermediate', 'Advanced', 'Expert']}
                    onChange={(val: string) => {
                      if (
                        val === 'Novice' ||
                        val === 'Intermediate' ||
                        val === 'Advanced' ||
                        val === 'Expert'
                      ) {
                        this.setDifficulty(val);
                      }
                    }}
                  />
                </div>
                <div
                  onMouseEnter={() => this.setState({ hoverId: 'engineFact' })}
                  onMouseLeave={() => this.setState({ hoverId: '' })}
                >
                  <Select
                    title="Engine Faction"
                    type="text"
                    width={240}
                    height={40}
                    defaultOption={engineFactionLabel}
                    options={engineFactionOptions}
                    onChange={(val: string) =>
                      this.setFactionForRole('engine', factionIdByName(val))
                    }
                  />
                </div>
              </div>
              <div
                className="swap-sides"
                onClick={this.swapSides}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.swapSides();
                  }
                }}
                onMouseEnter={() => this.setState({ hoverId: 'swapSides' })}
                onMouseLeave={() => this.setState({ hoverId: '' })}
              >
                SWAP SIDES
              </div>
            </div>
            <div className="hex-setups">
              <div
                className="hex"
                role="list"
                aria-label="Choose Player Faction"
              >
                {HEX_ROWS.map((row, rowIdx) => (
                  <div className="hex-row" key={`row-${rowIdx}`}>
                    {row.map((id) => {
                      const f = FACTIONS[id];
                      const isLocked = !f.unlocked;
                      const selectedAsPlayer =
                        this.state.playerFactionId === id;

                      return (
                        <div
                          key={id}
                          role="listitem"
                          className={[
                            'hex-cell',
                            selectedAsPlayer ? 'is-selected' : '',
                            isLocked ? 'is-locked' : 'is-unlocked',
                          ].join(' ')}
                          onMouseEnter={() => this.handleHexHover(id)}
                          onMouseLeave={() => this.handleHexHover(null)}
                          onClick={() => !isLocked && this.handleHexClick(id)}
                          aria-label={`${f.name}${isLocked ? ' (locked)' : ''}`}
                          tabIndex={isLocked ? -1 : 0}
                          onKeyDown={(e) => {
                            if (
                              !isLocked &&
                              (e.key === 'Enter' || e.key === ' ')
                            ) {
                              e.preventDefault();
                              this.handleHexClick(id);
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
                              <span className="faction-glyph large">
                                {GREEK_CAP[id]}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="setups">
                <div className="engine-setup">
                  <div
                    className="setup-row"
                    style={{
                      display: 'flex',
                      alignItems: 'stretch',
                      gap: 6,
                      ['--arcana-w' as any]: '360px',
                    }}
                  >
                    <div className="faction-img flex-fill">
                      {engineImg ? (
                        <>
                          <img src={engineImg} alt="" />
                          <span className="faction-glyph">{engineGreek}</span>
                        </>
                      ) : (
                        <div className="img-placeholder-block" />
                      )}
                    </div>
                    <div
                      className="arcana"
                      style={{ flex: '0 1 var(--arcana-w)' }}
                    >
                      <ArcanaSelect
                        inventory={
                          this.state.engineColor === 'white'
                            ? this.state.whiteArcana
                            : this.state.blackArcana
                        }
                        color={this.state.engineColor}
                        isOpen={false}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="army" style={{ marginTop: 6 }}>
                    <ArmySelect
                      army={
                        this.state.engineColor === 'white'
                          ? this.state.whiteSetup
                          : this.state.blackSetup
                      }
                      faction={this.state.engineFactionId ?? undefined}
                      isOpen={false}
                      color={this.state.engineColor}
                      readOnly
                    />
                  </div>
                </div>
                <div className="human-setup">
                  <div
                    className="setup-row"
                    style={{
                      display: 'flex',
                      alignItems: 'stretch',
                      gap: 6,
                      ['--arcana-w' as any]: '360px',
                    }}
                  >
                    <div className="faction-img flex-fill">
                      {playerImg ? (
                        <>
                          <img src={playerImg} alt="" />
                          <span className="faction-glyph">{playerGreek}</span>
                        </>
                      ) : (
                        <div className="img-placeholder-block" />
                      )}
                    </div>
                    <div
                      className="arcana"
                      style={{ flex: '0 1 var(--arcana-w)' }}
                    >
                      <ArcanaSelect
                        inventory={
                          this.state.playerColor === 'white'
                            ? this.state.whiteArcana
                            : this.state.blackArcana
                        }
                        color={this.state.playerColor}
                        isOpen={false}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="army" style={{ marginTop: 6 }}>
                    <ArmySelect
                      army={
                        this.state.playerColor === 'white'
                          ? this.state.whiteSetup
                          : this.state.blackSetup
                      }
                      faction={this.state.playerFactionId ?? undefined}
                      isOpen={false}
                      color={this.state.playerColor}
                      readOnly
                    />
                  </div>
                </div>

                {/* START */}
                <div style={{ marginTop: 10 }}>
                  <button
                    type="button"
                    className="nav-item start-button"
                    onClick={this.start}
                    disabled={!canStart}
                    aria-disabled={!canStart}
                  >
                    START
                  </button>
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
