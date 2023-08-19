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
    return <div>TEST ONE FRONT PAGE</div>;
  }
}

// function mapStateToProps({}) {
//   return {};
// }

export const FrontPage = UnwrappedFrontPage;
// connect(mapStateToProps)(
//   withRouter(UnwrappedFrontPage)
// );
