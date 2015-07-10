var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

function preload () {
  
  game.load.image('bullet', 'assets/bullet.png');
  game.load.image('light_sand', 'assets/light_sand.png');
  game.load.spritesheet('kaboom', 'assets/explosion.png', 64, 64, 23);
  
  // new player 1 sprite
  game.load.image('invader', 'assets/invader.png');
}



var floor;

// field characters
var player;
var moveSpeed = 200; // speed which player moves

// shooting
var bullets;
var fireRate = 100;
var nextFire = 0;
var bulletSpeed = 600; 

// input key controller
var cursors;
var fireButton;

function create () {
  
  // Resize game world to be a 800 x 600 square
  game.world.setBounds(-400, -300, 800, 600);

  // Tiled scrolling background
  floor = game.add.tileSprite(0, 0, 800, 600, 'light_sand');
  floor.fixedToCamera = true;
  
  
  // Player Sprite: invader 
  player = game.add.sprite(0, 0, 'invader');
  player.anchor.setTo(0.5, 0.5); // Centers the sprite (half is 0.5)

  game.physics.enable(player, Phaser.Physics.ARCADE);
  player.body.collideWorldBounds = true;

  
  // Player bullet group
  bullets = game.add.group();
  bullets.enableBody = true; // Allows group to have physics body 
  bullets.physicsBodyType = Phaser.Physics.ARCADE;
  bullets.createMultiple(30, 'bullet', 0, false); // False bc bullets do not exist on default
  bullets.setAll('anchor.x', 0);
  bullets.setAll('anchor.y', 0.5);
  bullets.setAll('outOfBoundsKill', true);
  bullets.setAll('checkWorldBounds', true);

  
  // Camera related 
  player.bringToTop();    

  game.camera.follow(player);
  game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
  game.camera.focusOnXY(0, 0);


  // Input keys 
  cursors = game.input.keyboard.createCursorKeys();
  fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

}



/*  
  NOTE: sprite.angle is orientation in degrees 
  whereas sprite.body.angle is calculated by its velocity in radians
*/
function update () {

  // --- Player input/movement ---
  // Movement done through velocity, not position
  // Velocity is 0 if no key is pressed
  player.body.velocity.x = 0;
  player.body.velocity.y = 0;

  // player.angle (orientation) is the angle of velocity + pi/2 (offset)
  // then converted converted into degrees (multiply by 180/pi)
  if (cursors.left.isDown) { // left
    player.body.velocity.x = -moveSpeed;
    player.angle = (player.body.angle+(Math.PI/2)) * (180/Math.PI); 
  }
  else if (cursors.right.isDown) { // right
    player.body.velocity.x = moveSpeed;
    player.angle = (player.body.angle+(Math.PI/2)) * (180/Math.PI);
  }
  // separation necessary to allow combo movements (move up-right)
  if (cursors.up.isDown) { // up
    player.body.velocity.y = -moveSpeed;
    player.angle = (player.body.angle+(Math.PI/2)) * (180/Math.PI);
  }
  else if (cursors.down.isDown) { // down
    player.body.velocity.y = moveSpeed;
    player.angle = (player.body.angle+(Math.PI/2)) * (180/Math.PI);
  }

  if (fireButton.isDown) {
    fireBullet();
  }


  // floor scrolling
  floor.tilePosition.x = -game.camera.x;
  floor.tilePosition.y = -game.camera.y;


  // debug 
  // var refreshRate = 10000;
  // var nextCheck = 0;
  // if (game.time.time > nextCheck) {
  //   nextCheck = game.time.time + refreshRate;
  //   console.log(player.angle);
  // }
  
  // console.log("coordinates: " + bullets.children[i].x + ", " + bullets.children[i].y);

}

function fireBullet () {
  if (game.time.time > nextFire) {
    
    var bullet = bullets.getFirstExists(false);
    
    if (bullet) {
      nextFire = game.time.time + fireRate;
      bullet.reset(player.x, player.y);
      bullet.angle = player.angle - 90;
    
      if (player.angle == 0) { // up
        bullet.body.velocity.y = -bulletSpeed;
      }
      else if (player.angle == 45) { // up right 
        bullet.body.velocity.y = -bulletSpeed;
        bullet.body.velocity.x = bulletSpeed;
      }
      else if (player.angle == 90) { // right
        bullet.body.velocity.x = bulletSpeed;
      }
      else if (player.angle == 135) { // down right
        bullet.body.velocity.x = bulletSpeed;
        bullet.body.velocity.y = bulletSpeed;
      }
      else if (player.angle == -180) { // down
        bullet.body.velocity.y = bulletSpeed;
      }
      else if (player.angle == -135) { // down left
        bullet.body.velocity.y = bulletSpeed;
        bullet.body.velocity.x = -bulletSpeed;
      }
      else if (player.angle == -90) { // left
        bullet.body.velocity.x = -bulletSpeed;  
      }
      else if (player.angle == -45) { // up left 
        bullet.body.velocity.x = -bulletSpeed;  
        bullet.body.velocity.y = -bulletSpeed;
      }
    }
    
  }
}



function render () {

  game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.length, 32, 512);
  // game.debug.text('Enemies: ' + enemiesAlive + ' / ' + enemiesTotal, 32, 32);
  
  game.debug.bodyInfo(player, 16, 32);
  // game.debug.bodyInfo(bullets.children[0], 16, 22);

}