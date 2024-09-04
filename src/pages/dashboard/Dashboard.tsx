import React from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authActions';
import { withRouter } from 'src/components/withRouter/withRouter';

import Button from 'src/components/Button/Button';

import './Dashboard.scss';

// Define the structure for props if any are expected
interface DashboardProps {
  // Example:
  // someProp: string;
  logoutUser: () => void;
  auth: { user: { username: string } };
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
              color="B"
              height={50}
              width={160}
              // disabled={this.state.fen === ''}
              disabled={false}
              backgroundColorOverride="#11111188"
              // strong={true}
            />
          </Link>
          <Link
            className="home-button"
            to="/leaderboard"
            onMouseEnter={() => this.setState({ hoverNav: 'leaderboard' })}
          >
            <Button
              text="LEADERBOARD"
              // onClick={() => this.calculateFen()}
              className="tertiary"
              color="B"
              height={50}
              width={160}
              // disabled={this.state.fen === ''}
              disabled={false}
              // strong={true}
              backgroundColorOverride="#11111188"
            />
          </Link>
          <Link
            className="home-button"
            to="/quickplay"
            onMouseEnter={() => this.setState({ hoverNav: 'quickplay' })}
          >
            <Button
              text="QUICKPLAY"
              // onClick={() => this.calculateFen()}
              className="tertiary"
              color="B"
              height={50}
              width={160}
              // disabled={this.state.fen === ''}
              disabled={false}
              backgroundColorOverride="#11111188"
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
              color="B"
              height={50}
              width={160}
              // disabled={this.state.fen === ''}
              disabled={false}
              backgroundColorOverride="#11111188"
              // strong={true}
            />
          </Link>

          {/* <Link
               className="home-button"
               to="/create"
               onMouseEnter={() => this.setState({ hoverNav: 'create' })}
             >
               <Button
                 text="CREATE"
                 onClick={() => null}
                 className="tertiary"
                 color="B"
                 height={50}
                 width={160}
                 // disabled={this.state.fen === ''}
                 disabled={false}
                 backgroundColorOverride="#11111188"
                 // strong={true}
               />
             </Link> */}
          <Link
            className="home-button"
            to="/manifest"
            onMouseEnter={() => this.setState({ hoverNav: 'manifest' })}
          >
            <Button
              text="MANIFEST"
              onClick={() => null}
              className="tertiary"
              color="B"
              height={50}
              width={160}
              // disabled={this.state.fen === ''}
              disabled={false}
              backgroundColorOverride="#11111188"
              // strong={true}
            />
          </Link>
          <div onMouseEnter={() => this.setState({ hoverNav: 'logout' })}>
            <Button
              text="LOGOUT"
              // onClick={() => this.calculateFen()}
              className="tertiary"
              color="B"
              height={50}
              width={160}
              // disabled={this.state.fen === ''}
              disabled={false}
              onClick={() => {
                this.props.logoutUser();
                this.props.navigate('/login');
              }}
              backgroundColorOverride="#11111188"
              // strong={true}
            />
          </div>
        </div>
        <div className="hover-image">
          <img
            className="hover-image"
            src={`/assets/dashboard/${this.state.hoverNav}.webp`}
            alt={this.state.hoverNav}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps({ auth }: { auth: object }) {
  return {
    auth,
  };
}

export const Dashboard = connect(mapStateToProps, { logoutUser })(
  withRouter(UnwrappedDashboard)
);
