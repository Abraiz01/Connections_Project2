// client connects to the server
let socket = io();

//confirm that the client is connected
socket.on('connect',() => {
  console.log('connected to the lobby');
  // now that client has connected to server, emit name and room information
  let data = {
    'name' : sessionStorage.getItem('name'),
    'room' : sessionStorage.getItem('room')
  }
  socket.emit('userData', data);
})

socket.on('maxUsersReached',() => {
  alert('This room is full. Please go back and try to join another room');
  window.location = '/index.html'
})

socket.on('lobbyPositionServer', (data) => {
    
})

window.addEventListener('load', () => {
    // let submitButton = document.getElementById('send-button');
    let gameButton = document.getElementById('join-game-button');
    
    gameButton.addEventListener('click', (e) => {
      e.preventDefault();
      let playerName = sessionStorage.getItem('name');
    //   let room = document.getElementById('room-input').value;
      console.log(playerName);
  
      //save the name and the room in session storage
    //   sessionStorage.setItem('name',  name);
    //   sessionStorage.setItem('room',  room);
  
      //redirect the user to chat.html
      window.location = '/game.html'
    })
})

let lobbyPosition = {
    x: 100,
    y: 100,
    r: 20
}

function setup() {
    createCanvas(800, 800);
}

function draw() {
    // clear();
    ellipse(lobbyPosition.x, lobbyPosition.y, 20, 20);
}

// function mouseClicked() {
//     let mousePos = { 
//     x: round(mouseX), 
//     y:round(mouseY),
//     };
//     //emit this information to the server
//     socket.emit('lobbyMousePosition', mousePos);
// }