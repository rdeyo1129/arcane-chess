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
    this.state = {
      hoverArcane: '',
      selectedArcana: {
        ...getLocalStorage(this.props.auth.user.username).arcana,
      },
      allowedArcana:
        allowedArcanaPerChapter[
          getLocalStorage(this.props.auth.user.username).chapter
        ],
      multiplier: getLocalStorage(this.props.auth.user.username).config
        .multiplier,
    };
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

  toggleHover = (arcane: string) => {
    this.setState({ hoverArcane: arcane });
  };

  handleMultiplierChange = (value: number) => {
    this.setState({
      multiplier: this.state.multiplier + value,
    });
    this.props.updateBookMultiplier(value);
  };

  render() {
    const arcanaObj =
      this.props.missionArcana?.length === 0
        ? this.props.missionArcana
        : this.availableChapterArcana();
    const hasMissionArcana =
      this.props.missionArcana?.length === 0 ? true : false;
    if (!this.props.isMission) return null;
    return (
      <>
        {this.props.isPlayerArcana &&
          _.map(arcanaObj, (value: number, key: string) => {
            return (
              <img
                key={key}
                className="arcane"
                src={`${arcana[key].imagePath}${
                  this.state.hoverArcane === `${key}` ? '-hover' : ''
                }.svg`}
                style={{
                  opacity: !this.props.isPlayerArcana
                    ? 0.5
                    : _.includes(Object.keys(this.state.selectedArcana), key) ||
                      hasMissionArcana
                    ? 1
                    : 0.5,
                  cursor:
                    !this.props.isPlayerArcana || hasMissionArcana
                      ? 'not-allowed'
                      : 'url(/assets/images/cursors/pointer.svg) 12 4, pointer',
                }}
                onClick={() => {
                  if (!this.props.isPlayerArcana || hasMissionArcana) return;
                  if (_.includes(Object.keys(this.state.selectedArcana), key)) {
                    const newSelectedArcana = _.omit(
                      this.state.selectedArcana,
                      key
                    );
                    this.setState({
                      selectedArcana: newSelectedArcana,
                    });
                    setLocalStorage({
                      ...getLocalStorage(this.props.auth.user.username),
                      arcana: newSelectedArcana,
                    });
                    this.handleMultiplierChange(value);
                  } else if (
                    Object.keys(this.state.selectedArcana).length <
                    this.state.allowedArcana
                  ) {
                    this.setState({
                      selectedArcana: {
                        ...this.state.selectedArcana,
                        [key]: value,
                      },
                    });
                    setLocalStorage({
                      ...getLocalStorage(this.props.auth.user.username),
                      arcana: {
                        ...this.state.selectedArcana,
                        [key]: 1,
                      },
                    });
                    this.handleMultiplierChange(-value);
                  }
                }}
                onMouseEnter={() => this.toggleHover(`${key}`)}
                onMouseLeave={() => this.toggleHover('')}
              />
            );
          })}
        {!this.props.isPlayerArcana &&
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
              />
            );
          })}
      </>
    );
  }
}
