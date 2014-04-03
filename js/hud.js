Hud = function(game) {
    this.game = game;
    this.score = 0;
    this.items = 0;
    this.scoreText = null;
    this.gameOverText = null;
};

Hud.prototype = {
    create: function() {
        localStorage.score = 0;
        this.scoreText = this.game.add.text(
            GAME_WIDTH/2,
            GAME_HEIGHT/8,
            '0',
            {
                font: "60px Blocky",
                fill: '#fff',
                stroke: '#333',
                strokeThickness: 8,
                align: 'center'
            }
        );
        this.scoreText.anchor.setTo(0.5,0.5);        
        this.scoreText.fixedToCamera = true; // Fixed position to the center of the viewport
        this.scoreText.setText(this.score); // Zero by default
        
        if(this.game.device.localStorage) {
            this.items = parseInt(localStorage.items); // Get number of stored items
        }

        this.itemText = this.game.add.text(
            GAME_WIDTH/2,
            GAME_HEIGHT-60,
            '',
            {
                font: "20px Blocky",
                fill: '#fff',
                stroke: '#333',
                strokeThickness: 8,
                align: 'center'
            }
        );
        this.itemText.anchor.setTo(0.5,0.5);
        this.itemText.fixedToCamera = true; 
    },
    updateScore: function() {
        this.score += 1; // Increment score for every barrel passed
        this.scoreText.setText(this.score); // Display score
        
        // Store score in local storage 
        if( this.game.device.localStorage ) {
            localStorage.score = this.score;
            if (localStorage.highScore && localStorage.highScore != 0) {
                if (this.score > localStorage.highScore) {
                    localStorage.highScore = this.score; // Update high score
                }
            } else {
                localStorage.highScore = this.score;
            }
        }
        
        if (localStorage.score > 30) {
            // After 30 barrels = fasterer!
            SPEED = 300; 
        }
    },    
    collectItem: function() {
        this.items += 1; // Increment items for each item picked up
        this.itemText.setText(this.items); // Display number of items

        if(this.game.device.localStorage) {
            localStorage.items = this.items; // Store number of items
        }
    },
};