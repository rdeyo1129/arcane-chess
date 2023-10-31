import React from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authActions';
import { withRouter } from 'src/components/withRouter/withRouter';

import Button from 'src/components/Button/Button';
import Spinner from 'src/components/Loader/Spinner';
import Dots from 'src/components/Loader/Dots';

import './Dashboard.scss';

// Define the structure for props if any are expected
interface DashboardProps {
  // Example:
  // someProp: string;
  logoutUser: () => void;
  auth: any;
  navigate: (path: string) => void;
}

// Define the structure for the state
interface DashboardState {
  hoverNav: string;
}

export class UnwrappedDashboard extends React.Component<
  DashboardProps,
  DashboardState
> {
  constructor(props: DashboardProps) {
    super(props);
    this.state = {
      hoverNav: 'campaign',
    };
  }

  render() {
    return (
      <div className="dashboard">
        <div>
          {/* <Spinner /> */}
          {/* <Dots /> */}
        </div>
        <div className="news-bar">
          <div className="news-text">NEWS HERE.</div>
        </div>
        <div className="profile-hud">
          <div className="profile-text">
            <div className="username">{this.props.auth.user.username}</div>
            <div className="level">LEVEL 1</div>
          </div>
          <img
            className="avatar"
            src="public/assets/logoblue.png"
            alt="avatar"
          />
        </div>
        <div className="nav-bar">
          <Link
            className="home-button"
            to="/campaign"
            onMouseEnter={() => this.setState({ hoverNav: 'campaign' })}
          >
            <Button
              text="CAMPAIGN"
              // onClick={() => this.calculateFen()}
              className="tertiary"
              color="G"
              height={50}
              width={200}
              // disabled={this.state.fen === ''}
              disabled={false}
              // strong={true}
            />
          </Link>
          <Link
            className="home-button"
            to="/league"
            onMouseEnter={() => this.setState({ hoverNav: 'league' })}
          >
            <Button
              text="LEAGUE"
              // onClick={() => this.calculateFen()}
              className="tertiary"
              color="G"
              height={50}
              width={200}
              // disabled={this.state.fen === ''}
              disabled={false}
              // strong={true}
            />
          </Link>
          <Link
            className="home-button"
            to="/versus"
            onMouseEnter={() => this.setState({ hoverNav: 'versus' })}
          >
            <Button
              text="VERSUS"
              // onClick={() => this.calculateFen()}
              className="tertiary"
              color="G"
              height={50}
              width={200}
              // disabled={this.state.fen === ''}
              disabled={false}
              // strong={true}
            />
          </Link>
          <Link
            className="home-button"
            to="/lexicon"
            onMouseEnter={() => this.setState({ hoverNav: 'lexicon' })}
          >
            <Button
              text="LEXICON"
              // onClick={() => this.calculateFen()}
              className="tertiary"
              color="G"
              height={50}
              width={200}
              // disabled={this.state.fen === ''}
              disabled={false}
              // strong={true}
            />
          </Link>
          <Link
            className="home-button"
            to="/create"
            onMouseEnter={() => this.setState({ hoverNav: 'create' })}
          >
            <Button
              text="CREATE"
              onClick={() => null}
              className="tertiary"
              color="G"
              height={50}
              width={200}
              // disabled={this.state.fen === ''}
              disabled={false}
              // strong={true}
            />
          </Link>
          <Link
            className="home-button"
            to="/hub"
            onMouseEnter={() => this.setState({ hoverNav: 'hub' })}
          >
            <Button
              text="HUB"
              // onClick={() => this.calculateFen()}
              className="tertiary"
              color="G"
              height={50}
              width={200}
              // disabled={this.state.fen === ''}
              disabled={false}
              // strong={true}
            />
          </Link>
        </div>
        <div className="hover-image">
          <img
            className="hover-image"
            src={`public/assets/${this.state.hoverNav}.jpg`}
            alt={this.state.hoverNav}
          />
        </div>
        <div>
          <Button
            text="LOGOUT"
            // onClick={() => this.calculateFen()}
            className="tertiary"
            color="G"
            height={50}
            width={200}
            // disabled={this.state.fen === ''}
            disabled={false}
            onClick={() => {
              this.props.logoutUser();
              this.props.navigate('/login');
            }}
            // strong={true}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps({ auth }: { auth: any }) {
  return {
    auth,
  };
}

export const Dashboard = connect(mapStateToProps, { logoutUser })(
  withRouter(UnwrappedDashboard)
);
