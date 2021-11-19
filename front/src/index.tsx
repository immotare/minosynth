import * as ReactDOM from 'react-dom';
import {Board} from './tsx/board';
import {useState} from 'react';

function GameBoardUI() {
  const [minoShape, setMinoShape] = useState('+');

  const crossMinoSelectHandler = () => {
    setMinoShape('+');
  };
  
  const lMinoSelectHandler = () => {
    setMinoShape('L');
  };

  return (
    <div className="game-board-ui">
      {Board(minoShape)}
      <button onClick={crossMinoSelectHandler}>+</button>
      <button onClick={lMinoSelectHandler}>L</button>
    </div>
  );
}

ReactDOM.render(<GameBoardUI />, document.getElementById('root'));