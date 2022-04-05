import { Socket } from "socket.io-client"

export class ClientSocket  {
  static socket : Socket | null = null;

  private constructor() {
  }

  static setSocket(socket : Socket) {
    ClientSocket.socket = socket;
  }

  // 接続関連
  static connect() {
    ClientSocket.socket?.connect();
  }

  static disconnect() {
    ClientSocket.socket?.disconnect();
  }

  static isConnected() {
    return ClientSocket.socket?.connected;
  }

  // 原則イベントリスナーの登録はonceにする

  static setOnConnect(handler : () => void) {
    ClientSocket.socket?.once('connect', handler);
  }

  static setOnDisconnect(handler : (reason : Socket.DisconnectReason) => void) {
    ClientSocket.socket?.once('disconnect', handler);
  }

  // マッチIDの発行要求
  static requestMatchID() {
    ClientSocket.socket?.emit('request_matchid');
    return new Promise<string>((resolve) => {
      ClientSocket.socket?.once('request_matchid_reply', (reply : { matchID : string }) => {
        resolve(reply.matchID);
      });
    });
  }

  static setOnMatchIDReceived(handler : (reply : { matchID : string }) => void) {
    ClientSocket.socket?.once('request_matchid_reply', handler);
  }

  // マッチへの参加要求
  static joinMatch(matchID : string) {
    ClientSocket.socket?.emit('join_match', matchID);
    return new Promise<{ playerNumber : 1 | 2, isPlayerTurn : boolean }>((resolve) => {
      ClientSocket.socket?.once('match_start', (reply : { playerNumber : 1 | 2, isPlayerTurn : boolean }) => {
        resolve(reply);
      });
    });
  }

  static setOnJoinMatchFailed(handler : () => void) {
    ClientSocket.socket?.once('join_match_failed', handler);
  }

  // ゲームの開始
  static setOnMatchStart(handler : (reply : { playerNumber : 1 | 2, isPlayerTurn : boolean}) => void) {
    ClientSocket.socket?.once('match_start', handler);
  }
}