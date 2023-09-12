import React from 'react';
// import { Link, withRouter } from "react-router-dom";
// import { connect } from "react-redux";

// import engine
import arcaneChess from '../../arcaneChess/arcaneChess.mjs';

import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';

import { PerftTest } from '../../arcaneChess/perft.mjs';
import { ParseFen, PrintBoard } from '../../arcaneChess/board.mjs';

// interface FrontPageProps {
//   // whiteFaction: Faction;
//   // blackFaction: Faction;
//   // arcaneChess: () => void;
// }

type UIVState = {
  fen: string;
};

class UnwrappedUIValidationHouse extends React.Component<object, UIVState> {
  arcaneChess;
  constructor(props: object) {
    super(props);
    this.state = {
      fen: '',
    };
    this.arcaneChess = (fen: string) => arcaneChess({}, {}, fen);
  }

  initializeArcaneChessAndTest = () => {
    this.arcaneChess(this.state.fen);
    this.perftTest(this.state.fen);
  };

  perftTest = (fen: string) => {
    // gui?
    ParseFen(fen);
    PrintBoard();
    PerftTest(5);
  };

  setFen = (fen: string) => {
    this.setState({ fen });
  };

  render() {
    return (
      <div>
        <Input
          // id="test"
          className="input"
          color="B"
          height={40}
          width={400}
          placeholder="FEN"
          value={this.state.fen}
          setText={this.setFen}
        />
        <Button
          text="SET FEN"
          onClick={() => this.initializeArcaneChessAndTest()}
          className="primary"
          color="B"
          disabled={this.state.fen === ''}
          // strong={true}
        />
      </div>
    );
  }
}

// function mapStateToProps({}) {
//   return {};
// }

export const UIValidationHouse = UnwrappedUIValidationHouse;
// connect(mapStateToProps)(
//   withRouter(UnwrappedFrontPage)
// );

// .hero-text {
//   font-size: 48px;
//   font-weight: 800;
// }
