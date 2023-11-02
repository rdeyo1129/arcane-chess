import React from 'react';
import Modal from 'react-modal';
import axios from 'axios';

import { withRouter } from '../withRouter/withRouter';
import { connect } from 'react-redux';

import { setLocalStorage, getLocalStorage } from 'src/utils/handleLocalStorage';

import 'src/chessground/styles/chessground.scss';
import 'src/chessground/styles/normal.scss';
import { Chessground } from 'src/chessground/chessgroundMod';

import Button from '../Button/Button';
import Select from '../Select/Select';
import Toggle from '../Toggle/Toggle';

import './Modal.scss';

interface ModalProps {
  isOpen: boolean;
  type: string;
  imgPath?: string;
  toggleModal: () => void;
  navigate: (path: string) => void;
  auth: any;
  chapterNumber?: number;
}
interface ModalState {
  config: { [key: string]: any };
}

class UnwrappedTactoriusModal extends React.Component<ModalProps, ModalState> {
  constructor(props: ModalProps) {
    super(props);
    this.state = {
      config: {
        multiplier: 600,
        color: 'white',
        thinkingTime: 1,
        clock: false,
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

  saveSettingsStartBook = () => {
    setLocalStorage(
      this.props.auth,
      this.props.chapterNumber,
      this.state.config,
      {},
      {},
      ''
    );
    this.props.navigate('/book');
  };

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
            <div className="multiplier-settings-buttons">
              <span className="multiplier">
                x{this.state.config.multiplier} points
              </span>
              <div className="settings">
                <div className="settings-block">
                  <Select
                    options={['White', 'Black']}
                    title="Color"
                    type="string"
                    onChange={(val) =>
                      this.updateConfig(
                        val,
                        'color',
                        val === 'White' ? -450 : 450
                      )
                    }
                  />
                </div>
                <div className="settings-block">
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
                </div>
                <div className="settings-block">
                  <Toggle
                    title="Clock"
                    callback={(val: boolean) =>
                      this.updateConfig(val, 'clock', val ? 300 : -300)
                    }
                  />
                </div>
                <div className="settings-block">
                  <Toggle
                    title="Blunder Vision"
                    callback={(val: boolean) =>
                      this.updateConfig(val, 'blunderVision', val ? -200 : 200)
                    }
                  />
                </div>
                <div className="settings-block">
                  <Toggle
                    title="Threat Vision"
                    callback={(val) =>
                      this.updateConfig(val, 'threatVision', val ? -100 : 100)
                    }
                  />
                </div>
                <div className="settings-block">
                  <Toggle
                    title="Check Vision"
                    callback={(val) =>
                      this.updateConfig(val, 'checkVision', val ? -100 : 100)
                    }
                  />
                </div>
                <div className="settings-block">
                  <Toggle
                    title="Hints"
                    callback={(val) =>
                      this.updateConfig(val, 'hints', val ? -100 : 100)
                    }
                  />
                </div>
              </div>
              <div className="buttons">
                <Button
                  text="CANCEL"
                  className="secondary"
                  color="V"
                  onClick={() => this.props.toggleModal()}
                />
                <Button
                  text="START"
                  className="primary"
                  color="V"
                  onClick={() => this.saveSettingsStartBook()}
                />
              </div>
            </div>
          </Modal>
        ) : this.props.type === 'armory' ? (
          <Modal
            style={armoryModal}
            isOpen={this.props.isOpen}
            ariaHideApp={false}
          >
            hello armory
            <div className="cg-wrap armory-board">
              <Chessground
                // fen={this.state.fenHistory[this.state.fenHistory.length - 1]}
                // check={this.tactorius.inCheck().isAttacked}
                // viewOnly={this.isCheckmate()}
                fen="8/8/P7/QRRRRK2"
                coordinates={false}
                // notation={true}
                // onChange={(move) => {
                //   console.log('hello', move);
                // }}
                resizable={true}
                wFaction={'normal'}
                bFaction={'normal'}
                // wRoyalty={this.state.wRoyalty}
                // bRoyalty={this.state.bRoyalty}
                // wVisible={this.state.wVisCount === 0}
                // bVisible={this.state.bVisCount === 0}
                // width={520}
                // height={520}
                width={480}
                height={240}
                // inline styling for aspect ratio? OR interpolating in this case based on the page type, use a global state string?
                // don't, just go by the page type
                // width={360}
                // height={360}
                animation={{
                  enabled: true,
                  duration: 1,
                }}
                highlight={{
                  lastMove: false,
                  check: true,
                }}
                // orientation={this.state.orientation}
                disableContextMenu={false}
                // turnColor={GameBoard.side === 0 ? 'white' : 'black'}
                // movable={{
                //   free: false,
                //   // todo swap out placeholder for comment
                //   // color: "both",
                //   color: GameBoard.side === 0 ? 'white' : 'black',
                //   // todo show summon destinations
                //   dests: this.arcaneChess().getGroundMoves(),
                // }}
                dimensions={{
                  height: 4,
                  width: 8,
                }}
                events={{
                  change: () => {
                    // if (this.state.)
                    // this.setState({
                    //   fen:
                    // })
                    // this.arcaneChess().engineReply();
                    // this.setState({})
                    // console.log(cg.FEN);
                    // send moves to redux store, then to server (db), then to opponent
                  },
                  // move: (orig, dest, capturedPiece) => {
                  //   const parsed = this.arcaneChess().makeUserMove(orig, dest);
                  //   console.log(generatePowers());
                  //   if (!PrMove(parsed)) {
                  //     console.log('invalid move');
                  //     debugger; // eslint-disable-line
                  //   }
                  //   this.setState((prevState) => ({
                  //     history: [...prevState.history, PrMove(parsed)],
                  //     fenHistory: [
                  //       ...prevState.fenHistory,
                  //       outputFenOfCurrentPosition(),
                  //     ],
                  //   }));
                  //   this.engineGo();
                  // },
                  // select: (key) => {
                  //   ParseFen(this.state.fen);
                  //   AddPiece(prettyToSquare(key), PIECES.wN);
                  //   this.setState({
                  //     fen: outputFenOfCurrentPosition(),
                  //     fenHistory: [outputFenOfCurrentPosition()],
                  //   });
                  // },
                }}
              />
            </div>
          </Modal>
        ) : (
          <div>other modal</div>
        )}
      </div>
    );
  }
}

// please do mapstatetoprops stuff

function mapStateToProps({ auth }: { auth: any }) {
  return {
    auth,
  };
}

const TactoriusModal = connect(
  mapStateToProps,
  {}
)(withRouter(UnwrappedTactoriusModal));

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

const armoryModal = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: 'auto',
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
