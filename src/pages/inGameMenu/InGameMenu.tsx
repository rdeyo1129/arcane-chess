import React from 'react';
// import { Link, withRouter } from "react-router-dom";
// import { connect } from "react-redux";

// import "../styles/front-page.css";

import 'src/pages/inGameMenu/InGameMenu.scss';

// import Hero from "../components/Hero";

// import arcaneChess from "./././validation-engine/arcaneChess";

import arcaneChess from '../../arcaneChess/arcaneChess.mjs';
import { PerftTest } from '../../arcaneChess/perft.mjs';
import { ParseFen, PrintBoard } from '../../arcaneChess/board.mjs';

// import engine
// import arcaneChess from '../../arcaneChess/arcaneChess.mjs';

import { SinglePlayer } from '../singlePlayer/SinglePlayer';

// import arcaneChess correctly
// import arcaneChess from "@shared/arcaneChess/arcaneChess";

import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Toggle from '../../components/Toggle/Toggle';

import { Chessground } from '../../chessground/chessgroundMod';

// interface FrontPageProps {
//   // whiteFaction: Faction;
//   // blackFaction: Faction;
//   // arcaneChess: () => void;
// }

class UnwrappedInGameMenu extends React.Component {
  arcaneChess;
  constructor(props: object) {
    super(props);
    this.state = {
      fen: '',
    };
    this.arcaneChess = (fen?: string) => arcaneChess({}, {}, fen);
  }

  initializeArcaneChessAndTest = (fen: string) => {
    // const start = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    // const start = '6pk/3K2p1/6p1/6p1/8/8/8/7P w - - 0 1';
    // const start = '8/8/8/4X3/8/8/8/8 w - - 0 1';
    // koh
    // const start = 'k7/8/8/8/8/8/8/7K w - - 0 1';
    // royalty mate
    const start = '6Xk/8/8/8/8/8/R7/K7 w - - 0 1';
    // promote to unicorn
    // const start = '4pk2/4ppp1/6XP/8/8/8/8/7K w - - 0 1';
    // const start = '5pk1/5XX1/6XP/6X1/8/8/8/7K w - - 0 1';
    // rnbqk2r/p1pp1ppp/1p2pn2/8/1bPP4/2N1P3/PP3PPP/R1BQKBNR w KQkq - 0 1
    this.arcaneChess().startGame(start);
    // this.perftTest(start);
  };

  perftTest = (fen: string) => {
    PerftTest(3, fen);
  };

  setFen = (fen: string) => {
    this.setState({ fen });
  };

  render() {
    // const { auth } = this.props;
    return (
      <div className="tactorius-board fade">
        {/* <button style={{ position: "absoulte" }}>test</button> */}
        <div className="panels-board">
          {/* <TactoriusModal
            isOpen={this.state.isOpen}
            handleClose={() => this.handleModalClose()}
            modalType={this.state.endScenario}
            message="test1" // interpolate
          /> */}
          {/* <div className="game-info">
            <div className="panel-left-container">
              <div className="panel-left">this is a paragraph about chess.</div>
            </div>
          </div> */}
          {/* 
            panel types lesson temple mission create... any others? puzzles (leage vs temples)
            must be true to page architecture

          */}
          {/* <div className="panel"></div> */}
          <div className="fen-input">
            <Input
              // id="test"
              className="input fen-text-box"
              color="B"
              height={60}
              width={280}
              placeholder="FEN"
              value={this.state.fen}
              setText={this.setFen}
            />
            <Button
              text="SET FEN"
              onClick={() => this.initializeArcaneChessAndTest(this.state.fen)}
              className="primary"
              color="B"
              height={60}
              width={120}
              // disabled={this.state.fen === ''}
              disabled={false}
              // strong={true}
            />
          </div>
          <div className="time-input">
            {/* dropdowns */}
            <div className="white-time">10 : 00</div>
            <div className="black-time">10 : 00</div>
          </div>
          <div className="eval-output">
            <span>-5.23 ... </span>
            <span>Nf5 RU@c2+ Kh2</span>
          </div>
          <div className="arcane-faction-input">
            <div className="arcane-input">
              Implant, Mind Read, Temporal Pincer
            </div>
            <div className="faction-input">
              <div className="create-faction"></div>
              <div className="create-faction"></div>
              <div className="create-faction"></div>
              <div className="create-faction"></div>
              <div className="create-faction"></div>
              <div className="create-faction"></div>
              <div className="create-faction"></div>
              <div className="create-faction"></div>
            </div>
          </div>
          <div className="board-view">
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
              // inline styling for aspect ratio? OR interpolating in this case based on the page type, use a global state string?
              // don't, just go by the page type
              // width={360}
              // height={360}
              animation={{
                duration: 0.1,
              }}
              highlight={{
                lastMove: true,
                check: true,
              }}
              // orientation={this.state.orientation}
              disableContextMenu={false}
              // turnColor={this.state.turn}
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
          <div className="pieces-buttons">
            <div className="preset-dropdown">Horde</div>
            <div className="piece-pickup">{/* forEach */}</div>
            <div className="create-buttons">
              <Button
                text="DISABLE"
                onClick={() => null}
                className="tertiary"
                color="B"
                height={60}
                width={200}
                disabled={false}
              />
              <Button
                text="MAKE MOVE"
                onClick={() => null}
                className="tertiary"
                color="B"
                height={60}
                width={200}
                disabled={false}
              />
              <Button
                text="RANDOMIZE"
                onClick={() => null}
                className="tertiary"
                color="B"
                height={60}
                width={200}
                disabled={false}
              />
              <Button
                text="SAVE / QUIT"
                onClick={() => null}
                className="tertiary"
                color="B"
                height={60}
                width={200}
                disabled={false}
              />
            </div>
          </div>
          <div className="grid-filler"></div>
          <div className="grid-filler"></div>
          <div className="grid-filler"></div>
        </div>
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
