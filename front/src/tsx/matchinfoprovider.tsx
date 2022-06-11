import * as React from "react";
import { createContext, Dispatch, useEffect,useState } from "react";
import { ClientSocket } from "../ts/clientsocket";

export type MatchInfo = {
  matchID : string | null,
  isPlayerTurn : boolean,
  assignedPlayerNumber : 1 | 2,
  playerScores : number[],
  anchors : number[][],
}

type MatchInfoContextType = {
  matchInfo : MatchInfo,
  setMatchInfo : Dispatch<React.SetStateAction<MatchInfo>>
}

export const MatchInfoContext = createContext<MatchInfoContextType>({
  matchInfo : {
    matchID : null,
    isPlayerTurn : false,
    assignedPlayerNumber : 1,
    playerScores : [0, 0],
    anchors : [],
  },
  setMatchInfo : matchInfo => matchInfo,
});

export const MatchInfoProvider : React.FC = (props) => {
  const { children } = props; 

  const [matchInfo, setMatchInfo] = useState<MatchInfo>({matchID : null, isPlayerTurn : false, assignedPlayerNumber : 1, playerScores : [0, 0], anchors : [] });

  useEffect(() => {
    ClientSocket.setOnFillBoardReply((reply : { score : number}) => {
      setMatchInfo((prevMatchInfo) => {
        const newScores = prevMatchInfo.playerScores;
        newScores[prevMatchInfo.assignedPlayerNumber-1] += reply.score;
        return {
          matchID : prevMatchInfo.matchID,
          isPlayerTurn : false,
          assignedPlayerNumber : prevMatchInfo.assignedPlayerNumber,
          playerScores : newScores,
          anchors : [...prevMatchInfo.anchors],
        }
      });
    });

    ClientSocket.setOnOpponentPlayerScored((reply : {opponentPlayerNumber : 1 | 2, score : number, filledPosArray : number[][]}) => {
      setMatchInfo((prevMatchInfo) => {
        const newScores = prevMatchInfo.playerScores;
        newScores[reply.opponentPlayerNumber-1] += reply.score;
        return {
          matchID : prevMatchInfo.matchID,
          isPlayerTurn : true,
          assignedPlayerNumber : prevMatchInfo.assignedPlayerNumber,
          playerScores : newScores,
          anchors : [...prevMatchInfo.anchors],
        }
      });
    });
  }, []);

  return (
    <MatchInfoContext.Provider value={{ matchInfo, setMatchInfo }}>
      {children}
    </MatchInfoContext.Provider>
  );
};