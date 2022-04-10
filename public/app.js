// opens and connect to socket
let socket = io();

//listen for confirmation
socket.on('connect', () => {
    console.log("client connected to the game");

    // now that client has connected to server, emit name
    let playerData = {
        'name' : sessionStorage.getItem('name'),
        'room' : sessionStorage.getItem('room')
    }
    socket.emit('playerData', playerData);

    // //on disconnection
    // socket.on('disconnect', () => {
    //     let mes = 'player has left the game'
    //     socket.emit('leftGame', mes);
    // })
})

socket.on('maxPlayersReached',() => {
    alert('This room is full.');
    window.location = '/world.html';
})

socket.on('playerOneServerData', (data) => {
    // background(255,255,255);  
    ellipse(data.x, data.y, data.r, data.r);
})

let lobbyButton = document.getElementById('back-to-lobby-button');

lobbyButton.addEventListener('click', () => {
    let playerData = {
        'name' : sessionStorage.getItem('name'),
        'room' : sessionStorage.getItem('room')
    }
    socket.emit('returnData', playerData);
    window.location = '/world.html';
})

//P5 code

let value = 0;

function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        game.playerOne.key_handler.left = true;
        // socket.emit('keyData', value);   
  } else if (keyCode === RIGHT_ARROW) {
        game.playerOne.key_handler.right = true;
        // socket.emit('keyData', value);  
  }
    else if (keyCode === UP_ARROW) {
        game.playerOne.key_handler.up = true;
        // socket.emit('keyData', value);
  }
    else if (keyCode === DOWN_ARROW) {
        game.playerOne.key_handler.down = true;
        // socket.emit('keyData', value);
  }

}

function keyReleased() {
    if (keyCode === LEFT_ARROW) {
        game.playerOne.key_handler.left = false;
    // socket.emit('keyData', value);
  } else if (keyCode === RIGHT_ARROW) {
        game.playerOne.key_handler.right = false;
    // socket.emit('keyData', value);
  }
    else if (keyCode === UP_ARROW) {
        game.playerOne.key_handler.up = false;
    // socket.emit('keyData', value);
  }
    else if (keyCode === DOWN_ARROW) {
        game.playerOne.key_handler.down = false;
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
        // ellipse(this.x, this.y, this.r, this.r);
    }
}

class PlayerOne extends Creature {
    constructor(x, y, r) {
        super(x, y, r);
        this.key_handler = {
            left: false,
            right: false,
            up: false,
            down: false
        };
        this.positionData = {
            x: this.x,
            y: this.y,
            r: this.r
        }
        this.alive = true;
    }
    update() {
        if (this.key_handler.left == true) {
            this.vx = -2;
            // this.dir = left;
            this.x += this.vx;
            this.positionData.x += this.vx;
            socket.emit('playerOnePosition', this.positionData);
        }
        else if (this.key_handler.right == true) {
            this.vx = 2;
            // this.dir = right;
            this.x += this.vx;
            this.positionData.x += this.vx;
            socket.emit('playerOnePosition', this.positionData);
        }
        else {
            this.vx = 0;
        }
        if (this.key_handler.up == true) {
            this.vy = -2;
            // this.dir = up;
            this.y += this.vy;
            this.positionData.y += this.vy;
            socket.emit('playerOnePosition', this.positionData);
        }
        else if (this.key_handler.down == true) {
            this.vy = 2;
            // this.dir = down;
            this.y += this.vy;
            this.positionData.y += this.vy;
            socket.emit('playerOnePosition', this.positionData);
        }
        else {
            this.vy = 0;
        }
    }
}

class PlayerTwo extends Creature {
    constructor(x, y, r) {
        super(x, y, r);
        this.key_handler = {
            left: false,
            right: false,
            up: false,
            down: false
        };
        this.positionData = {
            x: this.x,
            y: this.y,
            r: this.r
        }
        this.alive = true;
    }
    update() {
        if (this.key_handler.left == true) {
            this.vx = -2;
            // this.dir = left;
            this.x += this.vx;
            this.positionData.x += this.vx;
            socket.emit('playerTwoPosition', this.positionData);
        }
        else if (this.key_handler.right == true) {
            this.vx = 2;
            // this.dir = right;
            this.x += this.vx;
            this.positionData.x += this.vx;
            socket.emit('playerTwoPosition', this.positionData);
        }
        else {
            this.vx = 0;
        }
        if (this.key_handler.up == true) {
            this.vy = -2;
            // this.dir = up;
            this.y += this.vy;
            this.positionData.y += this.vy;
            socket.emit('playerTwoPosition', this.positionData);
        }
        else if (this.key_handler.down == true) {
            this.vy = 2;
            // this.dir = down;
            this.y += this.vy;
            this.positionData.y += this.vy;
            socket.emit('playerTwoPosition', this.positionData);
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
        this.playerOne = new PlayerOne(300, 300, 20);
        this.playerTwo = new PlayerOne(100, 100, 20);

        
    }
    display() {
        this.playerOne.display();
        this.playerTwo.display();
    }
}

game = new Game(50, 50);

function setup() {
    createCanvas(800, 800);
    // background(220);
}

function draw() {
    // background(255,255,255);  
    // clear();
    game.display();
    // clear();
}

