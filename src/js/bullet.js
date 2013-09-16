define([

], function() {

    var Bullet = (function() {

        var bullets = [];

        function Bullet(game, x, y, rotation) {
            this.x = x;
            this.y = y;
            this.rotation = rotation;
            this.game = game;
            this.speed = 10;
            this.alive = true;
            this.bounces = 0;
            bullets.push(this);
            this.create();
        }

        Bullet.preload = function(game) {
            game.load.image('bullet.main', 'assets/sprites/bullet.png');
        };

        Bullet.prototype.create = function() {
            this.texture = this.game.add.sprite(this.x, this.y, 'bullet.main');
            this.texture.anchor.x = 0.5;
            this.texture.anchor.y = 0.5;

            this.texture.x = this.x;
            this.texture.y = this.y;
            this.texture.rotation = this.rotation;

            this.velocityX = Math.cos(this.texture.rotation - Phaser.Math.degToRad(90));
            this.velocityY = Math.sin(this.texture.rotation - Phaser.Math.degToRad(90));
        };

        Bullet.updateBullets = function(game) {
            
            _.each(bullets, function(bullet) {
                if (!bullet) return;
                // Add forward momentum
                bullet.texture.x += bullet.velocityX * bullet.speed;
                bullet.texture.y += bullet.velocityY * bullet.speed;

                bullet.bounce();
            });
        };

        Bullet.prototype.bounce = function() {
            var bounce = false;

            if (this.bounces === 3) {
                this.kill();
                return;
            }

            if (this.texture.y < 0 || this.texture.y > this.game.height) {
                this.velocityY *= -1;
                bounce = true;
            }
            if (this.texture.x < 0 || this.texture.x > this.game.width) {
                this.velocityX *= -1;
                bounce = true;
            }
            if (bounce) {
                this.texture.rotation = -this.texture.rotation;
                this.bounces ++;
            }
        };

        Bullet.prototype.kill = function() {
            this.texture.kill();
            bullets.splice(bullets.indexOf(this), 1);
        };

        Bullet.render = function(game)  {
            game.debug.renderText("Bullets: " + bullets.length, 20, 100);
        };

        Bullet.addBullet = function(bullet) {
            bullets.push(bullet);
        };

        return Bullet;

    })();

    return Bullet;

});