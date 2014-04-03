// Init the game
var GAME_WIDTH = 320;
var GAME_HEIGHT = 568;

var game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, 'game_div', { preload: this.preload, create: this.create, update: this.update, render: this.render });
var world;

var GRAVITY = 800;
var VELOCITY = 360;
var SPEED = 200;
var BASE_SIZE = 40;
var START_POSITION = GAME_HEIGHT-250;
var WAVE_TIME = 1600;
var ITEM_FREQ = 30;
var GAMEOVER_TEXT = ['NO MORE SAKE!', 'SAKE FAIL!', 'MORE SAKE!', 'I SEE DUCKS', 'WOOOOO'];

var BRONZE = 20;
var SILVER = 40;
var GOLD = 80;

var STYLE_HEADER = {
    font: "36px Blocky",
    fill: '#fff',
    stroke: '#333',
    strokeThickness: 8,
    align: 'center'
};

Game = function(game) { 
    this.game = game;   
    this.level = null;
    this.player = null;
    this.hud = null;
    this.isPaused = null;
}; 


Game.Boot = function (game) { };

Game.Boot.prototype = {
   preload: function() { 
    
        // Loading screen
        game.stage.backgroundColor = '#000';
        
        this.scoreText = this.game.add.text(
            GAME_WIDTH/2,
            GAME_HEIGHT/2,
            'GETTING DRUNK...',
            {
                font: "20px Blocky",
                fill: '#fff',
                align: 'center'
            }
        );
        this.scoreText.anchor.setTo(0.5,0.5);    
                
        
        // Preload all of the game assets here
        
        // Menu Assets            
        this.game.load.image('title', 'assets/images/title-small.png');
        this.game.load.image('duck', 'assets/images/duck.png'); 
        
        // Player Assets
        this.game.load.spritesheet('walktest', 'assets/images/man-walk.png', 112, 112);
        this.game.load.spritesheet('fall', 'assets/images/man-stumble.png', 112, 112);
        this.game.load.spritesheet('hit', 'assets/images/man-hit.png', 112, 112);
        
        this.game.load.audio('tap', ['assets/audio/tap.wav']);
        this.game.load.audio('hit', ['assets/audio/hit.wav']);
        this.game.load.audio('splash', ['assets/audio/splash.wav']); 
        
        
        // Level Assets
        this.game.load.image('road', 'assets/images/brick-smooth-brown.png');
        this.game.load.image('rightEdge', 'assets/images/right-water-3.png');
        this.game.load.image('leftRoof', 'assets/images/left-roof-toblack.png');
        this.game.load.image('leftShadow', 'assets/images/left-shadow-3.png');             
        //this.game.load.image('overlay', 'assets/images/light.png');        
        
        this.game.load.spritesheet('barrel', 'assets/images/barrel-duck.png', 128, 128);
        this.game.load.spritesheet('bottle', 'assets/images/bottle.png', 32, 52);
        this.game.load.spritesheet('shore', 'assets/images/right-shore.png', 128, 128);

        game.load.audio('pass', ['assets/audio/pass.wav']);
        game.load.audio('collect', ['assets/audio/collect.wav']);
    
    },
    create: function() {
        this.game.state.start('menu'); // Transition to title screen when loaded
    }
};   
 
Game.Game = function(game){};
Game.Game.prototype = {

    preload: function() { 

        // Init stuff
        this.level = new Level(game);
        this.player = new Player(game); 
        this.hud = new Hud(game);   
    
    },

    create: function() { 
        
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.stage.smoothed = false; // Render crisp pixel art
        
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.startFullScreen();

        
        world = game.add.group();
        //world.scale.setTo(0.5,0.5);
        //world.scale.setTo(1,1);
        
        WAVE_TIME = 1.6;
        
        this.level.create();
        this.player.create();
        this.level.addOverlay();
        this.hud.create();
        
        this.game.world.setBounds(-30, -30, GAME_WIDTH+62, GAME_HEIGHT+30); 
    },
    
    update: function() {
        
        //game.debug.renderSpriteBounds(this.player.sprite, ['#a70000']);
        
        
        
        this.level.update();
        this.player.update();

        // Check for collisions
        if (!this.player.isDead) {
            
            // Hit a barrel!
            this.game.physics.arcade.collide(
                this.player.sprite, 
                this.level.obstacles, 
                this.setGameOver, 
                null, this
            );
            
            // Successfully passed a barrel so update the score
            this.game.physics.arcade.overlap(
                this.player.sprite, 
                this.level.gaps, 
                this.addScore, 
                null, this
            );            
            
            if  (!this.level.itemAnimate) {
                this.game.physics.arcade.overlap(
                    this.player.sprite, 
                    this.level.item, 
                    this.collectItem, 
                    null, this
                );
            }
            
            // Hit the water so game over
            if (this.player.hitRight()) {
                this.setGameOver('splash');
            } 
                
            // Bounce off the left wall       
            if (this.player.hitLeft()) {
                this.setGameOver();
                //this.player.sprite.body.velocity.x = this.player.sprite.body.bounce.x;
            }
        } 

    },
    render : function() {
        // For Debugging
        //game.debug.bodyInfo(this.player.sprite, 32, 32);
        //game.debug.body(this.player.sprite);
    },
    setGameOver: function(type) {
        this.level.gameOver();
  
        if (type == 'splash') {
            this.player.gameSplash();    
        } else {
            this.player.gameCollide();    
        }

        // Transition to the game over screen after 0.5s death animation
        game.time.events.add(Phaser.Timer.SECOND * 0.5, function(){this.game.state.start('gameover')}, this);
        
    },    
    addScore: function(player, gap) {
        this.level.updateScore(gap);
        this.hud.updateScore();
    },     
    collectItem: function(player, item) {
        this.level.collectItem(item);
        this.hud.collectItem();
    }
};



