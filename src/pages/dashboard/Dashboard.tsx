import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authActions';
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
    stacktadium: string;
    leaderboard: string;
    quickplay: string;
    lexicon: string;
    manifest: string;
    logout: string;
  };
  fadeIn: boolean;
  fadeOut: boolean;
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
        campaign:
          'Collect the arcana, conquer the beasts, and etch your name on the leaderboard.',
        stacktadium: 'An ancient grid, a fresh enigma—coming soon.',
        leaderboard: 'Observe global rankings.',
        quickplay:
          'Master the arcana and challenge the engine with custom battles.',
        lexicon:
          'Review every technic mastered throughout your campaign journey.',
        manifest: 'Mission, insights, links, bugs, and notes—unveiled.',
        logout: 'Pause and breathe—your journey can wait.',
      },
      fadeIn: false,
      fadeOut: false,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ fadeIn: true });
    }, 50);
  }

  render() {
    return (
      <div
        className={`dashboard ${this.state.fadeIn ? 'fade-in' : ''} ${
          this.state.fadeOut ? 'fade-out' : ''
        }`}
      >
        <div className={`fade-overlay ${this.state.fadeOut ? 'active' : ''}`} />
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
            <Link
              className="home-button"
              to="/"
              onMouseEnter={() => this.setState({ hoverNav: 'stacktadium' })}
            >
              <Button
                text="STACKTADIUM"
                className="tertiary"
                color="R"
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
                color="Y"
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
                color="G"
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
                color="O"
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
                  this.setState({ fadeOut: true });
                  setTimeout(() => {
                    this.props.logoutUser();
                    this.props.navigate('/login');
                  }, 300);
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
  logoutUser,
})(withRouter(UnwrappedDashboard));
