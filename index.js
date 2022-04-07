const MAX_USERS_ROOM =  5;
const MAX_PLAYERS = 2;

//Initialize the express 'app' object
let express = require('express');
let app = express();
app.use('/', express.static('public'));

//Initialize the actual HTTP server
let http = require('http');
let server = http.createServer(app);

//Initialize socket.io
let io = require('socket.io');
io = new io.Server(server);

let rooms = {}; // key value pair - 'roomname' : number of people in room
let users = {}; // key value pair - 'username' : userid
let gameRooms = {};
let players = {};

app.use('/', express.static('public'));

io.sockets.on('connect', (socket) => {
    console.log("we have a new client: ", socket.id);

    //on disconnection
    socket.on('disconnect', () => {
        console.log('connection ended, ', socket.id);
        rooms[socket.roomName]--;
        delete users[socket.name];
    })

    //get user data
    socket.on('userData', (data) => {
        //save user name in an array
        socket.name = data.name;
        users[socket.name] = socket.id;

        console.log(users);

        // MODIFIED POST CLASS - limiting number of people in room
        if(rooms[data.room]) { //is the room already there?
            if(rooms[data.room]< MAX_USERS_ROOM) {
                //let the socket join room of choice
                socket.roomName = data.room; // we will add this data to the socket only after we can verify that there is space
                socket.join(socket.roomName);
                rooms[socket.roomName]++;
            } else {
                socket.emit('maxUsersReached');
            }
        } else {
            socket.roomName = data.room;
            socket.join(socket.roomName);
            rooms[socket.roomName] = 1;   
        }

        console.log(rooms);
        
    })

    //get user data
    socket.on('playerData', (data) => {
        //save user name in an array
        socket.playerName = data.name;
        players[socket.playerName] = socket.id;

        console.log(users);
        console.log(players);

        // MODIFIED POST CLASS - limiting number of people in room
        if(gameRooms[data.room]) { //is the room already there?
            if(gameRooms[data.room]< MAX_PLAYERS) {
                //let the socket join room of choice
                socket.gameRoomName = data.room; // we will add this data to the socket only after we can verify that there is space
                socket.join(socket.gameRoomName);
                gameRooms[socket.gameRoomName]++;
            } else {
                socket.emit('maxPlayersReached');
            }
        } else {
            socket.gameRoomName = data.room;
            socket.join(socket.gameRoomName);
            gameRooms[socket.gameRoomName] = 1;   
        }

        console.log(rooms);
        console.log(gameRooms);
        
    })

    socket.on('keyData', (data) => {
        console.log(data);
    })

    socket.on('playerOnePosition', (data) => {
        // console.log(data);
        io.sockets.emit('playerOneServerData', data);
    })

    socket.on('playerTwoPosition', (data) => {
        // console.log(data);
        io.sockets.emit('positionDataFromServer', data);
    })

})

server.listen(9000, () => {
  console.log("server is up and running")
})