import React from 'react';
import { Link } from 'react-router-dom';
// import { connect } from "react-redux";

// import "../styles/front-page.scss";

import './FrontPage.scss';
import Hero from 'src/components/hero2/Hero';

import Button from '../../components/Button/Button';

// interface FrontPageProps {
//   // whiteFaction: Faction;
//   // blackFaction: Faction;
//   // arcaneChess: () => void;
// }

class UnwrappedFrontPage extends React.Component {
  // arcaneChess;
  constructor(props: object) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="front-page fade">
        <div className="header">
          <div className="inner-header">
            <img className="logo" src={'/assets/logogold.png'} alt="" />
            <div className="inner-header-a">
              <h1 className="tactorius" style={{ fontWeight: '800' }}>
                <div className="tact">
                  <i>TACT</i>
                </div>
                <div className="orius">
                  <i>ORIUS</i>
                </div>
              </h1>
              <p>
                <i>Your mind is the armory.</i>
              </p>
            </div>
          </div>
          <div className="header-buttons">
            <Link to={'/login'}>
              <Button
                text="LOGIN"
                // onClick={() => this.calculateFen()}
                className="primary"
                color="Y"
                height={50}
                width={140}
                // disabled={this.state.fen === ''}
                disabled={false}
                // strong={true}
              />
            </Link>
            <Link to={'/register'}>
              <Button
                text="REGISTER"
                // onClick={() => this.calculateFen()}
                className="secondary"
                color="Y"
                height={50}
                width={140}
                // disabled={this.state.fen === ''}
                disabled={false}
                // strong={true}
              />
            </Link>
          </div>
        </div>
        <div className="divider"></div>
        <div className="row-a">
          {/* <img className="image" src="public/assets/jellyfish.jpg" /> */}
          <img className="image" src={'/assets/hero.webp'} alt="" />
        </div>
        {/* start with why */}
        <div className="row-b">
          <Hero />
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
