const { match } = require('assert');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const PORT = process.env.port || 8080;

app.use('/img', express.static(__dirname+'/front/src/img'));
app.use('/dist', express.static(__dirname+'/front/dist'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/front/index.html');
});

// matchID : openerSocketID
const matchOpener  = {};

/* 
  matchID : {

  }
*/ 

io.on('connection', (socket) => {
  console.log('request arrived');
  console.log(`socket id : ${socket.id}`);

  socket.on('request_matchid', () => {
    console.log('request_matchid emitted');
    const matchID = getRandomMatchID();
    socket.emit('request_matchid_reply', {
      matchID : matchID,
    });
    matchOpener[matchID] = socket.id;
  });

  socket.on('join_match', (matchID) => {
    console.log(matchID);

    if (!matchOpener[matchID]) {
      socket.emit('join_match_failed');
    }

    socket.emit('match_start', { playerNumber : '1', isPlayerTurn : true});
    io.to(matchOpener[matchID]).emit('match_start', { playerNumber : '2', isPlayerTurn : false });
  });
});

http.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});


function getRandomMatchID() {
  const idCharSrc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const len = 8;

  let matchID = '';

  for (let i = 0; i < len;i++) {
    matchID += idCharSrc.charAt(Math.floor(Math.random() * idCharSrc.length));
  }

  return matchID;
}