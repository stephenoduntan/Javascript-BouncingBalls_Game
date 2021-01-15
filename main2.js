const menuBox = document.querySelector('#menu');
const option = document.querySelector('.option');
const startGame = document.querySelector('#start-game');
const levelBtn = document.querySelector('#difficulty');
const levels = document.querySelector('#levels');
const instructionBtn = document.querySelector('#instructionBtn');
const instruction = document.querySelector('.instruction');
const difficulty = document.querySelectorAll('#levels button');


let aim = 'Your aim in this game is for you to get all the floating balls eaten by the evil circle. ' +
"Use key 'w', 's', 'a', 'd' to move the evil circle up, down, left, right respectively in order to get to the floating balls. "  +
"Click on the 'Select Difficulty' option in the menu to change the diffilculty of the game." + "Make sure you do not have your 'caps-lock' on while playing."

let message;

const score = document.querySelector('.score');
let count = new Number;

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

//func for random number
function random(min, max){
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}

//funct to sqrt number
function squareNum(num){
    const sqr = Math.floor(Math.pow(num, 2));
    return sqr;
}

//General object
function Shape(x, y, velX, velY, exists){
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = exists;
}

//Ball object
function Ball(x, y, velX, velY, exists, color, radius){
    Shape.call(this, x, y, velX, velY, exists);
    
    this.color = color;
    this.radius = radius;
}

//Circle object
function Circle(x, y, velX, velY, exists, color){
    Shape.call(this, x, y, velX, velY, exists)

    this.color = color;
    this.radius = 10;
}

Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

Ball.prototype.create = function(){
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
}

Ball.prototype.update = function(){
    if((this.x + this.radius) >= width){
        this.velX = -(this.velX)
    }
    if((this.x - this.radius) <= 0){
        this.velX = -(this.velX)
    }
    if((this.y + this.radius) >= height){
        this.velY = -(this.velY)
    }
    if((this.y - this.radius) <= 0){
        this.velY = -(this.velY)
    }

    this.x += this.velX;
    this.y += this.velY;
}

Ball.prototype.collisionDetect = function(){
    for(j = 0; j < balls.length; j++){
        if(!(this === balls[j]) && balls[j].exists){
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if((distance < this.radius + balls[j].radius) && balls[j].exists){
                balls[j].color = `rgb(${random(0,225)}, ${random(0,225)}, ${random(0,225)})`
            }
        }
    }
}

Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle

Circle.prototype.create = function() {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 4;
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.stroke();
}

Circle.prototype.moveCircle = function(){
    let _this = this;
    window.onkeydown = function(e){
        if(e.key === 'w'){
            _this.y -= _this.velY
        } else if(e.key === 's'){
            _this.y += _this.velY
        }else if(e.key === 'a'){
            _this.x -= _this.velX
        }else if(e.key ==='d'){
            _this.x += _this.velX
        }
    }
}

Circle.prototype.checkBounds = function() {
    if((this.x + this.radius) >= width){
        this.velX = -(this.velX)
    }
    if((this.x - this.radius) <= 0){
        this.velX = -(this.velX)
    }
    if((this.y + this.radius) >= height){
        this.velY = -(this.velY)
    }
    if((this.y - this.radius) <= 0){
        this.velY = -(this.velY)
    }
}

Circle.prototype.collisionDetect = function() {
    for(j = 0; j < balls.length; j++){
        if(balls[j].exists){
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy *dy)

            if(distance < this.radius + balls[j].radius){
                balls[j].exists = false;
                balls[j].radius = 0
                count--;
                score.textContent = `Balls Left: ${count}` ;

                if(count === 0){
                    menuBox.classList.add('menu');
                    count = new Number;
                    message = document.createElement('p');
                    message.textContent = 'CONGRATULATIONS!!!, you have completed this difficulty';
                    message.style.display = 'block'
                    option.append(message);
                    setInterval(function(){
                        location.reload();
                    }, 3000)
                }
            }
        }
    }
}

let balls = [];

//Ball loops
let allBalls;

for(i = 0; i < difficulty.length; i++){
    difficulty[i].addEventListener('click', function(e){
        if(e.target.innerText === 'Easy'){
            allBalls = squareNum(4);
        }
        if(e.target.innerText === 'Medium'){
            allBalls = squareNum(5);
        }
        if(e.target.innerText === 'Hard'){
            allBalls = squareNum(6);
        }
        levels.classList.toggle('difficulty');
    })
}


let size = 10;
let evilCircle = new Circle(random(0 + size, width - size), random(0 + size, height - size), 20, 20, true, '#fff')

function loop(){
    ctx.fillStyle = 'rgba(0, 0, 0, 0.20)';
    ctx.fillRect(0, 0, width, height)

    for(i = 0; i < balls.length; i++){
        balls[i].create();
        balls[i].update();
        balls[i].collisionDetect();
    }

    evilCircle.create();
    evilCircle.moveCircle();
    evilCircle.checkBounds();
    evilCircle.collisionDetect();

    requestAnimationFrame(loop);
}

loop();

function reset(){
    while(balls.length < allBalls){
        let size = random(10, 20);
        let ball = new Ball(random(0 + size, width - size), random(0 + size, height - size), random(-3, 9), random(-3, 9), true, `rgb(${random(0,225)},${random(0,225)},${random(0,225)})`, size);
    
        balls.push(ball);
        count++;
        score.textContent = `Balls Left: ${count}`;
    }

    menuBox.classList.remove('menu');
    message.style.display = 'none';

    loop();
}


startGame.addEventListener('click', reset);

levelBtn.onclick = function(){
    levels.classList.toggle('difficulty')
}

instructionBtn.onclick = function(){
    instruction.textContent = aim;
    if(instruction.style.display === 'none'){
        instruction.style.display = 'block';
    }else{
        instruction.style.display = 'none'
    }
}
