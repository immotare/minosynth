import { useEffect, useState } from "react";
import { ClientSocket } from "../ts/clientsocket";
export const GameLogHistory : React.FC = () => {

  const [ logHistory, setLogHistory ] = useState<string[]>([]);

  useEffect(() => {
    const handler = (reply : { scoredPlayerNumber : 1 | 2, score : number, nextPlayer : 1 | 2}) => {
      const scoreLog = `プレイヤー${reply.scoredPlayerNumber}が${reply.score}点得ました！`;
      setLogHistory((prevLogHistory) => {
        const newLogHistory : string[] = [...prevLogHistory];
        newLogHistory.push(scoreLog);
        return newLogHistory;
      });
    };
    ClientSocket.setOnScoredAndTurnChange(handler);

    return () => {
      ClientSocket.removeOnScoredAndTurnChange(handler);
    };
  }, []);

  const logHistoryElm = logHistory.map((log, index) => {
    return (
      <div className="border border-black text-lg w-full mt-5 p-1" key={index}>{log}</div>
    );
  });

  return (
    <div>
      {logHistoryElm}
    </div>
  );
}