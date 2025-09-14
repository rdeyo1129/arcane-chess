import React from 'react';
import _ from 'lodash';

import './ArcanaSelect.scss';
import 'src/chessground/styles/normal.scss';

import arcanaJson from 'src/data/arcana.json';

interface ArcanaDetail {
  id: string;
  name: string;
  description: string;
  type: string;
  imagePath: string;
}

interface ArcanaSelectProps {
  inventory: ArcanaDetail[];
  color: string;
  isOpen: boolean;
  updateInventory?: (inventory: ArcanaDetail[]) => void;
  updateHover?: (arcane: ArcanaDetail) => void;
  handleToggle?: () => void;
}

interface ArcanaSelectState {
  hoverId: string;
  currentInventorySlot: number;
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
    const { inventory, updateInventory, handleToggle, updateHover } =
      this.props;
    const { currentInventorySlot } = this.state;

    const updatedInventory = [...inventory];
    updatedInventory[currentInventorySlot] = newValue;

    updateInventory?.(updatedInventory);
    handleToggle?.();
    updateHover?.(newValue);

    this.setState({
      currentInventorySlot: -1,
      hoverId: '',
    });
  };

  render() {
    const { inventory, isOpen, updateHover, handleToggle } = this.props;
    const { hoverId, currentInventorySlot } = this.state;

    return (
      <div className="arcane-select">
        <div className="inventory">
          {inventory.map((arcane, key) => (
            <div
              key={key}
              className="arcane-wrapper"
              style={
                key === currentInventorySlot
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
                updateHover?.(arcane);
                this.setState({
                  hoverId: arcane.id,
                  currentInventorySlot: key,
                });
              }}
              onMouseLeave={() => {
                updateHover?.({} as ArcanaDetail);
                if (!isOpen) {
                  this.setState({
                    hoverId: '',
                    currentInventorySlot: -1,
                  });
                }
              }}
              onClick={() => {
                handleToggle?.();
                this.setState({
                  currentInventorySlot: key,
                });
              }}
            >
              <img
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
          ))}
        </div>

        {isOpen && (
          <div className="arcana-block">
            {_.map(arcana, (arcaneObject: ArcanaDetail, key: string) => (
              <img
                key={key}
                className={`arcane ${hoverId === key ? 'focus' : ''}`}
                src={`/assets/arcanaImages${arcana[key].imagePath}.svg`}
                style={{
                  cursor:
                    "url('/assets/images/cursors/pointer.svg') 12 4, pointer",
                }}
                onMouseEnter={() => {
                  updateHover?.(arcaneObject);
                  this.setState({ hoverId: key });
                }}
                onMouseLeave={() => {
                  updateHover?.({} as ArcanaDetail);
                  this.setState({ hoverId: '' });
                }}
                onClick={() => this.updateSlot(arcaneObject)}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
}
