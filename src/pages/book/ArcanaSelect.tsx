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
    modsFUT: 1,
  },
  // 2
  {
    sumnN: 1,
    sumnU: 1,
    dyadN: 1,
    dyadU: 1,
  },
  // 3
  {
    sumnB: 1,
    sumnZ: 1,
    dyadB: 1,
    dyadZ: 1,
    shftN: 1,
  },
  // 4
  {
    sumnX: 1,
    sumnRE: 1,
    modsIMP: 1,
    modsFUG: 1,
  },
  // 5
  {
    sumnR: 1,
    dyadR: 1,
    dyadK: 1,
    shftR: 1,
    modsORA: 1,
  },
  // 6
  {
    sumnM: 1,
    sumnRM: 1,
    dyadM: 1,
    modsCON: 1,
  },
  // 7
  {
    sumnT: 1,
    sumnRT: 1,
    dyadT: 1,
    shftB: 1,
  },
  // 8
  {
    sumnQ: 1,
    sumnRQ: 1,
    dyadQ: 1,
    modsTEL: 1,
  },
  // 9
  {
    sumnH: 1,
    dyadH: 1,
    modsSUS: 1,
    modsINH: 1,
  },
  // 10
  {
    dyadW: 1,
    dyadS: 1,
    modsTEM: 1,
  },
  // 11
  {
    sumnW: 1,
    sumnS: 1,
    dyadA: 1,
  },
  // 12
  {
    sumnV: 1,
    sumnRV: 1,
    dyadV: 1,
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
    if (!this.props.isMission) return null;
    return (
      <>
        {this.props.isPlayerArcana &&
          _.map(this.availableChapterArcana(), (value: number, key: string) => {
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
                    : _.includes(Object.keys(this.state.selectedArcana), key)
                    ? 1
                    : 0.5,
                  cursor: !this.props.isPlayerArcana
                    ? 'not-allowed'
                    : 'url(/assets/images/cursors/pointer.svg) 12 4, pointer',
                }}
                onClick={() => {
                  if (!this.props.isPlayerArcana) return;
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
