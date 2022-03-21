import { Mino } from './boardcontainer';
import * as React from 'react';

type MinoSelectBtnProp = {
  currentHoldMinoes : Mino[],
  setSelectMino : React.Dispatch<React.SetStateAction<{
    mino? : Mino,
    indexInMinoesArray? : number,
  }>>
}

export const MinoSelectBtnList : React.FC<MinoSelectBtnProp> = ({currentHoldMinoes, setSelectMino}) => {
  const selectbtnlist = currentHoldMinoes.map((mino : Mino, index: number) => {
    const btnclicklistener = () => {
      setSelectMino({mino : mino, indexInMinoesArray : index})
    };

    return (
      <div className='border border-black h-48' onClick={btnclicklistener} key={index.toString()}>
        <img className='w-full h-full' src={mino.imageUrl}></img>
      </div>
    );   
  });

  return (
    <div className='grid grid-cols-10 gap-4'>
      {selectbtnlist}
    </div>
  );
}