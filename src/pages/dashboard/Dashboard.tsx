import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logoutUser } from '../../actions/authActions';
import { withRouter } from 'src/components/withRouter/withRouter';
import './Dashboard.scss';

type DashboardProps = { auth: { user: { username: string } } };
type DashboardState = { openSubKey: string | null; hoverKey: string };

/** Each key gets:
 *  - description: what to show in the desc rail
 *  - imageKey: which image to use for the hover art (parents for subs)
 */
const NAV_META: Record<string, { description: string; imageKey: string }> = {
  // Primary
  campaign1: {
    description: 'Collect arcana. Defeat bosses. Climb ranks.',
    imageKey: 'campaign1',
  },
  lexicon: {
    description: 'Reference rules, tactics, and lore.',
    imageKey: 'lexicon',
  },
  leaderboard2: {
    description: 'Global rankings and ladders.',
    imageKey: 'leaderboard2',
  },
  // Arena (parent + subs share the ARENA image)
  arena: {
    description: 'Battle modes vs the engine.',
    imageKey: 'quickplay',
  },
  quickplay: {
    description:
      'Master the arcana and challenge the engine with custom battles.',
    imageKey: 'quickplay',
  },
  gauntlet: {
    description: 'Draft an army. Survive waves.',
    imageKey: 'arena',
  },
  skirmish: {
    description: 'Faction matchups with custom spells.',
    imageKey: 'arena',
  },
  melee: {
    description: 'Quickplay from a shared arcana pool.',
    imageKey: 'arena',
  },
  // Forum (parent uses forum image; no visible subs yet)
  forum: {
    description: 'Community news and discussions.',
    imageKey: 'forum',
  },
  // Manifest (parent + subs share the MANIFEST image)
  manifest2: {
    description: 'Pieces, spells, and site info.',
    imageKey: 'manifest2',
  },
  about: {
    description: 'About, mission, terms.',
    imageKey: 'manifest2',
  },
  pieces: {
    description: 'View all classic and new units.',
    imageKey: 'manifest2',
  },
  arcana: {
    description: 'Spell Chess details.',
    imageKey: 'manifest2',
  },
  // Right rail
  settings: {
    description: 'Profile, preferences, UI.',
    imageKey: 'settings',
  },
  logout: {
    description: 'Save progress and sign out.',
    imageKey: 'logout',
  },
};

export class UnwrappedDashboard extends React.Component<
  DashboardProps,
  DashboardState
> {
  rootRef: React.RefObject<HTMLDivElement>;
  constructor(props: DashboardProps) {
    super(props);
    this.state = { openSubKey: null, hoverKey: '' };
    this.toggleSub = this.toggleSub.bind(this);
    this.handleGlobalClick = this.handleGlobalClick.bind(this);
    this.rootRef = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleGlobalClick);
    document.addEventListener('keydown', this.handleEscape);
  }
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleGlobalClick);
    document.removeEventListener('keydown', this.handleEscape);
  }

  handleGlobalClick(e: MouseEvent) {
    if (!this.rootRef.current) return;
    if (!this.rootRef.current.contains(e.target as Node)) {
      this.setState({ openSubKey: null });
    }
  }
  handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this.setState({ openSubKey: null });
  };
  toggleSub(key: string) {
    this.setState((prev) => ({
      openSubKey: prev.openSubKey === key ? null : key,
    }));
  }

  setHover = (key: string) => this.setState({ hoverKey: key });

  render() {
    const { openSubKey, hoverKey } = this.state;
    const imageKey = (hoverKey && NAV_META[hoverKey]?.imageKey) || 'campaign1'; // default fallback
    const desc = (hoverKey && NAV_META[hoverKey]?.description) || '';

    return (
      <div className="dashboard" ref={this.rootRef}>
        <div className="dashboard-header">
          <div className="header-icons">
            <Link
              className="home-button"
              to="/"
              onMouseEnter={() => this.setHover('')}
            >
              <img className="logo" src="/assets/logoall+.png" alt="" />
            </Link>
            <img className="avatar" src="/assets/avatars/normal.webp" alt="" />
          </div>

          <div className="xp-panel">
            <div className="xp-left">
              <div className="xp-user">{this.props.auth.user.username}</div>
              <div className="xp-stats">
                <div className="xp-points">XP 1,240</div>
                <div className="xp-level">LV 12</div>
              </div>
              <div className="xp-bar">
                <div className="xp-fill" style={{ width: '45%' }} />
              </div>
            </div>
            <img
              className="avatar-inline"
              src="/assets/avatars/normal.webp"
              alt=""
            />
          </div>

          <div className="nav-right">
            <div className="right-actions">
              <Link
                className="nav-item"
                to="/settings"
                onMouseEnter={() => this.setHover('settings')}
                onFocus={() => this.setHover('settings')}
              >
                SETTINGS
              </Link>
              <Link
                className="nav-item"
                to="/logout"
                onMouseEnter={() => this.setHover('logout')}
                onFocus={() => this.setHover('logout')}
              >
                LOGOUT
              </Link>
            </div>
            <div className="desc-rail" aria-live="polite">
              {desc}
            </div>
          </div>

          <div
            className="nav-left"
            onClick={() => this.setState({ openSubKey: null })}
          >
            <Link
              className="nav-link"
              to="/campaign"
              onMouseEnter={() => this.setHover('campaign1')}
              onFocus={() => this.setHover('campaign1')}
            >
              <button
                className="nav-btn"
                aria-expanded={openSubKey === 'CAMPAIGN'}
              >
                CAMPAIGN
              </button>
            </Link>

            <Link
              className="nav-link"
              to="/leaderboard"
              onMouseEnter={() => this.setHover('leaderboard2')}
              onFocus={() => this.setHover('leaderboard2')}
            >
              <button
                className="nav-btn"
                aria-expanded={openSubKey === 'RANKINGS'}
              >
                RANKINGS
              </button>
            </Link>

            <Link
              className="nav-link"
              to="/lexicon"
              onMouseEnter={() => this.setHover('lexicon')}
              onFocus={() => this.setHover('lexicon')}
            >
              <button
                className="nav-btn"
                aria-expanded={openSubKey === 'LEXICON'}
              >
                LEXICON
              </button>
            </Link>

            {/* ARENA + submenu */}
            <div
              className={`nav-item has-sub ${
                openSubKey === 'ARENA' ? 'open' : ''
              }`}
              onMouseEnter={() => this.setHover('arena')}
              onFocus={() => this.setHover('arena')}
            >
              <button
                className="nav-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  this.toggleSub('ARENA');
                }}
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
                onClick={(e) => e.stopPropagation()}
              >
                <Link
                  to="/quickplay"
                  onClick={(e) => e.preventDefault()}
                  onMouseEnter={() => this.setHover('quickplay')}
                  onFocus={() => this.setHover('quickplay')}
                >
                  QUICKPLAY
                </Link>
                <Link
                  // to="/gauntlet"
                  to="#"
                  onClick={(e) => e.preventDefault()}
                  onMouseEnter={() => this.setHover('gauntlet')}
                  onFocus={() => this.setHover('gauntlet')}
                >
                  GAUNTLET
                </Link>
                <Link
                  // to="/skirmish"
                  to="#"
                  onClick={(e) => e.preventDefault()}
                  onMouseEnter={() => this.setHover('skirmish')}
                  onFocus={() => this.setHover('skirmish')}
                >
                  SKIRMISH
                </Link>
                <Link
                  // to="/melee"
                  to="#"
                  onClick={(e) => e.preventDefault()}
                  onMouseEnter={() => this.setHover('melee')}
                  onFocus={() => this.setHover('melee')}
                >
                  MELEE
                </Link>
              </div>
            </div>

            {/* FORUM (no visible subs yet) */}
            <div
              className={`nav-item has-sub ${
                openSubKey === 'FORUM' ? 'open' : ''
              }`}
              onMouseEnter={() => this.setHover('forum')}
              onFocus={() => this.setHover('forum')}
            >
              <button
                className="nav-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  this.toggleSub('FORUM');
                }}
                aria-expanded={openSubKey === 'FORUM'}
              >
                FORUM
              </button>
              <div
                id="submenu-forum"
                className="sub-menu"
                role="region"
                onClick={(e) => e.stopPropagation()}
              >
                {/* future submenu items */}
              </div>
            </div>

            {/* MANIFEST + submenu */}
            <div
              className={`nav-item has-sub ${
                openSubKey === 'MANIFEST' ? 'open' : ''
              }`}
              onMouseEnter={() => this.setHover('manifest2')}
              onFocus={() => this.setHover('manifest2')}
            >
              <button
                className="nav-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  this.toggleSub('MANIFEST');
                }}
                aria-expanded={openSubKey === 'MANIFEST'}
              >
                MANIFEST
              </button>
              <div
                id="submenu-manifest"
                className="sub-menu"
                role="region"
                onClick={(e) => e.stopPropagation()}
              >
                <Link
                  to="/manifest?tab=about"
                  onMouseEnter={() => this.setHover('about')}
                  onFocus={() => this.setHover('about')}
                >
                  ABOUT
                </Link>
                <Link
                  to="/manifest?tab=pieces"
                  onMouseEnter={() => this.setHover('pieces')}
                  onFocus={() => this.setHover('pieces')}
                >
                  PIECES
                </Link>
                <Link
                  to="/manifest?tab=arcana"
                  onMouseEnter={() => this.setHover('arcana')}
                  onFocus={() => this.setHover('arcana')}
                >
                  ARCANA
                </Link>
              </div>
            </div>
          </div>

          {imageKey && (
            <img
              className="hover-image"
              src={`/assets/dashboard/${imageKey}.webp`}
              alt={hoverKey || 'hover-art'}
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

function mapStateToProps({ auth }: { auth: any }) {
  return { auth };
}
export const Dashboard = connect(mapStateToProps, { logoutUser })(
  withRouter(UnwrappedDashboard)
);
