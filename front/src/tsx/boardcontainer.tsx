import {Board} from './board';
import { MinoSelectBtnList } from './minoselectbtn';
import { useState } from 'react';

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
  0 : 'src/img/mino_0.svg',
  1 : 'src/img/mino_1.svg',
  2 : 'src/img/mino_2.svg',
  3 : 'src/img/mino_3.svg',
  4 : 'src/img/mino_4.svg',
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

export const GameBoardContainer = () => {

  const [currentSelectMino, setSelectMino] = useState<{mino? : Mino, indexInMinoesArray? : number}>({
    mino: initSelectMino,
    indexInMinoesArray: 0,
  });

  const [currentHoldMinoes, setHoldMinoes] = useState<Array<Mino>>(initHoldMinoesArray);

  return (
    <div className=''>
        <Board currentSelectMino={currentSelectMino} setSelectMino={setSelectMino} currentHoldMinoes={currentHoldMinoes} setHoldMinoes={setHoldMinoes} />
        <MinoSelectBtnList currentHoldMinoes={currentHoldMinoes} setSelectMino={setSelectMino}/>
    </div>
  );
}