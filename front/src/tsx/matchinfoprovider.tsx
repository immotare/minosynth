import * as React from "react";
import { createContext, Dispatch, useState } from "react";

export type MatchInfo = {
  matchID : string | null,
  isPlayerTurn : boolean,
  assignedPlayerNumber : 1 | 2,
  playerScores : number[],
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
  },
  setMatchInfo : matchInfo => matchInfo,
});

export const MatchInfoProvider : React.FC = (props) => {
  const { children } = props; 

  const [matchInfo, setMatchInfo] = useState<MatchInfo>({matchID : null, isPlayerTurn : false, assignedPlayerNumber : 1, playerScores : [0, 0] });

  console.log('Context Changed');

  return (
    <MatchInfoContext.Provider value={{ matchInfo, setMatchInfo }}>
      {children}
    </MatchInfoContext.Provider>
  );
};