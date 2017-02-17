snake = [[]];
snakeMove = [[]];
grids = 20;
dx = 0;
dy = -1;
apple = [];

window.onload = function(){
  c = document.getElementById('gc');
  cc = c.getContext('2d');
  setInterval(update,1000/10);
  window.addEventListener('keydown',this.checkKeys,false);
  scale = c.width / grids;
  resetSnake();
  appleReset();
}

function  update(){
  cc.fillStyle = 'black';
  cc.fillRect(0,0,c.width,c.height);
  placeApple();
  moveSnake();
}

function resetSnake(){
  mid = parseInt(grids/2);
  snake = snakeMove = [[mid,mid],[mid,mid+1],[mid,mid+2],[mid,mid+3]];
  dx = 0;
  dy = -1;
}

function moveSnake(){
  newHead(dx, dy);
  addBody();
  checkDead();
  snake = snakeMove;
  snake.forEach(buildSnake);
}

function buildSnake(element, index, array){
  console.log('a[' + index + '] = ' + element);
  x = element[0];
  y = element[1];
  cc.fillStyle = 'white';
  cc.fillRect(x*scale, y*scale, scale, scale);
}

function newHead(dx, dy){
  //get head coordinates
  x = snake[0][0] + dx;
  y = snake[0][1] + dy;
  //add the head to the array
  snakeMove = [[x,y]];
  hardBounds(x,y);
}

function addBody(){
  snake.forEach(function(element, index){
    snakeMove.push(element);
    if(snake.length-2 == index){
      snake.shift();
    }
  });
}

function checkDead(){
  snake.forEach(function(element){
    if(snakeMove[0][0] == element[0] && snakeMove[0][1] == element[1]){
      dead();
    }
  });
}

function dead(){
    resetSnake();
}

function placeApple(){
  cc.fillStyle = 'red';
  cc.fillRect(apple[0]*scale, apple[1]*scale, scale, scale);
  //if apple location equal to the head location, reset the apple position
  if(apple[0] == snake[0][0] && apple[1] == snake[0][1]){
    appleReset();
    snake.forEach(function(element, index){
      if(snake.length-1 == index){
        snakeMove.push(element);
      }
    });
    snake = snakeMove;
  }
}

function appleReset(){
  x = parseInt(Math.random()*grids)
  y = parseInt(Math.random()*grids);
  apple = [x,y];
  placeApple();
}

function checkKeys(e) {
  code = e.keyCode;
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
}

function hardBounds(x, y){
  if(x>grids || x<0){
    dead();
  }
  if(y>grids || y<0){
    dead();
  }
}
