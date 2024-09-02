import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'src/components/withRouter/withRouter';
import './Manifest.scss';

class UnwrappedManifest extends React.Component {
  render() {
    return (
      <div className="manifest">
        <div className="container">
          <div className="content">
            <h3>Misson:</h3>
          </div>
        </div>
        <div className="manifest-curtain"></div>
        <div className="manifest-image">
          <img
            className="manifest-image"
            src={`/assets/dashboard/manifest.webp`}
            alt={`manifest`}
          />
        </div>
        {/* <Link
            className="home-button"
            to="https://discord.gg/JYV3SWnc"
            onMouseEnter={() => this.setState({ hoverNav: 'underground' })}
          >
            <Button
              text="UNDERGROUND"
              // onClick={() => this.calculateFen()}
              className="tertiary"
              color="B"
              height={50}
              width={160}
              // disabled={this.state.fen === ''}
              disabled={false}
              backgroundColorOverride="#11111188"
              // strong={true}
            />
          </Link> */}
      </div>
    );
  }
}

export const Manifest = withRouter(UnwrappedManifest);
