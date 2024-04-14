import React from 'react';
import { connect } from 'react-redux';

import { withRouter } from 'src/components/withRouter/withRouter';

import './Campaign.scss';

import { setLocalStorage, getLocalStorage } from 'src/utils/handleLocalStorage';

import Button from 'src/components/Button/Button';
import TactoriusModal from 'src/components/Modal/Modal';

import { Link } from 'react-router-dom';

// Define the structure for props if any are expected
interface CampaignProps {
  auth: any;
  navigate: (path: string) => void;
}

// Define the structure for the state
interface CampaignState {
  books: string[];
  configModalOpen: boolean;
  chapter: number;
}

export class UnwrappedCampaign extends React.Component<
  CampaignProps,
  CampaignState
> {
  constructor(props: CampaignProps) {
    super(props);
    this.state = {
      books: [
        // TODO: To be read from db
        'ARRIVAL',
        'ANAMNESIS',
        'PENTAGRAMS',
        '?',
        '?',
        '?',
        '?',
        '?',
        '?',
        '?',
        '?',
        '?',
      ],
      configModalOpen: false,
      chapter: getLocalStorage(this.props.auth.user.username)?.chapter || 0,
    };
  }

  render() {
    return (
      <div className="campaign">
        <Link to="/dashboard">
          <Button
            text="BACK"
            className="tertiary"
            color="V"
            width={120}
            height={40}
            disabled={false}
          />
        </Link>
        <div className="book-grid">
          {this.state.books.map((book, i) => {
            const LS = getLocalStorage(this.props.auth.user.username);
            const isUnlocked =
              LS.auth.user.campaign.topScores[i - 1] || i === 0;
            return (
              <Button
                key={i}
                text={isUnlocked ? book : '?'}
                className="tertiary"
                color="V"
                width={200}
                height={80}
                onClick={() => {
                  if (this.state.chapter !== 0) {
                    this.props.navigate('/chapter');
                  } else {
                    this.setState({ configModalOpen: true, chapter: i + 1 });
                  }
                }}
                disabled={
                  !isUnlocked || (LS.chapter !== 0 && LS.chapter !== i + 1)
                }
              />
            );
          })}
        </div>
        <Button
          text="RESET CHAPTER"
          className="tertiary"
          color="V"
          width={160}
          height={40}
          onClick={() => {
            const currLS = getLocalStorage(this.props.auth.user.username);
            setLocalStorage({
              ...currLS,
              chapter: 0,
              config: {},
              nodeScores: {},
              inventory: {},
              nodeId: '',
              chapterEnd: false,
            });
            this.setState({ chapter: 0 });
          }}
          disabled={false}
        />
        <TactoriusModal
          toggleModal={() => {
            const currLS = getLocalStorage(this.props.auth.user.username);
            setLocalStorage({
              ...currLS,
              chapter: 0,
              config: {},
              nodeScores: {},
              inventory: {},
              nodeId: '',
              chapterEnd: false,
            });
            this.setState({ configModalOpen: false, chapter: 0 });
          }}
          chapterNumber={this.state.chapter}
          isOpen={this.state.configModalOpen}
          type="bookSettings"
          imgPath="public/assets/treeBoat.jpg"
        />
      </div>
    );
  }
}

function mapStateToProps({ auth }: { auth: any }) {
  return {
    auth,
  };
}

export const Campaign = connect(
  mapStateToProps,
  {}
)(withRouter(UnwrappedCampaign));
