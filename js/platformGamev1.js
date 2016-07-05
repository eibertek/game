
canvas.init();
var object = function(img, gravity, position, width, height, bounds){
    this.img = '';
    this.gravity= true;
    this.position= new canvas.vector(0,0);
    this.width = 0;
    this.height = 0;
    this.bounds = [];
    this.create = function(img, gravity, position, width, height, bounds){
            if( typeof(img) != "undefined" ){
                this.img= img;
            }
            if( typeof(gravity) != "undefined" ){
                this.gravity= gravity;
            }
            if( typeof(position) != "undefined"  && position instanceof canvas.vector ){
                this.position= position;
            }
            if( typeof(width) != "undefined" ){
                this.width= width;
            }
            if( typeof(height) != "undefined" ){
                this.height= height;
            }
            if( typeof(bounds) != "undefined" && bounds instanceof bound){
                this.addBound(bounds);
            }else{
                this.addBound(new bound(new canvas.vector(this.position.x,this.position.y) , new canvas.vector(this.position.x, this.position.y+this.height), false, {name:'left', visible:true})); //left
                this.addBound(new bound(new canvas.vector(this.position.x,this.position.y) , new canvas.vector(this.position.x+this.width, this.position.y), false, {name:'up', visible:true}));  //up
                this.addBound(new bound(new canvas.vector(this.position.x+this.width,this.position.y) , new canvas.vector(this.position.x+this.width, this.position.y+this.height), false, {name:'right', visible:true}));  //right
                this.addBound(new bound(new canvas.vector(this.position.x,this.position.y+this.height) , new canvas.vector(this.position.x+this.width, this.position.y+this.height), false, {name:'down', visible:true}));  //down        
                              
            }
    };
    this.addBound = function(boundObj){
        if(boundObj instanceof bound ) {
            this.bounds.push(boundObj);            
        }
    };
    this.collide = function(object){
        //collide x
        if( ( object.position.x > this.position.x && object.position.x < this.position.x+ this.width) 
            && ( object.position.y > this.position.y && object.position.y < this.position.y+ this.height) ){
                return true;
            }else{
                return false;
            }
    };
    this.animate = function(status){
        switch(status){
            case 1:
                //animate Idle
                break;
            case 2:
                // animate attack;
                break;
            case 3:
                // animate attacked
                break;
            case 4:
                // animate destroyed
                break;
            default:
                //animate Idle
                if(this.img ==''){
                 //  canvas.drawRect(this.position, this.width, this.height,{color:'#DDDDDD'});                    
                }
                break;
        }
        this.bounds = [];
        this.addBound(new bound(new canvas.vector(this.position.x,this.position.y) , new canvas.vector(this.position.x, this.position.y+this.height), false, {name:'left', visible:true})); //left
        this.addBound(new bound(new canvas.vector(this.position.x,this.position.y) , new canvas.vector(this.position.x+this.width, this.position.y), false, {name:'up', visible:true}));  //up
        this.addBound(new bound(new canvas.vector(this.position.x+this.width,this.position.y) , new canvas.vector(this.position.x+this.width, this.position.y+this.height), false, {name:'right', visible:true}));  //right
        this.addBound(new bound(new canvas.vector(this.position.x,this.position.y+this.height) , new canvas.vector(this.position.x+this.width, this.position.y+this.height), false, {name:'down', visible:true}));  //down        
    };
    this.create(img, gravity, position, width, height, bounds);
};
var bound = function(origin, destiny, ethereal, options){
    this.orig = new canvas.vector(0,0);
    this.dest = new canvas.vector(0,0);   
    this.ethereal = false;
    this.visible = false;
    this.boundName = ''; 
    this.is_ethereal = function(){
        return this.ethereal;
    }
    this.create = function(origin, destiny, ethereal, options){
        if(origin instanceof canvas.vector && destiny instanceof canvas.vector) {
            this.orig = origin;
            this.dest = destiny;
        }
        if(typeof(options.visible) != "undefined" ) {
            this.visible = options.visible;
        }
        if(typeof(options.name) != "undefined" ) {
            this.boundName = options.name;
        }        
        this.ethereal = ethereal;
        return this;
    };
    return this.create(origin, destiny, ethereal, options);
};

var game = {
    date: new Date(),
    phisics: {gravity:10},
    players: new Array(),
    objects: new Array(),
    worldBounds: [],
    errorAllowed: 5,
    render: function(){
//        canvas.ctx.drawImage(fondo, 0,0, canvas.container.width, canvas.container.height);
        for(var c=0; c < this.worldBounds.length; c++)
        {
            if ( this.worldBounds[c].visible === true ){
                canvas.drawLine(this.worldBounds[c].orig, this.worldBounds[c].dest, {color:'#CCCCCC'});
            }
        }                

        for(var c=0; c < this.objects.length; c++ ){
                for(var i=0; i < this.objects[c].bounds.length; i++)
                {
                    if ( this.objects[c].bounds[i].visible === true ){
                        canvas.drawLine(this.objects[c].bounds[i].orig, this.objects[c].bounds[i].dest, {color:'#FF0000'});
                    }
                }              
            if(this.objects[c].gravity && !this.detectObjectCollision(this.objects[c]) ) // if object.collide(this.worldbounds)    && ( this.objects[c].position.y+this.objects[c].height < canvas.container.height-10
                {
                this.objects[c].position.y+=this.phisics.gravity;
            }
             this.objects[c].position.x--;
            this.objects[c].animate();                
        }    
        for(var c=0; c < this.players.length; c++ ){

        }                
    },
    detectObjectCollision: function(object){
                for(var i=0; i < object.bounds.length; i++)
                {
                    for(var j=0; j < this.worldBounds.length; j++)
                    {
                        if ( this.detectCollision(object.bounds[i], this.worldBounds[j]) === true ) return true; 
                    }                     
                }         
                return false;
    },
    detectCollision: function(bound1, bound2){
        if(bound1.orig.x >= bound2.orig.x && bound1.dest.x <= bound2.dest.x 
           && bound1.orig.y <= (bound2.orig.y + this.errorAllowed) && bound1.orig.y > (bound2.orig.y - this.errorAllowed)
           ){
               return true;
           }else{
               return false;
           }    //COmprendido en x con el bound2
    },
    addPlayer: function(player){
        this.players.push(player);
    },
    addObject: function(object){
        this.objects.push(object);
    },
    addBound: function(bound){
        this.worldBounds.push(bound);
    }
    
};
game.addPlayer(new player({name:'Player 1', x:10, y:200, color:'#FF0000'}));
/*game.addObject(new object('',true, new canvas.vector(30,10),40,50));
game.addObject(new object('',true, new canvas.vector(150,80),40,50));
game.addObject(new object('',true, new canvas.vector(200,20),40,50));
game.addObject(new object('',true, new canvas.vector(250,30),40,50));
game.addObject(new object('',true, new canvas.vector(300,40),40,50));
game.addObject(new object('',true, new canvas.vector(350,50),40,50));
*/
game.addBound(new bound(new canvas.vector(0,canvas.container.height-50), new canvas.vector(canvas.container.width,canvas.container.height-50), false, {visible:true, name:'floor'}));
game.addBound(new bound(new canvas.vector(250,canvas.container.height-350), new canvas.vector(canvas.container.width,canvas.container.height-350), false, {visible:true, name:'elevatedfloor1'}));

counter=3;
function renderize(){
    canvas.ctx.clearRect(0, 0, canvas.container.width, canvas.container.height);        
    game.render();
}
function dropBox(){
        game.addObject(new object('',true, new canvas.vector(550,50),40,50));
}
function startGame(){
        window.addEventListener("keydown", 
                                function(event) {
                                    input.onKeyDown(event, true);
                                    if(input.key_code == input.key_right || input.key_code == input.key_d){
                                        game.players[0].position.x+=10;
                                    }
                                    if(input.key_code == input.key_left || input.key_code == input.key_a){
                                        game.players[0].position.x-=10;
                                    }
                                    if(input.key_code == input.key_up || input.key_code == input.key_w){
                                        game.players[0].position.y-=10;
                                    }
                                    if(input.key_code == input.key_down || input.key_code == input.key_s){
                                        game.players[0].position.y+=10;
                                    }                                    
        }, false);
        canvas.ctx.clearRect(0, 0, canvas.container.width, canvas.container.height);        
        window.setInterval(renderize,10);
        window.setInterval(dropBox,500);
/*        canvas.drawText(counter,{color:'#000'});
        counter--;
        if(counter==0){
            canvas.ctx.clearRect(0, 0, canvas.container.width, canvas.container.height);        
            canvas.drawText('Start!!!',{color:'#000'});
            setTimeout(function(){
                game.render();
                window.setInterval(race,10);
            }, 1000);            
        }else{
            setTimeout(startGame, 1000);            
        }
        */
}

function finishGame(winner){
            canvas.ctx.clearRect(0, 0, canvas.container.width, canvas.container.height);        
            canvas.drawText('Finish!!',{color:'#000', x:canvas.container.width/3});
            canvas.drawText('Winner:'+winner.name,{color:winner.color, x:canvas.container.width/3, y:canvas.container.height/2+50});
}

//Start Game!!!
startGame();


/*
function race(){
    canvas.ctx.clearRect(0, 0, canvas.container.width, canvas.container.height);        
    for(var c=0; c < game.players.length; c++){
        if(game.players[c].ia === true){
            game.players[c].position.x+= Math.random()*Math.PI;
        }
        if(game.players[c].position.x+20 > game.finishLineX) {
            window.clearInterval('race');
            window.removeEventListener('keydown', function(){});
            finishGame(game.players[c]);
            return true;
        }
    }
    game.render();
}
*/
