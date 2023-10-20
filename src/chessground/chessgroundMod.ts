import React from 'react';
import { propTypes } from './propTypes';
import { Chessground as NativeChessground } from 'chessgroundx';

import './styles/chessground.scss';

import './styles/normal.scss';
import './styles/sigma.scss';
import './styles/omega.scss';
import './styles/lambda.scss';
import './styles/mu.scss';
import './styles/nu.scss';
import './styles/chi.scss';

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

  componentWillReceiveProps(nextProps) {
    this.cg.set(this.buildConfigFromProps(nextProps));
  }

  componentWillUnmount() {
    this.cg.destroy();
  }

  render() {
    const props = { style: { ...this.props.style } };

    if (this.props.width) {
      props.style.width = this.props.width;
    }

    if (this.props.height) {
      props.style.height = this.props.height;
    }

    return <div ref={(el) => (this.el = el)} {...props}></div>;
  }
}
