import { useState } from 'react';
import * as React from 'react';
import { Mino } from '../index';

type Owner = '1p' | '2p' | 'board' | 'pre-1p' | 'pre-2p';
type BoxProp = {
  owner: Owner;
  mouseOverHandler: () => void;
  mouseOutHandler: () => void;
  clickHandler: () => void;
}

type BoardState = {
  boardStateArray : Owner[];
  hoveringPosArray : number[][];
}

function Box(boxprop: BoxProp) {
  const classname = `board-box owner-${boxprop.owner}`;
  return (
    <div className={classname}
    onClick={boxprop.clickHandler} 
    onMouseOver={boxprop.mouseOverHandler} 
    onMouseOut={boxprop.mouseOutHandler}></div>
  );
}

function BoxRow({boxPropArray} : {boxPropArray : BoxProp[]}) {
  const boxes = [];
  for (let boxprop of boxPropArray) {
    boxes.push(Box(boxprop));
  }

  return (
    <div className='board-box-row'>
      {boxes}
    </div>
  );
}

export function Board({ currentSelectMino, setSelectMino, currentHoldMinoes, setHoldMinoes } : { currentSelectMino? : {mino : Mino, indexInMinoesArray : number}, setSelectMino : React.Dispatch<React.SetStateAction<{mino:Mino, indexInMinoesArray:number} | undefined>>, currentHoldMinoes : Array<Mino>, setHoldMinoes : React.Dispatch<React.SetStateAction<Array<Mino>>>}) {

  const [boardState, setBoardState] = useState<BoardState>({
    boardStateArray: Array<Owner>(400).fill('board'),
    hoveringPosArray: []
  });

  const currentBoardState : Owner[] = boardState.boardStateArray;
  const currentHoveringPos : number[][] = boardState.hoveringPosArray;

  const currentSelectMinoShape : number[][] | undefined = currentSelectMino?.mino.shape;
  const currentSelectMinoIndex : number | undefined = currentSelectMino?.indexInMinoesArray;
  const currentHoldMinoesArray = currentHoldMinoes;

  const rows = [];
  for (let i = 0; i < 20; i++) {
    const rowprop : BoxProp[] = [];
    for (let j = 0; j < 20; j++) {
      const currentboxowner : Owner | undefined = currentBoardState[i*20+j];
      if (typeof currentboxowner === 'undefined')throw Error("");

      const mouseOverHandler = () => {
        if (typeof currentSelectMino === 'undefined')return;

        let hasRoom : boolean = true;
        for (const pos of currentSelectMinoShape as number[][]) {
          let y = pos[0];
          let x = pos[1];

          if (typeof y === 'undefined' || typeof x === 'undefined') {
            throw Error("");
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
            throw Error("");
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
        if (typeof currentSelectMino === 'undefined') {
          alert("ミノを選択してください！");
          return;
        }
        let hasRoom : boolean = true;

        for (const pos of currentSelectMinoShape as number[][]) {
          let y = pos[0];
          let x = pos[1];

          if (typeof y === 'undefined' || typeof x === 'undefined') {
            throw Error("");
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
                throw Error("");
              }
              nextHoldMinoesArray.push(mino);
            }
          }

          setBoardState({
            boardStateArray: nextBoardStateArray,
            hoveringPosArray : []
          })
          setHoldMinoes(nextHoldMinoesArray)

          setSelectMino(undefined);
        }
      };

      const boxProp : BoxProp = { owner: currentboxowner, mouseOverHandler: mouseOverHandler, mouseOutHandler: mouseOutHandler, clickHandler: clickHandler};
      rowprop.push(boxProp);
    }
    rows.push(<BoxRow boxPropArray={rowprop}/>);
  }

  return (
    <div className='board-container'>
      {rows}
    </div>
  );
}