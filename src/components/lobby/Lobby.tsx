import React from 'react';

import { withRouter } from '../withRouter/withRouter';

import { socket } from '../../lib/socket';
import { getOrCreateMultiplayerGuestId } from 'src/utils/guestId';
import Button from 'src/components/Button/Button';

export type LobbyGame = {
  gameId: string;
  hostSocketId: string;
  hostId: string; // ← newly required
  isFull: string;
  isPrivate: string;
  matchType: string;
  createdAt: string;
  joinSocketId?: string;
};

type State = {
  games: LobbyGame[];
};

interface Props {
  navigate: (path: string) => void;
}

export class Lobby extends React.Component<Props, State> {
  // cache your guestId once
  myId = getOrCreateMultiplayerGuestId();

  constructor(props: Props) {
    super(props);
    this.state = { games: [] };
  }

  componentDidMount() {
    socket.emit('lobby:list');
    socket.on('lobby:update', (games: LobbyGame[]) => {
      this.setState({ games });
    });
    socket.on('game:start', ({ gameId }: { gameId: string }) => {
      this.props.navigate(`/game/${gameId}`);
    });
  }

  componentWillUnmount() {
    socket.off('lobby:update');
    socket.off('game:start');
  }

  handleQuickfind = (timeControl: string) => {
    socket.emit('quickfind', { timeControl });
  };

  // Creates a custom game (host), then waits for a guest to join
  handleCreateGame = () => {
    // don’t let the same host open multiple customs
    const hasOpen = this.state.games.some(
      (g) => g.matchType === 'custom' && g.hostId === this.myId
    );
    if (hasOpen) {
      return alert('You already have a game open.');
    }

    socket.emit('lobby:create', {
      hostSocketId: socket.id,
      hostId: this.myId,
      isPrivate: false,
      matchType: 'custom',
    });
  };

  // Join an existing game — the server will fire `game:start` on success
  handleJoinGame = (gameId: string) => {
    socket.emit('lobby:join', { gameId });
  };

  // you can use the same hostId check for disabling the button
  hasOwnOpenGame = () =>
    this.state.games.some(
      (g) =>
        g.matchType === 'custom' &&
        g.hostId === this.myId &&
        g.isFull !== 'true'
    );

  render() {
    return (
      <div className="lobby-wrapper">
        <h2 className="lobby-title">Lobby</h2>

        {/* list all games */}
        <div className="lobby-list">
          {this.state.games.map((game) => {
            const isMine = game.hostId === this.myId;
            return (
              <div key={game.gameId} className="lobby-item">
                <span>
                  Game {game.gameId.slice(0, 6)} {isMine && '(You)'}
                </span>
                <Button
                  text={isMine ? 'Your Game' : 'Join'}
                  className="tertiary"
                  color={isMine ? 'gray' : 'B'}
                  height={40}
                  width={80}
                  disabled={isMine}
                  onClick={() => !isMine && this.handleJoinGame(game.gameId)}
                />
              </div>
            );
          })}
        </div>

        {/* quick matches */}
        <div className="lobby-section">
          <h3 className="lobby-subtitle">Quick Match</h3>
          <div className="lobby-buttons">
            {['blitz', 'rapid', 'classical'].map((tc) => (
              <Button
                key={tc}
                text={tc.charAt(0).toUpperCase() + tc.slice(1)}
                className="tertiary"
                color="B"
                height={40}
                width={100}
                onClick={() => this.handleQuickfind(tc)}
              />
            ))}
          </div>
        </div>

        {/* create game */}
        <div className="lobby-section">
          <Button
            text="Create Game"
            className="tertiary"
            color="B"
            height={50}
            width={120}
            onClick={this.handleCreateGame}
            // 3) disable visually if you want
            disabled={this.hasOwnOpenGame()}
          />
        </div>
      </div>
    );
  }
}

export default withRouter(Lobby);
