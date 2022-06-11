import { useContext, useEffect, useState } from "react";
import { MatchInfoContext } from "./matchinfoprovider";
import { ClientSocket } from "../ts/clientsocket";

type GameLog = {
  type : 'score' | 'pass' | 'win',
  scoredPlayer? : 1 | 2,
  score? : number,
  logNum : number,
}

export const GameLogHistory : React.FC = () => {

  const [ logHistory, setLogHistory ] = useState<GameLog[]>([]);
  const { matchInfo } = useContext(MatchInfoContext);

  useEffect(() => {
    const fillBoardReplyHandler = (reply : { score : number } ) => {
      setLogHistory((prevLogHistory) => {
        const newLog : GameLog = { 
          type : 'score', 
          score : reply.score, 
          scoredPlayer : matchInfo.assignedPlayerNumber, 
          logNum : prevLogHistory.length
        };
        const newLogHistory = [newLog, ...prevLogHistory];
        return newLogHistory;
      });
    };
    ClientSocket.setOnFillBoardReply(fillBoardReplyHandler);

    const opponentPlayerScoredHandler = (reply : { opponentPlayerNumber : 1 | 2, score : number, filledPosArray : number[][]}) => {
      setLogHistory((prevLogHistory) => {
        const newLog : GameLog = {
          type : 'score',
          score : reply.score,
          scoredPlayer : reply.opponentPlayerNumber,
          logNum : prevLogHistory.length,
        };
        const newLogHistory = [newLog, ...prevLogHistory];
        return newLogHistory;
      });
    };
    ClientSocket.setOnOpponentPlayerScored(opponentPlayerScoredHandler);
  }, []);

  const logHistoryElms = logHistory.map((log) => {
    if (log.type === 'score') {
      const playerTextColor = (log.scoredPlayer === 1) ? 'text-red-600' : 'text-blue-600';
      const msgElm : JSX.Element = (
        <div className="container mx-auto border border-black text-lg w-5/6 mt-5 p-1" key={log.logNum}>
          <span className={playerTextColor}>プレイヤー{log.scoredPlayer}</span>が{log.score}点を得ました！
        </div>
      );

      return msgElm;
    }
    else return;
  });

  return (
    <div className="h-[700px] overflow-auto">
      {logHistoryElms}
    </div>
  );
}