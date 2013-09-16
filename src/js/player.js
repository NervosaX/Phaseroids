define([
    'bullet'
], function(Bullet) {
    /*
        Our player character. Contains all functionality for the movement
        rotation and movement backwards and forwards.
    */
    var Player = (function() {

        function Player(game) {
            this.speed = 5.5;
            this.game = game;
        }

        Player.prototype.preload = function() {
            this.game.load.image('player.main', 'assets/sprites/player.png');
        };

        Player.prototype.create = function() {
            this.texture = this.game.add.sprite(this.game.world.centerX, 
                this.game.world.centerY, 'player.main');


            // Set the time last 'shot'. This can be used to add a delay
            // between bullets fired.
            this.lastShot = 0;

            // Sets the rotational axis. In this case, we want to rotate around
            // the largest part of the triangle.
            this.texture.anchor.x = 0.5;
            this.texture.anchor.y = 0.7;
        };

        Player.prototype.update = function() {
            // Rotations
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
            {
                this.texture.rotation -= 0.1;
            }
            else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
            {
                this.texture.rotation += 0.1;
            }

            // Forwards and backwards
            var movementX = Math.cos(this.texture.rotation - Phaser.Math.degToRad(90));
            var movementY = Math.sin(this.texture.rotation - Phaser.Math.degToRad(90));

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP))
            {
                this.texture.x += (movementX * this.speed);
                this.texture.y += (movementY * this.speed);
            }
            else if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
            {
                // Reverse slower, because... I dunno, it seems like it should
                // be slower.
                this.texture.x -= (movementX * this.speed * 0.6);
                this.texture.y -= (movementY * this.speed * 0.6);
            }

            // Check for 'shoot' button. Create a bullet at this position if
            // pressed.
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.CONTROL))
            {
                // Only fire a new bullet after a delay
                if (this.game.time.elapsedSecondsSince(this.lastShot) > 0.1) {
                    this.lastShot = this.game.time.now;

                    var bulletPosX = this.texture.x + movementX * 35;
                    var bulletPosY = this.texture.y + movementY * 35;
                    
                    var bullet = new Bullet(this.game, bulletPosX, bulletPosY, 
                        this.texture.rotation);
                    
                    Bullet.addBullet(bullet);
                }
            }

            // Set bounds
            if (this.texture.x < 0) this.texture.x = this.game.width;
            if (this.texture.x > this.game.width) this.texture.x = 0;

            if (this.texture.y < 0) this.texture.y = this.game.height;
            if (this.texture.y > this.game.height) this.texture.y = 0;
        };

        Player.prototype.getPosition = function() {
            return {
                x: this.texture.x,
                y: this.texture.y,
                rotation: this.texture.rotation
            }
        };

        Player.prototype.render = function() {
            var absRotation = Math.abs(Phaser.Math.radToDeg(this.texture.rotation) % 360);
            this.game.debug.renderText("Rotation: " + absRotation.toFixed(1), 20, 40);
            this.game.debug.renderText("PositionX: " + this.texture.x.toFixed(1), 20, 60);
            this.game.debug.renderText("PositionY: " + this.texture.y.toFixed(1), 20, 80);
        };

        return Player;
    })();

    return Player;

});