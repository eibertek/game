/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var constants = {LEFT:'L', RIGHT:'R', IDLE:'idle', GO:'go', GORIGHT:'go', JUMP:'jump', ATTACK:'attack', HURT:'hurt'};
var player = function(data){
    this.name   = '';
    this.ia     = false;
    this.life   = 0;
    this.attack = 0;
    this.defense = 0;
    this.image  = '';
    this.status = null;
    this.color = '#0000'
    this.position= new game.canvas.vector(0,0);
    this.width = 0;
    this.height = 0;
    this.bounds = {};
    this.gravity = true;
    this.ethereal= false;
    this.jumping = false;
    this.grounded = false;
    this.velX = 0;
    this.velY = 0;
    this.aura = 2;
    this.speed= 3;
    this.self = this;
    this.orientation = null;
    this.moveTo = function(x,y){
        this.position.x = x;
        this.position.y = y;
        this.resetBounds();
    };
    this.sprite = null;
    this.movingAnimation = function(){
        if(this.self.velX<1 && this.self.velX>-2 && this.self.velY>-1) {
           this.self.status = constants.IDLE;
        }
        if(this.self.velY<=-1) {
           this.self.status = constants.JUMP;
        }         
        if(this.self.velX>=1) {
            this.self.orientation = 'R';
            this.self.status = constants.GO;
        }        
        if(this.self.velX<=-2) {
            this.self.orientation = 'L';
            this.self.status = constants.GO;
        }  
        if(this.self.jumping){
           this.self.status = constants.JUMP;
        }        
     };
    this.create = function(data){
        if(typeof(data.ia) != "undefined")
            this.ia=data.ia?true:false;
        if(typeof(data.name) != "undefined")
            this.name=data.name;
        if(typeof(data.x) != "undefined")
            this.position.x=data.x;        
        if(typeof(data.y) != "undefined")
            this.position.y=data.y;       
        if(typeof(data.width) != "undefined")
            this.width=data.width;  
        if(typeof(data.height) != "undefined")
            this.height=data.height;          
        if(typeof(data.color) != "undefined")
            this.color=data.color;                
        if(typeof(data.life) != "undefined")
            this.life=data.life;      
        if(typeof(data.sprite) != "undefined")
            this.sprite=data.sprite;
            with(this.sprite.left){
                 spritesheet = new SpriteSheet(img, spritesheet[0], spritesheet[1]);
                 idle = new Animation(spritesheet, idle[0], idle[1], idle[2]); 
                 go = new Animation(spritesheet, go[0], go[1], go[2]);      
                 attack = new Animation(spritesheet, attack[0], attack[1], attack[2]);      
                 jump = new Animation(spritesheet, jump[0], jump[1], jump[2]);  
            }
            with(this.sprite.right){
                 spritesheet = new SpriteSheet(img, spritesheet[0], spritesheet[1]);
                 idle = new Animation(spritesheet, idle[0], idle[1], idle[2]); 
                 go = new Animation(spritesheet, go[0], go[1], go[2]);      
                 attack = new Animation(spritesheet, attack[0], attack[1], attack[2]);      
                 jump = new Animation(spritesheet, jump[0], jump[1], jump[2]);  
            }
        
    };
    this.animate = function(displacedX){
        this.movingAnimation();
        if(this.orientation==constants.RIGHT){                
            spriteTemp =  this.sprite.left;
        }else{
            spriteTemp =  this.sprite.right;
        }
        switch(this.status){
            case constants.IDLE:
                //animate Idle
                spriteTemp.idle.update();
                spriteTemp.idle.draw(this.self.position.x-10, this.self.position.y-10);
                break;
            case constants.ATTACK:
                // animate attack;
                break;
            case constants.GO:
                spriteTemp.go.update();
                spriteTemp.go.draw(this.self.position.x-10, this.self.position.y-10);
                //animate Idle
                break;
             case constants.JUMP:
                this.sprite.left.jump.update();
                this.sprite.left.jump.draw(this.self.position.x-10, this.self.position.y-10);
                break;
            default:
                break;
        }
        if(game.cinematics){
            this.cinematicsMovement(displacedX);
        }else{
            this.movement(displacedX);
        }
    };
    this.cinematicsMovement = function(displacedX){
        this.self.velX *= game.phisics.friction;
        this.self.velY += game.phisics.gravity;

        this.self.grounded= false;
        this.colliding();
        if(this.self.grounded){
             this.self.velY = 0;
        }
        this.self.position.x += this.self.velX;
        this.self.position.y += this.self.velY;        
    };
    this.movement = function(){
        if(this.ia===true ) return false;
        if(game.pauseInput) return false;
        if (input.key_code[38] || input.key_code[32] || input.key_code[87]) {
        // up arrow or space
        if (!this.self.jumping && this.self.grounded) {
            this.self.jumping = true;
            this.self.grounded = false;
            this.self.velY = -this.self.speed * 3;
        }
        }
        if (input.key_code[39] || input.key_code[68]) {
            // right arrow
            if (this.self.velX < this.self.speed && game.centered <= 0) {
                this.self.velX++;
            }
        }
        if (input.key_code[37] || input.key_code[65]) {
            // left arrow
            if (this.self.velX > -this.self.speed) {
                this.self.velX--;
            }
        }
        this.self.velX *= game.phisics.friction;
        this.self.velY += game.phisics.gravity;

        this.self.grounded= false;
        this.colliding();
        if(this.self.grounded){
             this.self.velY = 0;
        }
        if(game.centered>0){
           this.self.position.x+= this.self.velX-game.centerVelocity;
        }else{        
           this.self.position.x += this.self.velX;
        }
        this.self.position.y += this.self.velY;

    };
    this.clearStatus = function(){
        this.self.velX = 0;
        this.self.velY= 0;
        if(this.jumping){          
            this.self.jumping = false;
        }
    }
    this.colliding = function(){
        for (var i = 0; i < game.objects.length; i++) {
            if(game.objects[i].ethereal) continue;
            var dir = game.colCheck(this.self, game.objects[i]);
            if (dir === "l" || dir === "r") {
                this.self.velX = 0;
                this.self.jumping = false;
            } else if (dir === "b") {
                this.self.grounded = true;
                this.self.jumping = false;
            } else if (dir === "t") {
                this.self.velY *= -1;
            }
        }
    };
    this.collidingObjectives = function(){
        for (var i = 0; i < game.objectives.length; i++) {
            temp = this.self;
            var dirtemp = game.colCheck_temp(temp, game.objectives[i]);
           if(dirtemp != null) game.objectives[i].doObjectives();
        }
            return false;
    };    
    this.create(data);
}
