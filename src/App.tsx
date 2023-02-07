import { useEffect } from 'react';
import { Box, Container } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import { gameConfig, GameInstance } from './game/gameInstance';

function App() {
  useEffect(() => {
    const gameInstance = new GameInstance(gameConfig);

    return () => {
      gameInstance.destroy(true);
    };
  }, []);

  return (
    <>
      <Navbar />
      <Box as='main' padding={4} paddingTop={14}>
        <Container
          id='game-container'
          display='flex'
          flexDirection='column'
          maxHeight='600px'
          maxWidth='800px'
        />
      </Box>
    </>
  );
}

export default App;
