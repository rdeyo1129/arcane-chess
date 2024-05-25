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
      'You wanted the Knook and we heard you.',
      'Initiative. Formulation. Execution.',
      'Is this theory?',
      "This time it's personal.",
      "Let's see a more advanced setup.",
      "Not your grandfather's chess set.",
      'Let your chess do the talking.',
      'Read. Recognize. React.',
      'Metagame just got a new name.',
      "User used plan. It's super effective.",
      'Difficult to learn, impossible to master.',
      'Your mind is the armory.',
      'Built for GMs, instructive for all.',
      // 'Time to mitigate.',
      'Patience. Planning. Persistence.',
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
      <div className="front-page fade offset-hero">
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
        {/* <div className="divider"></div> */}
        <div className="row-a">
          <div className="intro-box">
            <div className="intro">
              <h3>
                Education in Chess has to be an education in independent
                thinking and judgment. Chess must not be memorized. - Emanuel
                Lasker
              </h3>
            </div>
            {/* <img className="image" src={'/assets/hero.webp'} alt="" /> */}
            {/* <div className="intro">
              <p>
                In a parallel universe, woven into the intricate cosmic
                tapestry, lies a unique planet governed by factions. This world
                orbits within the gravitational embrace of twin stars, creating
                a dance of shadows and light across its diverse landscapes. Each
                faction is a haven to distinct races, boasting unique cultures
                and philosophies. To maintain harmony among these varied
                peoples, a council was formed, comprising a leader from each
                faction dedicated to fostering peaceful interrelations.
              </p>
              <br />
              <p>
                The discovery of an ancient tome in the dusty recesses of a
                forgotten library marked a pivotal moment for this council. The
                book detailed an esoteric game of profound wisdom, designed for
                the keenest minds, champions of strategy and decision-making.
                Recognizing the potential of this game to bolster diplomacy and
                avert conflict, the leaders embraced it as a sacred instrument
                of governance. Yet, they also feared its power to inspire
                intellectual awakening. Thus, they agreed to shroud the game in
                secrecy.
              </p>
              <br />
              <p>
                The narrative further unravels to reveal a prophecy entwined
                with mystical abilities, hidden within the ruins of
                civilizations long extinct. Driven by a thirst for knowledge and
                power, each leader embarked on a quest, only to uncover ancient
                temples that bestowed upon them unspoken powers. Yet, these
                gifts bore the curse of corruption, leading to discord and
                rivalry among them. As whispers of the ancient game and its
                mystical potency leaked, unrest and suspicion took root among
                the factions, spiraling into a silent, cold war.
              </p>
              <br />
              <p>
                Amidst this brewing storm, in a secluded glen shrouded by the
                dense canopy of a remote forest, an enigmatic figure awakens.
                Clad in dark-brown leather armor, veiled by a grey cloak, they
                find themselves in a state of confusion, with no memories of
                their identity, yet possessed of an innate mastery over unknown
                arts. Beside them lay a bow and quiver – the only clues to their
                past. Driven by an inexplicable urge, this mysterious individual
                sets forth on a path that weaves through the heart of the
                wilderness.
              </p>
            </div> */}
          </div>
        </div>
        <Hero />
      </div>
    );
  }
}

export const FrontPage = UnwrappedFrontPage;
