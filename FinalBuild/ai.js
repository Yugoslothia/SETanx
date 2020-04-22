// puts the tank head on the Ai
// SHOULD ONLY BE CALLED BY THE AI CLASS AND SUBCLASSES.
class AiHead extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, x, y) {
    super(scene, x, y, 'enemyHead');
    this.setOrigin(0.225, 0.5);
    scene.add.existing(this);
    scene.physics.world.enable(this);
  }
}

// standard ai class which every subclass inherits from
class Ai extends Phaser.Physics.Arcade.Sprite {

  constructor (scene, x, y) {
    super(scene, x, y, 'enemy');
    scene.add.existing(this);
    scene.physics.world.enable(this);
    this.body.setCollideWorldBounds(true);
    scene.physics.add.collider(this, walls);
    this.aiHead = new AiHead(scene, this.x, this.y).setScale(0.4);
    this.dead = false;
    scene.physics.add.collider(this, bullets, this.aiKill, null, this);

    this.timedEvent = scene.time.addEvent({ delay: 2000, callback: this.shootAI, callbackScope: this, loop: true });
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if(this.dead == false) {this.moveAI();}
    this.aiHead.rotation = Phaser.Math.Angle.Between(this.aiHead.x, this.aiHead.y, player.x, player.y);
    this.aiHead.x = this.x;
    this.aiHead.y = this.y;
  }

  moveAI() {
    if(this.body.velocity.x == 0) {
      this.setVelocityX(100);
      this.oldx = this.x;
      this.oldy = this.y;
    }
    // randomly moves ai whenever it moves 100 pixels in y or x dir on dir change
    if(this.x - this.oldx > 100 || this.x - this.oldx < -100 || this.y - this.oldy > 100 || this.y - this.oldy < -100
        || (this.x == this.oldx && this.y == this.oldy)) {
      this.dirx = Phaser.Math.Between(-1, 1);
      this.diry = Phaser.Math.Between(-1, 1);
      while(this.dirx == 0 && this.diry == 0) {
        this.dirx = Phaser.Math.Between(-1, 1);
        this.diry = Phaser.Math.Between(-1, 1);
      }
      if(Math.abs(this.dirx) == Math.abs(this.diry)) {
        this.dirx *= Math.sqrt(2) / 2;
        this.diry *= Math.sqrt(2) / 2;
      }
      this.setVelocityX(100 * this.dirx);
      this.setVelocityY(100 * this.diry);
      this.oldx = this.x;
      this.oldy = this.y;
    }
  }

  // shoots in the direction of the player and spawns unique bullet
  shootAI(){
		var ebullet = enemyBullets.create(this.x, this.y).setScale(0.3);
    var direction = Math.atan((player.y-this.y)/(player.x-this.x));
    ebullet.setVelocityX(175 * Math.cos(direction));
    ebullet.setVelocityY(175 * Math.sin(direction));
    if(player.x - this.x < 0 && player.y - this.y >= 0) {
      ebullet.setVelocityY(-175 * Math.sin(direction));
      ebullet.setVelocityX(-175 * Math.cos(direction));
    }
    if(player.x - this.x < 0 && player.y - this.y < 0) {
      ebullet.setVelocityY(-175 * Math.sin(direction));
      ebullet.setVelocityX(-175 * Math.cos(direction));
    }
    ebullet.body.setCollideWorldBounds(true).setBounce(1);
  }

  aiKill(bullet) {
    bullet.x = -100;
    bullet.y = -100;
    this.disableBody(true, true);
    this.aiHead.disableBody(true, true);
    this.timedEvent.remove();
    this.dead = true;
  }

  isDead() {return this.dead;}

}

// Inherits from AI class but does not move (red Tank)
class AiStill extends Ai {
  constructor(scene, x, y){
    super(scene, x, y, 'enemy2');
    this.setTexture('enemy2');
    this.aiHead.setTexture('enemyHead2').setScale(0.4);

  }

  // update func made so enemy does not move
  moveAI(){}
}

// bullet travel almost doubly increased
class AiFastBullet extends Ai {
  constructor(scene, x, y){
    super(scene, x, y, 'enemy3');
    this.setTexture('enemy3');
    this.aiHead.setTexture('enemyHead3').setScale(0.4);
    scene.physics.add.collider(this, bullets, this.aiKill, null, this);
    this.timedEvent.remove(); // automatically inherits old timed event, so remove it
    this.timedEvent2 = scene.time.addEvent({ delay: 3000, callback: this.shootAI, callbackScope: this, loop: true });
  }

  shootAI(){
    var ebullet = enemyBullets.create(this.x, this.y).setScale(0.3);
    var direction = Math.atan((player.y-this.y)/(player.x-this.x));
    ebullet.setVelocityX(300 * Math.cos(direction));
    ebullet.setVelocityY(300 * Math.sin(direction));
    if(player.x - this.x < 0 && player.y - this.y >= 0) {
      ebullet.setVelocityY(-300 * Math.sin(direction));
      ebullet.setVelocityX(-300 * Math.cos(direction));
    }
    if(player.x - this.x < 0 && player.y - this.y < 0) {
      ebullet.setVelocityY(-300 * Math.sin(direction));
      ebullet.setVelocityX(-300 * Math.cos(direction));
    }
    ebullet.body.setCollideWorldBounds(true).setBounce(1);
  }

  aiKill(bullet) {
    this.disableBody(true, true);
    this.aiHead.disableBody(true, true);
    bullet.disableBody(true, true);
    this.timedEvent2.remove();
    this.dead = true;
  }

}

// ai moves twice as fast as original ai
class AiFastMoving extends Ai {
  constructor(scene, x, y){
    super(scene, x, y, 'enemy4');
    this.setTexture('enemy4');
    this.aiHead.setTexture('enemyHead4').setScale(0.4);
  }

  moveAI() {
    if(this.body.velocity.x == 0) {
      this.setVelocityX(200);
      this.oldx = this.x;
      this.oldy = this.y;
    }
    // randomly moves ai whenever it moves 100 pixels in y or x dir on dir change
    if(this.x - this.oldx > 200 || this.x - this.oldx < -200 || this.y - this.oldy > 200 || this.y - this.oldy < -200
        || (this.x == this.oldx && this.y == this.oldy)) {
      this.dirx = Phaser.Math.Between(-1, 1);
      this.diry = Phaser.Math.Between(-1, 1);
      while(this.dirx == 0 && this.diry == 0) {
        this.dirx = Phaser.Math.Between(-1, 1);
        this.diry = Phaser.Math.Between(-1, 1);
      }
      if(Math.abs(this.dirx) == Math.abs(this.diry)) {
        this.dirx *= Math.sqrt(2) / 2;
        this.diry *= Math.sqrt(2) / 2;
      }
      this.setVelocityX(200 * this.dirx);
      this.setVelocityY(200 * this.diry);
      this.oldx = this.x;
      this.oldy = this.y;
    }
  }
}

class EvilChris extends Phaser.Physics.Arcade.Sprite {

    constructor (scene, x, y) {
      super(scene, x, y, 'evilChris');
      scene.add.existing(this);
      scene.physics.world.enable(this);
      this.body.setCollideWorldBounds(true);
      scene.physics.add.collider(this, walls);
      this.dead = false;
      scene.physics.add.collider(this, bullets, this.aiKill, null, this);

      this.timedEvent = scene.time.addEvent({ delay: 700, callback: this.shootAI, callbackScope: this, loop: true });
    }

    preUpdate(time, delta) {
      super.preUpdate(time, delta);
      if(this.dead == false) {this.moveAI();}
    }

    moveAI() {
      if(this.body.velocity.x == 0) {
        this.setVelocityX(200);
        this.oldx = this.x;
        this.oldy = this.y;
      }
      // randomly moves ai whenever it moves 100 pixels in y or x dir on dir change
      if(this.x - this.oldx > 100 || this.x - this.oldx < -100 || this.y - this.oldy > 100 || this.y - this.oldy < -100
          || (this.x == this.oldx && this.y == this.oldy)) {
        this.dirx = Phaser.Math.Between(-1, 1);
        this.diry = Phaser.Math.Between(-1, 1);
        while(this.dirx == 0 && this.diry == 0) {
          this.dirx = Phaser.Math.Between(-1, 1);
          this.diry = Phaser.Math.Between(-1, 1);
        }
        if(Math.abs(this.dirx) == Math.abs(this.diry)) {
          this.dirx *= Math.sqrt(2) / 2;
          this.diry *= Math.sqrt(2) / 2;
        }
        this.setVelocityX(200 * this.dirx);
        this.setVelocityY(200 * this.diry);
        this.oldx = this.x;
        this.oldy = this.y;
      }
    }

    shootAI(){
  		var ebullet = enemyBullets.create(this.x, this.y);
      var direction = Math.atan((player.y-this.y)/(player.x-this.x));
      ebullet.setVelocityX(350 * Math.cos(direction));
      ebullet.setVelocityY(350 * Math.sin(direction));
      if(player.x - this.x < 0 && player.y - this.y >= 0) {
        ebullet.setVelocityY(-350 * Math.sin(direction));
        ebullet.setVelocityX(-350 * Math.cos(direction));
      }
      if(player.x - this.x < 0 && player.y - this.y < 0) {
        ebullet.setVelocityY(-350 * Math.sin(direction));
        ebullet.setVelocityX(-350 * Math.cos(direction));
      }
      ebullet.body.setCollideWorldBounds(true).setBounce(1);
    }

    aiKill(bullet) {
      this.disableBody(true, true);
      bullet.disableBody(true, true);
      this.timedEvent.remove();
      this.dead = true;
    }

    isDead() {return this.dead;}

}
