// Player Entity
Player = function(game) {
	this.game = game;
	this.sprite = null;
    this.isDead = null;    
};

Player.prototype = {
    preload: function() {
        
    },
    create: function() {

        // Guy starts at the vertical position START_POSITION defined in game.js
        // TODO: Have him animate in
	    this.sprite = this.game.add.sprite(GAME_WIDTH/3, START_POSITION, 'walktest');

        game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        
        // For big sprite
        this.sprite.body.setSize(40, 40, 0, 30);
        
        // Set the camer to move
        this.game.camera.follow(this.sprite,Phaser.Camera.FOLLOW_TOPDOWN_LOOSE);

	    this.sprite.body.bounce.x = VELOCITY * 0.4; // For bouncing off walls 
	    this.sprite.body.gravity.x = GRAVITY; // Pull to right
	    this.sprite.anchor.setTo(0.5,0.5);

        // Add player to the world 
        world.add(this.sprite);

        // Move the player by tapping or pressing the UP arrow key
	    up_key = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
	    up_key.onDown.add(this.tap, this);  
	    game.input.onDown.add(this.tap, this); 
        
        // Init sounds
        tap = game.add.audio('tap',1,false);   
        hit = game.add.audio('hit',1,false);
        splash = game.add.audio('splash',1,false); 
              
        // Reset not dead. Used for animation after hitting something      
        this.isDead = false;  
        
        // Walk animation
        this.sprite.animations.add('walk');
        this.sprite.animations.play('walktest',11, true);

        // Define other animations
        // TODO: Combine into atlas
        this.sprite.loadTexture('fall', 0);
        this.sprite.animations.add('fall');         
        
        this.sprite.loadTexture('hit', 0);
        this.sprite.animations.add('hit'); 
     
    },
    update: function() {
        
        if (!this.isDead) {
            // Swap out animation is stumbling
            if (this.sprite.body.velocity.x < 50) {
                this.sprite.animations.play('walk', 11, true);
            } else {   
                this.sprite.animations.play('fall',11, true);   
            }
        }
    },  
    
    render: function() {

        game.debug.bodyInfo(this.sprite, 112, 112);
        game.debug.body(this.sprite);

    },
	tap: function() {  
        // Move to the left on tap
        tap.play('',0,0.5,false);
	    this.sprite.body.velocity.x = -VELOCITY; 
	},
    hitRight: function() {
        return this.sprite.body.right+30 >= this.game.world.bounds.right;
    },    
    hitLeft: function() {
        return this.sprite.body.x <= 0;
    },
    bounceBack: function() {
        if (this.sprite.body.y >= START_POSITION) {
            return true;
        }
        return false;
    },     
    gameCollide: function() {
        
        // Hit an obstacle
        hit.play('',0,0.3,false); 

        var spr = this.sprite.body;

        // Bounce backwards and direction hit
        spr.velocity.y = VELOCITY/4;   
        
        if (spr.touching.right) {
            spr.velocity.x = -VELOCITY/3; 
            spr.acceleration.x = VELOCITY/2;               
        } else if (spr.touching.left) {
            spr.velocity.x = VELOCITY/3;   
            spr.acceleration.x = -VELOCITY/2;          
        } else if (spr.touching.up) {
            spr.velocity.x = 0;  
            spr.velocity.y = VELOCITY;           
            spr.acceleration.y = -VELOCITY*2;       
        } else {
            spr.velocity.x = 0;  
            spr.velocity.y = 0;                  
        }

        spr.gravity.x = 0;
        
        this.gameOver(); 
    },     
    gameSplash: function() {
        // In the water
        splash.play('',0,0.4,false);  
        this.sprite.body.velocity.y = 0;
        this.sprite.body.velocity.x = -300;
        this.sprite.body.acceleration.x = VELOCITY*2; 
        this.gameOver(); 
    },   
    gameOver: function() {
        this.isDead = true;
        this.sprite.animations.play('hit',10, true); 
        //this.sprite.animations.stop();

        // Disable input
        game.input.onDown.remove(this.tap, this); 
        up_key.onDown.remove(this.tap, this); 
    }
	    
}
