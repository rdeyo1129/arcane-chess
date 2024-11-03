import React from 'react';
// import _ from 'lodash';

import './ArmySelect.scss';

import 'src/chessground/styles/normal.scss';

interface ArmySelectProps {
  army: string;
  isOpen: boolean;
  color: string;
  updateArmy: (army: string) => void;
  handleToggle: () => void;
}
interface ArmySelectState {
  hoverArmy: number;
  army: string;
}

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
    const armies = [
      'RNWMKWNR',
      'RNSMKSNR',
      'RZWMKWZR',
      'RZSMKSZR',
      'RUWMKWUR',
      'RUSMKSUR',
      //
      'RNBQKBNR',
      'RNBTKBNR',
      'RZBQKBZR',
      'RZBTKBZR',
      'RUBQKBUR',
      'RUBTKBUR',
      //
      'RSMVKQSR',
      'RSMVKTSR',
      'RWMVKQWR',
      'RWMVKTWR',
      //
      'RNBVKBNR',
      'ZNUVKUNZ',
      'RSWVKWSR',
      'TMQVKQMT',
    ];
    return (
      <div className="army-select">
        <div
          className={`army ${this.state.hoverArmy === -1 ? 'hover-army' : ''}`}
          onMouseEnter={() => {
            this.setState({
              hoverArmy: -1,
            });
          }}
          onMouseLeave={() => {
            this.setState({
              hoverArmy: -2,
            });
          }}
          onClick={() => {
            this.props.handleToggle();
          }}
        >
          {this.props.army.split('').map((piece, index) => (
            <div
              key={index}
              className={`${piece.toLowerCase()}-piece ${
                this.props.color
              } normal`}
            ></div>
          ))}
        </div>
        {this.props.isOpen ? (
          <div className="army-block">
            {armies.map((army, armyIndex) => (
              <div
                key={armyIndex}
                className={`army-item ${
                  this.state.hoverArmy === armyIndex ? 'hover-army' : ''
                }`}
                onMouseEnter={() => {
                  this.setState({
                    hoverArmy: armyIndex,
                  });
                }}
                onMouseLeave={() => {
                  this.setState({
                    hoverArmy: -2,
                  });
                }}
              >
                {army.split('').map((piece, pieceIndex) => (
                  <div
                    key={pieceIndex}
                    className={`${piece.toLowerCase()}-piece ${
                      this.props.color
                    } normal ${
                      this.state.hoverArmy === armyIndex ? 'hover-army' : ''
                    }`}
                    onClick={() => {
                      this.props.updateArmy(
                        this.props.color === 'white'
                          ? armies[armyIndex]
                          : armies[armyIndex].toLowerCase()
                      );
                      this.setState(
                        {
                          army: armies[armyIndex],
                        },
                        () => {
                          this.props.handleToggle();
                        }
                      );
                    }}
                  ></div>
                ))}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  }
}
