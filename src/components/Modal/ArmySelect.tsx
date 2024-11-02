import React from 'react';
// import _ from 'lodash';

import './ArmySelect.scss';

import 'src/chessground/styles/normal.scss';

interface ArmySelectProps {
  // armies: string[];
  color: string;
  updateArmy: (army: string) => void;
}
interface ArmySelectState {
  armySelectOpen: boolean;
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
      armySelectOpen: false,
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
            this.setState({
              armySelectOpen: this.state.armySelectOpen ? false : true,
            });
          }}
        >
          {this.state.army.split('').map((piece, index) => (
            <div
              key={index}
              className={`${piece.toLowerCase()}-piece ${
                this.props.color
              } normal`}
            ></div>
          ))}
        </div>
        {this.state.armySelectOpen ? (
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
                      this.setState({
                        armySelectOpen: false,
                        army: armies[armyIndex],
                      });
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
