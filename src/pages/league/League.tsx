import React from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import axios from 'axios';
import { connect } from 'react-redux';
import { withRouter } from 'src/components/withRouter/withRouter';
import Select from 'src/components/Select/Select';
import Button from 'src/components/Button/Button';

import './League.scss';

interface LeagueProps {
  auth: { user: { username: string } };
}
interface LeagueState {
  currentChapterTopScores: Array<{ username: string; score: number }>;
}

export class UnwrappedLeague extends React.Component<LeagueProps, LeagueState> {
  constructor(props: any) {
    super(props);
    this.state = {
      currentChapterTopScores: [],
    };
  }

  getLeaderboard = async (chapter: string) => {
    try {
      const response = await axios.get('/api/campaign/scores', {
        params: {
          chapter: chapter,
        },
      });
      this.setState({
        currentChapterTopScores: response.data,
      });
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  componentDidMount() {
    this.getLeaderboard('1');
  }

  render() {
    const digits = (score: number | string) => {
      const formattedNumber = Number(score).toLocaleString();

      return formattedNumber.split('').map((char, index) => (
        <span key={index} className="digit-box">
          {char}
        </span>
      ));
    };
    return (
      <div className="league">
        <Link to="/dashboard">
          <Button
            text="Back"
            onClick={() => {
              return;
            }}
            className="tertiary"
            color="B"
          />
        </Link>
        <div className="outer-leaderboard">
          <Select
            width={400}
            height={40}
            options={[
              '1',
              '2',
              '3',
              '4',
              '5',
              '6',
              '7',
              '8',
              '9',
              '10',
              '11',
              '12',
            ]}
            onChange={(val) => this.getLeaderboard(val)}
          />
          <div className="leaderboard">
            {_.map(this.state.currentChapterTopScores, (score, index) => {
              if (!score.score) return;
              return (
                <div key={index} className="user-score">
                  <div className="username">{score.username}</div>
                  <div className="points">
                    <span className="digit-box">{digits(score.score)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ auth }: { auth: object }) {
  return {
    auth,
  };
}

export const League = connect(mapStateToProps, {})(withRouter(UnwrappedLeague));
