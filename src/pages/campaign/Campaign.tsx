import React from 'react';

import './Campaign.scss';
import Button from '../../components/button/Button';
import { Link } from 'react-router-dom';

export class Campaign extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      books: [
        // todo to be read from db
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
              null;
            }}
            disabled={false}
          />
        </Link>
        <div className="book-grid">
          {this.state.books.map((book, i) => {
            return (
              <Link key={i} to={`/book`}>
                <Button
                  text={book}
                  className="tertiary"
                  color="G"
                  width={200}
                  height={80}
                  onClick={() => {
                    null;
                  }}
                  disabled={book === '?'}
                />
              </Link>
            );
          })}
        </div>
      </div>
    );
  }
}
