import React from 'react';

import './Clock.scss';

interface ClockProps {
  initialTime: number | null; // Make sure this is passed as a number and not null
}

interface ClockState {
  timeLeft: number | null;
  isActive: boolean;
  playerTurn: string;
}

class ChessClock extends React.Component<ClockProps, ClockState> {
  interval: NodeJS.Timeout | null = null;

  constructor(props: ClockProps) {
    super(props);
    this.state = {
      timeLeft: props.initialTime,
      isActive: true,
      playerTurn: 'Player 1',
    };
  }

  startTimer = () => {
    if (!this.interval) {
      this.interval = setInterval(() => {
        this.setState((prevState) => ({
          timeLeft: prevState.timeLeft !== null ? prevState.timeLeft - 1 : null,
        }));
      }, 1000);
    }
  };

  stopTimer = () => {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  };

  toggleTimer = () => {
    this.setState((prevState) => ({ isActive: !prevState.isActive }));
  };

  switchPlayer = () => {
    this.stopTimer();
    this.setState({
      playerTurn:
        this.state.playerTurn === 'Player 1' ? 'Player 2' : 'Player 1',
      timeLeft: this.props.initialTime,
      isActive: false,
    });
  };

  componentDidUpdate(prevProps: ClockProps, prevState: ClockState) {
    // Check if the timer should start or stop
    if (this.state.isActive && !this.interval) {
      this.startTimer();
    } else if (!this.state.isActive && this.interval) {
      this.stopTimer();
    }

    // Check for timer reaching zero
    if (this.state.timeLeft === 0 && prevState.timeLeft !== 0) {
      alert(`${this.state.playerTurn} ran out of time! Game over.`);
      this.stopTimer();
    }
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  componentDidMount() {
    console.log('ChessClock mounted with initialTime:', this.props.initialTime);
    this.startTimer();
  }

  render() {
    const { timeLeft, isActive } = this.state;
    const { initialTime } = this.props;

    let timerWidth = 0;
    let timerColor = 'green';

    if (timeLeft !== null && initialTime !== null) {
      timerWidth = (timeLeft / initialTime) * 100;
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
