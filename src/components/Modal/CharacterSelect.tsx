import React from 'react';
import _ from 'lodash';
import './CharacterSelect.scss';

interface CharacterSelectProps {}
interface CharacterSelectState {}

export default class CharacterSelect extends React.Component<
  CharacterSelectProps,
  CharacterSelectState
> {
  constructor(props: CharacterSelectProps) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="character-block">
        {_.times(12, (i) => {
          return (
            <div
              className="character"
              style={{ background: 'navy', width: '60px', height: '60px' }}
            >
              {i}
            </div>
          );
        })}
      </div>
    );
  }
}
