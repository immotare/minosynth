import { useContext, useEffect } from "react";
import { ClientSocket } from "../ts/clientsocket";
import { MatchInfoContext } from "./matchinfoprovider";

export const ScoreBar : React.FC = () => {
  const { matchInfo, setMatchInfo } = useContext(MatchInfoContext);

  useEffect(() => {
    const handler = (reply : { scoredPlayerNumber : 1 | 2,  score : number, nextPlayer : 1 | 2}) => {
      setMatchInfo((prevMatchInfo) => {
        const isPlayerTurn : boolean = prevMatchInfo.assignedPlayerNumber == reply.nextPlayer;
        const scores = prevMatchInfo.playerScores;
        scores[reply.scoredPlayerNumber-1] += reply.score;
        return {
          matchID : prevMatchInfo.matchID,
          assignedPlayerNumber : prevMatchInfo.assignedPlayerNumber,
          isPlayerTurn : isPlayerTurn,
          playerScores : scores,
        };
      });
    };
    ClientSocket.setOnScoredAndTurnChange(handler);
    return () => {
      ClientSocket.removeOnScoredAndTurnChange(handler);
    };
  }, []);

  return (
    <div className='w-full grid grid-cols-5 h-12'>
      <div className='bg-red-400'>1P:{matchInfo.playerScores[0]}</div>
      <div className='col-span-3'></div>
      <div className='bg-blue-400'>2P:{matchInfo.playerScores[1]}</div>
    </div>
  );
};