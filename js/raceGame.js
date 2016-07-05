/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

canvas.init();
var fondo = new Image();
fondo.src = 'img/fondo.jpg';
var cars = new Image();
cars.src = 'img/car1.jpg';

var game = {
    date: new Date(),
    players: new Array(),
    finishLineX: canvas.container.width-10, 
    render: function(){
        canvas.ctx.drawImage(fondo, 0,0, canvas.container.width, canvas.container.height);
        for(var c=0; c < this.players.length; c++){
            player = this.players[c];
            //canvas.drawRect(player.position,20,30, { color:player.color, name: player.name });
            imgOptions={ img:cars, 
                         srcx:0,
                         srcy:0,
                         srcwdth:30,
                         srchght:30, 
                         destx:0, 
                         desty:0, 
                         destw:30, 
                         desth:30                         
                       }
            canvas.drawChar(player.position,imgOptions, { color:player.color, name: player.name });
        }
        canvas.drawLine(new canvas.vector(canvas.container.width-10,0),
                        new canvas.vector(canvas.container.width-10,canvas.container.height),
                        {color:'#CCCCCC'});
    },
    addPlayer: function(player){
        this.players.push(player);
    }
};
game.addPlayer(new player({name:'Player 1', x:10, y:200, color:'#FF0000'}));
game.addPlayer(new player({name:'CPU', ia:true,  x:10, y:270, color:'#00FF00'}));
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

counter=3;
function startGame(){
        window.addEventListener("keydown", 
                                function(event) {
                                    input.onKeyDown(event, true);
                                    if(input.key_code == input.key_right || input.key_code == input.key_d){
                                        game.players[0].position.x+=10;
                                    }
        }, false);
        canvas.ctx.clearRect(0, 0, canvas.container.width, canvas.container.height);        
        canvas.drawText(counter,{color:'#000'});
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
}

function finishGame(winner){
            canvas.ctx.clearRect(0, 0, canvas.container.width, canvas.container.height);        
            canvas.drawText('Finish!!',{color:'#000', x:canvas.container.width/3});
            canvas.drawText('Winner:'+winner.name,{color:winner.color, x:canvas.container.width/3, y:canvas.container.height/2+50});
}

//Start Game!!!
startGame();

