import React from 'react';
// import { Link, withRouter } from "react-router-dom";
// import { connect } from "react-redux";

// import "../styles/front-page.css";

// import Hero from "../components/Hero";

// import arcaneChess from "./././validation-engine/arcaneChess";

// import engine
// import arcaneChess from '../../arcaneChess/arcaneChess.mjs';

import { SinglePlayer } from '../singlePlayer/SinglePlayer';

// import arcaneChess correctly
// import arcaneChess from "@shared/arcaneChess/arcaneChess";

import Button from '../../components/Button/Button';
import Toggle from '../../components/Toggle/Toggle';

import { Chessground } from '../../chessground/chessgroundMod';

// interface FrontPageProps {
//   // whiteFaction: Faction;
//   // blackFaction: Faction;
//   // arcaneChess: () => void;
// }

class UnwrappedInGameMenu extends React.Component {
  // arcaneChess;

  constructor(props: object) {
    super(props);
    this.state = {};
    // this.arcaneChess = arcaneChess();
  }

  render() {
    return (
      // <div style={{ color: 'red', width: '200px', height: '50px' }}>hello</div>
      <div className="board-frame">
        <Chessground
          // fen={this.state.fenHistory[this.state.fenHistory.length - 1]}
          // check={this.tactorius.inCheck().isAttacked}
          // viewOnly={this.isCheckmate()}
          fen={'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'}
          // coordinates={true}
          // notation={true}
          resizable={true}
          wFaction={'sigma'}
          bFaction={'omega'}
          // wRoyalty={this.state.wRoyalty}
          // bRoyalty={this.state.bRoyalty}
          // wVisible={this.state.wVisCount === 0}
          // bVisible={this.state.bVisCount === 0}
          // width={520}
          // height={520}
          width={480}
          height={480}
          animation={{
            duration: 0.1,
          }}
          highlight={{
            lastMove: true,
            check: true,
          }}
          orientation={this.state.orientation}
          disableContextMenu={false}
          turnColor={this.state.turn}
          // movable={{
          //   free: false,
          //   // todo swap out placeholder for comment
          //   // color: "both",
          //   color: this.isSummon(this.state.ability)
          //     ? undefined
          //     : this.state.orientation,
          //   // todo show summon destinations
          //   dests: !this.isSummon(this.state.ability)
          //     ? this.tactorius.getMoves(
          //         this.state.turn === "white" ? "w" : "b",
          //         this.state.ability === "invisibility"
          //           ? null
          //           : this.state.ability
          //       )
          //     : null,
          // }}
          // events={{
          //   move: this.makeMove,
          //   select: (key) => {
          //     // TODO REFACTOR
          //     return (this.isSummon(this.state.ability) ||
          //       this.state.ability === "swapAdjacent") &&
          //       _.includes(
          //         this.tactorius.getMoves(
          //           this.state.turn === "white" ? "w" : "b",
          //           this.state.ability
          //         ),
          //         key
          //       )
          //       ? this.summonMove(key, this.state.ability, false)
          //       : null;
          //   },
          // }}
        />
      </div>
    );
  }
}

// function mapStateToProps({}) {
//   return {};
// }

export const InGameMenu = UnwrappedInGameMenu;
// connect(mapStateToProps)(
//   withRouter(UnwrappedFrontPage)
// );

// .hero-text {
//   font-size: 48px;
//   font-weight: 800;
// }
