import { useState } from "react";

// --- Square.jsx ---

/**
 * Square-komponenten är en "presentational" eller "dumb" komponent.
 * Den visar ett värde ('value') och anropar en funktion ('onSquareClick')
 * när den klickas på. Den hanterar inget eget tillstånd (state).
 * @param {Object} props - Objektet som innehåller props som skickas till komponenten.
 * @param {string | null} props.value - Värdet som ska visas i rutan ('X', 'O', eller null).
 * @param {Function} props.onSquareClick - Funktionen som anropas när rutan klickas på.
 */
function Square({ value, onSquareClick }) {
  // Komponenten tar emot 'props' som argument.
  // Inget lokalt state används här; allt tillstånd hanteras av en förälderkomponent.

  return (
    // onClick-prop på button-elementet är en inbyggd DOM-händelse.
    // När användaren klickar, anropas funktionen 'onSquareClick' som skickades som prop.
    <button className="square" onClick={onSquareClick}>
      {/* Visar värdet som skickades som prop */}
      {value}
    </button>
  );
}

// --- Board.jsx ---

/**
 * Board-komponenten är en mellanliggande komponent ("smart" eller "container" komponent).
 * Den hanterar logiken för ett spelbräde med 9 rutor.
 * Den tar emot nödvändigt tillstånd och callbacks från sin förälder (Game).
 * Den skickar ner enkla värden och callback-funktioner till Square-komponenterna.
 * @param {Object} props - Objektet som innehåller props som skickas till komponenten.
 * @param {boolean} props.xIsNext - Anger om det är 'X':s tur.
 * @param {Array<(string|null)>} props.c_squares - En array med 9 element som representerar brädets tillstånd.
 * @param {Function} props.onPlay - Callback-funktion som anropas när ett drag görs.
 */
function Board({ xIsNext, c_squares, onPlay }) {
  // Komponenten tar emot 'props' som argument.
  // Inget lokalt state definieras här; det hanteras av föräldern 'Game'.

  /**
   * Hanterar klick på en ruta.
   * Den här funktionen är en "event handler" som körs när en Square klickas på.
   * Den uppdaterar brädets tillstånd och anropar förälderns callback.
   * @param {number} i - Index för den ruta som klickades på (0-8).
   */
  function HandleClick(i) {
    // 'Guard clause': Om rutan redan har ett värde eller om det finns en vinnare, gör ingenting.
    if (c_squares[i] || calculateWinner(c_squares)) return;

    // Skapar en kopia av 'c_squares'-arrayen för att undvika att mutera den ursprungliga.
    // Detta är viktigt i React för att säkerställa korrekt rendering och undvika biverkningar.
    const tempSquares = c_squares.slice();
    // Bestämmer vilket värde som ska sättas baserat på 'xIsNext'.
    tempSquares[i] = xIsNext ? "X" : "O";

    // Anropar 'onPlay'-callbacken som skickades från föräldern (Game)
    // och skickar med det uppdaterade brädets tillstånd.
    onPlay(tempSquares);
  }

  // --- Intern logik för att beräkna status ---

  // Anropar hjälpfunktionen för att se om någon har vunnit.
  const winner = calculateWinner(c_squares);

  // Beräknar statusmeddelandet som ska visas.
  let status;
  if (winner) {
    status = "The winner is " + winner;
  } else {
    // Använder 'xIsNext' för att bestämma nästa spelare.
    const nextPlayer = xIsNext ? "X" : "O";
    status = "Next is " + nextPlayer;
  }
  // --- Slut på intern logik ---

  return (
    <>
      {/* Visar statusmeddelandet */}
      <div className="status">{status}</div>
      <div className="board-row">
        {/* Skapar 9 Square-komponenter och skickar ner värden och callbacks som props. */}
        {/* Arrow functions används för att skapa anonyma funktioner som binder index 'i'. */}
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

// --- Game.jsx ---

/**
 * Game-komponenten är rotkomponenten och ansvarar för allt applikationstillstånd (state).
 * Den implementerar "lyfta state upp"-mönstret för Board och Square.
 * Den hanterar spelets historik och vilket drag som är aktivt.
 */
export default function Game() {
  // --- State Definition ---
  // 'useState' hook används för att deklarera och hantera komponentens tillstånd.
  // 'history' är en array av brädetillstånd. Initialt ett tomt bräde.
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // 'currentMove' håller reda på vilket index i 'history' som är det aktuella tillståndet.
  const [currentMove, setCurrentMove] = useState(0);
  // --- Härledda värden (Derived State) ---
  // Dessa värden beräknas varje gång komponenten renderas baserat på 'state'.
  // 'currentSquares' är brädets tillstånd vid det aktuella draget.
  const currentSquares = history[currentMove];
  // 'xIsNext' beräknas från 'currentMove'. Jämnt tal = X:s tur.
  const xIsNext = currentMove % 2 === 0;

  // --- Event Handlers (Callbacks) ---

  /**
   * Hanterar ett spel drag.
   * Denna funktion är en callback som skickas till Board.
   * Den uppdaterar spelets historik och vilket drag som är aktivt.
   * @param {Array<(string|null)>} nextSquares - Det nya brädetillståndet efter draget.
   */
  function handlePlay(nextSquares) {
    // Skapar en ny historik-array som klipper bort framtida drag om man går tillbaka i historiken.
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    // Uppdaterar 'history'-statet med den nya historiken.
    setHistory(nextHistory);
    // Uppdaterar 'currentMove' till att peka på det senaste draget i den nya historiken.
    setCurrentMove(nextHistory.length - 1);
    // Notera: 'xIsNext' behöver inte uppdateras manuellt eftersom det beräknas från 'currentMove'.
  }

  /**
   * Hoppar till ett specifikt tidigare drag i spelet.
   * @param {number} nextMove - Indexet i 'history' att hoppa till.
   */
  function jumpTo(nextMove) {
    // Uppdaterar 'currentMove'-statet, vilket implicit ändrar 'currentSquares' och 'xIsNext'.
    setCurrentMove(nextMove);
    // Notera: 'xIsNext' uppdateras automatiskt vid nästa render eftersom det är härlett.
  }

  // --- Rendering Logic ---

  /**
   * Skapar en lista över knappar för att navigera i spelets historik.
   * Använder 'map' för att transformera 'history'-arrayen till en array av React-element.
   */
  const moves = history.map((element, index) => {
    let description;
    if (index > 0) {
      description = "Go to move #" + index;
    } else {
      description = "Go to game start";
    }
    return (
      // 'key' är ett särskilt React-attribut som hjälper till med att identifiera element i listor.
      // 'index' används här eftersom elementens ordning kan ändras, men det är inte optimalt.
      // Ett unikt ID för varje drag vore bättre om det fanns.
      <li key={index}>
        {/* onClick på knappen anropar 'jumpTo' med det aktuella indexet. */}
        <button onClick={() => jumpTo(index)}>{description}</button>
      </li>
    );
  });
  // --- Slut på Rendering Logic ---

  return (
    <div className="game">
      <div className="game-board">
        {/* Skickar ner 'state' och callbacks som props till Board-komponenten. */}
        <Board
          xIsNext={xIsNext} // 'Derived state' skickas ner.
          c_squares={currentSquares} // 'Derived state' skickas ner.
          onPlay={handlePlay} // Callback-funktionen skickas ner.
        />
      </div>
      <div className="game-info">
        {/* Renderar listan med historikknappar. */}
        <ol>{moves}</ol>
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
