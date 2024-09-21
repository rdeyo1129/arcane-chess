import React from 'react';
import Button from 'src/components/Button/Button';
import { Link } from 'react-router-dom';
import { withRouter } from 'src/components/withRouter/withRouter';
import './Manifest.scss';

type State = {
  currentTab: string;
};
class UnwrappedManifest extends React.Component<object, State> {
  constructor(props: object) {
    super(props);
    this.state = {
      currentTab: 'mission',
    };
  }
  render() {
    return (
      <div className="manifest">
        <div className="container">
          <div className="nav">
            <Link to="/dashboard">
              <Button
                text="BACK"
                className="tertiary"
                color="B"
                width={160}
                height={50}
                disabled={false}
                backgroundColorOverride="#11111188"
              />
            </Link>
            <Button
              text="MISSION"
              className="tertiary"
              onClick={() => {
                this.setState({
                  currentTab: 'mission',
                });
              }}
              color="B"
              width={160}
              height={50}
              disabled={false}
              backgroundColorOverride="#11111188"
            />
            <Button
              text="ABOUT"
              className="tertiary"
              onClick={() => {
                this.setState({
                  currentTab: 'about',
                });
              }}
              color="B"
              width={160}
              height={50}
              disabled={false}
              backgroundColorOverride="#11111188"
            />
            <Button
              text="LINKS"
              className="tertiary"
              onClick={() => {
                this.setState({
                  currentTab: 'links',
                });
              }}
              color="B"
              width={160}
              height={50}
              disabled={false}
              backgroundColorOverride="#11111188"
            />
            <Button
              text="NOTES"
              className="tertiary"
              onClick={() => {
                this.setState({
                  currentTab: 'notes',
                });
              }}
              color="B"
              width={160}
              height={50}
              disabled={false}
              backgroundColorOverride="#11111188"
            />
            {/* <Button
              text="TOS"
              className="tertiary"
              onClick={() => {
                this.setState({
                  currentTab: 'tos',
                });
              }}
              color="B"
              width={160}
              height={50}
              disabled={false}
              backgroundColorOverride="#11111188"
            />
            <Button
              text="PRIVACY"
              className="tertiary"
              onClick={() => {
                this.setState({
                  currentTab: 'privacy',
                });
              }}
              color="B"
              width={160}
              height={50}
              disabled={false}
              backgroundColorOverride="#11111188"
            /> */}
          </div>
          <div className="content">
            {this.state.currentTab === 'mission' ? (
              <div id="mission" className="mission">
                <h2>Misson Statement:</h2>
                <ol style={{ listStyleType: 'decimal' }}>
                  <li>
                    To create a free and open-source platform that empowers
                    players to delve deeply into both the technical and
                    philosophical aspects of chess, offering a comprehensive
                    learning experience that enriches their understanding of the
                    game.
                  </li>
                  <li>
                    To revolutionize the chess experience by integrating
                    immersive narratives and innovative gameplay enhancements,
                    encouraging players to think creatively and explore new
                    strategies beyond traditional gameplay.
                  </li>
                  <li>
                    To cultivate a vibrant community of chess enthusiasts, where
                    collaboration, creativity, and shared mastery are at the
                    heart of a continuously evolving and dynamic chess
                    experience. Above all, the platform emphasizes the
                    importance of having fun with the game, encouraging players
                    to enjoy each match—win or lose—as a valuable and rewarding
                    journey.
                  </li>
                </ol>
              </div>
            ) : this.state.currentTab === 'about' ? (
              <div id="about" className="about">
                <h2>About the Project:</h2>
                <p>
                  The concept for this project was first envisioned in 2017 with
                  a mission to create a powerful chess platform that fosters
                  both technical excellence and creative exploration. As an
                  open-source initiative, it is licensed under the GPL 3. (learn
                  more about{' '}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://greendrake.info/publications/js-gpl"
                  >
                    JavaScript and the GPL
                  </a>
                  ), ensuring that the project remains free for all to use,
                  modify, and contribute to.
                </p>
                <p>
                  Key dependencies include{' '}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://github.com/gbtami/chessgroundx"
                  >
                    Chessgroundx
                  </a>
                  , which powers the interactive board, and{' '}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://database.lichess.org/"
                  >
                    the amazing puzzle database
                  </a>{' '}
                  from{' '}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://lichess.org"
                  >
                    Lichess
                  </a>
                  , providing an extensive collection of tagged, themed, and
                  rated puzzles to challenge and engage users. The engine
                  theory, brought to life through{' '}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.chessprogramming.org/BlueFeverSoft"
                  >
                    BlueFever Programming
                  </a>
                  , is integral to the platform{"'"}s performance. Lastly,
                  special thanks to the{' '}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.chessvariants.com/graphics.dir/svg/alfaerie/"
                  >
                    Chess Variants website resource
                  </a>{' '}
                  for providing a consistent set of fairy chess piece images,
                  and{' '}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://game-icons.net/"
                  >
                    Game Icons
                  </a>{' '}
                  for additional graphical elements used in the project.
                </p>
                <p>
                  While the platform is free to use, we welcome donations to
                  support ongoing server costs and development efforts. These
                  contributions enable us to maintain and improve the platform,
                  ensuring it continues to serve the global chess community
                  effectively.
                </p>
              </div>
            ) : this.state.currentTab === 'links' ? (
              <div id="links" className="links">
                <div className="link">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://discord.gg/QuuNv3Gqts"
                  >
                    <Button
                      text="DISCORD"
                      className="secondary"
                      color="B"
                      width={200}
                      height={50}
                      disabled={false}
                      backgroundColorOverride="#11111188"
                    />
                  </a>
                </div>
                <div className="link">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://x.com/tactorius"
                  >
                    <Button
                      text="X"
                      className="secondary"
                      color="B"
                      width={200}
                      height={50}
                      disabled={false}
                      backgroundColorOverride="#11111188"
                    />
                  </a>
                </div>
                <div className="link">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://paypal.me/tactorius?country.x=US&locale.x=en_US"
                  >
                    <Button
                      text="PAYPAL"
                      className="secondary"
                      color="B"
                      width={200}
                      height={50}
                      disabled={false}
                      backgroundColorOverride="#11111188"
                    />
                  </a>
                </div>
                <div className="link">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://github.com/rdeyo1129/arcane-chess"
                  >
                    <Button
                      text="PROJECT REPO"
                      className="secondary"
                      color="B"
                      width={200}
                      height={50}
                      disabled={false}
                      backgroundColorOverride="#11111188"
                    />
                  </a>
                </div>
                <div className="link">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://github.com/rdeyo1129/night-chess-ui-2"
                  >
                    <Button
                      text="CHESSGROUNDx FORK"
                      className="secondary"
                      color="B"
                      width={200}
                      height={50}
                      disabled={false}
                      backgroundColorOverride="#11111188"
                    />
                  </a>
                </div>
              </div>
            ) : this.state.currentTab === 'notes' ? (
              <div id="notes" className="notes">
                <h3>v1.0.0 Release Notes</h3>
                <ul style={{ listStyleType: 'disc' }}>
                  <li>Initial site release</li>
                  <li>
                    Play options:
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                      <li>Single player story mode or quickplay vs engine</li>
                    </ul>
                  </li>
                  <li>
                    Login:
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                      <li>No forgot password</li>
                      <li>
                        Guest login with all features except for campaign scores
                        being recorded on the leaderboard
                      </li>
                    </ul>
                  </li>
                  <li>
                    Campaign:
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                      <li>Book 1 (Chapter 1-4)</li>
                      <li>Lessons: Philosophy and chess lessons</li>
                      <li>Temples: Puzzles / themed challenges</li>
                      <li>
                        Missions: Story mode scenarios with custom armies and
                        arcana
                      </li>
                      <li>
                        Collect points to hit the leaderboard, defeat the boss
                        to get to the next chapter
                      </li>
                      <li>
                        Use optional arcana to help you win battles at the cost
                        of a lower score
                      </li>
                    </ul>
                  </li>
                  <li>
                    Leaderboard:
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                      <li>
                        With an account only, attain a high score in the
                        campaign
                      </li>
                      <li>
                        Scores to be reset periodically as the campaign gets
                        updated per release
                      </li>
                    </ul>
                  </li>
                  <li>
                    Quickplay:
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                      <li>
                        Select side, army composition, custom arcana for player
                        and engine
                      </li>
                      <li>Choose engine strength</li>
                    </ul>
                  </li>
                  <li>
                    ‘Patch’ notes:
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                      <li>
                        Engine:
                        <ul
                          style={{ listStyleType: 'disc', paddingLeft: '20px' }}
                        >
                          <li>
                            Basic and advanced engine search and evaluation
                            concepts
                          </li>
                        </ul>
                      </li>
                      <li>
                        Recognized engine variants:
                        <ul
                          style={{ listStyleType: 'disc', paddingLeft: '20px' }}
                        >
                          <li>X check</li>
                          <li>King of hill (throne)</li>
                          <li>Racing kings</li>
                          <li>Crazy house</li>
                          <li>Capture all pieces victory</li>
                        </ul>
                      </li>
                      <li>
                        Royalty family additions:
                        <ul
                          style={{ listStyleType: 'disc', paddingLeft: '20px' }}
                        >
                          <li>Templar (R and N)</li>
                          <li>Mystic (N and B)</li>
                        </ul>
                      </li>
                      <li>
                        Ghost family additions:
                        <ul
                          style={{ listStyleType: 'disc', paddingLeft: '20px' }}
                        >
                          <li>
                            Spectre (5x5 pattern) - All opposite color squares
                            of the square the piece sits on
                          </li>
                          <li>
                            Wraith (5x5 pattern) - All same color squares as the
                            piece sits on
                          </li>
                        </ul>
                      </li>
                      <li>
                        Equus family additions:
                        <ul
                          style={{ listStyleType: 'disc', paddingLeft: '20px' }}
                        >
                          <li>
                            Unicorn (5x5 pattern) - Jump to Bishop’s second
                            square, Rook’s first square
                          </li>
                          <li>
                            Zebra (5x5 pattern) - Jump to Rook’s second square,
                            Bishop’s first square
                          </li>
                        </ul>
                      </li>
                      <li>
                        Arcana: Various engine-recognized badges that a single
                        player may hold that provide certain on-board
                        advantages:
                        <ul
                          style={{ listStyleType: 'disc', paddingLeft: '20px' }}
                        >
                          <li>Summon a piece to the board</li>
                          <li>
                            Royalty: A piece moves like another piece on a
                            chosen square for 4 turns
                          </li>
                          <li>
                            Entangle: Freeze a piece to a square for 4 turns
                          </li>
                          <li>
                            Summon exile (a static “duck” for the rest of the
                            game)
                          </li>
                          <li>Swap adjacent pieces with exceptions</li>
                          <li>Swap most friendly major and minor pieces</li>
                          <li>
                            Alternate move patterns, no capturing: (P - right,
                            left, back. B - Rook’s first move. N - King’s
                            pattern. R - Bishop’s first square)
                          </li>
                          <li>
                            Suspend: Prevent checks and captures for 3 turns
                          </li>
                          <li>
                            3 levels of engine move recommendations (piece only
                            / summon square only, Full move suggestion, Look at
                            the principle variation - 4 moves ahead)
                          </li>
                          <li>Future sight: Force takeback 2 moves</li>
                          <li>
                            Consume / jaws of betrayal - Capture a friendly
                            piece
                          </li>
                          <li>Fugitive - Castle while in or through check</li>
                          <li>
                            Inheritance: Promote Pawns on the second to last
                            rank
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                  <li>
                    Known bugs:
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                      <li>No last move highlights</li>
                      <li>
                        Computer will ‘pass turn’ in certain scenarios if both
                        sides have swap arcana
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            ) : // this.state.currentTab === 'tos' ? (
            //   <div id="tos" className="tos">
            //     <h2>Terms of Service</h2>
            //     <ul>
            //       <li>
            //         <strong>Do not cheat</strong> or receive assistance in any
            //         player vs. player games (from a chess computer, book,
            //         database, or another person).
            //       </li>
            //       <li>
            //         <strong>Be nice</strong> and courteous to all other players,
            //         always.
            //       </li>
            //       <li>
            //         <strong>Don{"'"}t do bad things</strong> or break any laws.
            //       </li>
            //     </ul>
            //   </div>
            // ) : this.state.currentTab === 'privacy' ? (
            //   <div id="privacy" className="privacy">
            //     <h2>Privacy Policy</h2>
            //     <p>
            //       <strong>Last updated:</strong> September 2, 2024
            //     </p>
            //     <h5>1. Introduction</h5>
            //     <p>
            //       Welcome to Tactorius. We are committed to protecting your
            //       personal information and your right to privacy. This Privacy
            //       Policy explains how we collect, use, and safeguard your
            //       information when you use our application.
            //     </p>
            //     <h5>2. Information We Collect</h5>
            //     <p>
            //       We collect the following personal information when you use our
            //       app:
            //     </p>
            //     <ul>
            //       <li>Username</li>
            //       <li>Email Address</li>
            //       <li>Password</li>
            //     </ul>
            //     <h5>3. How We Use Your Information</h5>
            //     <p>
            //       We use the information we collect for the following purposes:
            //     </p>
            //     <ul>
            //       <li>
            //         Account Creation and Authentication: To create and manage
            //         your account on our app
            //       </li>
            //       <li>
            //         Communication: To send you updates, notifications, and other
            //         relevant information related to your account or our services
            //       </li>
            //     </ul>
            //     <h5>4. How We Protect Your Information</h5>
            //     <p>
            //       We implement industry-standard security measures to protect
            //       your personal information. However, please be aware that no
            //       security system is impenetrable. We cannot guarantee the
            //       absolute security of your information.
            //     </p>
            //     <h5>5. Sharing Your Information</h5>
            //     <p>
            //       We do not share, sell, or rent your personal information to
            //       third parties. Your data is solely used to provide and improve
            //       our services.
            //     </p>
            //     <h5>6. Your Rights</h5>
            //     <p>
            //       Depending on your location, you may have certain rights
            //       regarding your personal information, such as the right to
            //       access, correct, or delete your data. If you wish to exercise
            //       any of these rights, please contact us at{' '}
            //       <a
            //         target="_blank"
            //         rel="noopener noreferrer"
            //         href="mailto:tactoriusofficial@gmail.com"
            //       >
            //         tactoriusofficial@gmail.com
            //       </a>
            //       .
            //     </p>
            //     <h5>7. Changes to This Privacy Policy</h5>
            //     <p>
            //       We may update this Privacy Policy from time to time. Any
            //       changes will be posted on this page, and the Last updated date
            //       at the top will be revised. We encourage you to review this
            //       Privacy Policy periodically to stay informed about how we are
            //       protecting your information.
            //     </p>
            //     <h5>8. Contact Us</h5>
            //     <p>
            //       If you have any questions about this Privacy Policy, please
            //       contact us at{' '}
            //       <a
            //         target="_blank"
            //         rel="noopener noreferrer"
            //         href="mailto:tactoriusofficial@gmail.com"
            //       >
            //         tactoriusofficial@gmail.com
            //       </a>
            //       .
            //     </p>
            //   </div>
            // ) :
            null}
          </div>
        </div>
        <div className="manifest-curtain"></div>
        <div className="manifest-image">
          <img
            className="manifest-image"
            src={`/assets/dashboard/manifest.webp`}
            alt={`manifest`}
          />
        </div>
      </div>
    );
  }
}

export const Manifest = withRouter(UnwrappedManifest);
