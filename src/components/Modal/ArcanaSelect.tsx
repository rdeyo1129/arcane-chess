import React from 'react';
import _ from 'lodash';

import './ArcanaSelect.scss';

import 'src/chessground/styles/normal.scss';

import arcanaJson from 'src/data/arcana.json';

interface ArcanaSelectProps {
  color: string;
  isOpen: boolean;
  updateInventory: (inventory: ArcanaDetail | Record<string, any>) => void;
  updateHover: (arcane: ArcanaDetail) => void;
  handleToggle: () => void;
}
interface ArcanaSelectState {
  hoverId: string;
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
      hoverId: '',
      army: 'RNBQKBNR',
      currentInventorySlot: -1,
      inventory: [
        {
          id: 'empty',
          name: '',
          description: 'No arcane selected here. Click to choose one!',
          type: '',
          imagePath: '/assets/arcanaImages/empty',
        },
        {
          id: 'empty',
          name: '',
          description: 'No arcane selected here. Click to choose one!',
          type: '',
          imagePath: '/assets/arcanaImages/empty',
        },
        {
          id: 'empty',
          name: '',
          description: 'No arcane selected here. Click to choose one!',
          type: '',
          imagePath: '/assets/arcanaImages/empty',
        },
        {
          id: 'empty',
          name: '',
          description: 'No arcane selected here. Click to choose one!',
          type: '',
          imagePath: '/assets/arcanaImages/empty',
        },
        {
          id: 'empty',
          name: '',
          description: 'No arcane selected here. Click to choose one!',
          type: '',
          imagePath: '/assets/arcanaImages/empty',
        },
        {
          id: 'empty',
          name: '',
          description: 'No arcane selected here. Click to choose one!',
          type: '',
          imagePath: '/assets/arcanaImages/empty',
        },
      ],
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
          if (item.id && item.id !== 'empty') objectToPassToConfig[item.id] = 2;
        });

        return {
          inventory: updatedInventory,
          currentInventorySlot: -1,
          hoverId: '',
        };
      },
      () => {
        this.props.updateInventory(objectToPassToConfig);
        this.props.handleToggle();
      }
    );
  };

  toggleHover = (arcaneObject: ArcanaDetail) => {
    this.setState({ hoverId: arcaneObject.id });
    this.props.updateHover(arcaneObject);
  };

  render() {
    return (
      <div className="arcane-select">
        <div className="inventory">
          {this.state.inventory.map((value, key) => {
            const arcane = value as ArcanaDetail;
            return (
              <div
                key={key}
                className="arcane-wrapper"
                style={
                  key === this.state.currentInventorySlot
                    ? {
                        display: 'inline-block',
                        borderRadius: '50%',
                        border: '2px solid white',
                        width: '60px',
                        height: '60px',
                        overflow: 'hidden',
                      }
                    : {}
                }
              >
                <img
                  key={key}
                  className="arcane"
                  src={`${arcana[arcane.id].imagePath}.svg`}
                  style={{
                    cursor:
                      "url('/assets/images/cursors/pointer.svg') 12 4, pointer",
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  onClick={() => {
                    this.setState(
                      {
                        currentInventorySlot: key,
                      },
                      () => {
                        this.props.handleToggle();
                      }
                    );
                  }}
                  onMouseEnter={() =>
                    this.setState(
                      {
                        hoverId: arcane.id,
                        currentInventorySlot: key,
                      },
                      () => {
                        this.toggleHover(arcane);
                      }
                    )
                  }
                  onMouseLeave={() => {
                    if (!this.props.isOpen)
                      this.setState(
                        {
                          hoverId: '',
                          currentInventorySlot: -1,
                        },
                        () => {
                          this.toggleHover({} as ArcanaDetail);
                        }
                      );
                  }}
                />
              </div>
            );
          })}
        </div>
        {this.props.isOpen ? (
          <div className="arcana-block">
            {_.map(arcana, (arcaneObject: ArcanaDetail, key: string) => {
              return (
                <img
                  key={key}
                  className="arcane"
                  src={`${arcana[key].imagePath}${
                    this.state.hoverId === `${key}` ? '-hover' : ''
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
                  onMouseEnter={() => this.toggleHover(arcaneObject)}
                  onMouseLeave={() => this.toggleHover({} as ArcanaDetail)}
                />
              );
            })}
          </div>
        ) : null}
      </div>
    );
  }
}
