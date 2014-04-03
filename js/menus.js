Game.Title = function(game){
  this.menuLabel = null;  
};
Game.Title.prototype = {
    preload : function() {
        
        this.level = new Level(game);
        
        // TODO: Replace with bitmap font
        this.game.load.bitmapFont('blocky', 'assets/fonts/block.png', 'assets/fonts/block.fnt');
    },
    create : function() {
    	        
        //var text = this.game.add.bitmapText(200, 100, 'Bitmap Fonts!', {  font: '64px Blocky', align: 'center' });
        
        // Reset a long wave time so we get some infrequent barrels rolling down on the start screen
        WAVE_TIME = 7;
        
        // Show the level 
        // TODO: Prevent the screen blinking black when starting the game
        world = game.add.group();
        this.level.create();

        this.game.time.events.remove(this.timer);
        
        // Show the title
        /*this.menuLabel = this.game.add.text(
            GAME_WIDTH/2,
            50,
            "SAKE\nSTUMBLE",
            LOGO_HEADER
        );
        this.menuLabel.anchor.setTo(0.5,0);*/
        
        gameTitle = game.add.sprite(GAME_WIDTH/2, 50, 'title');
        gameTitle.anchor.setTo(0.5,0);

        // Show 'Tap to Play'
        this.menuLabel = this.game.add.text(
            GAME_WIDTH/2,
            GAME_HEIGHT/2,
            "TAP TO PLAY",
            STYLE_HEADER
        );
        this.menuLabel.anchor.setTo(0.5,0.5);
          
        // Show 'by Seano' down the bottom         
        this.menuLabel = this.game.add.text(
            GAME_WIDTH/2,
            GAME_HEIGHT-60,
            "BY SEANO",
            {
                font: "20px Blocky",
                fill: '#fff',
                stroke: '#333',
                strokeThickness: 8,
                align: 'center'
            }
        );
        this.menuLabel.anchor.setTo(0.5,0.5);
        
        // Start the game by tapping
        this.game.input.onTap.add(this.transition, this);        
    },
    transition : function() {
        this.game.state.start('game');
    }
};

// GameOver
Game.GameOver = function(game){
  this.menuLabel = null; 
  this.hud = null; 
  this.itemLabel = '';
  this.scoreLabel = null;
};
Game.GameOver.prototype = {
    preload : function() {
        this.level = new Level(game);
    },
    create : function() {

        var gameOverText = GAMEOVER_TEXT;
        this.game.world.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT); // Reset game bounds

        var id = Math.floor(Math.random()*gameOverText.length); // Select a random game over blurb

        // Show the level again
        world = game.add.group();
        this.level.create();
        game.time.events.remove(this.level.waveTimer);

        // Add a duck to the screen
        this.duck = this.game.add.sprite(GAME_WIDTH/2, START_POSITION+80, 'duck');
        this.duck.anchor.setTo(0.5,0.5);

        // Get score if browser supports it
        if(this.game.device.localStorage) {
            // Prevent high score from being undefined
            if (localStorage.highScore == undefined) {
                localStorage.highScore = localStorage.score;
            }
            
            // Set medal text
            if (localStorage.score > BRONZE) {
                gameOverText[id] = 'BRONZE MEDAL';
            } else if (localStorage.score > SILVER) {
                gameOverText[id] = 'SILVER MEDAL';            
            } else if (localStorage.score > GOLD) {
                gameOverText[id] = 'WOW! GOLD MEDAL';            
            }

            // Show items if collected more than one
            if (localStorage.items > 0) {
                this.itemLabel = "\n" + "ITEMS: " + localStorage.items;
            }
            
            // Display game over text on screen
            this.scoreLabel = gameOverText[id] + 
            "\n\n\SCORE: " + localStorage.score + 
            "\n" + "HIGH SCORE: " + localStorage.highScore   + 
            this.itemLabel + 
            "\n\nTAP TO RETRY";
            
        } else {
            // Can't save scores so just display game score
            this.scoreLabel = gameOverText[id] + 
            "\n\n\SCORE: " + this.Hud.score + 
            "\n\nTAP TO PLAY";
        }
        
        // Display the game over text
        this.menuLabel = this.game.add.text(
            this.game.world.width/2,
            this.game.world.height/3,
            this.scoreLabel,
            STYLE_HEADER
        );
        this.menuLabel.anchor.setTo(0.5,0.5);
        
        this.game.input.onTap.add(this.transition, this); // Restart game on tap

    },
    transition : function() {
        this.game.state.start('game'); 
    }
};
