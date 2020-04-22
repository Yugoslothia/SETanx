class PlayerHead extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, 'tankHead');
		scene.add.existing(this);
		scene.physics.world.enable(this);
		this.setScale(0.6);
		this.setOrigin(0.225,0.5);
	}
}

class Player extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y) {
		super(scene, x, y, 'tank');
		scene.add.existing(this);
		scene.physics.world.enable(this);
		this.setScale(0.6);
		this.body.setCollideWorldBounds(true);
		scene.physics.add.collider(this, walls);
		this.pointer = scene.input.activePointer;
		this.playerHead = new PlayerHead(scene, this.x, this.y);
		this.dead = false;
		this.reticle = scene.physics.add.sprite(500, 175, 'target');
    scene.physics.add.collider(this, enemyBullets, this.playerKill, null, this);
		this.cursors = scene.input.keyboard.addKeys({
			up:Phaser.Input.Keyboard.KeyCodes.W,
			down:Phaser.Input.Keyboard.KeyCodes.S,
			left:Phaser.Input.Keyboard.KeyCodes.A,
			right:Phaser.Input.Keyboard.KeyCodes.D
		});
		game.canvas.addEventListener('mousedown', function() {
			game.input.mouse.requestPointerLock();
		});
		scene.input.on('pointerdown', function(pointer) {
			this.shoot();
		}, this);
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta);
		this.movePlayer();
		this.playerHead.x = this.x+5;
		this.playerHead.y = this.y-2;
		this.reticle.x += this.pointer.movementX;
		this.reticle.y += this.pointer.movementY;
		this.playerHead.rotation = Phaser.Math.Angle.Between(this.playerHead.x, this.playerHead.y, this.reticle.x, this.reticle.y);
	}

	movePlayer() {
		if(this.cursors.up.isDown) {
			this.setVelocityY(-125);
			this.playerHead.setVelocityY(-125);
		}
		if(this.cursors.down.isDown) {
			this.setVelocityY(125);
			this.playerHead.setVelocityY(125);
		}
		if(this.cursors.left.isDown) {
			this.setVelocityX(-125);
			this.playerHead.setVelocityX(-125);
		}
		if(this.cursors.right.isDown) {
			this.setVelocityX(125);
			this.playerHead.setVelocityX(125);
		}

		if(this.cursors.up.isUp) {
			if(this.cursors.down.isUp){
				this.setVelocityY(0);
				this.playerHead.setVelocityY(0);
			}
		}
		if(this.cursors.down.isUp) {
			if(this.cursors.up.isUP){
				this.setVelocityY(0);
				this.playerHead.setVelocityY(0);
			}
		}
		if(this.cursors.left.isUp) {
			if(this.cursors.right.isUp){
				this.setVelocityX(0);
				this.playerHead.setVelocityX(0);
			}
		}
		if(this.cursors.right.isUp) {
			if(this.cursors.left.isUP){
				this.setVelocityX(0);
				this.playerHead.setVelocityX(0);
			}
		}
	}

	shoot() {
		var bullet;
		var direction;
		if(bullets.countActive(true) < 5) {
      bullet = bullets.create(this.x-30, this.y).setScale(0.3);
			bullet.body.setCollideWorldBounds(true).bounce.set(1);
      direction = Math.atan((this.reticle.y-bullet.y)/(this.reticle.x-bullet.x));
			bullet.setVelocityX(175 * Math.cos(direction));
      bullet.setVelocityY(175 * Math.sin(direction));
      if(this.reticle.x - bullet.x < 0 && this.reticle.y - bullet.y >= 0) {
        bullet.setVelocityY(-175 * Math.sin(direction));
        bullet.setVelocityX(-175 * Math.cos(direction));
      }
      if(this.reticle.x - bullet.x < 0 && this.reticle.y - bullet.y < 0) {
        bullet.setVelocityY(-175 * Math.sin(direction));
        bullet.setVelocityX(-175 * Math.cos(direction));
      }

		}
	}

  playerKill(enemyBullets) {
    this.dead = true;
  }

  isDead() {return this.dead;}
}
