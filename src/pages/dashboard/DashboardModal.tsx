import React from 'react';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import Button from 'src/components/Button/Button';

interface DashboardModalProps {}
interface DashboardModalState {
  isVisible: boolean;
}

export default class DashboardModal extends React.Component<
  DashboardModalProps,
  DashboardModalState
> {
  private readonly version = '2.0.0';

  constructor(props: DashboardModalProps) {
    super(props);
    this.state = {
      isVisible: true,
    };
  }

  isVisible = () => {
    const storedVersion = localStorage.getItem('dashboardModalVersion');
    if (this.state.isVisible) {
      localStorage.setItem('dashboardModalVersion', this.version);
    }
    return storedVersion !== this.version || storedVersion === null;
  };

  closeModal = () => {
    this.setState({ isVisible: false });
  };

  render() {
    return (
      <Modal
        isOpen={this.isVisible() && this.state.isVisible}
        onRequestClose={this.closeModal}
        style={dashboardModal}
      >
        <div
          style={{
            maxWidth: '700px',
            color: 'white',
            padding: '20px',
            textAlign: 'left',
          }}
        >
          <p>
            {' '}
            Hello, meda here. Thank you for visiting the site. Version{' '}
            {this.version} has just been released, bringing a host of new arcana
            (spells) for you to discover and experiment with. If you are a
            first-time visitor, I recommend starting with{' '}
            <Link to="/quickplay" style={{ color: '#00f' }}>
              {' '}
              Quick Play{' '}
            </Link>{' '}
            to explore exciting new ways to enjoy the game, or check out the{' '}
            <Link to="/manifest" style={{ color: '#00f' }}>
              {' '}
              Manifest{' '}
            </Link>{' '}
            for a deeper dive.{' '}
          </p>{' '}
          <br />{' '}
          <p>
            {' '}
            While this site is a showcase of the story, lessons, and variants,
            it is also a thought experiment. Most engines traditionally give the
            white pieces a 0.4-point starting advantage over black. With the
            introduction of conditional spells, the aim is to seek out a
            perfectly balanced start to the game but also introduce a layer of
            strategic unpredictability.{' '}
          </p>{' '}
          <br />{' '}
          <p>
            {' '}
            As always, this site is a work in progress. Your suggestions and
            constructive feedback are greatly appreciated! Join our community on{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://discord.gg/QuuNv3Gqts"
            >
              {' '}
              Discord{' '}
            </a>{' '}
            to share your thoughts or connect with other players.{' '}
          </p>
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '40px',
            }}
          >
            <Button
              text="CLOSE"
              color="B"
              className="primary"
              onClick={() => this.closeModal()}
            />
          </div>
        </div>
      </Modal>
    );
  }
}

const dashboardModal = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: 'auto',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    height: '80vh',
    width: '90vw',
    background: '#000000',
    borderRadius: '10px',
    border: 'none',
    padding: '0px',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    zIndex: 10,
    backgroundColor: '#111111AA',
  },
};