import {Board} from './board';
import { MinoSelectBtnList } from './minoselectbtn';
import { useState } from 'react';
import { GameLogHistory } from './gameloghistory';

export type Mino = {
  shape: number[][],
  imageUrl : string
}

export type GameBoardContainerState = {
  selectMino : Mino,
  selectMinoIndex : number,
  currentHoldMinoesArray : Array<Mino>,
}

const minoTemplates : { [index:number] : number[][] } = {
  0 : [[0, 0], [0, 1], [1, 0], [1, 1]], // 田

  // 1 : [[0, 0], [0, 1], [0, 2], [0, 3]], // 一
  1 : [[0, 0], [1, 0], [2, 0], [3, 0]], // |
  
  2 : [[0, 1], [1, 1], [2, 0], [2, 1]], //　」
  // 12 : [[0, 0], [1, 0], [1, 1], [1, 2]], // └
  // 13 : [[0, 0], [0, 1], [1, 0], [2, 0]], // ┌
  // 14 : [[0, 0], [0, 1], [0, 2], [1, 2]], // ┐

  3 : [[0, 0], [1, 0], [2, 0], [2, 1]], // L
  // 8 : [[0, 2], [1, 0], [1, 1], [1, 2]], // ┘
  // 9 : [[0, 0], [0, 1], [1, 1], [2, 1]], // ┐
  // 10 : [[0, 0], [0, 1], [0, 2], [1, 0]], // ┌

  4 : [[0, 0], [0, 1], [0, 2], [1, 1]], // ┬
  // 4 : [[0, 1], [1, 0], [1, 1], [1, 2]], // ┴
  // 5 : [[0, 0], [1, 0], [1, 1], [2, 0]], // ├
  // 6 : [[0, 1], [1, 0], [1, 1], [2, 1]], // ┤
};

const minoTemplatesImgURLs : { [index:number] : string} = {
  0 : 'img/mino_0.svg',
  1 : 'img/mino_1.svg',
  2 : 'img/mino_2.svg',
  3 : 'img/mino_3.svg',
  4 : 'img/mino_4.svg',
}

function genRandomMino() : Mino {
  const randIndex : number = Math.floor(Math.random() * 5);
  return { shape: minoTemplates[randIndex] as number[][], imageUrl: minoTemplatesImgURLs[randIndex] as string};
}

function randomInitializeminoes() : Array<Mino> {
  const minosArray = Array< { shape: number[][], imageUrl: string }>();
  for (let i = 0;i < 10;i++) {
    minosArray.push(genRandomMino());
  }

  return minosArray;
}

const initHoldMinoesArray : Array<Mino> = randomInitializeminoes();
const initSelectMino : Mino = initHoldMinoesArray[0] as Mino;

export const GameBoardContainer : React.FC = () => {

  const [currentSelectMino, setSelectMino] = useState<{mino? : Mino, indexInMinoesArray? : number}>({
    mino: initSelectMino,
    indexInMinoesArray: 0,
  });

  const [currentHoldMinoes, setHoldMinoes] = useState<Array<Mino>>(initHoldMinoesArray);

  return (
    <div className='w-full min-w-[1210px] grid grid-cols-11 gap-0'>
      <div className='col-span-2 min-w-[220px]'>
        <MinoSelectBtnList currentHoldMinoes={currentHoldMinoes} setSelectMino={setSelectMino}/>
      </div>
      <div className='col-span-7 bg-indigo-400 min-w-[770px]'>
        <Board currentSelectMino={currentSelectMino} setSelectMino={setSelectMino} currentHoldMinoes={currentHoldMinoes} setHoldMinoes={setHoldMinoes} />
      </div>
      <div id='game-logs' className='col-span-2 min-w-[220px]'>
        {/* <div className='w-[100px] h-[400px] bg-yellow-400'>hoge</div> */}
        <GameLogHistory />
      </div>
    </div>
  );
}
