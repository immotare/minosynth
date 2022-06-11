import {Board} from './board';
import { MinoSelectBtnList } from './minoselectbtn';
import { useState } from 'react';
import { GameLogHistory } from './gameloghistory';

export type MinoColor = 'red' | 'blue' | 'green' | 'yellow';

export type Mino = {
  shape : number[][],
  imageUrl : string,
  color : MinoColor,
}

export type GameBoardContainerState = {
  selectMino : Mino,
  selectMinoIndex : number,
  currentHoldMinoesArray : Array<Mino>,
}

const minoTemplates : { [index:number] : number[][] } = {
  0 : [[0, 0], [0, 1], [1, 0], [1, 1]], // 田

  // 1 : [[0, 0], [0, 1], [0, 2], [0, 3]], // 一
  // 1 : [[0, 0], [1, 0], [2, 0], [3, 0]], // |
  
  1 : [[0, 1], [1, 1], [2, 0], [2, 1]], //　」
  // 12 : [[0, 0], [1, 0], [1, 1], [1, 2]], // └
  // 13 : [[0, 0], [0, 1], [1, 0], [2, 0]], // ┌
  // 14 : [[0, 0], [0, 1], [0, 2], [1, 2]], // ┐

  // 3 : [[0, 0], [1, 0], [2, 0], [2, 1]], // L
  // 8 : [[0, 2], [1, 0], [1, 1], [1, 2]], // ┘
  // 9 : [[0, 0], [0, 1], [1, 1], [2, 1]], // ┐
  // 10 : [[0, 0], [0, 1], [0, 2], [1, 0]], // ┌

  // 4 : [[0, 0], [0, 1], [0, 2], [1, 1]], // ┬
  // 4 : [[0, 1], [1, 0], [1, 1], [1, 2]], // ┴
  // 5 : [[0, 0], [1, 0], [1, 1], [2, 0]], // ├
  // 6 : [[0, 1], [1, 0], [1, 1], [2, 1]], // ┤
  2 : [[0, 1], [0, 2], [1, 0], [1, 1]],
  3 : [[0, 0], [0, 1], [1, 1], [1, 2]],
};

const minoTemplatesImgURLs : { [index:number] : string} = {
  0 : 'img/mino1.png',
  // 1 : 'img/mino2.png',
  1 : 'img/mino3.png',
  // 3 : 'img/mino4.png',
  // 4 : 'img/mino5.png',
  2 : 'img/mino6.png',
  3 : 'img/mino7.png',
}

const minoTemplatesColors : { [index:number] : MinoColor} = {
  0 : 'yellow',
  1 : 'blue',
  2 : 'green',
  3 : 'red',
}

function genRandomMino() : Mino {
  const randIndex : number = Math.floor(Math.random() * 4);
  return { shape: minoTemplates[randIndex] as number[][], imageUrl: minoTemplatesImgURLs[randIndex] as string, color : minoTemplatesColors[randIndex] as MinoColor};
}

function randomInitializeMinoes() : Array<Mino> {
  const minosArray = Array< { shape: number[][], imageUrl: string, color : MinoColor }>();
  for (let i = 0;i < 10;i++) {
    minosArray.push(genRandomMino());
  }

  return minosArray;
}

const initHoldMinoesArray : Array<Mino> = randomInitializeMinoes();
const initSelectMino : Mino = initHoldMinoesArray[0] as Mino;

export const GameBoardContainer : React.FC = () => {

  const [currentSelectMino, setSelectMino] = useState<{mino : Mino, indexInMinoesArray : number} | undefined>({
    mino: initSelectMino,
    indexInMinoesArray: 0,
  });

  const [currentHoldMinoes, setHoldMinoes] = useState<Array<Mino>>(initHoldMinoesArray);

  return (
    <div>
      <div className='container mx-auto flex flex-row justify-center'>
        {/* 
          TODO : Anchor一覧を表示するコンポーネントの追加
          以下は仮の要素 
        */}
        <div className='w-[100px] h-[50px] flex justify-center items-center text-lg border border-black'>a1</div>
        <div className='w-[50px] h-[50px] flex justify-center items-center text-lg'>→</div>
        <div className='w-[100px] h-[50px] flex justify-center items-center text-lg border border-black'>b2</div>
      </div>
      <div className='w-full grid grid-cols-12 gap-0 mt-6'>
        <div className='flex justify-center items-center col-span-3'>
          <MinoSelectBtnList currentSelectMino={currentSelectMino} setSelectMino={setSelectMino} currentHoldMinoes={currentHoldMinoes}/>
        </div>
        <div className='col-span-6 flex justify-center items-center'>
          <Board currentSelectMino={currentSelectMino} setSelectMino={setSelectMino} currentHoldMinoes={currentHoldMinoes} setHoldMinoes={setHoldMinoes} />
        </div>
        <div id='game-logs' className='col-span-3'>
          <GameLogHistory />
        </div>
      </div>
    </div>
  );
}