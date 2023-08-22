import React from "react";
// import { Link, withRouter } from "react-router-dom";
// import { connect } from "react-redux";

// import "../styles/front-page.css";

// import Hero from "../components/Hero";

class UnwrappedFrontPage extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <div className="panel">
          <i className="hero-text">TACTORIUS</i>
          <h2>hello</h2>
          tactorius is an extension of chess where you get to use powers to
          influence the outcome of the game.
        </div>
      </div>
    );
  }
}

// function mapStateToProps({}) {
//   return {};
// }

export const FrontPage = UnwrappedFrontPage;
// connect(mapStateToProps)(
//   withRouter(UnwrappedFrontPage)
// );

// .hero-text {
//   font-size: 48px;
//   font-weight: 800;
// }
