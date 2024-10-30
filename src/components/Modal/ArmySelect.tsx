import React from 'react';
// import _ from 'lodash';

import './ArmySelect.scss';

import 'src/chessground/styles/normal.scss';

interface ArmySelectProps {
  // armies: string[];
  // color: string;
}
interface ArmySelectState {
  armySelectOpen: boolean;
  hoverArmy: number;
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
      'RZBQKBNR',
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
    const army = 'RNBQKBNR';
    const color = 'white';
    return (
      <div className="army-select">
        <div className="army">
          {army.split('').map((piece, index) => (
            <div
              key={index}
              className={`${piece.toLowerCase()}-piece ${color} normal`}
              onClick={() => {
                this.setState({
                  armySelectOpen: this.state.armySelectOpen ? false : true,
                });
              }}
            ></div>
          ))}
        </div>
        {this.state.armySelectOpen ? (
          <div className="army-block">
            {armies.map((army, armyIndex) => (
              <div
                key={armyIndex}
                className="army-item"
                onMouseEnter={() => {
                  this.setState({
                    hoverArmy: armyIndex,
                  });
                }}
              >
                {army.split('').map((piece, pieceIndex) => (
                  <div
                    key={pieceIndex}
                    className={`${piece.toLowerCase()}-piece ${color} normal`}
                    onClick={() => {
                      this.setState({
                        armySelectOpen: false,
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

/*
<div
        className={`
              ${piece} 
              ${this.randomizeHelper(false)?.color}
              ${this.randomizeHelper(false)?.faction}
            `}
        style={{
          position: 'relative',
          width: piece === 'x-piece' ? '100px' : '40px',
          height: piece === 'x-piece' ? '100px' : '40px',
          transform: piece === 'x-piece' ? 'scale(.5)' : 'scale(1.5)',
          top: piece === 'x-piece' ? '-20px' : '9px',
          left: piece === 'x-piece' ? '-20px' : '9px',
        }}
      />
*/
