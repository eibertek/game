(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();
var canvas = new canvasClass('canvas_ppg');
//var backgroundCanvas = new canvasClass('canvas_ppg_bkg');
var canvasInfo = new canvasClass('canvas_info');
game.addObject(new object(null,true, new canvas.vector(0,canvas.container.height-40),canvas.container.width*3,30,{ethereal:false, movable:false, floor:true}));
game.addObject(new object(null,true, new canvas.vector(0,0),1,canvas.container.height,{ethereal:false, movable:false, floor:true, limitWall:true}));
game.addObject(new object(null,true, new canvas.vector(canvas.container.width,0),1,canvas.container.height,{ethereal:false, movable:false, floor:true, limitWall:true}));
//game.addObject(new object('C1',true, new canvas.vector(350,-150),120,20,{ethereal:false, movable:true}));
/*game.addCreature(new object('Enemy',true, new canvas.vector(290,-550),40,40,
                                                {ethereal:false, movable:true, creature:true, life:500, enemyVelocity:1}));
//game.addCreature(new object('Enemy #2',true, new canvas.vector(150,-550),30,40,{ethereal:false, movable:true, creature:true, life:500}));
*/
var fondo = new Image();
fondo.src = 'img/bckground_mbros.jpg';
fondo.onload = function() {
    game.addObject(new object(fondo,true, new canvas.vector(0,0),fondo.width,canvas.container.height,{ethereal:true, movable:false, visible:true, background:true}));    
    game.addObject(new object(null,true, new canvas.vector(492,410),100,80,{ethereal:false, movable:false, visible:false}));
    game.addObject(new object(null,true, new canvas.vector(592,435),55,25,{ethereal:false, movable:false, visible:false}));
    colwidth= 52;
    colHeight= 25;
    pointWidth = 647;
    for(var i=1; i < 8; i++) {
        game.addObject(new object(null,true, new canvas.vector(pointWidth,435-colHeight*i),colwidth,colHeight*i,{ethereal:false, movable:false, visible:false}));
        pointWidth+=colwidth;
    }
    game.addObject(new object(null,true, new canvas.vector(pointWidth,435-colHeight*7),colwidth,colHeight*i,{ethereal:false, movable:false, visible:false}));
    game.addCreature(new object(null,true, new canvas.vector(492,310),30,40,
                                                {ethereal:false, movable:true, visible:true, creature:true, life:3000, enemyVelocity:2}));
}
var charSprite = new Image();
charSprite.src = 'img/char1.png';
charSprite.onload = function() {
    game.addPlayer(new player({name:'Player 1', x:100, y:310, color:'#FF0000', width:40, height:50, life:1000, sprite: charSprite}));    
}

function startGame(){
        document.body.addEventListener("keydown", function (e) {
            input.onKeyDown(e);
        });

        document.body.addEventListener("keyup", function (e) {
            input.onKeyUp(e);
        });   
        window.addEventListener("load", function () {
            game.render();
        });        
}

function finishGame(winner){
            canvas.ctx.clearRect(0, 0, canvas.container.width, canvas.container.height);        
            canvas.drawText('Finish!!',{color:'#000', x:canvas.container.width/3});
            canvas.drawText('Winner:'+winner.name,{color:winner.color, x:canvas.container.width/3, y:canvas.container.height/2+50});
}

//Start Game!!!
startGame(); //Si llega a 607 gano.
