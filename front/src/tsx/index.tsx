import { useState } from 'react';
import * as ReactDOM from 'react-dom';
import "../css/output.css";

type ClientState = "initial" | "openMatch" | "joinMatch";

const RootView = () => {
  const title = (
    <div className="container flex-initial bg-green-200 mx-auto h-1/3 flex items-center justify-center">
      <h1 className="text-6xl font-bold text-center">minosynth</h1>
    </div>
  );

  const [clientState, setClientState] = useState<ClientState>("initial");

  let content;

  if (clientState === "initial") {
    const openMatchBtnClickHandler = () => {
      setClientState("openMatch");
    }

    const joinMatchBtnClickHandler = () => {
      setClientState("joinMatch");
    }

    content = (
      <div className="container mx-auto flex flex-col h-2/3 gap-y-8 items-center">
        <button className="text-2xl w-96 bg-indigo-100 shadow-lg hover:bg-indigo-200 mt-20" onClick={openMatchBtnClickHandler}>ゲームを始める</button>
        <button className="text-2xl w-96 bg-indigo-100 shadow-lg hover:bg-indigo-200" onClick={joinMatchBtnClickHandler}>ゲームに参加する</button>
      </div>
    );
  }
  if (clientState === "joinMatch") {
    const backBtnClickHandler = () => {
      setClientState("initial");
    }

    content = (
      <div className="container mx-auto h-2/3 items-center">
        <form className="shadow-md">
          <label className="block text-gray-700 text-sm font-bold">マッチID</label>
          <input type="text" name="match-id" value="" placeholder="マッチID"></input>
        </form>

        <button className="bg-indigo-100 w-16 h-16 bg-arrow-left bg-no-repeat bg-center bg-contain shadow-lg hover:bg-indigo-200" onClick={backBtnClickHandler}></button>
      </div>
    )
  }
  if (clientState === "openMatch") {
    const backBtnClickHandler = () => {
      setClientState("initial");
    }

    content = (
      <div className="container mx-auto h-2/3 items-center">
        <h2 className="text-2xl text-center font-bold mt-20">ここにマッチIDが入る</h2>

        <button className="bg-indigo-100 w-16 h-16 bg-arrow-left bg-no-repeat bg-center bg-contain shadow-lg hover:bg-indigo-200" onClick={backBtnClickHandler}></button>
      </div>
    )
  }


  return (
    <div className="h-screen">
      {title}
      {content}
    </div>
  );
}

ReactDOM.render(<RootView />, document.getElementById('root'));