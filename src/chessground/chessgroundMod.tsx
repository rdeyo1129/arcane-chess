import React from 'react';
import { Chessground as NativeChessground } from 'chessgroundx';

import './styles/chessground.scss';

type AnyHacker = {
  [key: string]: number | string | React.CSSProperties | null;
};

export interface IChessground {
  fen: string;
  resizable: boolean;
  wFaction: string;
  bFaction: string;
  width: number | string;
  height: number | string;
  // style: React.CSSProperties;
  enabled?: boolean;
  lastMove?: string[];
  check?: boolean;
  free?: boolean;
  color?: 'white' | 'black';
  dests?: any; // Replace `any` with a more specific type if available
  change?: () => void;
  move?: (orig: string, dest: string, capturedPiece: number) => void;
  animation?: {
    enabled: boolean;
    duration: number;
  };
  highlight?: {
    lastMove: boolean;
    check: boolean;
    royalties?: boolean;
  };
  disableContextMenu?: boolean;
  turnColor?: string;
  movable?: any; // Replace `any` with a more specific type if available
  events?: any; // Replace `any` with a more specific type if available
  forwardedRef: React.Ref<IChessgroundApi>;
  royalties?:
    | { [key: string]: { [key: string]: number | undefined } }
    | undefined;
  // Adding an index signature for additional flexibility
  [key: string]: any;
}

export interface IChessgroundApi {
  set: (config: Record<string, AnyHacker>) => void;
  destroy: () => void;
  selectPocket: (piece: object) => void;
  setShapes: (shapes: object[]) => void;
  setAutoShapes: (shapes: object[]) => void;
  getFen: () => string;
  unselect: () => void;
}

export class Chessground extends React.Component<IChessground> {
  cg: IChessground;
  el: HTMLDivElement | null = null;
  config: Record<string, any> = {};

  constructor(props: IChessground) {
    super(props);
    this.cg = {} as IChessground;
    this.config = {};
  }

  buildConfigFromProps(props: IChessground): Record<string, any> {
    const config: { events: Record<string, any>; [key: string]: any } = {
      events: {},
    };

    Object.keys(props).forEach((k) => {
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
    if (this.el) {
      this.cg = NativeChessground(
        this.el,
        this.buildConfigFromProps(this.props)
      );

      if (this.props.forwardedRef) {
        const refObj = this.props.forwardedRef as React.RefObject<IChessground>;
        if (refObj) {
          refObj.current = {
            set: this.cg.set.bind(this.cg),
            destroy: this.cg.destroy.bind(this.cg),
            selectPocket: this.cg.selectPocket.bind(this.cg),
            setShapes: this.cg.setShapes.bind(this.cg),
            setAutoShapes: this.cg.setAutoShapes.bind(this.cg),
            // Bind any other API methods you want to expose
          };
        }
      }
    }
  }

  componentDidUpdate(prevProps: IChessground) {
    if (this.props !== prevProps) {
      this.cg.set(this.buildConfigFromProps(this.props));
    }
  }

  componentWillUnmount() {
    this.cg.destroy();
  }

  render() {
    // Initialize the style object with the provided style or an empty object
    /* eslint-disable react/prop-types */ // TODO: upgrade to latest eslint tooling
    const style: React.CSSProperties =
      this.props.style && typeof this.props.style === 'object'
        ? { ...this.props.style }
        : {};

    if (this.props.width !== undefined) {
      style.width = this.props.width;
    }

    if (this.props.height !== undefined) {
      style.height = this.props.height;
    }

    const props: React.HTMLAttributes<HTMLDivElement> = {
      style: style,
    };

    return (
      <div
        ref={(el) => {
          this.el = el;
        }}
        {...props}
      ></div>
    );
  }
}

export default React.forwardRef<IChessground, IChessground>((props, ref) => (
  <Chessground {...props} forwardedRef={ref} />
));
