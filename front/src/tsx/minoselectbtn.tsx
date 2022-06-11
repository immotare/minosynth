import { Mino } from './boardcontainer';
import * as React from 'react';

type MinoSelectBtnProp = {
  currentSelectMino : {
    mino : Mino,
    indexInMinoesArray : number, 
  } | undefined,
  setSelectMino : React.Dispatch<React.SetStateAction<{
    mino : Mino,
    indexInMinoesArray : number,
  } | undefined>>,
  currentHoldMinoes : Mino[],
}

export const MinoSelectBtnList : React.FC<MinoSelectBtnProp> = ({ currentSelectMino, setSelectMino, currentHoldMinoes}) => {
  const selectbtnlist = currentHoldMinoes.map((mino : Mino, index: number) => {
    const btnclicklistener = () => {
      setSelectMino({mino : mino, indexInMinoesArray : index});
    };

    let border = '';
    if (index === currentSelectMino?.indexInMinoesArray) {
      border = 'border-2 border-rose-600';
    }
    else {
      border = 'border border-slate-200';
    }

    return (
      <div className={`w-[120px] h-[120px] shadow-md ${border}`} style={{backgroundImage : `url(${mino.imageUrl})`, backgroundSize : 'cover'}} onClick={btnclicklistener} key={index.toString()}>
      </div>
    );
  });

  return (
    <div className='container h-[700px] mx-auto place-items-center grid grid-cols-2 gap-2'>
      {selectbtnlist}
    </div>
  );
}