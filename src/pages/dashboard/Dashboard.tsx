import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'src/components/withRouter/withRouter';
import Button from 'src/components/Button/Button';
import './Dashboard.scss';

// import GlobalVolumeControl from 'src/utils/audio/GlobalVolumeControl';
import DashboardModal from './DashboardModal';

// Define the structure for props if any are expected
interface DashboardProps {
  logoutUser: () => void;
  auth: { user: { username: string } };
  navigate: (path: string) => void;
}

// Define the structure for the state
interface DashboardState {
  hoverNav: string;
  menuItemDescriptions: {
    campaign: string;
    leaderboard: string;
    quickplay: string;
    lexicon: string;
    manifest: string;
    logout: string;
  };
}

export class UnwrappedDashboard extends React.Component<
  DashboardProps,
  DashboardState
> {
  constructor(props: DashboardProps) {
    super(props);
    this.state = {
      hoverNav: 'campaign',
      menuItemDescriptions: {
        campaign: 'Play the story mode and earn your spot on the leaderboard.',
        leaderboard:
          'See the global rankings and scores for each chapter in the campaign.',
        quickplay:
          'Test the arcana and face off against the engine with custom battle options.',
        lexicon:
          'Look back on the lessons you have learned throughout the campaign.',
        manifest: 'More information: mission statement, about, links, notes.',
        logout: 'Take a break.',
      },
    };
  }

  render() {
    return (
      <div className="dashboard">
        <DashboardModal />
        <div className="dashboard-content">
          <div className="nav-bar">
            <Link
              className="home-button"
              to="/campaign"
              onMouseEnter={() => this.setState({ hoverNav: 'campaign' })}
            >
              <Button
                text="CAMPAIGN"
                className="tertiary"
                color="B"
                height={50}
                width={'100%'}
                disabled={false}
                backgroundColorOverride="#11111188"
              />
            </Link>
            {/* <Button
              text="VERSUS"
              className="tertiary"
              color="B"
              height={50}
              width={'100%'}
              disabled={false}
              backgroundColorOverride="#11111188"
            /> */}
            <Link
              className="home-button"
              to="/leaderboard"
              onMouseEnter={() => this.setState({ hoverNav: 'leaderboard' })}
            >
              <Button
                text="LEADERBOARD"
                className="tertiary"
                color="B"
                height={50}
                width={'100%'}
                disabled={false}
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
                className="tertiary"
                color="B"
                height={50}
                width={'100%'}
                disabled={false}
                backgroundColorOverride="#11111188"
              />
            </Link>
            <Link
              className="home-button"
              to="/lexicon"
              onMouseEnter={() => this.setState({ hoverNav: 'lexicon' })}
            >
              <Button
                text="LEXICON"
                className="tertiary"
                color="B"
                height={50}
                width={'100%'}
                disabled={false}
                backgroundColorOverride="#11111188"
              />
            </Link>
            <Link
              className="home-button"
              to="/manifest"
              onMouseEnter={() => this.setState({ hoverNav: 'manifest' })}
            >
              <Button
                text="MANIFEST"
                className="tertiary"
                color="B"
                height={50}
                width={'100%'}
                disabled={false}
                backgroundColorOverride="#11111188"
              />
            </Link>
            <div onMouseEnter={() => this.setState({ hoverNav: 'logout' })}>
              <Button
                text="LOGOUT"
                className="tertiary"
                color="B"
                height={50}
                width={'100%'}
                disabled={false}
                onClick={() => {
                  this.props.navigate('/');
                }}
                backgroundColorOverride="#11111188"
              />
            </div>
            {/* <GlobalVolumeControl /> */}
          </div>
          <div className="image-description">
            <img
              className="hover-image"
              src={`/assets/dashboard/${this.state.hoverNav}.webp`}
              alt={this.state.hoverNav}
            />
            <div className="menu-item-description">
              {
                this.state.menuItemDescriptions[
                  this.state
                    .hoverNav as keyof DashboardState['menuItemDescriptions']
                ]
              }
            </div>
          </div>
        </div>
        <img
          className="hover-image-full"
          src={`/assets/dashboard/${this.state.hoverNav}.webp`}
          alt={this.state.hoverNav}
        />
      </div>
    );
  }
}

function mapStateToProps({ auth }: { auth: object }) {
  return {
    auth,
  };
}

export const Dashboard = connect(mapStateToProps, {
  /* logoutUser */
})(withRouter(UnwrappedDashboard));
