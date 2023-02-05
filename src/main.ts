import { FirstScene } from './firstScene';
import Phaser from 'phaser';

const gameConfig: Phaser.Types.Core.GameConfig = {
  width: 800,
  height: 600,
  backgroundColor: '#2c2c2c',
  type: Phaser.AUTO, // 브라우저가 WebGL을 지원할 수 있는지 자동 감지합니다. 지원하는 경우 WebGL 렌더러를 사용합니다. 그렇지 않은 경우 캔버스 렌더러로 대체됩니다.
  physics: {
    // phaser에서 제공되는 물리엔진을 설정하여 게임에 적용합니다. (type Phaser.Types.Core.PhysicsConfig)
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: [FirstScene],
};

new Phaser.Game(gameConfig);