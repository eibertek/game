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
    this.answers = [];
    this.answered = false;
    this.selectedAnswer = null;
    this.pendingAnswer = false;
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
                    if(typeof(options.answers) != "undefined" ) {
                        this.answers = options.answers;
                        this.selectedAnswer =  0;
                    }
            }                  
    };
    this.update = function() {
        // update to the next frame if it is time
        if (this.counter == (this.frameSpeed - 1) && this.dialog != ""){
            this.actualDialog+=this.dialog.slice(0,1);
            this.dialog = this.dialog.substr(1);
        }
        if(this.dialog == "" && this.pendingAnswer === false ){
            if(  this.answers.length > 0 && this.answered ){
                this.finish = true;
            }
            if( this.answers.length==0 ) {
                this.finish = true;
            }
        }
        // update the counter
        this.counter = (this.counter + 1) % this.frameSpeed;
    };
    this.animate = function(displacedX){
      //  game.canvas.drawRect(this.position, this.height, this.width,{color:'#000', name:name, creature:true});
        this.movement(displacedX);
    };
    this.movement = function(displacedX){
        if(game.centered>0){
           this.self.position.x+= this.self.velX-game.centerVelocity;
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
      //      game.disableInput();
            game.players[0].clearStatus();
            game.cinematics = true;
        }
        if(!this.finish){
            this.update();
        }else{
      //      game.enableInput();
            input.clearKeys();
            this.finish = true;
            game.cinematics = false;
        }
        game.canvas.drawText(this.actualDialog, {color:"#000", x:20, y:70, font:'bolder 20px Courier New'});
        if( this.dialog == "" ) {
            for(var c = 0; c <  this.answers.length; c++){
                if(c == this.selectedAnswer){
                    game.canvas.drawText(this.answers[c].dialog, {color:"#FF0000", x:20, y:120 + 20*c, font:'bolder 20px Courier New'});
                }else{
                    game.canvas.drawText(this.answers[c].dialog, {color:"#00FF33", x:20, y:120 + 20*c, font:'bolder 20px Courier New'});
                }
            }
        }
        this.chooseAnswer();
        if (input.key_code[13]=== true) {
            if(this.pendingAnswer === false){
                this.answers = [];
                this.actualDialog = " ";
                this.answered = true;
                this.pendingAnswer = true;
                switch(this.selectedAnswer){
                    case 0:
                        this.dialog = 'AAAAHHHH BOEEEEEE ';
                        break;
                    case 1:
                        this.dialog = 'Bueno bueno no te quejes ';
                        break;
                    case 2:
                        this.dialog = '... puede ser mi error ';
                        break;
                }
                input.clearKeys();
            }else{
                this.finish = true;
                 input.clearKeys();
            }
        }
    };
    this.chooseAnswer = function(){
        if(this.answers.length==0) return false;
        if (input.key_code[38] || input.key_code[40]) {
                for(var c = 0; c < this.answers.length; c++){
                    console.log(c, this.selectedAnswer, this.answers);
                    if( c == this.selectedAnswer) {
                        if (input.key_code[40] === true) {
                            if(c+1 < this.answers.length){
                                this.selectedAnswer = c + 1;
                            }else{
                                this.selectedAnswer = 0;
                            }
                            input.clearKeys();
                            return true;
                        }
                        if (input.key_code[38] === true) {
                            if(c == 0){
                                this.selectedAnswer = this.answers.length - 1;
                            }else{
                                this.selectedAnswer = c - 1;
                            }
                            input.clearKeys();
                            return true;
                        }
                    }
                }
        }
    };
    this.create(img, gravity, position, width, height, bounds, options);
};


var dialogClass= function(){

    this.isInteractive=false;
    this.answers = [];

    this.init = function(){};

    this.nextSecuence = function(){};
};