import React from 'react';

import './hero.scss';

import 'src/chessground/styles/normal.scss';
import 'src/chessground/styles/chi.scss';
import 'src/chessground/styles/mu.scss';
import 'src/chessground/styles/nu.scss';
import 'src/chessground/styles/sigma.scss';
import 'src/chessground/styles/omega.scss';
import 'src/chessground/styles/lambda.scss';

import arcanaJson from 'src/data/arcana.json';

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

export default class Hero extends React.Component {
  constructor(props: object) {
    super(props);
    this.state = {};
  }

  // Helper to get a random integer between min and max, inclusive.
  getRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  // Returns the JSX for a random chess piece.
  // This method now uses a single random selection instead of multiple calls.
  getRandomPiece = () => {
    const colors = ['white', 'black'];
    const pieces = [
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
      'w-piece',
      // 'x-piece',
    ];
    const details = {
      piece: pieces[this.getRandomNumber(0, pieces.length - 1)],
      color: colors[this.getRandomNumber(0, colors.length - 1)],
      faction: 'normal', // You can uncomment and adjust faction logic as needed.
    };

    return (
      <div
        className={`${details.piece} ${details.color} ${details.faction}`}
        style={{
          position: 'relative',
          width: details.piece === 'x-piece' ? '100px' : '40px',
          height: details.piece === 'x-piece' ? '100px' : '40px',
          transform: details.piece === 'x-piece' ? 'scale(.5)' : 'scale(1.5)',
          top: details.piece === 'x-piece' ? '-20px' : '9px',
          left: details.piece === 'x-piece' ? '-20px' : '9px',
        }}
      />
    );
  };

  // Returns the JSX for a random arcana.
  // It grabs the image from /assets/arcanaImages using the imagePath from the JSON.
  getRandomArcana = () => {
    const arcanaKeys = Object.keys(arcana);
    if (arcanaKeys.length === 0) return null;
    const randomIndex = this.getRandomNumber(0, arcanaKeys.length - 1);
    const randomArcana = arcana[arcanaKeys[randomIndex]];

    return (
      <div
        className="arcana-display"
        style={{
          backgroundImage: `url('${randomArcana.imagePath}.svg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '60px',
          height: '60px',
          position: 'relative',
        }}
      ></div>
    );
  };

  /**
   * Decides what to display on a square.
   * @param arcanaChance a number between 0 and 1 for arcana appearance chance (default 0.1 = 10%)
   * @param pieceChance a number between 0 and 1 for chess piece appearance chance (default 0.1 = 10%)
   */
  getRandomDisplay = (
    arcanaChance: number = 0.2,
    pieceChance: number = 0.2
  ) => {
    const rand = Math.random();
    if (rand < arcanaChance) {
      return this.getRandomArcana();
    } else if (rand < arcanaChance + pieceChance) {
      return this.getRandomPiece();
    } else {
      return null;
    }
  };

  shouldComponentUpdate() {
    return false; // Prevents the component from re-rendering
  }

  render() {
    return (
      <div className="hero">
        <div className="hero-curtain"></div>
        <div className="hero-grid">
          {[...Array(50).keys()].map((x) => {
            return [...Array(50).keys()].map((y) => {
              const squareClass =
                x % 2 === 0
                  ? y % 2 === 0
                    ? 'hero-square light'
                    : 'hero-square dark'
                  : y % 2 === 1
                  ? 'hero-square light'
                  : 'hero-square dark';
              return (
                <div key={y} className={squareClass}>
                  {this.getRandomDisplay(0.1, 0.1)}
                </div>
              );
            });
          })}
        </div>
      </div>
    );
  }
}
