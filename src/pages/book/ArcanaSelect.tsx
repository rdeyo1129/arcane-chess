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
    sumnP: 2,
    dyadP: 1,
    shftP: 1,
    modsFUT: 2,
    modsSKI: 1,
  },
  // 2
  {
    sumnN: 4,
    sumnU: 4,
    dyadN: 3,
    dyadU: 3,
    modsTRO: 2,
    offrC: 2,
  },
  // 3
  {
    sumnB: 4,
    sumnZ: 4,
    dyadB: 3,
    dyadZ: 3,
    shftN: 3,
  },
  // 4
  {
    sumnX: 5,
    sumnRE: 4,
    modsIMP: 2,
    modsFUG: 3,
    offrS: 4,
  },
  // 5
  {
    sumnR: 6,
    dyadR: 5,
    dyadK: 7,
    shftR: 4,
    modsORA: 4,
  },
  // 6
  {
    sumnM: 10,
    sumnRM: 6,
    dyadM: 8,
    modsCON: 4,
    sumnRZ: 5,
  },
  // 7
  {
    sumnT: 11,
    sumnRT: 6,
    dyadT: 9,
    shftB: 4,
    sumnRY: 5,
    offrR: 3,
  },
  // 8
  {
    sumnQ: 12,
    sumnRQ: 7,
    dyadQ: 11,
    sumnRA: 6,
    offrM: 4,
    // modsTEL: 5, won't use
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
    offrA: 5,
  },
  // 11
  {
    sumnW: 9,
    sumnS: 9,
    modsTEM: 6,
    modsEXT: 7,
  },
  // 12
  {
    sumnV: 15,
    sumnRV: 13,
    dyadV: 14,
    modsGLI: 9,
  },
];

export const allowedArcanaPerChapter = [2, 2, 2, 2, 4, 4, 4, 4, 6, 6, 6, 6];

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
    let newSelectedArcana = { ...selectedArcana };

    if (_.includes(Object.keys(selectedArcana), key)) {
      newSelectedArcana = _.omit(selectedArcana, key);
      this.handleMultiplierChange(value);
    } else if (Object.keys(selectedArcana).length < allowedArcana) {
      newSelectedArcana[key] = 1;
      this.handleMultiplierChange(-value);
    }

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
        multiplierAddBack += arcanaObj[key];
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

  render() {
    const { isPlayerArcana, isMission, missionArcana } = this.props;
    const { hoverArcane, selectedArcana } = this.state;

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
              color="B"
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
                );
              })}
            </div>
          </div>
        )}
        {!isPlayerArcana && (
          <div className="arcana-picker-wrapper">
            <div className="arcana-picker">
              {_.map(this.props.engineArcana, (_value: number, key: string) => {
                return (
                  <img
                    key={key}
                    className="arcane"
                    src={`${arcana[key].imagePath}.svg`}
                    style={{
                      opacity: 0.5,
                      cursor: 'not-allowed',
                    }}
                    onMouseEnter={() => this.props.onToggleHover(`${key}`)}
                    onMouseLeave={() => this.props.onToggleHover('')}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
}
