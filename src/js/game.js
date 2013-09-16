define([
 'underscore',
 'player',
 'bullet'
], function(_, Player, Bullet) {

    var Game = (function() {
        var game, player;
        /*
            Main gaming module. Controls the main loops and pre-render/
            setup.
        */
        function Game() {
            game = new Phaser.Game(1024, 768, Phaser.CANVAS, '', {
                preload: this.preload,
                create: this.create,
                update: this.update,
                render: this.render
            });

            player = new Player(game);
        }

        Game.prototype.preload = function() {
            player.preload();
            Bullet.preload(game);
        };

        Game.prototype.create = function() {
            player.create();
        };

        Game.prototype.update = function() {
            player.update();
            Bullet.updateBullets(game);
        };

        Game.prototype.render = function() {
            player.render();
            Bullet.render(game);

            this.game.debug.renderText("Time elapsed: " + this.game.time.elapsedSecondsSince(0).toFixed(1), 20, 20);
        };

        return Game;
    })();

    return Game;

});