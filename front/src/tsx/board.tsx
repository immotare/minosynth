import {useState} from 'react';

type Owner = '1p' | '2p' | 'board' | 'pre-1p' | 'pre-2p';
type BoxProp = {
  owner: Owner;
  mouseOverHandler: () => void;
  mouseOutHandler: () => void;
  clickHandler: () => void;
}

function Box(boxprop: BoxProp) {
  const classname = `board-box owner-${boxprop.owner}`;
  return (
    <div className={classname} onClick={boxprop.clickHandler} onMouseOver={boxprop.mouseOverHandler} onMouseOut={boxprop.mouseOutHandler}></div>
  );
}

function BoxRow(boxPropArray: BoxProp[]) {
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

// function ownerIsBoard (currentBoardState: Owner[], boardPosArray : number[][]) {
//   // boardPosArray = [[y1, x1], [y2, x2], ...]
//   for (const boxPos of boardPosArray) {
//     const y : number | undefined = boxPos[0];
//     const x : number | undefined = boxPos[1];

//     if (typeof y === 'undefined' || typeof x === 'undefined') {
//       throw Error("");
//     }
//     const boxowner : Owner | undefined = currentBoardState[y*20+x];

//     if (boxowner !== 'board')return false;
//   }
//   return true;
// }

export function Board(minoShape: string) {
  // boardState := (currentBoardState, prevBoardState)
  const [boardState, setBoardState] = useState<Owner[][]>([Array<Owner>(400).fill('board'), Array<Owner>(400).fill('board')]);
  const currentBoardState : Owner[] | undefined = boardState[0];
  const prevBoardState : Owner[] | undefined = boardState[1];

  if (typeof currentBoardState === 'undefined' || typeof prevBoardState === 'undefined')throw Error("");

  const rows = [];
  for (let i = 0; i < 20; i++) {
    const rowprop : BoxProp[] = [];
    for (let j = 0; j < 20; j++) {
      const currentboxowner : Owner | undefined = currentBoardState[i*20+j];
      const prevboxowner : Owner | undefined = prevBoardState[i*20+j];

      if (typeof currentboxowner === 'undefined' || typeof prevboxowner === 'undefined')throw Error("");

      const mouseOverHandler = () => {
        // console.log("on mouse over");
        if (minoShape === '+') {
          if (i - 1 >= 0 && i + 1 < 20 && j - 1 >= 0 && j + 1 < 20) {
            const nextBoardState = [...currentBoardState];
            nextBoardState[i*20+j] = 'pre-1p';
            nextBoardState[(i-1)*20+j] = 'pre-1p';
            nextBoardState[(i+1)*20+j] = 'pre-1p';
            nextBoardState[i*20+j-1] = 'pre-1p';
            nextBoardState[i*20+j+1] = 'pre-1p';
            setBoardState([nextBoardState, currentBoardState]);
          }
        }

        if (minoShape === 'L') {
          if (i - 2 >= 0 && j + 1 < 20) {
            const nextBoardState = [...currentBoardState]
            nextBoardState[i*20+j] = 'pre-1p';
            nextBoardState[(i-1)*20+j] = 'pre-1p';
            nextBoardState[(i-2)*20+j] = 'pre-1p';
            nextBoardState[i*20+j+1] = 'pre-1p';
            setBoardState([nextBoardState, currentBoardState]);
          }
        }
      };

      const mouseOutHandler = () => {
        // console.log("on mouse out");
        if (minoShape === 'L' || minoShape === '+') {
          setBoardState([prevBoardState, prevBoardState]);
        }
      };

      // const clickHandler = () => {
      //   if (minoShape === '+') {
      //     if (i - 1 >= 0 && i + 1 < 20 && j - 1 >= 0 && j + 1 < 20) {
      //       const nextBoardState = [...currentBoardState];
      //       nextBoardState[i*20+j] = 'pre-1p';
      //       nextBoardState[(i-1)*20+j] = 'pre-1p';
      //       nextBoardState[(i+1)*20+j] = 'pre-1p';
      //       nextBoardState[i*20+j-1] = 'pre-1p';
      //       nextBoardState[i*20+j+1] = 'pre-1p';
      //       setBoardState([nextBoardState, currentBoardState]);
      //     }
      //   }

      //   if (minoShape === 'L') {
      //     if (i - 2 >= 0 && j + 1 < 20) {
      //       const nextBoardState = [...currentBoardState]
      //       nextBoardState[i*20+j] = 'pre-1p';
      //       nextBoardState[(i-1)*20+j] = 'pre-1p';
      //       nextBoardState[(i-2)*20+j] = 'pre-1p';
      //       nextBoardState[i*20+j+1] = 'pre-1p';
      //       setBoardState([nextBoardState, currentBoardState]);
      //     }
      //   }
      // };

      const boxProp : BoxProp = { owner: currentboxowner, mouseOverHandler: mouseOverHandler, mouseOutHandler: mouseOutHandler, clickHandler: () => {} };
      rowprop.push(boxProp);
    }
    rows.push(BoxRow(rowprop));
  }

  return (
    <div className='board-container'>
      {rows}
    </div>
  );
}