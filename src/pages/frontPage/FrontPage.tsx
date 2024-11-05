import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { withRouter } from 'src/components/withRouter/withRouter';
import { connect } from 'react-redux';

import './FrontPage.scss';
import Hero from 'src/components/hero2/Hero';

import Button from '../../components/Button/Button';

import {
  loginGuest,
  getGuestUserFromLocalStorage,
} from '../../actions/authActions';

interface UserData {
  username: string;
  password: string;
  guest: boolean;
}

type FrontPageProps = {
  loginGuest: (userData: any) => void;
  registerGuest: () => void;
  navigate: (path: string) => void;
};

type RandomSloganState = {
  currentSlogan: string;
  currentIndex: number;
};

class UnwrappedFrontPage extends React.Component<
  FrontPageProps,
  RandomSloganState
> {
  private slogans: string[];
  private intervalId: NodeJS.Timeout | undefined = undefined;
  constructor(props: FrontPageProps) {
    super(props);
    this.slogans = [
      'Principle. Preparation. Process.',
      'As in war, so in life.',
      'Is this theory?',
      'Read. Recognize. React.',
      "Let's see a more advanced setup.",
      'Metagame just got a new name.',
      "User used plan. It's super effective.",
      'Patience. Planning. Persistence.',
      'Difficult to learn, impossible to master.',
      'Your mind is the armory.',
      'Less doom scroll, more square control.',
      'Initiative. Formulation. Execution.',
      'Built for GMs, instructive for all.', // fun for the aliens
      //
      'The war continues... so does your learning.',
    ];
    this.state = { currentSlogan: '', currentIndex: 0 };
  }

  fetchNextSlogan = () => {
    const nextIndex = (this.state.currentIndex + 1) % this.slogans.length;
    this.setState({
      currentSlogan: this.slogans[nextIndex],
      currentIndex: nextIndex,
    });
  };

  onSubmitLogin = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();

    let guestUserData: UserData | null = null;

    const existingGuestUser = getGuestUserFromLocalStorage();

    if (existingGuestUser) {
      guestUserData = {
        username: existingGuestUser.key,
        password: '123456',
        guest: true,
      };
    } else {
      guestUserData = {
        username: `guest_${Math.random().toString(36).substring(2)}`,
        password: '123456',
        guest: true,
      };
    }

    if (guestUserData) {
      this.props.loginGuest(guestUserData);
      this.props.navigate('/dashboard');
    } else {
      return false;
    }
  };

  componentDidMount() {
    const randomIndex = Math.floor(Math.random() * this.slogans.length);
    this.setState({
      currentSlogan: this.slogans[randomIndex],
      currentIndex: randomIndex,
    });

    this.intervalId = setInterval(this.fetchNextSlogan, 4000);
  }
  render() {
    return (
      <div className="front-page-container">
        <div className="header">
          <div className="inner-header">
            <img className="logo" src={'/assets/logogold.png'} alt="" />
            <div className="inner-header-a">
              <h1 className="tactorius" style={{ fontWeight: '800' }}>
                <div className="tact">
                  <i>TACT</i>
                </div>
                <div className="orius">
                  <i>ORIUS</i>
                </div>
              </h1>
              <p>
                <i>{this.state.currentSlogan}</i>
              </p>
            </div>
          </div>
        </div>
        <div className="front-page fade offset-hero">
          <div className="row-a">
            <div className="intro-box">
              <div className="intro">
                <h3>
                  Education in Chess has to be an education in independent
                  thinking and judgment. Chess must not be memorized.
                </h3>
                {/* <hr /> */}
                <h5>&emsp; - Emanuel Lasker, Second World Chess Champion</h5>
              </div>
            </div>
            <div className="enter-buttons">
              {/* revert to login page when ready for users */}
              <Link
                to="/dashboard"
                onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) =>
                  this.onSubmitLogin(e)
                }
              >
                <Button
                  text="ENTER THE SITE"
                  className="primary"
                  color="Y"
                  height={80}
                  width={400}
                  disabled={false}
                  styles={{
                    color: 'black',
                    fontStyle: 'italic',
                  }}
                  fontSize={24}
                  strong={true}
                />
              </Link>
              {/* <Link to={'/register'}>
              <Button
                text="REGISTER"
                // onClick={() => this.calculateFen()}
                className="secondary"
                color="Y"
                height={50}
                width={140}
                // disabled={this.state.fen === ''}
                disabled={false}
                // strong={true}
              />
            </Link> */}
            </div>
            <div className="intro-box">
              <div className="intro">
                <h3>
                  Welcome to <em>Tactorius</em>, where the timeless game of
                  Chess transforms into an epic journey of strategy,
                  imagination, and personal growth.
                </h3>
                <h3>Embark on a Campaign:</h3>
                <p>
                  Embark on an epic journey through a story teeming with
                  villains, mythical beasts, alternate histories, and the fusion
                  of spells with technology. Experience a campaign that
                  seamlessly blends the strategic depth of Chess with profound
                  personal growth and innovative storytelling. Traverse a
                  cautionary sci-fi and fantasy universe, where every move on
                  the board reveals deeper narratives. Test your skills with
                  advanced Chess concepts, solve increasingly challenging
                  puzzles, and engage in custom army battles. Earn points as you
                  progress, and see your name rise on the leaderboard with each
                  challenge you conquer.
                </p>
                <h3>Enter Arcane Chess:</h3>
                <p>
                  Step into a world where traditional Chess boundaries are
                  redefined. Utilize powerful arcana—spells that bend the
                  rules—encounter new and formidable pieces. Uncover limitless
                  possibilities for fresh tactics and a new dynamic metagame.
                </p>
                <h5>
                  <strong>
                    Your mind is the armory. Prepare it well, for every decision
                    could be the key to victory or the door to defeat.
                  </strong>
                </h5>
              </div>
            </div>
            <div className="enter-buttons">
              {/* revert to login page when ready for users */}
              <Link
                to="/dashboard"
                onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) =>
                  this.onSubmitLogin(e)
                }
              >
                <Button
                  text="ENTER THE SITE"
                  className="primary"
                  color="Y"
                  height={80}
                  width={400}
                  disabled={false}
                  styles={{
                    color: 'black',
                    marginBottom: '100px',
                    fontStyle: 'italic',
                  }}
                  fontSize={24}
                  strong={true}
                />
              </Link>
              {/* <Link to={'/register'}>
              <Button
                text="REGISTER"
                // onClick={() => this.calculateFen()}
                className="secondary"
                color="Y"
                height={50}
                width={140}
                // disabled={this.state.fen === ''}
                disabled={false}
                // strong={true}
              />
            </Link> */}
            </div>
          </div>
          <Hero />
        </div>
        <div className="front-page-footer"></div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  loginGuest: (guestUserData: UserData) => dispatch(loginGuest(guestUserData)),
});

const FrontPageNoNavigation = connect(
  null,
  mapDispatchToProps
)(withRouter(UnwrappedFrontPage));

export const FrontPage = ({ ...mapDispatchToProps }) => {
  const navigate = useNavigate();
  return <FrontPageNoNavigation {...mapDispatchToProps} navigate={navigate} />;
};
