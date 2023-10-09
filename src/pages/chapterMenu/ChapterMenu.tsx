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

// interface FrontPageProps {
//   // whiteFaction: Faction;
//   // blackFaction: Faction;
//   // arcaneChess: () => void;
// }

class UnwrappedChapterMenu extends React.Component {
  // arcaneChess;

  constructor(props: object) {
    super(props);
    this.state = {};
    // this.arcaneChess = arcaneChess();
  }

  render() {
    return <div></div>;
  }
}

// function mapStateToProps({}) {
//   return {};
// }

export const ChapterMenu = UnwrappedChapterMenu;
// connect(mapStateToProps)(
//   withRouter(UnwrappedFrontPage)
// );

// .hero-text {
//   font-size: 48px;
//   font-weight: 800;
// }
