import React from 'react';
import './Clock.scss';

//
// multiplayer to pass down current nodejs.timeouts from server level
//

interface ClockProps {
  playerTurn: boolean;
  turn: string;
  time: number | null;
  inc: number | null;
  playerTimeout: () => void;
  // whiteTimeout: () => void;
  // blackTimeout: () => void;
}

interface ClockState {
  timeLeft: number | null;
  isActive: boolean;
  isPlayerOneTurn: boolean;
}

class ChessClock extends React.Component<ClockProps, ClockState> {
  interval: NodeJS.Timeout | null = null;

  constructor(props: ClockProps) {
    super(props);
    this.state = {
      timeLeft: props.time,
      isActive: true,
      isPlayerOneTurn: true,
    };
  }

  startTimer = () => {
    if (!this.interval) {
      this.interval = setInterval(() => {
        this.setState(
          (prevState) => ({
            timeLeft:
              prevState.timeLeft !== null ? prevState.timeLeft - 1 : null,
          }),
          () => {
            if (this.state.timeLeft === 0) {
              this.props.playerTimeout();
              this.stopTimer();
            }
          }
        );
      }, 1000);
    }
  };

  stopTimer = () => {
    console.log('Stopping timer');
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  };

  toggleTimer = () => {
    this.setState((prevState) => ({ isActive: !prevState.isActive }));
  };

  // switchPlayer = () => {
  //   this.stopTimer(); // Ensures the current timer is stopped before switching.
  //   this.setState(
  //     {
  //       isPlayerOneTurn: this.props.playerTurn ?? true, // Assuming true defaults to Player 1
  //       timeLeft: this.props.time,
  //       isActive: true, // Set to true to indicate the timer should be active
  //     },
  //     () => {
  //       // Ensure the timer is stopped before starting a new one to prevent overlaps
  //       if (!this.interval) {
  //         // this.startTimer(); // Start the timer only if it's not already running
  //       }
  //     }
  //   );
  // };

  componentDidUpdate(prevProps: ClockProps, prevState: ClockState) {
    // Example condition adjustment to stop the timer immediately when the player's turn ends
    if (
      this.props.playerTurn !== prevProps.playerTurn &&
      !this.props.playerTurn
    ) {
      this.stopTimer(); // Ensure timer is stopped as soon as it's not the player's turn
    }

    // Start the timer only when it's the player's turn
    if (this.props.playerTurn && !this.interval) {
      this.startTimer();
    }

    // Handle timer expiration
    if (
      this.state.timeLeft === 0 &&
      this.state.timeLeft !== prevState.timeLeft
    ) {
      this.props.playerTimeout(); // Call the timeout handler
      this.stopTimer(); // Ensure timer is stopped
    }
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  componentDidMount() {
    console.log('ChessClock mounted with initialTime:', this.props.time);
    this.startTimer();
  }

  render() {
    const { timeLeft, isActive } = this.state;
    const { time } = this.props;

    let timerWidth = 0;
    let timerColor = 'green';

    if (timeLeft !== null && time !== null) {
      timerWidth = (timeLeft / time) * 100;
      timerColor = timerWidth < 10 ? 'red' : 'green';
    }

    return (
      <div>
        <div className="time-text">{this.state.timeLeft}</div>
      </div>
    );
  }
}

export default ChessClock;
