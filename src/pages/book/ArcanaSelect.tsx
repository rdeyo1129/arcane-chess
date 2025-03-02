import React from 'react';
import _ from 'lodash';

import Button from 'src/components/Button/Button';

import { setLocalStorage, getLocalStorage } from 'src/utils/handleLocalStorage';

import arcanaJson from 'src/data/arcana.json';

const arcana: ArcanaMap = arcanaJson as ArcanaMap;

interface ArcanaMap {
  [key: string]: ArcanaDetail;
}

interface ArcanaDetail {
  id: string;
  name: string;
  description: string;
  type: string;
  imagePath: string;
}

interface ArcanaSelectProps {
  isPlayerArcana: boolean;
  auth: { user: { id: string; username: string } };
  engineArcana?: { [key: string]: number | string };
  isMission?: boolean;
  updateBookMultiplier: (value: number) => void;
  missionArcana?: { [key: string]: number | string };
  onToggleHover: (hoverArcane: string) => void;
}
interface ArcanaSelectState {
  hoverArcane: string;
  selectedArcana: {
    [key: string]: number;
  };
  allowedArcana: number;
  multiplier: number;
}

export const unlockableArcana = [
  // 1
  {
    sumnP: 1,
    dyadP: 1,
    shftP: 1,
    modsFUT: 2,
    modsSKI: 1,
  },
  // 2
  {
    sumnN: 3,
    sumnU: 3,
    dyadN: 3,
    dyadU: 3,
    modsTRO: 2,
    offrC: 2,
    modsAET: 2,
  },
  // 3
  {
    sumnB: 3,
    sumnZ: 3,
    dyadB: 3,
    dyadZ: 3,
    shftN: 3,
    offrE: 2,
  },
  // 4
  {
    sumnX: 3,
    sumnRE: 4,
    modsIMP: 2,
    modsFUG: 3,
    offrS: 7,
  },
  // 5
  {
    sumnR: 5,
    dyadR: 5,
    dyadK: 7,
    shftR: 4,
    modsORA: 4,
  },
  // 6
  {
    sumnM: 9,
    sumnRM: 6,
    dyadM: 8,
    modsCON: 4,
    sumnRZ: 5,
  },
  // 7
  {
    sumnT: 10,
    sumnRT: 6,
    dyadT: 9,
    shftB: 4,
    sumnRY: 5,
    offrR: 8,
  },
  // 8
  {
    sumnQ: 11,
    sumnRQ: 7,
    dyadQ: 11,
    sumnRA: 6,
    offrM: 8,
  },
  // 9
  {
    offrH: 5,
    sumnH: 6,
    dyadH: 2,
    modsSUS: 4,
    modsINH: 7,
  },
  // 10
  {
    dyadW: 8,
    dyadS: 8,
    dyadA: 8,
    modsREA: 7,
    offrA: 1,
  },
  // 11
  {
    sumnW: 8,
    sumnS: 8,
    modsTEM: 6,
    modsEXT: 7,
  },
  // 12
  {
    sumnV: 14,
    sumnRV: 13,
    dyadV: 14,
    modsGLI: 9,
    modsGLU: 9,
  },
];

export const allowedArcanaPerChapter = [0, 2, 2, 2, 4, 4, 4, 6, 6, 6, 8, 8, 8];

export default class ArcanaSelect extends React.Component<
  ArcanaSelectProps,
  ArcanaSelectState
> {
  constructor(props: ArcanaSelectProps) {
    super(props);
    const currLS = getLocalStorage(this.props.auth.user.username);
    this.state = {
      hoverArcane: '',
      selectedArcana: currLS.arcana || {},
      allowedArcana: allowedArcanaPerChapter[currLS.chapter],
      multiplier: currLS.config.multiplier,
    };
  }

  componentDidUpdate(prevProps: ArcanaSelectProps) {
    if (
      prevProps.auth.user.username !== this.props.auth.user.username ||
      prevProps.missionArcana !== this.props.missionArcana
    ) {
      const currLS = getLocalStorage(this.props.auth.user.username);
      this.setState({
        selectedArcana: currLS.arcana || {},
        allowedArcana: allowedArcanaPerChapter[currLS.chapter],
        multiplier: currLS.config.multiplier,
      });
    }
  }

  availableChapterArcana = () => {
    const chapter = getLocalStorage(this.props.auth.user.username).chapter;
    const unlockedArcana = unlockableArcana
      .slice(0, chapter)
      .reduce((acc, current) => {
        return { ...acc, ...current };
      }, {});
    return unlockedArcana;
  };

  handleMultiplierChange = (value: number) => {
    this.setState({
      multiplier: this.state.multiplier + value,
    });
    this.props.updateBookMultiplier(value);
  };

  handleArcanaClick = (key: string, value: number) => {
    const { selectedArcana, allowedArcana } = this.state;
    const { auth } = this.props;
    const newSelectedArcana = { ...selectedArcana };
    const totalArcanaValue = Object.values(newSelectedArcana).reduce(
      (sum, count) => sum + count,
      0
    );

    if (arcana[key].type === 'inherent' && selectedArcana[key]) return;
    if (totalArcanaValue >= allowedArcana) return;

    newSelectedArcana[key] = (newSelectedArcana[key] || 0) + 1;

    this.handleMultiplierChange(-value);

    this.setState({
      selectedArcana: newSelectedArcana,
    });

    setLocalStorage({
      ...getLocalStorage(auth.user.username),
      arcana: newSelectedArcana,
    });
  };

  handleClearArcana = () => {
    const { selectedArcana } = this.state;
    const { auth, missionArcana } = this.props;
    const arcanaObj: Record<string, number> =
      (Object.keys(missionArcana || {}).length !== 0
        ? missionArcana
        : this.availableChapterArcana()) || {};
    let multiplierAddBack = 0;
    Object.keys(selectedArcana).forEach((key) => {
      if (arcanaObj[key] !== undefined) {
        multiplierAddBack += arcanaObj[key] * selectedArcana[key];
      }
    });
    this.setState({
      selectedArcana: {},
      multiplier: this.state.multiplier + multiplierAddBack,
    });
    this.props.updateBookMultiplier(multiplierAddBack);
    setLocalStorage({
      ...getLocalStorage(auth.user.username),
      arcana: {},
    });
  };

  calculateArcanaScore = (LS: any) => {
    if (!unlockableArcana || !Array.isArray(unlockableArcana)) {
      console.error('unlockableArcana is undefined or not an array.');
      return 0;
    }

    const getTotalScore = (arcanaSet: any) => {
      let total = 0;

      unlockableArcana.forEach((arcanaData, index) => {
        if (!arcanaData || typeof arcanaData !== 'object') {
          console.warn(
            `Skipping invalid arcana set at index ${index}`,
            arcanaData
          );
          return;
        }

        Object.entries(arcanaData).forEach(([arcana, value]) => {
          if (arcanaSet && arcanaSet[arcana]) {
            total += arcanaSet[arcana] * value;
          }
        });
      });

      return total;
    };

    const totalLSArcanaScore = getTotalScore(LS?.arcana);
    const totalEngineArcanaScore = getTotalScore(this.props.engineArcana);

    return LS?.config?.color === 'white'
      ? totalLSArcanaScore - totalEngineArcanaScore
      : totalEngineArcanaScore - totalLSArcanaScore;
  };

  render() {
    const { auth, isPlayerArcana, isMission, missionArcana } = this.props;
    const { hoverArcane, selectedArcana } = this.state;
    const LS = getLocalStorage(auth.user.username);

    const arcanaObj =
      Object.keys(missionArcana || {}).length !== 0
        ? missionArcana
        : this.availableChapterArcana();
    const hasMissionArcana = Object.keys(missionArcana || {}).length !== 0;

    if (!isMission) return null;

    return (
      <div
        style={{
          height: '240px',
          width: '200px',
        }}
      >
        {isPlayerArcana && (
          <div className="arcana-picker-wrapper">
            <Button
              color="S"
              width={200}
              text="CLEAR ARCANA"
              className="tertiary"
              onClick={() => this.handleClearArcana()}
            />
            <div className="arcana-picker">
              {_.map(arcanaObj, (value: number, key: string) => {
                const isSelected = _.includes(Object.keys(selectedArcana), key);
                const isDisabled = !isPlayerArcana || hasMissionArcana;
                return (
                  <div
                    key={key}
                    style={{
                      position: 'relative',
                      display: 'inline-block',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                      }}
                    >
                      {arcana[key].type === 'inherent'
                        ? 'INH'
                        : hasMissionArcana
                        ? missionArcana && missionArcana[key]
                        : missionArcana && missionArcana[key]
                        ? 'INH'
                        : LS.arcana[key]}
                    </div>
                    <img
                      key={key}
                      className="arcane"
                      src={`${arcana[key].imagePath}${
                        hoverArcane === `${key}` ? '-hover' : ''
                      }.svg`}
                      style={{
                        opacity: isDisabled || isSelected ? 1 : 0.5,
                        cursor: isDisabled
                          ? 'not-allowed'
                          : 'url(/assets/images/cursors/pointer.svg) 12 4, pointer',
                      }}
                      onClick={() => {
                        if (isDisabled) return;
                        this.handleArcanaClick(key, value);
                      }}
                      onMouseEnter={() => this.props.onToggleHover(`${key}`)}
                      onMouseLeave={() => this.props.onToggleHover('')}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {!isPlayerArcana && (
          <div className="arcana-picker-wrapper">
            <div className="arcana-picker">
              {_.map(this.props.engineArcana, (value: number, key: string) => (
                <div
                  key={key}
                  style={{
                    position: 'relative',
                    display: 'inline-block',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                    }}
                  >
                    {arcana[key].type === 'inherent' ? 'INH' : value}
                  </div>
                  <img
                    className="arcane"
                    src={`${arcana[key].imagePath}.svg`}
                    style={{
                      opacity: 0.5,
                      cursor: 'not-allowed',
                    }}
                    onMouseEnter={() => this.props.onToggleHover(`${key}`)}
                    onMouseLeave={() => this.props.onToggleHover('')}
                  />
                </div>
              ))}
            </div>
            <div
              style={{
                height: '40px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              Imbalance Score: {this.calculateArcanaScore(LS)}
            </div>
          </div>
        )}
      </div>
    );
  }
}
