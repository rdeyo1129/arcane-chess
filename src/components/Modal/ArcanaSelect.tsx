import React from 'react';
import _ from 'lodash';

import './ArcanaSelect.scss';

import 'src/chessground/styles/normal.scss';

import arcanaJson from 'src/data/arcana.json';

interface ArcanaSelectProps {
  inventory: any;
  color: string;
  isOpen: boolean;
  updateInventory: (inventory: ArcanaDetail[]) => void;
  updateHover: (arcane: ArcanaDetail) => void;
  handleToggle: () => void;
}
interface ArcanaSelectState {
  hoverId: string;
  currentInventorySlot: number;
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
      currentInventorySlot: -1,
    };
  }

  updateSlot = (newValue: ArcanaDetail) => {
    const updatedInventory = [...this.props.inventory];
    updatedInventory[this.state.currentInventorySlot] = newValue;
    this.props.updateInventory(updatedInventory);
    this.props.handleToggle();
    this.props.updateHover(newValue);
    this.setState({
      currentInventorySlot: -1,
      hoverId: '',
    });
  };

  render() {
    return (
      <div className="arcane-select">
        <div className="inventory">
          {this.props.inventory.map((value: any, key: any) => {
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
                onMouseEnter={() => {
                  this.props.updateHover(arcane);
                  this.setState({
                    hoverId: arcane.id,
                    currentInventorySlot: key,
                  });
                }}
                onMouseLeave={() => {
                  this.props.updateHover({} as typeof arcane);
                  if (!this.props.isOpen) {
                    this.setState({
                      hoverId: '',
                      currentInventorySlot: -1,
                    });
                  }
                }}
                onClick={() => {
                  this.props.handleToggle();
                  this.setState({
                    // hoverId: arcane.id,
                    currentInventorySlot: key,
                  });
                }}
              >
                <img
                  key={key}
                  className="arcane"
                  src={`/assets/arcanaImages${arcane.imagePath}.svg`}
                  style={{
                    cursor:
                      "url('/assets/images/cursors/pointer.svg') 12 4, pointer",
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
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
                  className={`arcane ${
                    this.state.hoverId === key ? 'focus' : ''
                  }`}
                  src={`/assets/arcanaImages${arcana[key].imagePath}.svg`}
                  style={{
                    cursor:
                      "url('/assets/images/cursors/pointer.svg') 12 4, pointer",
                  }}
                  onMouseEnter={() => {
                    this.props.updateHover(arcaneObject);
                    this.setState({
                      hoverId: key,
                    });
                  }}
                  onMouseLeave={() => {
                    this.props.updateHover({} as typeof arcaneObject);
                    this.setState({
                      hoverId: '',
                    });
                  }}
                  onClick={() => {
                    this.updateSlot(arcaneObject);
                    // this.setState({
                    //   // hoverId: arcane.id,
                    //   currentInventorySlot: -1,
                    // });
                  }}
                />
              );
            })}
          </div>
        ) : null}
      </div>
    );
  }
}
