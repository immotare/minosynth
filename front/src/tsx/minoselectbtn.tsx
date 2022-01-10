import { Mino } from './board_ui';
import * as React from 'react';

export function MinoSelectBtnList({ currentHoldMinoes, setSelectMino } : { currentHoldMinoes : Array<Mino>, setSelectMino : React.Dispatch<React.SetStateAction<{mino : Mino, indexInMinoesArray : number} | undefined>>}) {

  const selectBtnList = currentHoldMinoes.map((mino : Mino, index: number) => {
    const btnClickListener = () => {
      setSelectMino({mino : mino, indexInMinoesArray : index})
    };

    return (
      <div className='mino-sel-btn' onClick={btnClickListener} key={index.toString()}>
        <img className='mino-sel-btn-img' src={mino.imageUrl}></img>
      </div>
    );   
  });

  return (
    <div className='mino-sel-btn-container'>
      {selectBtnList}
    </div>
  );
}