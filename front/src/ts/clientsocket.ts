import { io, Socket } from "socket.io-client"

export class ClientSocket  {
  static socket : Socket  = io({autoConnect : false});

  private constructor() {
  }

  static setSocket(socket : Socket) {
    ClientSocket.socket = socket;
  }

  // 接続関連
  static connect() : void {
    ClientSocket.socket?.connect();
  }

  static disconnect() : void {
    ClientSocket.socket?.disconnect();
  }

  static isConnected() : boolean {
    return ClientSocket.socket?.connected;
  }

  static setOnConnect(handler : () => void) : void {
    ClientSocket.socket?.once('connect', handler);
  }

  static setOnDisconnect(handler : (reason : Socket.DisconnectReason) => void) : void {
    ClientSocket.socket?.once('disconnect', handler);
  }

  // マッチIDの発行要求
  static requestMatchID() : Promise<string> {
    ClientSocket.socket?.emit('request_matchid');
    return new Promise<string>((resolve) => {
      ClientSocket.socket?.once('request_matchid_reply', (reply : { matchID : string }) => {
        resolve(reply.matchID);
      });
    });
  }

  static setOnMatchIDReceived(handler : (reply : { matchID : string }) => void) : void {
    ClientSocket.socket?.once('request_matchid_reply', handler);
  }

  // マッチへの参加要求
  static joinMatch(matchID : string) : Promise<{ playerNumber : 1 | 2, isPlayerTurn : boolean,anchors : number[][] }> {
    ClientSocket.socket?.emit('join_match', matchID);
    return new Promise<{ playerNumber : 1 | 2, isPlayerTurn : boolean, anchors : number[][] }>((resolve) => {
      ClientSocket.socket?.once('match_start', (reply : { playerNumber : 1 | 2, isPlayerTurn : boolean, anchors : number[][] }) => {
        resolve(reply);
      });
    });
  }

  // マッチへの参加が失敗したとき
  static setOnJoinMatchFailed(handler : () => void) : void {
    ClientSocket.socket?.once('join_match_failed', handler);
  }

  // ゲームの開始
  static setOnMatchStart(handler : (reply : { playerNumber : 1 | 2, isPlayerTurn : boolean, anchors : number[][] }) => void) : void {
    ClientSocket.socket?.once('match_start', handler);
  }


  static fillBoard(fillPosArray : number[][], matchID : string) : Promise<void> {
    ClientSocket.socket?.emit('fill_board', fillPosArray, matchID);
    return new Promise<void>((resolve) => {
      ClientSocket.socket?.once('fill_board_reply', () => {
        resolve();
      });
    });
  }

  static setOnFillBoardReply(handler : (reply : { score : number }) => void) : void {
    ClientSocket.socket?.on('fill_board_reply', handler);
  }

  static removeOnFillBoardReply(handler : (reply : { score : number }) => void) : void {
    ClientSocket.socket?.removeListener('fill_board_reply', handler);
  }


  static setOnOpponentPlayerScored(handler : (reply : { opponentPlayerNumber : 1 | 2, score : number, filledPosArray : number[][] }) => void) : void {
    ClientSocket.socket?.on('opponent_player_scored', handler);
  }

  static removeOnOpponentPlayerScored(handler : (reply : { opponentPlayerNumber : 1 | 2, score : number, filledPosArray : number[][] }) => void) : void {
      ClientSocket.socket?.removeListener('opponent_player_scored', handler);
  }

}