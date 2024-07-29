import React from 'react';
import _ from 'lodash';

import { setLocalStorage, getLocalStorage } from 'src/utils/handleLocalStorage';

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
    // dyadP: 1,
    shftP: 1,
    modsFUT: 2,
  },
  // 2
  {
    sumnN: 4,
    sumnU: 4,
    // dyadN: 3,
    // dyadU: 3,
  },
  // 3
  {
    sumnB: 4,
    sumnZ: 4,
    // dyadB: 3,
    // dyadZ: 3,
    shftN: 3,
  },
  // 4
  {
    sumnX: 5,
    sumnRE: 4,
    modsIMP: 2,
    modsFUG: 3,
  },
  // 5
  {
    sumnR: 6,
    // dyadR: 5,
    // dyadK: 7,
    shftR: 4,
    modsORA: 4,
  },
  // 6
  {
    sumnM: 10,
    sumnRM: 6,
    // dyadM: 8,
    modsCON: 4,
  },
  // 7
  {
    sumnT: 11,
    sumnRT: 6,
    // dyadT: 9,
    shftB: 4,
  },
  // 8
  {
    sumnQ: 12,
    sumnRQ: 7,
    // dyadQ: 11,
    // modsTEL: 5,
  },
  // 9
  {
    sumnH: 3,
    // dyadH: 2,
    modsSUS: 4,
    modsINH: 7,
  },
  // 10
  {
    dyadW: 8,
    dyadS: 8,
    modsTEM: 6,
  },
  // 11
  {
    sumnW: 9,
    // sumnS: 9
    // dyadA: 8,
  },
  // 12
  {
    sumnV: 15,
    sumnRV: 13,
    // dyadV: 14,
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
      newSelectedArcana[key] = value;
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
      <>
        {isPlayerArcana &&
          _.map(arcanaObj, (value: number, key: string) => {
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
        {!isPlayerArcana &&
          _.map(this.props.engineArcana, (_value: number, key: string) => {
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
      </>
    );
  }
}
