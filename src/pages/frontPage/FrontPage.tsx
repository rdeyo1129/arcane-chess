import React from 'react';
import { Link } from 'react-router-dom';

import './FrontPage.scss';
import Hero from 'src/components/hero2/Hero';

import Button from '../../components/Button/Button';

type RandomSloganState = {
  currentSlogan: string;
  currentIndex: number;
};

class UnwrappedFrontPage extends React.Component<object, RandomSloganState> {
  private slogans: string[];
  private intervalId: NodeJS.Timeout | undefined = undefined;
  constructor(props: object) {
    super(props);
    this.slogans = [
      'Principle. Preparation. Process.',
      'You wanted the Knook and we heard you.',
      'Initiative. Formulation. Execution.',
      'As in war, so in life.',
      'Is this theory?',
      "This time it's personal.",
      "Let's see a more advanced setup.",
      "Not your grandfather's Chess set.",
      'Let your Chess do the talking.',
      'Read. Recognize. React.',
      'Metagame just got a new name.',
      "User used plan. It's super effective.",
      'Difficult to learn, impossible to master.',
      'Your mind is the armory.',
      'Built for GMs, instructive for all.',
      'Patience. Planning. Persistence.',
      'The war continues... so does your learning.',
      'TikTok? This is TakTic.',
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
          <div className="header-buttons">
            <Link to={'/login'}>
              <Button
                text="ENTER"
                // onClick={() => this.calculateFen()}
                className="primary"
                color="Y"
                height={60}
                width={200}
                // disabled={this.state.fen === ''}
                disabled={false}
                // strong={true}
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
          </div>
          <Hero />
        </div>
      </div>
    );
  }
}

export const FrontPage = UnwrappedFrontPage;
