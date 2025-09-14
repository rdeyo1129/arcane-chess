import React from 'react';
import './ArmySelect.scss';
import 'src/chessground/styles/normal.scss';

interface ArmySelectProps {
  army: string;
  isOpen: boolean;
  color: string;
  updateArmy?: (army: string) => void;
  handleToggle?: () => void;
  updateHover?: (id: string) => void;
}

interface ArmySelectState {
  hoverArmy: number;
  army: string;
}

export const armies = [
  'RNBQKBNR',
  'RNBTKBNR',
  'RNBMKBNR',
  'RNBVKBNR',
  'RSBQKBSR',
  'RSBTKBSR',
  'RSBMKBSR',
  'RSBVKBSR',
  'RNWQKWNR',
  'RNWTKWNR',
  'RNWMKWNR',
  'RNWVKWNR',
  'RSWQKWSR',
  'RSWTKWSR',
  'RSWMKWSR',
  'RSWVKWSR',
  'TMQVKQMT',
];

export default class ArmySelect extends React.Component<
  ArmySelectProps,
  ArmySelectState
> {
  constructor(props: ArmySelectProps) {
    super(props);
    this.state = {
      hoverArmy: 0,
      army: 'RNWMKWNR',
    };
  }

  render() {
    const { army, isOpen, color, updateArmy, handleToggle, updateHover } =
      this.props;

    return (
      <div className="army-select">
        <div
          className={`army ${this.state.hoverArmy === -1 ? 'hover-army' : ''}`}
          onMouseEnter={() => {
            this.setState({ hoverArmy: -1 });
            updateHover?.('army');
          }}
          onMouseLeave={() => {
            this.setState({ hoverArmy: -2 });
            updateHover?.('');
          }}
          onClick={() => handleToggle?.()}
        >
          {army.split('').map((piece, index) => (
            <div
              key={index}
              className={`${piece.toLowerCase()}-piece ${color} normal`}
            />
          ))}
        </div>

        {isOpen && (
          <div className="army-block">
            {armies.map((armyCode, armyIndex) => (
              <div
                key={armyIndex}
                className={`army-item ${
                  this.state.hoverArmy === armyIndex ? 'hover-army' : ''
                }`}
                onMouseEnter={() => {
                  this.setState({ hoverArmy: armyIndex });
                  updateHover?.('army');
                }}
                onMouseLeave={() => {
                  this.setState({ hoverArmy: -2 });
                  updateHover?.('');
                }}
              >
                {armyCode.split('').map((piece, pieceIndex) => (
                  <div
                    key={pieceIndex}
                    className={`${piece.toLowerCase()}-piece ${color} normal ${
                      this.state.hoverArmy === armyIndex ? 'hover-army' : ''
                    }`}
                    onClick={() => {
                      updateArmy?.(
                        color === 'white'
                          ? armies[armyIndex]
                          : armies[armyIndex].toLowerCase()
                      );
                      this.setState(
                        { army: armies[armyIndex] },
                        () => handleToggle?.()
                      );
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}
