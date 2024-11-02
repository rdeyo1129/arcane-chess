import React from 'react';
import _ from 'lodash';

import './ArcanaSelect.scss';

import 'src/chessground/styles/normal.scss';

import arcanaJson from 'src/data/arcana.json';

interface ArcanaSelectProps {
  color: string;
  updateInventory: (inventory: ArcanaDetail | Record<string, any>) => void;
}
interface ArcanaSelectState {
  arcanaSelectOpen: boolean;
  hoverArcane: string;
  army: string;
  currentInventorySlot: number;
  inventory: (ArcanaDetail | Record<string, any>)[];
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

export default class ArcanaSelect extends React.Component<
  ArcanaSelectProps,
  ArcanaSelectState
> {
  constructor(props: ArcanaSelectProps) {
    super(props);
    this.state = {
      arcanaSelectOpen: false,
      hoverArcane: '',
      army: 'RNBQKBNR',
      currentInventorySlot: -1,
      inventory: [{}, {}, {}, {}, {}, {}],
    };
  }

  updateSlot = (
    slotNum: number,
    newValue: ArcanaDetail | Record<string, any>
  ) => {
    const objectToPassToConfig: ArcanaDetail | Record<string, any> = {};
    this.setState(
      (prevState) => {
        const updatedInventory = [...prevState.inventory];
        updatedInventory[slotNum] = newValue;

        _.forEach(updatedInventory, (item) => {
          if (item.id) objectToPassToConfig[item.id] = 2;
        });

        return {
          inventory: updatedInventory,
          currentInventorySlot: -1,
          arcanaSelectOpen: false,
        };
      },
      () => {
        this.props.updateInventory(objectToPassToConfig);
      }
    );
  };

  toggleHover = (arcane: string) => {
    this.setState({ hoverArcane: arcane });
  };

  render() {
    return (
      <div className="arcane-select">
        <div className="inventory">
          {this.state.inventory.map((value, key) => {
            const arcane = value as ArcanaDetail;
            return (
              <img
                key={key}
                className="arcane"
                src={`${arcane.imagePath || '/assets/arcanaImages/empty'}${
                  this.state.hoverArcane === `${key}` ? '-hover' : ''
                }.svg`}
                style={{
                  cursor:
                    "url('/assets/images/cursors/pointer.svg') 12 4, pointer",
                }}
                onClick={() => {
                  this.setState({
                    currentInventorySlot: key,
                    arcanaSelectOpen: this.state.arcanaSelectOpen
                      ? false
                      : true,
                  });
                }}
                onMouseEnter={() => this.toggleHover(`${key}`)}
                onMouseLeave={() => this.toggleHover('')}
              />
            );
          })}
        </div>
        {this.state.arcanaSelectOpen ? (
          <div className="arcane-block">
            {_.map(arcana, (arcaneObject: ArcanaDetail, key: string) => {
              return (
                <img
                  key={key}
                  className="arcane"
                  src={`${arcana[key].imagePath}${
                    this.state.hoverArcane === `${key}` ? '-hover' : ''
                  }.svg`}
                  style={{
                    cursor:
                      "url('/assets/images/cursors/pointer.svg') 12 4, pointer",
                  }}
                  onClick={() => {
                    this.updateSlot(
                      this.state.currentInventorySlot,
                      arcaneObject
                    );
                  }}
                  onMouseEnter={() => this.toggleHover(`${key}`)}
                  onMouseLeave={() => this.toggleHover('')}
                />
              );
            })}
          </div>
        ) : null}
      </div>
    );
  }
}
