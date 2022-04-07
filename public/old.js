// opens and connect to socket
let socket = io();

//listen for confirmation
socket.on('connect', () => {
    console.log("client connected to the game");

    // now that client has connected to server, emit name and room information
    let playerData = {
        'name' : sessionStorage.getItem('name'),
        }
        socket.emit('playerData', playerData);
})

//P5 code

let value = 0;

function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        game.player.key_handler.left = true;
        socket.emit('keyData', value);   
  } else if (keyCode === RIGHT_ARROW) {
        game.player.key_handler.right = true;
        socket.emit('keyData', value);  
  }
    else if (keyCode === UP_ARROW) {
        game.player.key_handler.up = true;
        socket.emit('keyData', value);
  }
    else if (keyCode === DOWN_ARROW) {
        game.player.key_handler.down = true;
        socket.emit('keyData', value);
  }

}

function keyReleased() {
    if (keyCode === LEFT_ARROW) {
        game.player.key_handler.left = false;
    // socket.emit('keyData', value);
  } else if (keyCode === RIGHT_ARROW) {
        game.player.key_handler.right = false;
    // socket.emit('keyData', value);
  }
    else if (keyCode === UP_ARROW) {
        game.player.key_handler.up = false;
    // socket.emit('keyData', value);
  }
    else if (keyCode === DOWN_ARROW) {
        game.player.key_handler.down = false;
    // socket.emit('keyData', value);
  }
}

class Creature {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.vx = 0;
        this.vy = 0;
        // this.dir = RIGHT;
    }
    display() {
        this.update();
        // socket.on('positionDataFromServer', (data) => {
        //     ellipse(data.x, data.y, data.r, data.r);
        // })
        ellipse(this.x, this.y, this.r, this.r);
    }
}

class Player extends Creature {
    constructor(x, y, r) {
        super(x, y, r);
        this.key_handler = {
            left: false,
            right: false,
            up: false,
            down: false
        };
        this.alive = true;
    }
    update() {
        if (this.key_handler.left == true) {
            this.vx = -2;
            // this.dir = left;
            this.x += this.vx;
        }
        else if (this.key_handler.right == true) {
            this.vx = 2;
            // this.dir = right;
            this.x += this.vx;
        }
        else {
            this.vx = 0;
        }
        if (this.key_handler.up == true) {
            this.vy = -2;
            // this.dir = up;
            this.y += this.vy;
        }
        else if (this.key_handler.down == true) {
            this.vy = 2;
            // this.dir = down;
            this.y += this.vy;
        }
        else {
            this.vy = 0;
        }
    }
}

class Game {
    constructor(w, h) {
        this.w = w;
        this.h = h;
        this.player = new Player(300, 300, 20)

        
    }
    display() {
        this.positionData = {
            x: game.player.x,
            y: game.player.y,
            r: game.player.r
        }
        // socket.emit('playerPosition', this.positionData);
        this.player.display();
    }
}

game = new Game(50, 50);

function setup() {
    createCanvas(800, 800);
    // background(220);
    // socket.on('keyDataFromServer', (data) => {
    //   console.log(data);
    // })
}

function draw() {
    // background(220);  
    game.display();
    // clear();
}

