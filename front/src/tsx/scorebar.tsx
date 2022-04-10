import { useContext } from "react";
import { MatchInfoContext } from "./matchinfoprovider";

export const ScoreBar : React.FC = () => {
  const { matchInfo } = useContext(MatchInfoContext);

  return (
    <div className='w-full grid grid-cols-5 h-12'>
      <div className='bg-red-400'>1P:{matchInfo.playerScores[0]}</div>
      <div className='col-span-3'></div>
      <div className='bg-blue-400'>2P:{matchInfo.playerScores[1]}</div>
    </div>
  );
};