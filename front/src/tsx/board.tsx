import { useState } from 'react';
import * as React from 'react';
import { Mino } from './boardcontainer';

type Owner = '1p' | '2p' | 'board' | 'pre-1p' | 'pre-2p';
type BoxProp = {
  owner: Owner,
  mouseOverHandler: () => void,
  mouseOutHandler: () => void,
  clickHandler: () => void,
}

type BoxRowProp = {
  boxPropArray: BoxProp[]
}

type BoardProp = {
  currentSelectMino : {
    mino? : Mino,
    indexInMinoesArray? : number,
  },
  setSelectMino : React.Dispatch<React.SetStateAction<
  {
    mino? : Mino,
    indexInMinoesArray? : number
  }>>,
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

  const className = `border border-black w-10 h-10 ${highlightcolor}`;
  return (
    <div className={className}
    onMouseOver={mouseOverHandler} 
    onMouseOut={mouseOutHandler}
    onClick={clickHandler}></div>
  );
}

const BoxRow : React.FC<BoxRowProp> = ({boxPropArray}) => {
  const boxes = [];
  for (let boxprop of boxPropArray) {
    boxes.push(Box(boxprop));
  }

  return (
    <div className='grid grid-cols-20 gap-0'>
      {boxes}
    </div>
  );
}

export const Board : React.FC<BoardProp> = ({currentSelectMino, setSelectMino, currentHoldMinoes, setHoldMinoes}) => {

  const [boardState, setBoardState] = useState<BoardState>({
    boardStateArray: Array<Owner>(400).fill('board'),
    hoveringPosArray: []
  });

  const currentBoardState : Owner[] = boardState.boardStateArray;
  const currentHoveringPos : number[][] = boardState.hoveringPosArray;

  const currentSelectMinoShape : number[][] | undefined = currentSelectMino.mino?.shape;
  const currentSelectMinoIndex : number | undefined = currentSelectMino?.indexInMinoesArray;
  const currentHoldMinoesArray = currentHoldMinoes;

  const rows = [];
  for (let i = 0; i < 20; i++) {
    const rowprop : BoxProp[] = [];
    for (let j = 0; j < 20; j++) {
      const currentboxowner : Owner | undefined = currentBoardState[i*20+j];
      if (typeof currentboxowner === 'undefined')throw Error('');

      const mouseOverHandler = () => {
        if (typeof currentSelectMino === 'undefined')return;

        let hasRoom : boolean = true;
        for (const pos of currentSelectMinoShape as number[][]) {
          let y = pos[0];
          let x = pos[1];

          if (typeof y === 'undefined' || typeof x === 'undefined') {
            throw Error('');
          }

          y += i;
          x += j;

          if (!(0 <= y && y < 20 && 0 <= x && x < 20) || currentBoardState[y*20+x] !== 'board')hasRoom = false;
        }

        if (hasRoom) {
          const nextHoveringPosArray = [];
          const nextBoardStateArray = [...currentBoardState]
          for (const pos of currentSelectMinoShape as number[][]) {
            let y : number = pos[0] as number;
            let x : number = pos[1] as number;

            y += i;
            x += j;
            nextHoveringPosArray.push([y, x])
            nextBoardStateArray[y*20+x] = 'pre-1p';
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

          if (currentBoardState[y*20+x] === 'pre-1p') {
            nextBoardStateArray[y*20+x] = 'board';
          }
        }

        setBoardState({
          boardStateArray: nextBoardStateArray,
          hoveringPosArray: []
        });
      };

      const clickHandler = () => {
        if (typeof currentSelectMinoShape === 'undefined' || typeof currentSelectMinoIndex === 'undefined') {
          alert('ミノを選択してください！');
          return;
        }
        let hasRoom : boolean = true;

        for (const pos of currentSelectMinoShape as number[][]) {
          let y = pos[0];
          let x = pos[1];

          if (typeof y === 'undefined' || typeof x === 'undefined') {
            throw Error('');
          }

          y += i;
          x += j;


          if (currentBoardState[y*20+x] !== 'pre-1p')hasRoom = false;
        }

        if (hasRoom) {
          const nextHoveringPosArray = [];
          const nextBoardStateArray = [...currentBoardState]
          for (const pos of currentSelectMinoShape as number[][]) {
            let y : number = pos[0] as number;
            let x : number = pos[1] as number;

            y += i;
            x += j;
            nextHoveringPosArray.push([y, x])
            nextBoardStateArray[y*20+x] = '1p';
          }

          const nextHoldMinoesArray : Mino[] = [];
          for (let i = 0;i < currentHoldMinoesArray.length;i++) {
            if (i !== currentSelectMinoIndex) {
              const mino : Mino | undefined = currentHoldMinoesArray[i];
              if (typeof mino === 'undefined') {
                throw Error('');
              }
              nextHoldMinoesArray.push(mino);
            }
          }

          setBoardState({
            boardStateArray: nextBoardStateArray,
            hoveringPosArray : []
          })
          setHoldMinoes(nextHoldMinoesArray)

          setSelectMino({});
        }
      };

      const boxProp : BoxProp = { owner: currentboxowner, mouseOverHandler: mouseOverHandler, mouseOutHandler: mouseOutHandler, clickHandler: clickHandler};
      rowprop.push(boxProp);
    }
    rows.push(<BoxRow boxPropArray={rowprop}/>);
  }

  return (
    <div className='container w-[800px] h-[800px] mx-auto'>
      {rows}
    </div>
  );
}