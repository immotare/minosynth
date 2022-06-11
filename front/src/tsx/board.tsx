import { useEffect, useState, useContext } from 'react';
import * as React from 'react';
import { Mino } from './boardcontainer';
import { MatchInfoContext } from './matchinfoprovider';
import { ClientSocket } from '../ts/clientsocket';

const BOARDSIZE =  20;
const BOXNUM    = 400;

type Owner = '1p' | '2p' | 'board' | 'pre-1p' | 'pre-2p';
type BoxProp = {
  owner: Owner,
  mouseOverHandler: () => void,
  mouseOutHandler: () => void,
  clickHandler: () => void,
  key : number,
}

type BoardProp = {
  currentSelectMino : {
    mino : Mino,
    indexInMinoesArray : number,
  } | undefined,
  setSelectMino : React.Dispatch<React.SetStateAction<
  {
    mino : Mino,
    indexInMinoesArray : number
  } | undefined>>,
  currentHoldMinoes : Mino[],
  setHoldMinoes : React.Dispatch<React.SetStateAction<Mino[]>>
}

type BoardState = {
  boardStateArray : Owner[],
  hoveringPosArray : number[][],
}

function ownerColor (owner : Owner) : string {
  let highlightcolor : string;
  switch(owner) {
    case '1p':
      highlightcolor = 'bg-red-600';
      break;
    case '2p':
      highlightcolor = 'bg-blue-600';
      break;
    case 'board':
      highlightcolor = 'bg-white';
      break;
    case 'pre-1p':
      highlightcolor = 'bg-red-400';
      break;
    case 'pre-2p':
      highlightcolor = 'bg-blue-400'
      break;
  }
  return highlightcolor;
}

const Box : React.FC<BoxProp> = ({owner, mouseOverHandler, mouseOutHandler, clickHandler}) => { 
  let highlightcolor = ownerColor(owner);

  const className = `border border-black w-[35px] h-[35px] ${highlightcolor}`;
  return (
    <div className={className}
    onMouseOver={mouseOverHandler} 
    onMouseOut={mouseOutHandler}
    onClick={clickHandler}></div>
  );
}

export const Board : React.FC<BoardProp> = ({currentSelectMino, setSelectMino, currentHoldMinoes, setHoldMinoes}) => {

  const [boardState, setBoardState] = useState<BoardState>({
    boardStateArray: Array<Owner>(BOXNUM).fill('board'),
    hoveringPosArray: []
  });

  const currentBoardState : Owner[] = boardState.boardStateArray;
  const currentHoveringPos : number[][] = boardState.hoveringPosArray;

  const currentSelectMinoShape : number[][] | undefined = currentSelectMino?.mino.shape;
  const currentSelectMinoIndex : number | undefined = currentSelectMino?.indexInMinoesArray;
  const currentHoldMinoesArray = currentHoldMinoes;

  const { matchInfo } = useContext(MatchInfoContext);

  const prePlayerOwn = `pre-${matchInfo.assignedPlayerNumber}p` as Owner;
  const playerOwn = `${matchInfo.assignedPlayerNumber}p` as Owner;

  useEffect(() => {
    const handler = (reply : { opponentPlayerNumber : 1 | 2,  score : number, filledPosArray : number[][] }) => {
      setBoardState((prevBoardState) => {
        const opponentPlayerOwn = `${reply.opponentPlayerNumber}p` as Owner;
        const nextBoardStateArray = [...prevBoardState.boardStateArray];
        for (const pos of reply.filledPosArray) {
          const y = pos[0];
          const x = pos[1];

          if (typeof y === 'undefined' || typeof x === 'undefined')throw Error('');

          nextBoardStateArray[y * BOARDSIZE + x] = opponentPlayerOwn;
        }

        return {
          boardStateArray : nextBoardStateArray,
          hoveringPosArray : [],
        }
      });
    };

    ClientSocket.setOnOpponentPlayerScored(handler);
    return () => {
      ClientSocket.removeOnOpponentPlayerScored(handler);
    }
  });


  const boxes = [];
  for (let i = 0; i < BOARDSIZE; i++) {
    for (let j = 0; j < BOARDSIZE; j++) {
      const currentboxowner : Owner | undefined = currentBoardState[i*20+j];
      if (typeof currentboxowner === 'undefined')throw Error('');

      const mouseOverHandler = () => {
        if (!matchInfo.isPlayerTurn)return;

        if (typeof currentSelectMinoShape === 'undefined')return;

        let hasRoom : boolean = true;
        for (const pos of currentSelectMinoShape) {
          let y = pos[0];
          let x = pos[1];

          if (typeof y === 'undefined' || typeof x === 'undefined') {
            throw Error('');
          }

          y += i;
          x += j;

          if (!(0 <= y && y < BOARDSIZE && 0 <= x && x < BOARDSIZE) || currentBoardState[y*BOARDSIZE+x] !== 'board')hasRoom = false;
        }

        if (hasRoom) {
          const nextHoveringPosArray = [];
          const nextBoardStateArray = [...currentBoardState]
          for (const pos of currentSelectMinoShape) {
            let y  = pos[0] as number;
            let x  = pos[1] as number;

            y += i;
            x += j;
            nextHoveringPosArray.push([y, x])
            nextBoardStateArray[y*BOARDSIZE+x] = prePlayerOwn;
          }
          setBoardState({
            boardStateArray: nextBoardStateArray,
            hoveringPosArray : nextHoveringPosArray
          })
        }
      };

      const mouseOutHandler = () => {
        if (currentSelectMinoIndex === -1)return;
        const nextBoardStateArray = [...currentBoardState];
        for (const hoveringpos of currentHoveringPos) {
          const y = hoveringpos[0];
          const x = hoveringpos[1];

          if (typeof y === 'undefined' || typeof x === 'undefined') {
            throw Error('');
          }

          if (currentBoardState[y*BOARDSIZE+x] === prePlayerOwn) {
            nextBoardStateArray[y*BOARDSIZE+x] = 'board';
          }
        }

        setBoardState({
          boardStateArray: nextBoardStateArray,
          hoveringPosArray: []
        });
      };

      const clickHandler = async () => {
        if (!matchInfo.isPlayerTurn)return;

        if (typeof currentSelectMinoShape === 'undefined' || typeof currentSelectMinoIndex === 'undefined') {
          alert('ミノを選択してください！');
          return;
        }
        let hasRoom : boolean = true;

        for (const pos of currentSelectMinoShape) {
          let y = pos[0];
          let x = pos[1];

          if (typeof y === 'undefined' || typeof x === 'undefined') {
            throw Error('');
          }

          y += i;
          x += j;


          if (currentBoardState[y*BOARDSIZE+x] !== prePlayerOwn)hasRoom = false;
        }

        if (hasRoom) {
          const nextBoardStateArray = [...currentBoardState]
          const fillPosArray = [];

          for (const pos of currentSelectMinoShape) {
            let y = pos[0] as number;
            let x = pos[1] as number;

            y += i;
            x += j;

            fillPosArray.push([y, x]);
            nextBoardStateArray[y*BOARDSIZE+x] = playerOwn;
          }

          const nextHoldMinoesArray : Mino[] = currentHoldMinoesArray.filter((mino, index) => { 
            if (index !== currentSelectMinoIndex)return mino;
            else return;
          });

          // socketで送信
          // const handler = (reply : { scoredPlayerNumber : 1 | 2, score : number, nextPlayer : 1 | 2, filledPosArray : number[][] }) => {
          //   ClientSocket.removeOnScoredAndTurnChange(handler);
          //   let newPlayerScores = matchInfo.playerScores;
          //   newPlayerScores[reply.scoredPlayerNumber-1] += reply.score;
          //   const scoredPlayerOwn = `${reply.scoredPlayerNumber}`;
          //   setBoardState({
          //     boardStateArray: nextBoardStateArray,
          //     hoveringPosArray : []
          //   })
          //   setHoldMinoes(nextHoldMinoesArray)
          //   setSelectMino(undefined);
          // };

          // TODO : await時に操作できないようにページをカバーする要素の追加
          await ClientSocket.fillBoard(fillPosArray, matchInfo.matchID as string);
          setBoardState({
            boardStateArray: nextBoardStateArray,
            hoveringPosArray : []
          })
          setHoldMinoes(nextHoldMinoesArray)
          setSelectMino(undefined);
        }
      };

      boxes.push(<Box owner={currentboxowner} mouseOverHandler={mouseOverHandler} mouseOutHandler={mouseOutHandler} clickHandler={clickHandler} key={i*BOARDSIZE+j}></Box>);
    }
  }

  return (
    <div>
      <div className='w-[700px] grid grid-cols-20 bg-slate-200'>
        {GridHorizontalSign}
      </div>
      <div className='flex'>
        <div className='w-[700px] h-[700px] grid grid-cols-20 gap-0'>
          {boxes}
        </div>
        <div className='h-[700px] grid grid-rows-20 bg-orange-400'>
          {GridVerticalSign}
        </div>
      </div>
    </div>
  );
}

const GridVerticalSign = (() => {
  const vSigns = [];
  const str = 'abcdefghijklmnopqrstuvwxyz';
  for (let i = 0;i < BOARDSIZE;i++) {
    vSigns.push(<div className='text-center flex justify-center items-center border border-black'>{str[i]}</div>);
  }
  return vSigns;
})();

const GridHorizontalSign = (() => {
  const hSigns = [];
  for (let i = 0;i < BOARDSIZE;i++) {
    hSigns.push(<div className='text-center border border-black'>{i.toString()}</div>);
  }
  return hSigns;
})();