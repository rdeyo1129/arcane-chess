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
        '?',
        '?',
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
      chapter: getLocalStorage(this.props.auth.user.id).chapter,
    };
  }

  render() {
    const { auth } = this.props;
    const { campaign, id } = this.props.auth.user;
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
            const isUnlocked = campaign.topScores[i - 1] || i === 0;
            const isInProgress = this.state.chapter === i + 1;
            return (
              <Button
                key={i}
                text={book}
                className="tertiary"
                color="V"
                width={200}
                height={80}
                onClick={() => {
                  if (this.state.chapter !== 0) {
                    this.props.navigate('/book');
                  } else {
                    this.setState({ configModalOpen: true, chapter: i + 1 });
                  }
                }}
                disabled={!isUnlocked && !isInProgress}
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
            setLocalStorage({ user: { id: '' } }, 0, {}, {}, {}, '');
            this.setState({ chapter: 0 });
          }}
          disabled={false}
        />
        <TactoriusModal
          toggleModal={() => {
            setLocalStorage(auth, 0, {}, {}, {}, '');
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
