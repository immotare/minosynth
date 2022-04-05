import { useContext, useState } from 'react';
import * as ReactDOM from 'react-dom';
import { ClientSocket } from '../ts/clientsocket';
import { io } from 'socket.io-client'
import '../css/output.css';
import { GameBoardContainer } from './boardcontainer';
import { MatchInfoContext, MatchInfoProvider } from './matchinfoprovider';

type ClientState = 'initial' | 'openMatch' | 'joinMatch' | 'gameStart';

const socket = io({autoConnect : false});
ClientSocket.setSocket(socket);

const App : React.FC = () => {
  const title : JSX.Element | null = (
    <div className='container bg-green-200 mx-auto h-[250px] w-2/3 flex items-center justify-center'>
      <h1 className='block text-6xl font-bold'>minosynth</h1>
    </div>
  );

  const [clientState, setClientState] = useState<ClientState>('initial');
  const { matchInfo, setMatchInfo } = useContext(MatchInfoContext);

  let content;

  if (clientState === 'initial') {
    const openMatchBtnClickHandler = () => {
      // console.log(`number of listeners on request_matchid_reply : ${socket.listeners('request_matchid_reply').length}`);

      ClientSocket.connect();
      ClientSocket.setOnConnect(async () => {
        console.log('connected to socket server');
        const repMatchID : string = await ClientSocket.requestMatchID();
        console.log(`reply match ID : ${repMatchID}`);

        ClientSocket.setOnMatchStart((reply) => {
          alert('マッチ開始!');
          setMatchInfo((prevMatchInfo) => {
            return {
              matchID : prevMatchInfo.matchID,
              isPlayerTurn : reply.isPlayerTurn,
              assignedPlayerNumber : reply.playerNumber,
            } 
          });
          setClientState('gameStart');
        });

        setMatchInfo((prevMatchInfo) => {
          return {
            matchID : repMatchID,
            isPlayerTurn : prevMatchInfo.isPlayerTurn,
            assignedPlayerNumber : prevMatchInfo.assignedPlayerNumber,
          }
        });

        setClientState('openMatch');
      });

      // ClientSocket.setOnMatchIDReceived((reply) => {
      //   console.log(`match ID : ${reply.matchid}`);
      //   setMatchInfo((prevMatchInfo) => {
      //     return {
      //       matchID : reply.matchid,
      //       isPlayerTurn : prevMatchInfo.isPlayerTurn,
      //       assignedPlayerNumber : prevMatchInfo.assignedPlayerNumber,
      //     }
      //   });
      //   setClientState('openMatch');
      // });

      // ClientSocket.setOnMatchStart((assignedPlayerNumber : 1 | 2) => {
      //    alert('マッチ開始!');
      //    setMatchInfo((prevMatchInfo) => {
      //      return {
      //        matchID : prevMatchInfo.matchID,
      //        isPlayerTurn : prevMatchInfo.isPlayerTurn,
      //        assignedPlayerNumber : assignedPlayerNumber,
      //      };
      //    });
      //    setClientState('gameStart');
      // });

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
      <div>
        {title}
        {content}
      </div>
    );
  }

  if (clientState === 'openMatch') {
    const backBtnClickHandler = () => {
      setClientState('initial');
    }

    content = (
      <div className='container mx-auto w-2/3 flex flex-col items-center justify-center bg-indigo-200 mt-20'>
        <h2 className='inline-block text-3xl font-bold'>マッチID</h2>
        <h3 className='inline-block text-2xl'>{matchInfo.matchID}</h3>
      </div>
    )

    // TODO: マッチの待機画面
    return (
      <div className='h-screen'>
        {title}
        {content}
        <button className='float-none bg-indigo-100 w-16 h-16 bg-arrow-left bg-no-repeat bg-center bg-contain shadow-lg hover:bg-indigo-200' onClick={backBtnClickHandler}></button>
      </div>
    );
  }

  if (clientState === 'joinMatch') {
    const backBtnClickHandler = () => {
      setClientState('initial');
      ClientSocket.disconnect();
      console.log('disconnect socket.');
    }

    const matchJoinBtnClickHandler = () => {
      const matchIDForm = document.getElementById('match-id-input') as HTMLInputElement;
      const inputMatchID : string = matchIDForm.value;
      ClientSocket.connect();
      ClientSocket.setOnConnect(async () => {
        const { playerNumber, isPlayerTurn } =  await ClientSocket.joinMatch(inputMatchID);
        alert('マッチ開始！');
        setMatchInfo({
          matchID : inputMatchID,
          isPlayerTurn : isPlayerTurn,
          assignedPlayerNumber : playerNumber,
        });
        setClientState('gameStart');
      });
    }

    content = (
      <div className='container mx-auto w-2/3 flex justify-center mt-20'>
        <form className='h-24 shadow-md flex items-center'>
          <input className='h-20 w-64 text-2xl text-center mr-5' type='text' minLength={8} maxLength={8} placeholder='マッチID' id='match-id-input'></input>
          <button className='h-20 w-40 text-white bg-sky-400 text-2xl' type='button' onClick={matchJoinBtnClickHandler}>送信</button>
        </form>
      </div>
    )

    // TOOD : マッチ一覧
    return(
      <div>
        {title}
        {content}
        <button className='bg-indigo-100 w-16 h-16 bg-arrow-left bg-no-repeat bg-center bg-contain shadow-lg hover:bg-indigo-200' onClick={backBtnClickHandler}></button>
      </div>
    );
  }

  if (clientState === 'gameStart') {
    const backBtnClickHandler = () => {
      setClientState('initial');
      ClientSocket.disconnect();
      console.log('disconnect socket.');
    }

    const boardGameUI = (
      <div>
        <div className='w-full grid grid-cols-5 h-12'>
          <div className='bg-red-400'></div>
          <div className='col-span-3'></div>
          <div className='bg-blue-400'></div>
        </div>
        <GameBoardContainer />
        <button className='float-none bg-indigo-100 w-16 h-16 bg-arrow-left bg-no-repeat bg-center bg-contain shadow-lg hover:bg-indigo-200' onClick={backBtnClickHandler}></button>
      </div>
    );

    return boardGameUI;
  }


  return (
    <div></div>
  );
}

ReactDOM.render(
  <MatchInfoProvider>
    <App/>
  </MatchInfoProvider>, 
  document.getElementById('root'));
