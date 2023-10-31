import React from 'react';
import Modal from 'react-modal';

import Button from '../Button/Button';
import Select from '../Select/Select';
import Toggle from '../Toggle/Toggle';

import './Modal.scss';

const multiplierMap = {};

interface ModalProps {
  isOpen: boolean;
  type: string;
  imgPath?: string;
}
interface ModalState {
  config: { [key: string]: any };
}

class TactoriusModal extends React.Component<ModalProps, ModalState> {
  constructor(props: ModalProps) {
    super(props);
    this.state = {
      config: {
        multiplier: 900,
        color: 'white',
        thinkingTime: 4,
        clock: true,
        blunderVision: false,
        threatVision: false,
        checkVision: false,
        hints: false,
      },
    };
  }

  updateConfig = (
    value:
      | boolean
      | string
      | number
      | null
      | React.ChangeEvent<HTMLSelectElement>,
    key: string,
    multiplier: number
  ) => {
    this.setState((prevState) => ({
      config: {
        ...this.state.config,
        [key]: value,
        multiplier: prevState.config.multiplier + multiplier,
      },
    }));
  };

  // todo save to local storage and update chapter number to db on click save or submit? FC?
  // todo dyanmicize for different types
  // book setttings
  // endgame
  // promotion

  render() {
    return (
      <div className="container">
        {this.props.type === 'bookSettings' ? (
          <Modal
            style={bookSettingsModal}
            isOpen={this.props.isOpen}
            ariaHideApp={false}
          >
            <div className="image-text">
              <img className="image" src={this.props.imgPath} />
            </div>
            <div className="multipler-settings-buttons">
              <span className="multiplier">
                x{this.state.config.multiplier} points
              </span>
              <div className="settings">
                <Select
                  title="Thinking Time"
                  type="number"
                  options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} // or to depth x?
                  onChange={(val) =>
                    this.updateConfig(
                      val,
                      'thinkingTime',
                      (-this.state.config.thinkingTime * 100 +
                        Number(val) * 100) as number
                    )
                  }
                />
                <Select
                  options={['White', 'Black']}
                  title="Color"
                  type="string"
                  onChange={(val) =>
                    this.updateConfig(
                      val,
                      'color',
                      val === 'White' ? -400 : 400
                    )
                  }
                />
                <Toggle
                  text="Clock"
                  callback={(val: boolean) =>
                    this.updateConfig(val, 'clock', val ? 300 : -300)
                  }
                />
                <Toggle
                  text="Blunder Vision"
                  callback={(val: boolean) =>
                    this.updateConfig(val, 'blunderVision', val ? -200 : 200)
                  }
                />
                <Toggle
                  text="Threat Vision"
                  callback={(val) =>
                    this.updateConfig(val, 'threatVision', val ? -100 : 100)
                  }
                />
                <Toggle
                  text="Check Vision"
                  callback={(val) =>
                    this.updateConfig(val, 'checkVision', val ? -100 : 100)
                  }
                />
                <Toggle
                  text="Hints"
                  callback={(val) =>
                    this.updateConfig(val, 'hints', val ? -100 : 100)
                  }
                />
              </div>
              <div className="buttons">
                <Button
                  text="CANCEL"
                  className="secondary"
                  color="V"
                  // onClick={() => console.log('save')}
                />
                <Button
                  text="START"
                  className="primary"
                  color="V"
                  // onClick={() => console.log('save')}
                />
              </div>
            </div>
          </Modal>
        ) : (
          <div>other modal</div>
        )}
      </div>
    );
  }
}

export default TactoriusModal;

const bookSettingsModal = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    height: '500px',
    width: '1000px',
    background: '#111111',
    borderRadius: '10px',
    border: '2px solid #a043a2',
  },
  overlay: {
    zIndex: 10,
    backgroundColor: '#111111EE',
  },
};
