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
              width={200}
              // disabled={this.state.fen === ''}
              disabled={false}
              backgroundColorOverride="#11111188"
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
              color="B"
              height={50}
              width={200}
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
              width={200}
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
              width={200}
              // disabled={this.state.fen === ''}
              disabled={false}
              backgroundColorOverride="#11111188"
              // strong={true}
            />
          </Link>
          <Link
            className="home-button"
            to="https://discord.gg/JYV3SWnc"
            onMouseEnter={() => this.setState({ hoverNav: 'underground' })}
          >
            <Button
              text="UNDERGROUND"
              // onClick={() => this.calculateFen()}
              className="tertiary"
              color="B"
              height={50}
              width={200}
              // disabled={this.state.fen === ''}
              disabled={false}
              backgroundColorOverride="#11111188"
              // strong={true}
            />
          </Link>
          {process.env.NODE_ENV !== 'production' ? (
            <Link
              className="home-button"
              to="/about"
              onMouseEnter={() => this.setState({ hoverNav: 'create' })}
            >
              <Button
                text="ABOUT"
                onClick={() => null}
                className="tertiary"
                color="B"
                height={50}
                width={200}
                // disabled={this.state.fen === ''}
                disabled={false}
                backgroundColorOverride="#11111188"
                // strong={true}
              />
            </Link>
          ) : (
            <Link
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
                width={200}
                // disabled={this.state.fen === ''}
                disabled={false}
                backgroundColorOverride="#11111188"
                // strong={true}
              />
            </Link>
          )}

          <Button
            text="LOGOUT"
            // onClick={() => this.calculateFen()}
            className="tertiary"
            color="B"
            height={50}
            width={200}
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
