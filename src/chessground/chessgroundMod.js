import React from 'react';
import { propTypes } from './propTypes';
import { Chessground as NativeChessground } from 'chessgroundx';

import './styles/chessground.css';

// import './styles/normal.css';
// import './styles/sigma.css';
// import './styles/omega.css';
// import './styles/lambda.css';
// import './styles/mu.css';
// import './styles/nu.css';
// import './styles/chi.css';

export class Chessground extends React.Component {
  buildConfigFromProps(props) {
    const config = { events: {} };

    Object.keys(propTypes).forEach((k) => {
      const v = props[k];

      if (typeof v !== 'undefined') {
        const match = k.match(/^on([A-Z]\S*)/);

        if (match) {
          config.events[match[1].toLowerCase()] = v;
        } else {
          config[k] = v;
        }
      }
    });

    return config;
  }

  componentDidMount() {
    this.cg = NativeChessground(this.el, this.buildConfigFromProps(this.props));
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.cg.set(this.buildConfigFromProps(this.props));
    }
  }

  componentWillUnmount() {
    this.cg.destroy();
  }

  render() {
    // const props = { style: { ...this.props.style } };

    const props = {};

    // if (this.props.width) {
    //   props.style.width = this.props.width;
    // }

    // if (this.props.height) {
    //   props.style.height = this.props.height;
    // }

    return <div ref={(el) => (this.el = el)} {...props} />;
  }
}
