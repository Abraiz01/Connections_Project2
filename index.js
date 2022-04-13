const MAX_USERS_ROOM =  5;
const MAX_PLAYERS = 2;

//Initialize the express 'app' object
let express = require('express');
const { del } = require('express/lib/application');
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
        console.log(users);
        console.log(players);
        console.log(rooms);
        console.log(gameRooms);
    })



    //get user data
    socket.on('userData', (data) => {
        //save user name in an array
        socket.name = data.name;
        users[socket.name] = socket.id;

        console.log(users);
        console.log(players);

        // MODIFIED POST CLASS - limiting number of people in room
        if(rooms[data.room] + gameRooms[data.room] >= 1) { //is the room already there?
            if(rooms[data.room] + gameRooms[data.room] < MAX_USERS_ROOM) {
                //let the socket join room of choice
                socket.roomName = data.room; // we will add this data to the socket only after we can verify that there is space
                socket.join(socket.roomName);
                rooms[socket.roomName]++;
                io.sockets.emit('clientCountLobby', rooms[socket.roomName]);
            } else {
                delete users[socket.name];
                console.log(users);
                console.log(players);
                console.log(rooms);
                console.log(gameRooms);
                socket.emit('maxUsersReached');
            }
        } else {
            socket.roomName = data.room;
            socket.join(socket.roomName);
            rooms[socket.roomName] = 1;  
            // rooms[socket.roomName] = io.sockets.adapter.rooms.get(socket.roomName).size;
            gameRooms[socket.roomName] = 0;
            io.sockets.emit('clientCountLobby', rooms[socket.roomName]);
        }

        console.log(rooms);
        // console.log(io.sockets.adapter.rooms.get(socket.roomName).size);
        console.log(gameRooms);
        // console.log(io.sockets.adapter.rooms.get(socket.gameRoomName).size);
    })

    socket.on('lobbyPositionData', (data) => {
        // console.log(data);
        socket.broadcast.emit('lobbyPositionServer', data);
        socket.emit('ownPosition', data);
    })

    // socket.on('lobbyMousePosition', (data) => {
    //     // console.log(data);
    //     io.sockets.emit('lobbyPositionServer', data);
    // })

    //get user data
    socket.on('playerData', (data) => {
        //save user name in an array
        socket.playerName = data.name;
        players[socket.playerName] = socket.id;

        console.log(users);
        console.log(players);

        // MODIFIED POST CLASS - limiting number of people in room
        // if(gameRooms[data.room]) { //is the room already there?
            if(gameRooms[data.room] < MAX_PLAYERS) {
                //let the socket join room of choice
                socket.gameRoomName = data.room; // we will add this data to the socket only after we can verify that there is space
                socket.join(socket.gameRoomName);
                gameRooms[socket.gameRoomName]++;
                io.sockets.emit('clientCountGame', gameRooms[socket.gameRoomName]);
            } else {
                delete players[socket.playerName];
                console.log(users);
                console.log(players);
                console.log(rooms);
                console.log(gameRooms);
                socket.emit('maxPlayersReached');
            }

        console.log(rooms);
        // console.log(io.sockets.adapter.rooms.get(socket.roomName).size);
        console.log(gameRooms);
        // console.log(io.sockets.adapter.rooms.get(socket.gameRoomName).size);
        
    })

    socket.on('returnData', (data) => {
        gameRooms[data.room]--;
        delete players[data.name];
        io.sockets.emit('clientCountGame', gameRooms[socket.gameRoomName]);
        console.log(users);
        console.log(players);
        console.log(rooms);
        console.log(gameRooms);
    })

    // socket.on('keyData', (data) => {
    //     console.log(data);
    // })

    socket.on('mousePositionData', (data) => {
        socket.broadcast.emit('playerTwoServer', data);
    })

    socket.on('playerOnePosition', (data) => {
        // console.log(data);
        socket.broadcast.emit('playerTwoServer', data);
    })

    socket.on('enemyPosition', (data) => {
        // console.log(data);
        socket.broadcast.emit('enemyTwoServer', data);
    })

    // socket.on('playerTwoPosition', (data) => {
    //     // console.log(data);
    //     io.sockets.emit('positionDataFromServer', data);
    // })

})

server.listen(9000, () => {
  console.log("server is up and running")
})
