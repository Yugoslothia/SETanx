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

class Ai extends Phaser.Physics.Arcade.Sprite {

  constructor (scene, x, y) {
    super(scene, x, y, 'enemy');
    scene.add.existing(this);
    scene.physics.world.enable(this);
    this.body.setCollideWorldBounds(true);
    scene.physics.add.collider(this, walls);
    this.aiHead = new AiHead(scene, this.x, this.y);
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

    shootAI(){
			var ebullet = enemyBullets.create(this.x, this.y);
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
      ebullet.body.setCollideWorldBounds(true);
    }

    aiKill(bullets) {
      this.disableBody(true, true);
      this.aiHead.disableBody(true, true);
      bullets.disableBody(true, true);
      this.timedEvent.remove();
      this.dead = true;
    }


}
/*
class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "bullet");
    scene.add.existing(this);
    scene.physics.world.enable(this);
    scene.physics.collider(this, walls);
    this.body.setCollideWorldBounds(true).bounce.set(1);
    var direction = Math.atan((player.y-this.y)/(player.x-this.x));
    this.setVelocityX(175 * Math.cos(direction));
    this.setVelocityY(175 * Math.sin(direction));
    if(player.x - this.x < 0 && player.y - this.y >= 0) {
      this.setVelocityY(-175 * Math.sin(direction));
      this.setVelocityX(-175 * Math.cos(direction));
    }
    if(player.x - this.x < 0 && player.y - this.y < 0) {
      this.setVelocityY(-175 * Math.sin(direction));
      this.setVelocityX(-175 * Math.cos(direction));
    }
  }
}*/
