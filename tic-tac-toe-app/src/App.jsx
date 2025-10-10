import { useState } from "react";


function Square({ value, onSquareClick, winningLine, index }) {
  const isWinning = winningLine && winningLine.includes(index);
  
  return (
    <button 
      className={`square ${isWinning ? 'winning' : ''}`} 
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}


function Board({ xIsNext, c_squares, onPlay }) {

  const winnerInfo = calculateWinner(c_squares); // ← här!
  const isDraw = !winnerInfo.player && c_squares.every(square => square !== null);

  function HandleClick(i) {
    if (c_squares[i] || winnerInfo.player || isDraw) return;

    const tempSquares = c_squares.slice();
    tempSquares[i] = xIsNext ? "X" : "O";

    onPlay(tempSquares, i);
  }

  
  

  let status;
  if (winnerInfo.player) {
    status = "The winner is " + winnerInfo.player;
  } else {
    const nextPlayer = xIsNext ? "X" : "O";
    status = "Next is " + nextPlayer;
  }

const boardRows = Array(3).fill(null).map((_, i) => {
  const squaresInRow = Array(3).fill(null).map((_, j) => {
    const index = i * 3 + j;
    return <Square  value={c_squares[index]} 
                    onSquareClick={() => HandleClick(index)}  
                    winningLine = {winnerInfo.line} 
                    index = {index}/>;
  });

  return (
    <div className="board-row" key={i}>
      {squaresInRow}
    </div>
  );
});

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

//////////
function CurrentMoveIndicator({ currentMove }) {
  return (
    <p className="current-move-badge">
      {currentMove === 0 ? "You are at game start" : `You are at move #${currentMove}`}
    </p>
  );
}


function MovesList({ history, jumpTo, isAscending}) {
  const moves1 = history.map((element, index) => {
    const description = index > 0 
      ? "Go to move #" + index 
      : "Go to game start";

    const position = element.location;
    const positionText = position 
  ? `(${position.row}, ${position.col})` 
  : '';
    
    return (
      <li key={index}>
        <button onClick={() => jumpTo(index)}>
                    {description} {positionText}
        </button>
      </li>
    );
  });

  const moves = isAscending ? moves1 : moves1.slice().reverse();

  return <><ul>{moves}</ul> </>; 
}

function AscendingButton({isAscending, setIsAscending}) {
  return (
    <button className="ascend-button" onClick={() => setIsAscending(!isAscending)}>
      {isAscending ? "Descending" : "Ascending"}
    </button>
  );
}

function ResetButton({ onReset }) {
  return (
    <button onClick={onReset}>
      Start New Game
    </button>
  );
}

export default function Game() {
  const [history, setHistory] = useState([
  {
    squares: Array(9).fill(null),
    location: null
  }
]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove].squares;
  const xIsNext = currentMove % 2 === 0;
  const [isAscending, setIsAscending] = useState(true);

  console.log(history)
 
  function handlePlay(nextSquares, index) {
    const row = Math.floor(index / 3)
    const col = index % 3
    const nextHistory = [...history.slice(0, currentMove + 1), {squares:nextSquares, location:{row,col}  }];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

 
  return (
    <div className="game">
      <div className="reset-button-container">
        <ResetButton onReset={() => {
          setHistory([{squares: Array(9).fill(null), location: null}]);
          setCurrentMove(0);
          setIsAscending(true);
        }} />
      </div>
      <div className="ascend-button-container">
        <AscendingButton isAscending={isAscending} setIsAscending={setIsAscending} />
      </div>
      <div className="move-indicator-container">
        <CurrentMoveIndicator currentMove={currentMove} />
      </div>
      <div className="game-board">
      
        <Board
          xIsNext={xIsNext} 
          c_squares={currentSquares} 
          onPlay={handlePlay} 
        />
      </div>
      <div className="game-info">
        <MovesList history={history} jumpTo={jumpTo} isAscending={isAscending} />
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      
      return( {player: squares[a],line: lines[i]});
    }
  }
  return( {player: null, line: null});
}
