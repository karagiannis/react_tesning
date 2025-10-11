import { useState, useEffect } from "react";

// Deploy test
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
    return <Square  key ={index}
                     value={c_squares[index]} 
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

//////////////////////////////////////////////////////////////
export default function Game() {
  const [history, setHistory] = useState([]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isAscending, setIsAscending] = useState(true);

  // Hämta spelet från servern vid första render
  useEffect(() => {
    fetch("/tic-tac-toe-api/api/game")
      .then(res => res.json())
      .then(data => {
        setHistory(data.history);
        setCurrentMove(data.currentMove);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load game:", err);
        // Starta nytt spel om hämtning misslyckas
        const initialGame = { history: [{ squares: Array(9).fill(null), location: null }], currentMove: 0 };
        setHistory(initialGame.history);
        setCurrentMove(initialGame.currentMove);
        setIsLoading(false);
      });
  }, []);

  const currentSquares = history[currentMove]?.squares || Array(9).fill(null);
  const xIsNext = currentMove % 2 === 0;

  function handlePlay(nextSquares, index) {
    const row = Math.floor(index / 3);
    const col = index % 3;
    const nextHistory = [...history.slice(0, currentMove + 1), { squares: nextSquares, location: { row, col } }];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);

    // Spara till servern
    fetch("/tic-tac-toe-api/api/game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        history: nextHistory,
        currentMove: nextHistory.length - 1
      })
    })
    .catch(err => console.error("Failed to save game:", err));
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);

    // Spara till servern
    fetch("/tic-tac-toe-api/api/game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        history,
        currentMove: nextMove
      })
    })
    .catch(err => console.error("Failed to save game:", err));
  }

  function resetGame() {
    const initialGame = { history: [{ squares: Array(9).fill(null), location: null }], currentMove: 0 };
    setHistory(initialGame.history);
    setCurrentMove(initialGame.currentMove);
    setIsAscending(true);

    // Spara till servern
    fetch("/tic-tac-toe-api/api/game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(initialGame)
    })
    .catch(err => console.error("Failed to reset game:", err));
  }

  if (isLoading) {
    return <div>Loading game...</div>;
  }

  return (
    <div className="game">
      <div className="reset-button-container">
        <ResetButton onReset={resetGame} />
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
