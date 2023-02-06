import { useEffect } from 'react';
import { gameConfig, GameInstance } from './game/gameInstance';

function App() {
  useEffect(() => {
    const gameInstance = new GameInstance(gameConfig);

    return () => {
      gameInstance.destroy(true);
    };
  }, []);

  return (
    <div
      id='game-container'
      style={{
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '600px',
        maxWidth: '800px',
      }}
    />
  );
}

export default App;
