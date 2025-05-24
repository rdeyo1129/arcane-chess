import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authActions';
import { withRouter } from 'src/components/withRouter/withRouter';
import Button from 'src/components/Button/Button';

import './Nav.scss';

interface NavProps {
  logoutUser: () => void;
  auth: { user: { username: string } };
  navigate: (path: string) => void;
}
interface NavState {
  isMenuOpen: boolean;
}

class UnwrappedNav extends React.Component<NavProps, NavState> {
  navRef: React.RefObject<HTMLDivElement>;

  constructor(props: NavProps) {
    super(props);
    this.state = { isMenuOpen: false };
    this.navRef = React.createRef<HTMLDivElement>();
  }

  handleToggleMenu = (): void => {
    this.setState((prev) => ({ isMenuOpen: !prev.isMenuOpen }));
  };

  handleClickOutside = (event: MouseEvent): void => {
    if (
      this.state.isMenuOpen &&
      this.navRef.current &&
      !this.navRef.current.contains(event.target as Node)
    ) {
      this.setState({ isMenuOpen: false });
    }
  };

  componentDidMount(): void {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount(): void {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  onLogout = (): void => {
    this.props.logoutUser();
    this.props.navigate('/login');
  };

  render() {
    return (
      <div className="nav-container" ref={this.navRef}>
        <Button
          text={this.state.isMenuOpen ? 'CLOSE' : 'MENU'}
          className="tertiary nav-toggle"
          color="B"
          height={50}
          width={100}
          onClick={this.handleToggleMenu}
        />

        {this.state.isMenuOpen && (
          <div className="nav-bar">
            <Link className="nav-link" to="/campaign">
              <Button
                text="CAMPAIGN"
                className="tertiary"
                color="B"
                height={50}
                width="100%"
                disabled={false}
                backgroundColorOverride="#11111188"
              />
            </Link>
            <Link className="nav-link" to="/stacktadium">
              <Button
                text="STACKTADIUM"
                className="tertiary"
                color="V"
                height={50}
                width="100%"
                disabled={false}
                backgroundColorOverride="#11111188"
              />
            </Link>
            <Link className="nav-link" to="/leaderboard">
              <Button
                text="LEADERBOARD"
                className="tertiary"
                color="Y"
                height={50}
                width="100%"
                disabled={false}
                backgroundColorOverride="#11111188"
              />
            </Link>
            <Link className="nav-link" to="/quickplay">
              <Button
                text="QUICKPLAY"
                className="tertiary"
                color="B"
                height={50}
                width="100%"
                disabled={false}
                backgroundColorOverride="#11111188"
              />
            </Link>
            <Link className="nav-link" to="/lexicon">
              <Button
                text="LEXICON"
                className="tertiary"
                color="G"
                height={50}
                width="100%"
                disabled={false}
                backgroundColorOverride="#11111188"
              />
            </Link>
            <Link className="nav-link" to="/manifest">
              <Button
                text="MANIFEST"
                className="tertiary"
                color="O"
                height={50}
                width="100%"
                disabled={false}
                backgroundColorOverride="#11111188"
              />
            </Link>
            <div className="nav-link">
              <Button
                text="LOGOUT"
                className="tertiary"
                color="R"
                height={50}
                width="100%"
                disabled={false}
                backgroundColorOverride="#11111188"
                onClick={this.onLogout}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default connect(null, { logoutUser })(withRouter(UnwrappedNav));
