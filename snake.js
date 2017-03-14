grids = 40;

window.onload = function(){
  c = document.getElementById('gc');
  cc = c.getContext('2d');
  scale = c.width / grids;

  var player = new Player(37, 38, 39, 40);
  var apple = new Apple();
  game = new GameSettings("hardBounds", player,apple);
  window.addEventListener('keydown',game.checkKeys,false);
  setInterval(update,1000/15, game);
}

function  update(game){
  cc.fillStyle = 'black';
  cc.fillRect(0,0,c.width,c.height);
  game.apple.place();
  game.player.snake.move();
}

class Snake{
  constructor(){
    this.reset();
  }

  reset(){
    var mid = parseInt(grids/2);
    this.body = [[mid,mid],[mid,mid+1],[mid,mid+2],[mid,mid+3]];
    this.dx = 0;
    this.dy = -1;
    this.score = 0;
  }

  place(){
    this.body.forEach(function(element, index){
      console.log('a[' + index + '] = ' + element);
      var x = element[0];
      var y = element[1];
      cc.fillStyle = 'white';
      cc.fillRect(x*scale, y*scale, scale, scale);
    });
  }

  move(){
    var newLocation = this.newLocation();
    if(this.checkIsDead(newLocation)){ return; }
    if(game.checkBounds(newLocation)){ return; }
    this.checkIfAte(newLocation);
    this.body = newLocation;
    this.place();
  }

  newLocation(){
    var x = this.body[0][0] + this.dx;
    var y = this.body[0][1] + this.dy;
    var newLocation = [[x,y]];
    for(var i = 0; i < this.body.length-1; i++){
      newLocation.push(this.body[i]);
    }
    return newLocation;
  }

  checkIsDead(newLocation){
    var head = newLocation[0];
    for(var i = 0; i < this.body.length-1; i++){
      if(this.body[i][0] == head[0]){
        if(this.body[i][1] == head[1]){
          this.dead();
          return true;
        }
      }
    }
    return false;
  }

  checkIfAte(newLocation){
    var head = newLocation[0];
    if(head[1] == game.apple.y){
      if(head[0] == game.apple.x){
        //add tail
        newLocation.push(this.body[this.body.length-1]);
        this.score++;
        game.apple.reset();
      }
    }
  }

  dead(){
    cc.fillStyle = 'red';
    cc.fillRect(0,0,c.width,c.height);
    setTimeout(200);
    this.reset();
  }
}

class Apple{
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.reset();
  }

  reset(){
    this.x = parseInt(Math.random()*grids)
    this.y = parseInt(Math.random()*grids);
  }

  place(){
    cc.fillStyle = 'red';
    cc.fillRect(this.x*scale, this.y*scale, scale, scale);
  }
}

class Player{
  constructor(left, up, right, down){
    this.left = left;
    this.up = up;
    this.right = right;
    this.down = down;
    this.snake = new Snake();
  }
}

class GameSettings{
  constructor(bounds, player, apple){
    this.bounds = bounds;
    this.player = player;
    this.apple = apple;
  }
  //if(players == 2) make second player

  checkBounds(newLocation){
    var x = newLocation[0][0];
    var y = newLocation[0][1];
    var dead;
    if(this.bounds == "hardBounds"){
      dead = this.hardBounds(x,y);
    }
    else if(this.bounds == "wrapBounds"){
      this.wrapBounds(newLocation);
      dead = false;   //can't die from hitting the edges
    }
    return dead;
  }

  hardBounds(x, y){
    if(x>grids || x<0){
      this.player.snake.dead();
      return true;
    }
    if(y>grids || y<0){
      this.player.snake.dead();
      return true;
    }
    return false;
  }

  wrapBounds(newLocation){
    //wrap around if going off screen
    var snakeBody = this.player.snake.body;
    var x = newLocation[0][0];
    var y = newLocation[0][1];

    if(x > grids){ //going right
      x = 0;
      snakeBody[0][0] = x;
    }
    if(x < -1){ //going left
      x = grids-1;
      snakeBody[0][0] = x;
    }
    if(y > grids){ //going down
      y = 0;
      snakeBody[0][1] = y;
    }
    if(y < -1){ //going up
      y = grids;
      snakeBody[0][1] = y;
    }
    newLocation[0][0] = x;
    newLocation[0][1] = y;
  }

  checkKeys(e) {
    var snake = this.game.player.snake;
    var code = e.keyCode;
    var dx = snake.dx;
    var dy = snake.dy;

    //change this to be list of active buttons from players
    switch (code) {
        case 37:
              dx = - 1;
              dy = 0;
              break; //Left key
        case 38:
              dx = 0;
              dy = -1;
              break; //Up key
        case 39:
              dx = 1;
              dy = 0;
              break; //Right key
        case 40:
              dx = 0;
              dy = 1;
              break; //Down key
        default:
              //alert("pls no. no press"); //Everything else
    }
    snake.dx = dx;
    snake.dy = dy;
  }
}
