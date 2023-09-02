import React from "react";
// import { Link, withRouter } from "react-router-dom";
// import { connect } from "react-redux";

// import "../styles/front-page.css";

// import Hero from "../components/Hero";

import Button from "../../components/Button/Button";
import Toggle from "../../components/Toggle/Toggle";

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
          <Button
            text="PLAY"
            onClick={() => console.log("clicked")}
            className="primary"
            color="B"
            disabled={false}
            // strong={true}
          />
          <Button
            text="PLAY"
            onClick={() => console.log("clicked")}
            className="primary"
            color="Y"
            disabled={true}
            // strong={true}
          />
          <Button
            text="PLAY"
            onClick={() => console.log("clicked")}
            className="secondary"
            color="Y"
            disabled={false}
            // strong={true}
          />
          <Button
            text="PLAY"
            onClick={() => console.log("clicked")}
            className="secondary"
            color="Y"
            disabled={true}
            // strong={true}
          />
          <Button
            text="PLAY"
            onClick={() => console.log("clicked")}
            className="tertiary"
            color="Y"
            disabled={false}
            // strong={true}
          />
          <Button
            text="PLAY"
            onClick={() => console.log("clicked")}
            className="tertiary"
            color="Y"
            disabled={true}
            // strong={true}
          />
          <Toggle />
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
