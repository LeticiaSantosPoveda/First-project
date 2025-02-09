const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

// BACKGROUND IMAGE
const backgroundImg = document.createElement('img');
backgroundImg.setAttribute('src', 'images/street-image.jpg');

// CONTAINER
const containerImg = document.createElement('img');
containerImg.setAttribute('src', 'images/container.png');
let containerWidth = 160;
let conWidthMargin = 30;
let containerHeight = 180;
let containerX = (canvas.getAttribute("width") - containerWidth)/2;
let containerY = canvas.getAttribute("height") - containerHeight;
let conVelocityX = 0; 

// GLASS IMAGES
let glass1 = document.createElement('img');
glass1.setAttribute('src', 'images/glass_1.png');

let glass2 = document.createElement('img');
glass2.setAttribute('src', 'images/glass_2.png');

let glass3 = document.createElement('img');
glass3.setAttribute('src', 'images/glass_3.png');

let glass4 = document.createElement('img');
glass4.setAttribute('src', 'images/glass_4.png');

let glass5 = document.createElement('img');
glass5.setAttribute('src', 'images/glass_5.png');

// CANS IMAGES
let can1 = document.createElement('img');
can1.setAttribute('src', 'images/soda_1.png');

let can2 = document.createElement('img');
can2.setAttribute('src', 'images/soda_2.png');

let can3 = document.createElement('img');
can3.setAttribute('src', 'images/soda_3.png');

let can4 = document.createElement('img');
can4.setAttribute('src', 'images/soda_4.png');

let can5 = document.createElement('img');
can5.setAttribute('src', 'images/soda_5.png');

// ARRAYS GLASS AND CANS
let glassArr = [glass1, glass2, glass3, glass4, glass5];
let cansArr = [can1, can2, can3, can4, can5];

// VARIABLES
let frames = 0;

let scoreShow = document.querySelector("#score span"); // el valor printeado
let score;  

let intervalId;
let activeComponent;
let components = [];

let gameAudio = new Audio("audio/gameAudio.mp3");
let overAudio = new Audio("audio/gameOver.wav");
let winAudio = new Audio("audio/winAudio.wav");
let gameMusic = new Audio("audio/gameAudio.mp3")

let body = document.getElementsByTagName("body")[0];
let arrows = document.getElementById("arrows");


let intervalArrows = setInterval(() => {
    if (arrows.src.includes("arrowsLeft")) arrows.src = "images/arrowsRight.png";
    else arrows.src = "images/arrowsLeft.png";
}, 400);


// OBJECTS CAN AND GLASS (medidas y posición predefinidas)
const can = {
    width: 50,
    height: 100,
    y: -100,
    points: 30,
    audio: new Audio("audio/canAudio.wav")
}

const glass = {
    width: 40,
    height: 130,
    y: -130,
    points: -30,
    audio: new Audio("audio/glassAudio.wav")
}

let gameIntro = document.getElementById("game-intro");

//GAME INTRO, remove the div game intro.
function hideDiv() {
    gameIntro.remove(); 
}

//START BUTTON --> goes to canvas, startGame
let startButton = document.getElementById("start-button")
startButton.onclick = () => {
    hideDiv();
    startGame();
}

// START GAME 
function startGame() {
    clearInterval(intervalArrows);
    score = 0; 
    getScore();   
    gameMusic.play();
    gameMusic.loop = true;
    gameMusic.volume = 0.4;                         
    intervalId = setInterval(update, 20);
    components.forEach((component) => {   // vaciar el array de components cuando pierdes
        delete component;
    })
    components = [];
    containerX = (canvas.getAttribute("width") - containerWidth)/2;
    containerY = canvas.getAttribute("height") - containerHeight;
    containerImg.setAttribute('src', 'images/container.png');
}

// GET SCORE
function getScore(){
    scoreShow.innerHTML = score; 
}

// GAME OVER
function gameOver(){
    overAudio.play();
    gameMusic.pause();
    body.appendChild(gameIntro);
    startButton.innerText = "Play Again";
    document.getElementById("sentence").innerHTML = `<p>Whoops! You didn't recycle well.<br>
    The Earth is crying.</p>`
    arrows.style.visibility = "hidden";
    clearInterval(intervalId);
}

// WIN GAME
function winGame(){
    winAudio.play();
    gameMusic.pause();
    body.appendChild(gameIntro);
    startButton.innerText = "Play Again";
    document.getElementById("sentence").innerHTML = `<p>Congratulations!,<br>
    You kept the Earth clean.</p>`
    arrows.style.visibility = "hidden";
    clearInterval(intervalId);
}

// CANS AND GLASS BOTTLES
class Component {
    constructor(){
        let randomNum = Math.floor(Math.random() * 2);
        this.x = Math.floor(Math.random() * (canvas.getAttribute("width") - 200) +100) 

        if (randomNum == 0){
            this.image = cansArr[Math.floor(Math.random() * cansArr.length)]
            this.x = this.x - 25;
            this.y = can.y
            this.width = can.width
            this.height = can.height 
            this.points = can.points
            this.audio = can.audio
        } else {
            this.image = glassArr[Math.floor(Math.random() * glassArr.length)]
            this.x = this.x -20;
            this.y = glass.y
            this.width = glass.width
            this.height = glass.height
            this.points = glass.points
            this.audio = glass.audio
        }
        this.pointsAdded = false;
    }
    
    draw(){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }

    crash(){
        if (this.pointsAdded) return;

        if(!(((containerX + containerWidth - conWidthMargin) < this.x) || ((canvas.height - containerHeight) > (this.y + this.height)) || (containerX + conWidthMargin > (this.x + this.width)) || ((canvas.height - containerHeight) < (this.y + (this.height - 20))))) {
            
            this.pointsAdded = true; //para que no siga sumando puntos mientras va pasando
            score += this.points;

            if(this.points < 0){
                this.audio.play();
                this.audio.volume = 0.8;
                containerImg.setAttribute('src', 'images/containerGameOver.png');

            } else if (this.points > 0){
                this.audio.play();
                containerImg.setAttribute('src', 'images/containerWin.png');
            }

            getScore();
            activeComponent = this;
        }
    }
}


//UPDATE
function update() {
    frames++; 
    // LIMPIAR
    ctx.clearRect(0, 0, canvas.getAttribute('width'), canvas.getAttribute('height'));

    // RECALCULAR posición
    containerX += conVelocityX; 

    if (activeComponent){
        activeComponent.x += conVelocityX
    }
    
    components.forEach((component)=>{
        component.y += 5;  
    })
    
    if(frames % 60 == 0) {
        // crea cans o glass
        let component = new Component();
        components.push(component); 
      }  

    // COLISIÓN (comprobar)
    components.forEach((component, k)=>{
        component.crash();
        if(component == activeComponent){
            if (activeComponent.y > (canvas.height - 200)){ 
                components.splice(k, 1);
            }
        }
    })

    if (score < 0){
        gameOver();
    }

    if (score >= 250){
        winGame();
    }
    
    // REPINTAR
      // background
    ctx.drawImage(backgroundImg, 0, 0, canvas.getAttribute("width"), canvas.getAttribute("height"))

      // can/glass
    components.forEach(component => {
        component.draw();
      })
      // container
    ctx.drawImage(containerImg, containerX, containerY, containerWidth, containerHeight)

}

// movimiento del contenedor con las flechas de teclado.
document.body.addEventListener('keydown', (e)=>{
    if(e.key == 'ArrowLeft'){
        conVelocityX = -10; 
        if(containerX < 0){
            containerX = 0;
        }
    } else if(e.key == 'ArrowRight'){
        conVelocityX = 10;
        if(containerX >= canvas.getAttribute('width') - containerWidth){
            containerX = (canvas.getAttribute('width') - containerWidth);
        }
    }
});

document.body.addEventListener("keyup", (e) => { 
    if (e.key == "ArrowLeft") {
      conVelocityX = 0
    } else if (e.key == "ArrowRight") {
      conVelocityX = 0
    }
})

