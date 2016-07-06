var game = {
    date: new Date(),
    phisics: {gravity:0.3, friction:0.8},
    players: new Array(),
    objects: new Array(),
    background: new Array(),
    objectives: new Array(),
    creatures: new Array(),
    screenPlay: null,
    errorAllowedY: 5,
    errorAllowedX: 1,
    debug: true,
    debugData: [],
    endScreen: false,
    self: this,
    canvas: null,
    pauseInput:false,
    cinematics:false,
    centered:0,
    centerVelocity:5,
    colCheck: function(shapeA, shapeB) {
            // get the vectors to check against
            var vX = (shapeA.position.x + (shapeA.width / 2)) - (shapeB.position.x + (shapeB.width / 2)),
                vY = (shapeA.position.y + (shapeA.height / 2)) - (shapeB.position.y + (shapeB.height / 2)),
                // add the half widths and half heights of the objects
                hWidths = (shapeA.width / 2) + (shapeB.width / 2),
                hHeights = (shapeA.height / 2) + (shapeB.height / 2),
                colDir = null;

            // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
            if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
                // figures out on which side we are colliding (top, bottom, left, or right)
                var oX = hWidths - Math.abs(vX),
                    oY = hHeights - Math.abs(vY);
                if (oX >= oY) {
                    if (vY > 0) {
                        colDir = "t";
                        shapeA.position.y += oY;
                    } else {
                        colDir = "b";
                        shapeA.position.y -= oY;
                    }
                } else {
                    if (vX > 0) {
                        colDir = "l";
                        shapeA.position.x += oX;
                    } else {
                        colDir = "r";
                        shapeA.position.x -= oX;
                    }
                }
            }
            return colDir;
        },
    colCheck_temp: function(shapeA, shapeB) {
            // get the vectors to check against
            var vX = (shapeA.position.x + (shapeA.width / 2)) - (shapeB.position.x + (shapeB.width / 2)),
                vY = (shapeA.position.y + (shapeA.height / 2)) - (shapeB.position.y + (shapeB.height / 2)),
                // add the half widths and half heights of the objects
                hWidths = (shapeA.width / 2) + (shapeB.width / 2),
                hHeights = (shapeA.height / 2) + (shapeB.height / 2),
                colDir = null;

            // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
            if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
                // figures out on which side we are colliding (top, bottom, left, or right)
                var oX = hWidths - Math.abs(vX),
                    oY = hHeights - Math.abs(vY);
                if (oX >= oY) {
                    if (vY > 0) {
                        colDir = "t";
                    //    shapeA.position.y += oY;
                    } else {
                        colDir = "b";
                     //   shapeA.position.y -= oY;
                    }
                } else {
                    if (vX > 0) {
                        colDir = "l";
                     //   shapeA.position.x += oX;
                    } else {
                        colDir = "r";
                     //   shapeA.position.x -= oX;
                    }
                }
            }
            return colDir;
        },        
    drawBackground: function(){
        for(var c=0; c < this.background.length; c++ ){
            this.background[c].animate('',displaceX);
        }
    },
    drawCreatures: function(){
        for(var c=0; c < this.creatures.length; c++ ){
            this.creatures[c].animate('',displaceX);                
        }    
    },
    drawObjects: function(){
        for(var c=0; c < this.objects.length; c++ ){
            this.objects[c].animate('',displaceX);                
        }    
    },    
    drawObjectives: function(){
        for(var c=0; c < this.objectives.length; c++ ){
            this.objectives[c].animate(displaceX);
        }    
    },     
    drawCharacters: function(displaceX){
        for(var c=0; c < this.players.length; c++ ){
            this.players[c].animate(displaceX);
        } 
    },
   disableInput: function(){
                game.pauseInput= true;
                document.body.removeEventListener("keydown",handlerKeyDown);
                document.body.removeEventListener("keyup",handlerKeyUp);
    },
   enableInput: function(){
        game.pauseInput= false;
        document.body.addEventListener("keydown",handlerKeyDown);
        document.body.addEventListener("keyup", handlerKeyUp);
    },
    render: function(){
        game.canvas.ctx.clearRect(0, 0, game.canvas.container.width, game.canvas.container.height); 
        displaceX = false;
        if(!game.pauseInput && game.players[0].position.x > game.canvas.container.width*9.2/10){
            game.centered=Math.abs(game.canvas.container.width/2);
        }
        game.drawBackground(displaceX);
        game.drawObjects(displaceX);
        game.drawCharacters(displaceX);
        game.drawCreatures(displaceX);
        game.drawObjectives(displaceX);
        game.players[0].collidingObjectives();
        game.canvas.drawText('JUEGO EN VERSION BETA', {color:"#00FF11", x:20, y:40, font:'20px Arial'});   
        game.clearFinishedObjectives();
        game.centerAll();
        requestAnimationFrame(game.render);
    },
    addPlayer: function(player){
        this.players.push(player);
    },
    addObject: function(object){
        this.objects.push(object);
    },
    addBackground: function(object){
           this.background.push(object);
       },
    addObjective: function(object){
        this.objectives.push(object);
    },    
    addCreature: function(object){
        this.creatures.push(object);
    },    
    setCanvas: function(canvas){
        this.canvas = canvas;
    },    
    removeCreature: function(id){
        for (var i = 0; i < game.creatures.length; i++) {
            if(game.creatures[i].id==id){
                game.creatures.splice(i,1);    
                return true;
            }
       }
       return false;
    },
    doCinematics: function(){},
    centerAll: function(){
        //objects
        //player
        //Background
        //objectives
        //creatures
       if(game.centered>0){
          this.centered-=3;
      }
    },
    clearFinishedObjectives: function(){
        for(var c=0; c < this.objectives.length; c++ ){
            if(this.objectives[c].finish){
                game.objectives[c].doObjectives();
                game.objectives.splice(c,1);
            }
        }    
    }
};



