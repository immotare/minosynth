const { match } = require('assert');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const PORT = process.env.port || 8080;

app.use('/img', express.static(__dirname+'/front/src/img'));
app.use('/dist', express.static(__dirname+'/front/dist'));

app.get('/', (req : any, res : any) => {
  res.sendFile(__dirname + '/front/index.html');
});

const matchConditions : { [matchID : string] : {
  participantIDs : string[],
  board : boolean[],
  currentPlayerID : string,
}} = {};

const BOARDSIZE = 20;
const BOXNUM    = 400;

io.on('connection', (socket : any) => {
  console.log('request arrived');
  console.log(`socket id : ${socket.id}`);

  socket.on('request_matchid', () => {
    console.log('request_matchid emitted');

    const matchID : string = getRandomMatchID();
    socket.emit('request_matchid_reply', {
      matchID : matchID,
    });

    matchConditions[matchID] = {
      participantIDs : [socket.id],
      board : [],
      currentPlayerID : '',
    }
  });

  socket.on('join_match', (matchID : string) => {
    console.log(matchID);
    const opponentID : string | undefined = matchConditions[matchID].participantIDs[0];

    if (typeof opponentID == 'undefined') {
      socket.emit('join_match_failed');
    }

    socket.emit('match_start', { playerNumber : '1', isPlayerTurn : true});

    io.to(opponentID).emit('match_start', { playerNumber : '2', isPlayerTurn : false });

    matchConditions[matchID] = {
      participantIDs : [socket.id, opponentID],
      board : Array<boolean>(BOXNUM).fill(false),
      currentPlayerID : socket.id,
    }
  });

  socket.on('fill_board', (fillPosArray : number[][], matchID : string) => {
    const board = matchConditions[matchID].board;
    let hasRoom = true;
    for (const pos of fillPosArray) {
      const [y, x] = pos;
      if (board[y*BOARDSIZE + x])hasRoom = false;
    }

    if (!hasRoom)return;

    for (const pos of fillPosArray) {
      const [y, x] = pos;
      board[y*BOARDSIZE + x] = true;
    }
    
    const participantIDs = matchConditions[matchID].participantIDs;
    const [opponentID, playerNumber, nextPlayer] = socket.id == participantIDs[0] ? [participantIDs[1], 1, 2] : [participantIDs[0], 2, 1];
    const score = fillPosArray.length;
    const reply = {
      scoredPlayerNumber : playerNumber,
      score : score,
      nextPlayer : nextPlayer,
      filledPos : fillPosArray,
    };

    socket.emit('player_scored_turn_change', reply);
    io.to(opponentID).emit('player_scored_turn_change', reply);
  });
});

http.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

function getRandomMatchID() : string {
  const idCharSrc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const len = 8;

  let matchID = '';

  for (let i = 0; i < len;i++) {
    matchID += idCharSrc.charAt(Math.floor(Math.random() * idCharSrc.length));
  }

  return matchID;
}