import React from 'react';
// import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authActions';
import { withRouter } from 'src/components/withRouter/withRouter';
// import Button from 'src/components/Button/Button';
import './NewDashboard.scss';

import Nav from '../../components/nav/Nav';
import Lobby from '../../components/lobby/Lobby';

// import GlobalVolumeControl from 'src/utils/audio/GlobalVolumeControl';
// import DashboardModal from './DashboardModal';

// import { audioManager } from 'src/utils/audio/AudioManager';

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
    campaign1: string;
    stacktadium2: string;
    leaderboard: string;
    quickplay: string;
    lexicon: string;
    manifest: string;
    logout: string;
  };
  fadeIn: boolean;
  fadeOut: boolean;
}

export class UnwrappedNewDashboard extends React.Component<
  DashboardProps,
  DashboardState
> {
  constructor(props: DashboardProps) {
    super(props);
    this.state = {
      hoverNav: 'campaign1',
      menuItemDescriptions: {
        campaign1:
          'Collect the arcana, conquer the beasts, and etch your name on the leaderboard.',
        stacktadium2: 'An ancient grid, a fresh enigma.',
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
    // setTimeout(() => {
    //   this.setState({ fadeIn: true });
    // }, 50);
  }

  render() {
    return (
      <div
      // className={`dashboard ${this.state.fadeIn ? 'fade-in' : ''} ${
      //   this.state.fadeOut ? 'fade-out' : ''
      // }`}
      >
        <Nav />
        <Lobby />
      </div>
    );
  }
}

function mapStateToProps({ auth }: { auth: object }) {
  return {
    auth,
  };
}

export const NewDashboard = connect(mapStateToProps, {
  logoutUser,
})(withRouter(UnwrappedNewDashboard));
