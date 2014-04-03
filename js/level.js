Level = function(game) {
    // Define variables here
    this.game = game;
    this.obstacles = null;
    this.waveTimer = null;
    this.gaps = null;
    this.itemAnimate = false;
    prevRand = [];
};

Level.prototype = {
    preload: function() {
    },
    create: function() {
        
        // Create a new subgroup called bg and add it to world group
        bg = game.add.group();
        world.add(bg);
        
        // Define background elements and add to bg group
        //this.road = this.game.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, 'road');
        this.road = this.game.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, 'road');
           bg.add(this.road);         
        this.rightEdge = this.game.add.tileSprite(GAME_WIDTH-40, 0, 128, GAME_HEIGHT, 'rightEdge');
           bg.add(this.rightEdge);         
        this.leftRoof = this.game.add.tileSprite(-56, 0, 128, GAME_HEIGHT, 'leftRoof');
           bg.add(this.leftRoof);         
        this.leftShadow = this.game.add.tileSprite(-56, 0, 128, GAME_HEIGHT, 'leftShadow');
           bg.add(this.leftShadow);        

        // Define obstacle groups
        this.obstacles = this.game.add.group();
        this.obstacles.enableBody = true;
        this.obstacles.physicsBodyType = Phaser.Physics.ARCADE;
        
        this.gaps = this.game.add.group();
        this.gaps.enableBody = true;
        this.gaps.physicsBodyType = Phaser.Physics.ARCADE;
        
        this.item = this.game.add.group();
        this.item.enableBody = true;
        this.item.physicsBodyType = Phaser.Physics.ARCADE;
        
        // Add to the world
        world.add(this.item);
        world.add(this.obstacles);
        world.add(this.gaps);
        
        // Start the timer for spawning enemies 
        this.waveTimer = game.time.events.loop(Phaser.Timer.SECOND * WAVE_TIME, this.spawnObstacles, this);
            
        // Init the pass sound
        pass = game.add.audio('pass',1,false);
        collect = game.add.audio('collect',1,false);
        
        // Reset game paused state
        game.isPaused = false;
        
        // Experimental pulsing light
        //this.overlay = this.game.add.sprite(GAME_WIDTH/2, 0, 'overlay');
        //this.overlay.anchor.setTo(0.7,0);
        //game.add.tween(this.overlay).to( { alpha: 0 }, 3000, Phaser.Easing.Linear.None, true, 0, 3000, true);
        
        //game.add.tween(this.rightShore).to( { x: GAME_WIDTH-10, alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, GAME_WIDTH-20, 1000, true);

    },
    update: function() {

        // Scroll the background if game is not paused
        if (!game.isPaused) {
            bg.forEach(function(elem) {
                elem.tilePosition.y += 1;
            });  
            
            this.leftRoof.tilePosition.y += 1;                           
        }

        // Remove obstacle if off the bottom of the screen    
        this.obstacles.forEachAlive(function(obstacle) {
            if (obstacle.y > this.game.world.bounds.bottom) {
                obstacle.kill();
            }
        });
 
        // Remove gap if off the bottom of the screen          
        this.gaps.forEachAlive(function(gapSprite) {
            if (gapSprite.y > this.game.world.bounds.bottom) {
                gapSprite.kill();
            }
        });       
         
        // Remove collect if off the bottom of the screen          
        this.item.forEachAlive(function(itemSprite) {
            if (itemSprite.y > this.game.world.bounds.bottom) {
                itemSprite.kill();
            }
        });
    },
    updateScore: function(gapSprite) {
        // Play the pass sound and remove the gap after successful pass
        pass.play('',0,0.5,false);
        this.gaps.remove(gapSprite);
    },    
    collectItem: function(itemSprite) {
        this.itemAnimate = true;
    	collect.play('',0,0.5,false);
        collectTween = game.add.tween(itemSprite).to( { alpha: 0.3, width: 64, height: 104, y: itemSprite.body.y-100 }, 200, Phaser.Easing.Quadratic.Out, true);
        collectTween.onComplete.add(this.removeItem, this);
        //this.item.remove(itemSprite);
    },
    removeItem: function(itemSprite) {
        this.itemAnimate = false;
        this.item.remove(itemSprite);
    },
    gameOver: function() {
        // Stop the background scrolling
        game.isPaused = true;
        this.shakeScreen(8, 60);
        
        // Stop all obstacles
        this.obstacles.forEachAlive(function(obstacle) {
            obstacle.body.velocity.y = 0;
            obstacle.animations.stop();
        });
        this.gaps.forEachAlive(function(gapSprite) {
            gapSprite.body.velocity.y = 0;
        });
        this.item.forEachAlive(function(itemSprite) {
            itemSprite.body.velocity.y = 0;
        });
        
        // Stop new obstacles from spawning
        game.time.events.remove(this.waveTimer);

    },
    addOverlay: function() {   
        // These elements are on the top layer so add after all other elements in the game have been added (except HUD)    
        world.add(this.leftRoof);
        //world.add(this.overlay);
    },    
    addObstacle: function(x,y,type,sprite) {
        // Obstacles kill you on hit, gaps add to your score on hit
        var obstacle;
    	if (type == 'obstacles') {
 			obstacle = this.obstacles.create(x, y, sprite);   		
    	} else {
  			obstacle = this.gaps.create(x, y, sprite);    		
    	}
	    obstacle.body.velocity.y = SPEED; // Constant speed defined in game.js
	    return obstacle;
    },
    addBarrel: function(x) {
        // A rolling barrel
        var barrel = this.addObstacle(x*BASE_SIZE/2, -136, 'obstacles', 'barrel');

        // Set the hitbox size
        barrel.body.setSize(78, 74, 0, 16);
        barrel.anchor.setTo(0.5,0.5);  
        
        // Do a barrel roll - animate
        barrel.animations.add('barrel');
        barrel.animations.play('barrel', 8, true);   
        
        return barrel.height;        
    },
    randColumn: function(excludeVals) {
        // Define 10 columns where the obstacles can spawn
        // TODO: simplify this
        var filtered = [];
        var numbers = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
        var exclude = [excludeVals]; // Exclude these values
        for (var i = 0; i < numbers.length; i += 1) {
        if (exclude.indexOf(numbers[i]) === -1) {
                filtered.push(numbers[i]);
            }
        }
        
        // Pick a random column
        return filtered[Math.floor(Math.random() * filtered.length)];
    },   
    spawnObstacles: function() {
        
        var x = this.randColumn(0,3);

        // Prevent more than 3 obstacles in the same a column consecutively
        prevRand.push(x);

        if (prevRand.length > 2) {
            if (prevRand[0] == prevRand[1] == prevRand[2]) {
                if (prevRand[0] < 5) {
                    x = prevRand[0] + 3;    
                } else {
                    x = prevRand[0] - 3;                     
                }   
            }
            prevRand = [];
        }
        
    	//var column = Math.floor(Math.random() * GAME_WIDTH/BASE_SIZE*2);
        var enemyColumn = Math.floor(Math.random()*2);
        var enemy = 'barrel';
        
        var y = 0;
        // Chance of double barrels above a score of 5
        if (enemyColumn == 1 && localStorage.score > 5) {
            if (x < 2) {
                this.addBarrel(x+4);      
            } else if (x > 7) {
               this.addBarrel(x-4);  
            }      
        }
        
        // Chance of spawning an item
        var spawnBottle = Math.floor(Math.random()*ITEM_FREQ);
        if (spawnBottle == 0) {
            var x = this.randColumn(0);
            var bottle = this.item.create(x*BASE_SIZE/2, -52, 'bottle');   
            bottle.body.setSize(32, 52, 0, 0);    
            bottle.anchor.setTo(0.5,0.5);
            bottle.body.velocity.y = 60;
        }
        
        // Spawn a new barrel and return its height
        y = this.addBarrel(x);

        // Add a gap immediately behind the obstacle
    	var gapSprite = this.addObstacle(0, -y, 'gap', 0);
        gapSprite.width = GAME_WIDTH;
    	gapSprite.height = 1;
        gapSprite.body.setSize(GAME_WIDTH, 1, 0, 0);
     
    },
    shakeScreen: function(i, t) {
        game.add.tween(world).to({y : i}, t, Phaser.Easing.Linear.None)
        .to({y : -i}, t, Phaser.Easing.Linear.None)
        .to({y : 0}, t, Phaser.Easing.Linear.None).start();

        game.add.tween(world).to({x : i}, t, Phaser.Easing.Linear.None)
        .to({x : -i}, t, Phaser.Easing.Linear.None)
        .to({x : 0}, t, Phaser.Easing.Linear.None).start();
    },
};