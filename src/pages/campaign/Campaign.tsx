import React from 'react';
import { connect } from 'react-redux';

import './Campaign.scss';

import Button from 'src/components/Button/Button';
import TactoriusModal from 'src/components/Modal/Modal';

import { Link } from 'react-router-dom';

// Define the structure for props if any are expected
interface CampaignProps {
  auth: any;
}

// Define the structure for the state
interface CampaignState {
  books: string[];
  configModalOpen: boolean;
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
    };
  }

  render() {
    const { campaign } = this.props.auth.user;
    return (
      <div className="campaign">
        <Link to="/dashboard">
          <Button
            text="BACK"
            className="tertiary"
            color="V"
            width={120}
            height={40}
            onClick={() => {
              // Placeholder for onClick function
            }}
            disabled={false}
          />
        </Link>
        <div className="book-grid">
          {this.state.books.map((book, i) => {
            const isUnlocked = campaign.topScores[i - 1] || i === 0;
            const isInProgress = campaign.chapter === i;
            return (
              <Button
                key={i}
                text={book}
                className="tertiary"
                color="V"
                width={200}
                height={80}
                onClick={() => {
                  this.setState({ configModalOpen: true });
                }}
                disabled={!isUnlocked && !isInProgress}
              />
            );
          })}
        </div>
        <TactoriusModal
          toggleModal={() => {
            this.setState({ configModalOpen: false });
          }}
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

export const Campaign = connect(mapStateToProps, {})(UnwrappedCampaign);
