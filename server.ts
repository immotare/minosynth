import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

const app : express.Express = express();
const httpServer = createServer(app);
const sockIO = new Server(httpServer);
const PORT = process.env.port || 8080;

app.use('/img', express.static(__dirname+'/front/src/img'));
app.use('/dist', express.static(__dirname+'/front/dist'));

app.get('/', (req : express.Request, res : express.Response) => {
  res.sendFile(__dirname + '/front/index.html');
});

const matchConditions : { [matchID : string] : {
  participantIDs : string[],
  board : boolean[],
  currentPlayerID : string,
  remAnchors : number[],
  remAnchorsNum : number,
}} = {};

const BOARDSIZE = 20;
const BOXNUM    = 400;

sockIO.on('connection', (socket : Socket) => {
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
      remAnchors : [],
      remAnchorsNum : 0,
    }
  });

  socket.on('join_match', (matchID : string) => {
    console.log(matchID);
    const opponentID : string | undefined = matchConditions[matchID].participantIDs[0];

    if (typeof opponentID == 'undefined') {
      socket.emit('join_match_failed');
    }

    // const arrowBoxes : ArrowBox = genArrowBoxes();
    matchConditions[matchID] = {
      participantIDs : [socket.id, opponentID],
      board : Array<boolean>(BOXNUM).fill(false),
      currentPlayerID : socket.id,
      remAnchors : [...Array(BOXNUM).keys()],
      remAnchorsNum : BOXNUM,
    }

    const anchors = extractAnchors(matchID, 3);
    socket.emit('match_start', { playerNumber : 1, isPlayerTurn : true, anchors : anchors });
    sockIO.to(opponentID).emit('match_start', { playerNumber : 2, isPlayerTurn : false, anchors : anchors });
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
    const opponentID = socket.id === participantIDs[0] ? participantIDs[1] : participantIDs[0];
    const scoredPlayerNumber : 1 | 2 = opponentID === participantIDs[0] ? 2 : 1;

    const score = fillPosArray.length;
    const toOpponentReply = {
      opponentPlayerNumber : scoredPlayerNumber,
      score : score,
      filledPosArray : fillPosArray,
    }

    // 別々のイベントを送出する
    socket.emit('fill_board_reply', { score : score });
    sockIO.to(opponentID).emit('opponent_player_scored', toOpponentReply);

    // if (scoredPlayerNumber == 2) {
    //   const anchor = extractAnchors(matchID, 1);
    //   socket.emit('anchor_event', { anchor : anchor});
    //   sockIO.to(opponentID).emit('anchor_event', { anchor : anchor});
    // }
  });
});

httpServer.listen(PORT, () => {
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

function extractAnchors(matchID : string , size : number) : number[][] {
  let remNum = matchConditions[matchID].remAnchorsNum;
  if (size > remNum)return [];
  const anchors : number[][] = [];
  for (let i = 0;i < size;i++) {
    const idx = Math.floor(Math.random() * remNum);
    const anchorPos = matchConditions[matchID].remAnchors[idx];
    matchConditions[matchID].remAnchors[idx] = matchConditions[matchID].remAnchors[remNum-1];
    const anchorPosY = anchorPos / BOARDSIZE;
    const anchorPosX = anchorPos % BOARDSIZE;
    anchors.push([anchorPosY, anchorPosX]);
    remNum--;
  }

  matchConditions[matchID].remAnchorsNum = remNum;
  return anchors;
}