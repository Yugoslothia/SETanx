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
    // places object and scene and enables it to move
    scene.add.existing(this);
    scene.physics.world.enable(this);
    this.body.setCollideWorldBounds(true);
    scene.physics.add.collider(this, walls);
    //attach AiHead to the tank
    this.aiHead = new AiHead(scene, this.x, this.y).setScale(0.4);
    this.dead = false;
    // collider with bullet and tank which calls bulletDestroy on impact
    scene.physics.add.collider(bullets, this, this.aiKill, bulletDestroy, this);
    this.timedEvent = scene.time.addEvent({ delay: 2000, callback: this.shootAI, callbackScope: this, loop: true });
  }

  // preUpdate called to make sure that the rotation works, aiHead is right, and
  // that the timer moves
  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if(this.dead == false) {this.moveAI();}
    this.aiHead.rotation = Phaser.Math.Angle.Between(this.aiHead.x, this.aiHead.y, player.x, player.y);
    this.aiHead.x = this.x;
    this.aiHead.y = this.y;
    if(this.aiHead.rotation >= 0 && this.aiHead.rotation < 1.5708) {
			this.shootPosX = 50*Math.cos(this.aiHead.rotation);
			this.shootPosY = 50*Math.sin(this.aiHead.rotation);
		}
		else if(this.aiHead.rotation >= 1.5708 && this.aiHead.rotation < 3.14158) {
			this.shootPosX = 49*Math.cos(this.aiHead.rotation);
			this.shootPosY = 50*Math.sin(this.aiHead.rotation);
		}
		else if(this.aiHead.rotation >= -3.14158 && this.aiHead.rotation < -1.5708) {
			this.shootPosX = 49*Math.cos(this.aiHead.rotation);
			this.shootPosY = 50*Math.sin(this.aiHead.rotation);
		}
		else if(this.aiHead.rotation >= -1.5708 && this.aiHead.rotation < 0) {
			this.shootPosX = 50*Math.cos(this.aiHead.rotation);
			this.shootPosY = 50*Math.sin(this.aiHead.rotation);
		}
  }

  moveAI() {

    // randomly moves ai whenever it moves 100 pixels in y or x dir on dir change
    if(this.x - this.oldx > 100 || this.x - this.oldx < -100 || this.y - this.oldy > 100 || this.y - this.oldy < -100
        || (this.body.velocity.x == 0 && this.body.velocity.y == 0)) {
      this.dirx = Phaser.Math.Between(-1, 1);
      this.diry = Phaser.Math.Between(-1, 1);

      // sets angle of sprite relative to direction
      if(this.dirx == 0 && this.diry == 1) {this.setAngle(90);}
      else if(this.dirx == -1 && this.diry == 1) {this.setAngle(135);}
      else if(this.dirx == -1 && this.diry == 0) {this.setAngle(180);}
      else if(this.dirx == -1 && this.diry == -1) {this.setAngle(225);}
      else if(this.dirx == 0 && this.diry == -1) {this.setAngle(270);}
      else if(this.dirx == 1 && this.diry == -1) {this.setAngle(315);}
      else if(this.dirx == 1 && this.diry == 0) {this.setAngle(0);}
      else if(this.dirx == 1 && this.diry == 1) {this.setAngle(45);}

      // if tank is moving diagonally, make them move slower
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
		var ebullet = enemyBullets.create(this.x+this.shootPosX, this.y+this.shootPosY).setScale(0.3);
    var direction = Math.atan((player.y-this.y)/(player.x-this.x));
    ebullet.setVelocityX(175 * Math.cos(direction));
    ebullet.setVelocityY(175 * Math.sin(direction));
    // flip the direction because velocity is in radians
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

  // make tank disappear, stop its shooting, and kill it
  aiKill(bullet) {
    bullet.disableBody(true, true);
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
    // call botht this.kill and destroy bullet in scene
    scene.physics.add.collider(bullets, this, this.aiKill, bulletDestroy, this);
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

  // kills ai and bullet (disable 2nd timer to make sure it stops shooting)
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
    if(this.x - this.oldx > 200 || this.x - this.oldx < -200 || this.y - this.oldy > 200 || this.y - this.oldy < -200
        || (this.body.velocity.x == 0 && this.body.velocity.y == 0)) {
      this.dirx = Phaser.Math.Between(-1, 1);
      this.diry = Phaser.Math.Between(-1, 1);

      // sets angle of sprite relative to direction
      if(this.dirx == 0 && this.diry == 1) {this.setAngle(90);}
      else if(this.dirx == -1 && this.diry == 1) {this.setAngle(135);}
      else if(this.dirx == -1 && this.diry == 0) {this.setAngle(180);}
      else if(this.dirx == -1 && this.diry == -1) {this.setAngle(225);}
      else if(this.dirx == 0 && this.diry == -1) {this.setAngle(270);}
      else if(this.dirx == 1 && this.diry == -1) {this.setAngle(315);}
      else if(this.dirx == 1 && this.diry == 0) {this.setAngle(0);}
      else if(this.dirx == 1 && this.diry == 1) {this.setAngle(45);}

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

// THE FINAL BOSS. THE DOOMSLAYER. SAVE YOURSELF FOR YOU CAN'T SAVE OTHERS
class EvilChris extends Phaser.Physics.Arcade.Sprite {
    // CALLED AT THE BEGINNING OF TIME
    constructor (scene, x, y) {
      super(scene, x, y, 'evilChris');
      scene.add.existing(this);
      scene.physics.world.enable(this);
      this.body.setCollideWorldBounds(true);
      scene.physics.add.collider(this, walls);
      this.dead = false;
      this.counter = 0;
      scene.physics.add.collider(this, bullets, this.chrisKill, bulletDestroy, this);

      this.timedEvent = scene.time.addEvent({ delay: 250, callback: this.shootAI, callbackScope: this, loop: true });
    }
    // HE IS ALWAYS WATCHING
    preUpdate(time, delta) {
      super.preUpdate(time, delta);
      if(this.dead == false) {this.moveAI();}
    }

    // HE MOVES FASTER THAN YOU CAN THINK
    moveAI() {
      if(this.x - this.oldx > 400 || this.x - this.oldx < -400 || this.y - this.oldy > 400 || this.y - this.oldy < -400
          || (this.body.velocity.x == 0 && this.body.velocity.y == 0)) {
        this.dirx = Phaser.Math.Between(-1, 1);
        this.diry = Phaser.Math.Between(-1, 1);
        // NO SPRITE ROATATION FOR HE IS GOD
        if(Math.abs(this.dirx) == Math.abs(this.diry)) {
          this.dirx *= Math.sqrt(2) / 2;
          this.diry *= Math.sqrt(2) / 2;
        }
        this.setVelocityX(600 * this.dirx);
        this.setVelocityY(600 * this.diry);
        this.oldx = this.x;
        this.oldy = this.y;

      }
    }

    // HIS BULLETS DEFY OUR KNOWLEDGE OF PHYSICS
    shootAI(){
  		var ebullet = enemyBullets.create(this.x, this.y);
      var direction = Math.atan((player.y-this.y)/(player.x-this.x));
      ebullet.setVelocityX(450 * Math.cos(direction));
      ebullet.setVelocityY(450 * Math.sin(direction));
      if(player.x - this.x < 0 && player.y - this.y >= 0) {
        ebullet.setVelocityY(-450 * Math.sin(direction));
        ebullet.setVelocityX(-450 * Math.cos(direction));
      }
      if(player.x - this.x < 0 && player.y - this.y < 0) {
        ebullet.setVelocityY(-450 * Math.sin(direction));
        ebullet.setVelocityX(-450 * Math.cos(direction));
      }
      ebullet.body.setCollideWorldBounds(true).setBounce(1);
    }

    // THIS STATEMENT HAS NO EFFECT, YOU CANNOT "KILL" GOD
    chrisKill() {
      this.dead = true
    }

    // ALWAYS RETURNS FALSE
    isDead() {return this.dead;}

}
