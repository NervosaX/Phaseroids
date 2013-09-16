require.config({
    paths: {
        'underscore': 'libs/lodash',
        'jquery': 'libs/jquery',
    },
    shim: {
    }
});

require([
    'game', 
    'libs/phaser'
], function(Game) {
    var game = new Game();
});