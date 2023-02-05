
import Phaser from 'phaser';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  key: 'firstScene',
};

export class FirstScene extends Phaser.Scene {
  private gameOver!: boolean;
  private score: number = 0;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private stars!: Phaser.Physics.Arcade.Group;
  private bombs!: Phaser.Physics.Arcade.Group;
  private scoreText!: Phaser.GameObjects.Text;
  private defaultTextStyle: Phaser.Types.GameObjects.Text.TextStyle = {
    fontSize: '32px',
    color: '#000',
  };

  constructor() {
    super(sceneConfig);
  }

  init() {
    console.log('init');
  }
  preload() {
    console.log('preload');
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', {
      frameWidth: 32,
      frameHeight: 48,
    });
  }
  create() {
    console.log('create');

    this.add.image(400, 300, 'sky');

    this.platforms = this.physics.add.staticGroup();
    this.bombs = this.physics.add.group();
    /*
    Scene에 별을 뿌려 플레이어가 별을 수집할 수 있도록 하기 위해 stars라는 새 그룹을 만듭니다.
    움직이고 튀는 별이 필요하므로 정적 그룹 대신 동적 물리 그룹을 만듭니다.

    그룹은 설정을 돕기 위해 config 개체를 사용할 수 있습니다. 이 경우 그룹 config 개체는 세 부분으로 구성됩니다. 
    먼저 질감 키를 별 이미지로 설정합니다. 즉, config 개체의 결과로 생성된 자식은 모두 기본적으로 별 텍스처가 제공됩니다. 
    그런 다음 반복 값을 11로 설정합니다. 자동으로 1개의 자식을 생성하기 때문에 11번 반복하면 게임에 필요한 총 12개를 얻게 됩니다.

    setXY그룹이 생성하는 12개의 자식 위치를 설정하는 데 사용됩니다
    */
    this.stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    // 스코어 텍스트를 초기화하여 Scene에 렌더링
    this.scoreText = this.add.text(
      16,
      16,
      `score: ${this.score}`,
      this.defaultTextStyle,
    );

    this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    this.platforms.create(600, 400, 'ground');
    this.platforms.create(50, 250, 'ground');
    this.platforms.create(750, 220, 'ground');

    // [Player] Physics Sprite
    this.player = this.physics.add.sprite(100, 450, 'dude'); // 게임 하단에서 100 x 450 픽셀에 위치한 이라는 새 스프라이트가 생성 됩니다.
    this.player.setBounce(0.2); // 스프라이트를 생성한 후 0.2라는 약간의 바운스 값이 지정됩니다. 즉, 점프 후 착지하면 아주 약간 튕겨 나옵니다.
    this.player.setCollideWorldBounds(true);
    /* 스프라이트는 world의 경계와 충돌하도록 설정됩니다. 경계는 기본적으로 게임 차원 외부에 있습니다. 
      게임을 800 x 600으로 설정했기 때문에 플레이어는 이 영역 밖에서 달릴 수 없습니다. 
      플레이어가 화면 가장자리를 벗어나거나 상단을 통해 점프할 수 없도록 합니다. */

    /*
    [Player] 움직임에 따른 출력 프레임 설정
    
    flipping sprites: Phaser는 애니메이션 프레임을 절약하기 위해 스프라이트 뒤집기를 지원
    '왼쪽' 애니메이션은 프레임 0, 1, 2, 3을 사용하고 초당 10프레임으로 실행됩니다. 'repeat -1' 값은 애니메이션이 반복되도록 지시합니다.

    추가 정보: Phaser 3에서 애니메이션 관리자는 글로벌 시스템입니다. 
    그 안에서 생성된 애니메이션은 모든 게임 개체에서 전역적으로 사용할 수 있습니다. 
    자체 타임라인을 관리하면서 기본 애니메이션 데이터를 공유합니다. 
    이를 통해 단일 애니메이션을 한 번 정의하고 필요한 만큼 많은 게임 개체에 적용할 수 있습니다.
    */
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    /*
    Phaser에는 키보드 관리자가 내장되어 있습니다.
    이 키보드 관리자는 위/아래/왼쪽/오른쪽의 네 가지 속성으로 커서 개체에 대한 이벤트 리스너를 제공해줍니다.
    */
    this.cursors = this.input.keyboard.createCursorKeys();

    /*
    다음 코드 조각은 그룹의 모든 자식을 반복하고 0.4와 0.8 사이의 임의의 Y 바운스 값을 제공합니다. 
    바운스 범위는 0(바운스가 전혀 없음)과 1(전체 바운스) 사이입니다. 
    별은 모두 y 0에서 생성되기 때문에 중력은 플랫폼이나 지면과 충돌할 때까지 별을 아래로 끌어내립니다. 
    바운스 값은 최종적으로 휴식을 취할 때까지 무작위로 다시 바운스된다는 것을 의미합니다.

    지금처럼 코드를 실행하면 별이 게임 바닥을 뚫고 시야에서 사라질 것입니다. 
    이를 중지하려면 플랫폼과의 충돌을 확인해야 합니다. 다른 Collider 개체를 사용하여 이를 수행할 수 있습니다.
    */
    this.stars.children.iterate((child: Phaser.GameObjects.GameObject) => {
      //  Give each star a slightly different bounce
      (child as Phaser.Physics.Arcade.Sprite).setBounceY(
        Phaser.Math.FloatBetween(0.4, 0.8),
      );
    });

    /* 
    지면과 플레이어 사이의 충돌 처리
    플레이어가 플랫폼과 충돌할 수 있도록 Collider 개체를 만들 수 있습니다. 
    이 개체는 두 개의 물리 개체(그룹을 포함할 수 있음)를 모니터링하고 개체 간의 충돌 또는 겹침을 확인합니다. 
    그런 경우 선택적으로 자신의 콜백을 호출할 수 있지만 플랫폼과의 충돌을 위해 다음을 요구하지 않습니다.
    */
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.collider(this.bombs, this.platforms);
    this.physics.add.collider(
      this.player,
      this.bombs,
      this.hitBomb,
      undefined,
      this,
    );

    // 플레이어가 별과 겹치는지 여부를 확인합니다.
    this.physics.add.overlap(
      this.player,
      this.stars,
      this.collectStar,
      undefined,
      this,
    );
  }

  update() {
    if (this.gameOver) {
      return;
    }

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);

      this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);

      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);

      this.player.anims.play('turn');
    }

    /* 
    코드의 마지막 부분은 점프 기능을 추가합니다. 
    위쪽 커서는 점프 키이며 그것이 눌렸는지 테스트합니다. 
    그러나 우리는 또한 플레이어가 바닥에 닿고 있는지 테스트합니다. 
    그렇지 않으면 공중에서 점프할 수 있습니다.
    */
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330); // 230px/sec sq의 수직 속도를 적용합니다. 플레이어는 중력으로 인해 자동으로 바닥으로 떨어집니다
    }
  }

  collectStar(
    playerGameObject: Phaser.GameObjects.GameObject,
    starGameObject: Phaser.GameObjects.GameObject,
  ) {
    // const player = playerGameObject as Phaser.Physics.Arcade.Sprite;
    const star = starGameObject as Phaser.Physics.Arcade.Sprite;
    star.disableBody(true, true);

    this.score += 10;
    this.scoreText.setText('score: ' + this.score);

    // console.log('남은 별 갯수', this.stars.countActive(true));
    // console.log('먹은 별 갯수', this.stars.countActive(false));
    // console.log('폭탄 갯수', this.bombs.countActive(true));

    // Group의 함수중 countActive는 현재 Scene의 살아있는 별의 갯수
    if (this.stars.countActive(true) === 0) {
      // 반복기능(iterate 함수)을 사용하여 모든 별을 다시 활성화하고 y 위치를 0으로 재설정합니다. 이렇게 하면 모든 별이 화면 상단에서 다시 떨어집니다.
      // Group.children.iterate(childObject => {}) is equals to Group.forEach(childObject => {})
      this.stars.children.iterate(
        (childObject: Phaser.GameObjects.GameObject) => {
          const child = childObject as Phaser.Physics.Arcade.Sprite;
          child.enableBody(true, child.x, 0, true, true);
        },
      );

      /*
        Phaser.Math.Between(min, max) : 최소값과 최대값 사이의 임의의 정수를 계산합니다.
        플레이어의 x값을 기준으로 반대편에 있는 랜덤한 x 좌표값을 설정합니다.
      */
      const x =
        this.player.x < 400
          ? Phaser.Math.Between(400, 800)
          : Phaser.Math.Between(0, 400);
      // 위에서 설정한 x 좌표에 폭탄을 생성합니다.
      const bomb = this.bombs.create(
        x,
        16,
        'bomb',
      ) as Phaser.Physics.Arcade.Sprite;

      /* 
        반발 계수: 물체의 충돌 전후 속도의 비율을 나타내는 분수이다. 반발 계수가 1인 물체는 탄성 충돌을 하며, 반발 계수가 1보다 작은 물체는 비탄성 충돌을 한다. 반발 계수가 0이면 완전 비탄성 충돌을 하며, 충돌한 물체와 붙어서 튀지 않는다.
      */
      bomb.setBounce(1); // 바운스는 신체가 다른 물체와 충돌할 때 반발 계수 또는 탄성의 양입니다.
      bomb.setCollideWorldBounds(true); // 맵과 폭탄의 출동처리를 설정
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20); // 폭탄의 속도를 설정합니다.
      /*
        x — 몸체의 수평 속도. 양수 값은 본체를 오른쪽으로 이동하고 음수 값은 왼쪽으로 이동합니다.
        y — 몸체의 수직 속도. 양수 값은 본체를 아래로 이동하고 음수 값은 위로 이동합니다.
      */
    }
  }

  hitBomb(playerGameObject: Phaser.GameObjects.GameObject) {
    const player = playerGameObject as Phaser.Physics.Arcade.Sprite;

    this.physics.pause(); // 게임 중지
    player.setTint(0xff0000); // 플레이어 색상 설정
    player.anims.play('turn'); // 설정했던 애니메이션에 해당하는 key값 애니메이션 상태로 설정
    this.gameOver = true;
  }
}
