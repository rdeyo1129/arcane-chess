import React from 'react';
import { Link } from 'react-router-dom';

import Button from 'src/components/Button/Button';
import Spinner from 'src/components/Loader/Spinner';
import Dots from 'src/components/Loader/Dots';

import './Dashboard.scss';

// Define the structure for props if any are expected
interface DashboardProps {
  // Example:
  // someProp: string;
}

// Define the structure for the state
interface DashboardState {
  hoverNav: string;
}

export class Dashboard extends React.Component<DashboardProps, DashboardState> {
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
            <div className="username">USERNAME</div>
            <div className="level">LEVEL 1</div>
          </div>
          <img
            className="avatar"
            src="public/assets/logoblue2.png"
            alt="avatar"
          />
        </div>
        <div className="nav-bar">
          {/* Rest of the code is similar, just ensure to provide proper types or handle any specific functionality in the onClick handlers */}
        </div>
        <div className="hover-image">
          <img
            className="hover-image"
            src={`public/assets/${this.state.hoverNav}.jpg`}
            alt={this.state.hoverNav}
          />
        </div>
        {/* Rest of the component */}
      </div>
    );
  }
}
