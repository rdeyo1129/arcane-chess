import React from 'react';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authActions';
import { withRouter } from 'src/components/withRouter/withRouter';
import './Dashboard.scss';

type DashboardProps = { auth: { user: { username: string } } };
type DashboardState = { openSubKey: string | null; hoverNav: string };

const DESCRIPTIONS: { [k: string]: string } = {
  campaign1: 'Story mode and progression.',
  lexicon: 'Rules, strategy, and lore.',
  leaderboard2: 'Global rankings and ladders.',
  gauntlet: 'Arena hub for modes.',
  skirmish: 'Quick tactical bouts.',
  melee: 'Free-for-all chaos.',
  forum: 'Community discussions.',
  members: 'Meet players and clans.',
  events: 'Tournaments and meetups.',
  chat: 'Live rooms and DMs.',
  manifest2: 'Inventory, spells, relics.',
  inventory: 'Your items and gear.',
  spells: 'Learn and equip spells.',
  relics: 'Passive artifacts.',
  settings: 'Profile and UI settings.',
  logout: 'Sign out safely.',
};

export class UnwrappedDashboard extends React.Component<
  DashboardProps,
  DashboardState
> {
  constructor(props: DashboardProps) {
    super(props);
    this.state = { openSubKey: null, hoverNav: '' };
    this.toggleSub = this.toggleSub.bind(this);
  }
  toggleSub(key: string) {
    this.setState((prev) => ({
      openSubKey: prev.openSubKey === key ? null : key,
    }));
  }
  render() {
    const { openSubKey, hoverNav } = this.state;
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <div className="header-icons">
            <img className="logo" src="/assets/logoall+.png" alt="" />
            <img className="avatar" src="/assets/avatars/normal.webp" alt="" />
          </div>
          <div className="xp-panel">
            <div className="xp-meta">
              <div className="xp-user">{this.props.auth.user.username}</div>
              <div className="xp-points">XP 1,240</div>
              <div className="xp-level">LV 12</div>
            </div>
            <div className="xp-bar">
              <div className="xp-fill" style={{ width: '45%' }} />
            </div>
          </div>
          <div className="nav-right">
            <div className="right-actions">
              <div
                className="nav-item"
                onMouseEnter={() => this.setState({ hoverNav: 'settings' })}
                onFocus={() => this.setState({ hoverNav: 'settings' })}
                tabIndex={0}
              >
                SETTINGS
              </div>
              <div
                className="nav-item"
                onMouseEnter={() => this.setState({ hoverNav: 'logout' })}
                onFocus={() => this.setState({ hoverNav: 'logout' })}
                tabIndex={0}
              >
                LOGOUT
              </div>
            </div>
            <div className="desc-rail" aria-live="polite">
              {(hoverNav && DESCRIPTIONS[hoverNav]) || ''}
            </div>
          </div>

          <img
            className="avatar-inline"
            src="/assets/avatars/normal.webp"
            alt=""
          />
          <div className="nav-left">
            <div
              className="nav-item"
              onMouseEnter={() => this.setState({ hoverNav: 'campaign1' })}
              onFocus={() => this.setState({ hoverNav: 'campaign1' })}
              tabIndex={0}
            >
              CAMPAIGN
            </div>
            <div
              className="nav-item"
              onMouseEnter={() => this.setState({ hoverNav: 'lexicon' })}
              onFocus={() => this.setState({ hoverNav: 'lexicon' })}
              tabIndex={0}
            >
              LEXICON
            </div>
            <div
              className="nav-item"
              onMouseEnter={() => this.setState({ hoverNav: 'leaderboard2' })}
              onFocus={() => this.setState({ hoverNav: 'leaderboard2' })}
              tabIndex={0}
            >
              RANKINGS
            </div>
            <div
              className={`nav-item has-sub ${
                openSubKey === 'ARENA' ? 'open' : ''
              }`}
              onMouseEnter={() => this.setState({ hoverNav: 'gauntlet' })}
              onFocus={() => this.setState({ hoverNav: 'gauntlet' })}
            >
              <button
                className="nav-btn"
                onClick={() => this.toggleSub('ARENA')}
                aria-expanded={openSubKey === 'ARENA'}
                aria-controls="submenu-arena"
              >
                ARENA
              </button>
              <div
                id="submenu-arena"
                className="sub-menu"
                role="region"
                aria-label="Arena submenu"
              >
                <div
                  onMouseEnter={() => this.setState({ hoverNav: 'gauntlet' })}
                  onFocus={() => this.setState({ hoverNav: 'gauntlet' })}
                  tabIndex={0}
                >
                  GAUNTLET
                </div>
                <div
                  onMouseEnter={() => this.setState({ hoverNav: 'skirmish' })}
                  onFocus={() => this.setState({ hoverNav: 'skirmish' })}
                  tabIndex={0}
                >
                  SKIRMISH
                </div>
                <div
                  onMouseEnter={() => this.setState({ hoverNav: 'melee' })}
                  onFocus={() => this.setState({ hoverNav: 'melee' })}
                  tabIndex={0}
                >
                  MELEE
                </div>
              </div>
            </div>
            <div
              className={`nav-item has-sub ${
                openSubKey === 'FORUM' ? 'open' : ''
              }`}
              onMouseEnter={() => this.setState({ hoverNav: 'forum' })}
              onFocus={() => this.setState({ hoverNav: 'forum' })}
            >
              <button
                className="nav-btn"
                onClick={() => this.toggleSub('FORUM')}
                aria-expanded={openSubKey === 'FORUM'}
                aria-controls="submenu-forum"
              >
                FORUM
              </button>
              <div
                id="submenu-forum"
                className="sub-menu"
                role="region"
                aria-label="Forum submenu"
              >
                <div
                  onMouseEnter={() => this.setState({ hoverNav: 'members' })}
                  onFocus={() => this.setState({ hoverNav: 'members' })}
                  tabIndex={0}
                >
                  Members
                </div>
                <div
                  onMouseEnter={() => this.setState({ hoverNav: 'events' })}
                  onFocus={() => this.setState({ hoverNav: 'events' })}
                  tabIndex={0}
                >
                  Events
                </div>
                <div
                  onMouseEnter={() => this.setState({ hoverNav: 'chat' })}
                  onFocus={() => this.setState({ hoverNav: 'chat' })}
                  tabIndex={0}
                >
                  Chat
                </div>
              </div>
            </div>
            <div
              className={`nav-item has-sub ${
                openSubKey === 'MANIFEST' ? 'open' : ''
              }`}
              onMouseEnter={() => this.setState({ hoverNav: 'manifest2' })}
              onFocus={() => this.setState({ hoverNav: 'manifest2' })}
            >
              <button
                className="nav-btn"
                onClick={() => this.toggleSub('MANIFEST')}
                aria-expanded={openSubKey === 'MANIFEST'}
                aria-controls="submenu-manifest"
              >
                MANIFEST
              </button>
              <div
                id="submenu-manifest"
                className="sub-menu"
                role="region"
                aria-label="Manifest submenu"
              >
                <div
                  onMouseEnter={() => this.setState({ hoverNav: 'inventory' })}
                  onFocus={() => this.setState({ hoverNav: 'inventory' })}
                  tabIndex={0}
                >
                  Inventory
                </div>
                <div
                  onMouseEnter={() => this.setState({ hoverNav: 'spells' })}
                  onFocus={() => this.setState({ hoverNav: 'spells' })}
                  tabIndex={0}
                >
                  Spells
                </div>
                <div
                  onMouseEnter={() => this.setState({ hoverNav: 'relics' })}
                  onFocus={() => this.setState({ hoverNav: 'relics' })}
                  tabIndex={0}
                >
                  Relics
                </div>
              </div>
            </div>
          </div>
          {hoverNav && (
            <img
              className="hover-image"
              src={`/assets/dashboard/${hoverNav}.webp`}
              alt={hoverNav}
            />
          )}
        </div>
        <div className="dashboard-body">
          <div className="hero"></div>
          <div className="announcements"></div>
        </div>
        <div className="dashboard-footer"></div>
      </div>
    );
  }
}

function mapStateToProps({ auth }: { auth: object }) {
  return { auth };
}
export const Dashboard = connect(mapStateToProps, { logoutUser })(
  withRouter(UnwrappedDashboard)
);
