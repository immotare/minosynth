import { useState } from 'react';
import * as ReactDOM from 'react-dom';
import '../css/output.css';
import { GameBoardContainer } from './boardcontainer';

type ClientState = 'initial' | 'openMatch' | 'joinMatch' | 'gameStart';


const RootView : React.FC = () => {
  let title : JSX.Element | null = (
    <div className='container bg-green-200 mx-auto h-1/4 items-center justify-center'>
      <h1 className='text-6xl font-bold text-center'>minosynth</h1>
    </div>
  );

  const [clientState, setClientState] = useState<ClientState>('initial');

  let content;

  if (clientState === 'initial') {
    const openMatchBtnClickHandler = () => {
      setClientState('openMatch');
    }

    const joinMatchBtnClickHandler = () => {
      setClientState('joinMatch');
    }

    const startGameBtnHandler = () => {
      setClientState('gameStart');
    }

    content = (
      <div className='container mx-auto flex flex-col gap-y-8 items-center mt-20'>
        <button className='text-2xl w-96 bg-indigo-100 shadow-lg hover:bg-indigo-200' onClick={openMatchBtnClickHandler}>ゲームを始める</button>
        <button className='text-2xl w-96 bg-indigo-100 shadow-lg hover:bg-indigo-200' onClick={joinMatchBtnClickHandler}>ゲームに参加する</button>
        <button className='text-2xl w-96 bg-indigo-100 shadow-lg hover:bg-indigo-200' onClick={startGameBtnHandler}>開始(開発用)</button>
      </div>
    );

    return (
      <div className='h-screen'>
        {title}
        {content}
      </div>
    );
  }

  if (clientState === 'joinMatch') {
    const backBtnClickHandler = () => {
      setClientState('initial');
    }

    content = (
      <div className='container mx-auto h-3/4 items-center'>
        <form className='shadow-md'>
          <label className='block text-gray-700 text-sm font-bold'>マッチID
            <input type='text' minLength={8} maxLength={8} name='match-id' placeholder='マッチID'></input>
          </label>
        </form>

        <button className='bg-indigo-100 w-16 h-16 bg-arrow-left bg-no-repeat bg-center bg-contain shadow-lg hover:bg-indigo-200' onClick={backBtnClickHandler}></button>
      </div>
    )

    // TOOD : マッチ一覧
    return(
      <div></div>
    );
  }

  if (clientState === 'openMatch') {
    const backBtnClickHandler = () => {
      setClientState('initial');
    }


    content = (
      <div className='container mx-auto h-3/4 items-center'>
        <h2 className='text-2xl text-center font-bold inline-block mt-20'>ここにマッチIDが入る</h2>
        <button className='bg-indigo-100 w-16 h-16 bg-arrow-left bg-no-repeat bg-center bg-contain shadow-lg hover:bg-indigo-200' onClick={backBtnClickHandler}></button>
      </div>
    )

    // TODO: マッチの待機画面
    return (
      <div></div>
    );
  }

  if (clientState === 'gameStart') {
    title = null;
    const backBtnClickHandler = () => {
      setClientState('initial');
    }

    const boardGameUI = (
      <div>
        <div className='w-full grid grid-cols-5 h-12'>
          <div className='bg-red-400'></div>
          <div className='col-span-3'></div>
          <div className='bg-blue-400'></div>
        </div>
        <div className='container mx-auto'>
          <GameBoardContainer />
          <button className='bg-indigo-100 w-16 h-16 bg-arrow-left bg-no-repeat bg-center bg-contain shadow-lg hover:bg-indigo-200' onClick={backBtnClickHandler}></button>
        </div>
      </div>
    );

    return boardGameUI;
  }


  // 
  return (
    <div></div>
  );
}

ReactDOM.render(<RootView/>, document.getElementById('root'));