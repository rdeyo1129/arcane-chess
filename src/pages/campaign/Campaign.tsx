import React from 'react';
import './Campaign.scss';
import Button from 'src/components/Button/Button';
import { Link } from 'react-router-dom';

// Define the structure for props if any are expected
interface CampaignProps {
  // Example:
  // someProp: string;
}

// Define the structure for the state
interface CampaignState {
  books: string[];
}

export class Campaign extends React.Component<CampaignProps, CampaignState> {
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
    };
  }

  render() {
    return (
      <div className="campaign">
        <Link to="/dashboard">
          <Button
            text="BACK"
            className="tertiary"
            color="G"
            width={120}
            height={40}
            onClick={() => {
              // Placeholder for onClick function
            }}
            disabled={false}
          />
        </Link>
        <div className="book-grid">
          {this.state.books.map((book, i) => (
            <Link key={i} to={`/book`}>
              <Button
                text={book}
                className="tertiary"
                color="G"
                width={200}
                height={80}
                onClick={() => {
                  // Placeholder for onClick function
                }}
                disabled={book === '?'}
              />
            </Link>
          ))}
        </div>
      </div>
    );
  }
}
