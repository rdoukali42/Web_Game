// const Express = require("express")();
// const Http = require("http").Server(Express);
// const Socketio = require("socket.io")(Http);
const apiUrl = 'http://10.13.7.9:3000/api/outh42';
const ballVelocity = 6;
const barVelocity = 30;
var bootVelocity = 25;
var velocityPercent = 0;
var directionX = Math.random() < 0.5 ? 1 : -1;
var directionY = Math.random() < 0.5 ? 1 : -1;
// var directionX = 1;
// var directionY = 1;
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*"
    }
});

app.use(cors({ origin: '*' }));

const positions = {
    lx: 0,
    ly: 180,
    x: 0,
    y: 180
};

const positions2 = {
    lx: 630,
    ly: 180,
    x: 630,
    y: 180
};
const ballpositions0 = {
    lx: 330,
    ly: 230,
    x: 320,
    y: 240
};

const ballpositions = {
    lx: 330,
    ly: 230,
    x: 320,
    y: 240
};

const scores = {
    player1: 0,
    player2: 0
};

function ballpositionTo_0() {
    velocityPercent = 0;
    ballpositions.lx =  330;
    ballpositions.ly =  230;
    ballpositions.x =  320;
    ballpositions.y =  240;
}

function definePercent()
{
    if (ballpositions.x <= ballVelocity)
        velocityPercent = ((positions.y + 60) - ballpositions.y) / 60;
    else
        velocityPercent = ((positions2.y + 60) - ballpositions.y) / 60;
    console.log("%%%" + velocityPercent);

}

server.listen(3030, () => {
    console.log("Listening at :3030...");
});

fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Fetched data:', data);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

io.on("connection", (socket) => {
    // socket.emit('message', 'You are connected! PLAYER 1');
    // socket.emit('message', 'You are connected! PLAYER 2');
    // socket.on("identify", (clientId) => {
    //     if (clientId === "11") {
    //         clients[0] = socket;
    //         socket.emit('message', 'You are connected! PLAYER 1');
    //         socket.emit("position", positions);
    //     } else if (clientId === "22") {
    //         clients[1] = socket;
    //         socket.emit('message', 'You are connected! PLAYER 2');
    //         socket.emit("position", positions2);
    //     }
    // });
    socket.emit("dataup", positions, positions2);
    socket.on("stop", data => {
        console.log("STOPPPPPP");
        io.emit("ballposition", ballpositions);
        io.emit("lose", data);
    });
    // socket.emit('updateScores', scores);
    // socket.on('updateScore', (data) => {
    //     scores[data.player] += data.points;
    //     io.emit('updateScores', scores);
    // });
    socket.on("move", (data, id) => {
        if (id == 11)
            {
                switch(data) {
                case "up":
                    if (positions.y > 0)
                    {
                        positions.ly = positions.y;
                        positions.y -= barVelocity;
                    }
                        io.emit("dataup", positions, positions2);
                        break;
                case "down":
                    if (positions.y < 360)
                    {
                        positions.ly = positions.y;
                        positions.y += barVelocity;
                    }
                        io.emit("dataup", positions, positions2);
                        break;
                }
            }
        else if (id == 22)
        {
                positions2.ly = positions2.y;
                switch(data) {
                case "up":
                    if (positions2.y > 0)
                        positions2.y -= barVelocity;
                    io.emit("dataup", positions, positions2);
                    break;
                case "down":
                    if (positions2.y < 360)
                        positions2.y += barVelocity;
                    io.emit("dataup", positions, positions2);
                    break;
                }
        }
        else if (id == 99)
        {
                positions2.ly = positions2.y;
                positions.ly = positions.y;
                if (data) {
                    if (data == "W"){
                        if (positions.y > 0)
                        {
                            positions.ly = positions.y;
                            positions.y -= barVelocity;
                        }
                            io.emit("dataup", positions, positions2);
                        }
                    if (data == "S"){
                        if (positions.y < 360)
                        {
                            positions.ly = positions.y;
                            positions.y += barVelocity;
                        }
                            io.emit("dataup", positions, positions2);
                        }
                    if (data == "up"){
                        if (positions2.y > 0)
                            positions2.y -= barVelocity;
                        io.emit("dataup", positions, positions2);
                    }
                    if (data == "down"){
                        if (positions2.y < 360)
                            positions2.y += barVelocity;
                        io.emit("dataup", positions, positions2);
                    }
                    }
        }

    });
    socket.on("boot", data => {
            if (data == 111)
                    bootVelocity = 25;
            positions2.ly = positions2.y;
            if (ballpositions.y < positions2.y)
                positions2.y -= barVelocity - bootVelocity;
            else if (ballpositions.y > positions2.y + 100)
                positions2.y += barVelocity - bootVelocity;
            io.emit("dataup", positions, positions2);
            // function getRandomNumber(min, max) {
            //     // Generate a random decimal between 0 and 1
            //     const randomDecimal = Math.random();
                
            //     // Scale and shift the random decimal to fit within the range [min, max]
            //     const randomNumber = min + randomDecimal * (max - min);
                
            //     // Return the random number
            //     return randomNumber;
            // }
            
            // // Example usage:
            // const min = 10;
            // const max = 20;
            // const randomValue = getRandomNumber(min, max);
            // console.log(randomValue);
    });
    socket.on("ballmove", data => {
            if(ballpositions.x <= ballVelocity && (ballpositions.y < positions.y || ballpositions.y > positions.y + 120))
                {
                    io.emit("message", "Player 1 lose");
                    scores.player2++;
                    io.emit('updateScores', scores);
                    io.emit("lose", ballpositions);
                    ballpositionTo_0();
                    io.emit('ballposition', ballpositions);
                    // io.emit('newstart', ballpositions);
                }
            else if(ballpositions.x >= 640 - ballVelocity && (ballpositions.y < positions2.y || ballpositions.y > positions2.y + 120))
                {
                    io.emit("message", "Player 2 lose");
                    scores.player1++;
                    io.emit('updateScores', scores);
                    io.emit("lose", ballpositions);
                    ballpositionTo_0();
                    io.emit('ballposition', ballpositions);
                    // io.emit('newstart', ballpositions);
                }
            if(scores.player1 > 4 || scores.player2 > 4)
                {
                    io.emit('updateScores', scores);
                    scores.player1 = 0;
                    scores.player2 = 0;
                    io.emit('lose', ballpositions0);
                    io.emit("ballposition", ballpositions);
                }
            if(ballpositions.x <= ballVelocity || ballpositions.x >= 640 - ballVelocity)
            {
                definePercent();
                directionX *= -1;
            }
            if(ballpositions.y <= ballVelocity || ballpositions.y >= 480 - ballVelocity)
                directionY *= -1;
            ballpositions.lx = ballpositions.x;
            ballpositions.ly = ballpositions.y;
            ballpositions.x += ballVelocity * directionX;
            ballpositions.y += ballVelocity * directionY * velocityPercent;
            io.emit("ballposition", ballpositions);
        });
    });

// Socketio.on('connection', (socket) => {
//     console.log('A user connected');

//     // Example: Send data to the client
//     socket.emit('position', positions);
    
//     // Example: Listen for data from the client
//     socket.on('updatePosition', (data) => {
//         console.log('Received new position:', data);
//         // Handle the received data as needed
//     });
// });

