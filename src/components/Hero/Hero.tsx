import React from 'react';

import './Hero.scss';

import 'src/chessground/styles/normal.scss';
import 'src/chessground/styles/chi.scss';
import 'src/chessground/styles/mu.scss';
import 'src/chessground/styles/nu.scss';
import 'src/chessground/styles/sigma.scss';
import 'src/chessground/styles/omega.scss';
import 'src/chessground/styles/lambda.scss';

export default class Hero extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // figure out seeds?

  getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  randomizeHelper = (
    getAppears
  ): { piece: string; color: string; faction: string } | null => {
    if (getAppears && Math.random() < 0.6) {
      return null;
    }

    const color = ['white', 'black'];
    const piece = [
      'p-piece',
      's-piece',
      'h-piece',
      'n-piece',
      'b-piece',
      'r-piece',
      'q-piece',
      'k-piece',
      't-piece',
      'm-piece',
      'u-piece',
      'z-piece',
      'v-piece',
      'e-piece',
    ];
    const faction = ['normal', 'chi', 'mu', 'nu', 'sigma', 'omega', 'lambda'];

    return {
      piece: piece[this.getRandomNumber(0, 13)],
      color: color[this.getRandomNumber(0, 1)],
      faction: faction[this.getRandomNumber(0, 6)],
    };
  };

  getRandomPiece = () =>
    this.randomizeHelper(true) ? (
      // <div>
      <div
        className={`
              ${this.randomizeHelper(false).piece || ''} 
              ${this.randomizeHelper(false).color} 
              ${this.randomizeHelper(false).faction}
            `}
        style={{
          position: 'relative',
          width: '40px',
          height: '40px',
          transform: 'scale(1.5)',
          top: '9px',
          left: '9px',
        }}
      />
    ) : // </div>
    null;

  shouldComponentUpdate() {
    return false; // Prevents the component from re-rendering
  }

  render() {
    return (
      <div className="hero">
        <div className="hero-curtain"></div>
        <div className="hero-grid">
          {[...Array(10).keys()].map((x) => {
            return [...Array(15).keys()].map((y) => {
              return x % 2 === 0 ? (
                y % 2 === 0 ? (
                  <div key={y} className="hero-square light">
                    {this.getRandomPiece()}
                  </div>
                ) : (
                  <div key={y} className="hero-square dark">
                    {this.getRandomPiece()}
                  </div>
                )
              ) : y % 2 === 1 ? (
                <div key={y} className="hero-square light">
                  {this.getRandomPiece()}
                </div>
              ) : (
                <div key={y} className="hero-square dark">
                  {this.getRandomPiece()}
                </div>
              );
            });
          })}
        </div>
      </div>
    );
  }
}
