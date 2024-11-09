import React from 'react';
import _ from 'lodash';
import './CharacterSelect.scss';

import { characters, modes } from './charactersModes';

interface CharacterSelectProps {
  color: string;
  isOpen: string;
  sendCharacterSelect: (character: CharacterType) => void;
  handleToggle: () => void;
}
interface CharacterSelectState {}

interface CharacterType {
  name: string;
  inventory: ArcanaDetail[];
  setup: string;
  imagePath: string;
}

interface ArcanaDetail {
  id: string;
  name: string;
  description: string;
  type: string;
  imagePath: string;
}

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
      <>
        {this.props.isOpen === this.props.color && (
          <div className="character-block">
            {_.map(characters, (character, key) => {
              return (
                <img
                  key={key}
                  className="character"
                  src={`${character.imagePath}.svg`}
                  style={{
                    cursor:
                      "url('/assets/images/cursors/pointer.svg') 12 4, pointer",
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  onClick={() => {
                    this.props.sendCharacterSelect(character);
                    this.props.handleToggle();
                  }}
                />
              );
            })}
          </div>
        )}
      </>
    );
  }
}
