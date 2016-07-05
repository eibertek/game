var objective = function(img, gravity, position, width, height, bounds, options){
    this.img = null;
    this.name = '';
    this.id = Math.random().toString(36).substr(2);
    this.gravity= true;
    this.position= new game.canvas.vector(0,0);
    this.width = 0;
    this.height = 0;
    this.bounds = {};
    this.extra = {};
    this.life = 0;
    this.ethereal = false;
    this.visible = false;
    this.movable = true;
    this.grounded = false;
    this.creature = false;
    this.touched=false;
    this.enemyVelocity=3;
    this.velX = 0;
    this.velY = 0;
    this.speed= 3; 
    this.self = this;
    this.floor= false;
    this.limitWall = false;
    this.status = null;
    this.orientation = null;
    this.objectives = null;
    this.interactive = false;
    this.counter = 0;
    this.currentFrame = 0;
    this.totalFrames = 0;
    this.dialog = "";
    this.actualDialog = "";
    this.finish = false;
    this.create = function(img, gravity, position, width, height, options){
            if( typeof(img) != "undefined" && img != null){
                this.img= img;
            }
            if( typeof(gravity) != "undefined" ){
                this.gravity= gravity;
            }
            if( typeof(position) != "undefined"  && position instanceof game.canvas.vector ){
                this.position= position;
            }
            if( typeof(width) != "undefined" ){
                this.width= width;
            }
            if( typeof(height) != "undefined" ){
                this.height= height;
            }
            if ( typeof(options) != "undefined" ){
                    this.ethereal = options.ethereal;
                    if(typeof(options.movable) != "undefined" ) {
                        this.movable = options.movable;
                    }
                    if(typeof(options.floor) != "undefined" ) {
                        this.floor = options.floor;
                    }
                    if(typeof(options.name) != "undefined" ) {
                        this.name = options.name;
                    }                       
                    if(typeof(options.limitWall) != "undefined" ) {
                        this.limitWall = options.limitWall;
                    }         
                    if(typeof(options.creature) != "undefined" ) {
                        this.creature = options.creature;
                    } 
                    if(typeof(options.life) != "undefined" ) {
                        this.life = options.life;
                    }            
                    if(typeof(options.visible) != "undefined" ) {
                        this.visible = options.visible;
                    }else{
                        this.visible = true;
                    }                    
                    if(typeof(options.enemyVelocity) != "undefined" ) {
                        this.enemyVelocity = options.enemyVelocity;
                    }   
                    if(typeof(options.objectives) != "undefined" ) {
                        this.objectives = options.objectives;
                    }
                    if(typeof(options.frameSpeed) != "undefined" ) {
                        this.frameSpeed = options.frameSpeed;
                    }
                    if(typeof(options.dialog) != "undefined" ) {
                        this.dialog = options.dialog;
                    }
            }                  
    };
    this.update = function() {
        // update to the next frame if it is time
        if (this.counter == (this.frameSpeed - 1) && this.dialog != ""){
            this.actualDialog+=this.dialog.slice(0,1);
            this.dialog = this.dialog.substr(1);
        }
        if(this.dialog == "") this.finish = true;
        // update the counter
        this.counter = (this.counter + 1) % this.frameSpeed;
    };
    this.animate = function(displacedX){
        game.canvas.drawRect(this.position, this.height, this.width,{color:'#000', name:name, creature:true});
        this.movement(displacedX);
    };
    this.movement = function(displacedX){
        if(game.centered>0){
           this.self.position.x+= this.self.velX-3;
        }
    };
    this.colliding = function(){
        for (var i = 0; i < game.objects.length; i++) {
            if(game.objects[i].ethereal) continue;
            if(this.self.id != game.objects[i].id && !game.objects[i].limitWall){
                var dir = game.colCheck(this.self, game.objects[i]);
                if (dir === "l" || dir === "r") {
                    this.self.velX = 0;
                } else if (dir === "b") {
                    this.self.grounded = true;
                } else if (dir === "t") {
                    this.self.velY *= -1;
                }
            }
        }
    };  
    this.doObjectives = function(){
        if(!game.pauseInput && !this.finish){
            game.disableInput();
            game.players[0].clearStatus();
            game.cinematics = true;
        }
        if(!this.finish){
            this.update();
        }else{
            game.enableInput();
            input.clearKeys();
            this.finish = true;
            game.cinematics = false;
        }
        game.canvas.drawText(this.actualDialog, {color:"#FFFFFF", x:20, y:70, font:'bolder 20px Courier New'});
    };
    this.create(img, gravity, position, width, height, bounds, options);
};


var dialogClass= function(){

    this.isInteractive=false;
    this.answers = [];

    this.init = function(){};

    this.nextSecuence = function(){};
};