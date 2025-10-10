import { useState } from "react";


function Square({ value, onSquareClick }) {

  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}


function Board({ xIsNext, c_squares, onPlay }) {

  function HandleClick(i) {
    if (c_squares[i] || calculateWinner(c_squares)) return;

    const tempSquares = c_squares.slice();
    tempSquares[i] = xIsNext ? "X" : "O";

    onPlay(tempSquares);
  }

  
  const winner = calculateWinner(c_squares);

  let status;
  if (winner) {
    status = "The winner is " + winner;
  } else {
    const nextPlayer = xIsNext ? "X" : "O";
    status = "Next is " + nextPlayer;
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={c_squares[0]} onSquareClick={() => HandleClick(0)} />
        <Square value={c_squares[1]} onSquareClick={() => HandleClick(1)} />
        <Square value={c_squares[2]} onSquareClick={() => HandleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={c_squares[3]} onSquareClick={() => HandleClick(3)} />
        <Square value={c_squares[4]} onSquareClick={() => HandleClick(4)} />
        <Square value={c_squares[5]} onSquareClick={() => HandleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={c_squares[6]} onSquareClick={() => HandleClick(6)} />
        <Square value={c_squares[7]} onSquareClick={() => HandleClick(7)} />
        <Square value={c_squares[8]} onSquareClick={() => HandleClick(8)} />
      </div>
    </>
  );
}

function CurrentMoveIndicator({ currentMove }) {
  return (
    <p className="current-move-badge">
      {currentMove === 0 ? "You are at game start" : `You are at move #${currentMove}`}
    </p>
  );
}


function MovesList({ history, jumpTo }) {
  const moves = history.map((element, index) => {
    const description = index > 0 
      ? "Go to move #" + index 
      : "Go to game start";
    
    return (
      <li key={index}>
        <button onClick={() => jumpTo(index)}>{description}</button>
      </li>
    );
  });

  return <><ol>{moves}</ol> </>; 
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

 
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

 
  return (
    <div className="game">
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
        <MovesList history={history} jumpTo={jumpTo} />
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
      return squares[a];
    }
  }
  return null;
}
