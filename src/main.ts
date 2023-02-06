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
  parent: 'root', // 게임 캔버스를 포함할 DOM 요소 또는 해당 ID
  scale: {
    mode: Phaser.Scale.FIT,
    max: { width: 1020, height: 720 },
    autoCenter: Phaser.Scale.CENTER_BOTH,
    // `fullscreenTarget` must be defined for phones to not have
    // a small margin during fullscreen.
    fullscreenTarget: 'root', // 전체 화면 모드로 전송될 DOM 요소 또는 해당 ID
    expandParent: false,
  },
  scene: [FirstScene],
};

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

new Game(gameConfig);
