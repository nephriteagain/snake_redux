import { useAppSelector, useAppDispatch } from "./hooks/hooks"
import { startGame, changeDirection, restartGame, moveSnake } from "./features/gameSlice"
import { useEffect } from 'react'

function App() {
  
  const gameState = useAppSelector(state => state.game)
  const gameBoard = gameState.board
  const speed = gameState.speed
  const started = gameState.gameStart

  
  const dispatch = useAppDispatch()

  function gameStart() {
    dispatch(startGame())
    setInterval(() => {
      dispatch(moveSnake())
    }, 1000/ speed)
  }
  

  function handleKeyPress(e: KeyboardEvent) {
    console.log(e.key)
    dispatch(changeDirection({key: e.key}))
  }

  useEffect(() => {
    document.addEventListener('keyup', handleKeyPress);

    return () => {
      document.removeEventListener('keyup', handleKeyPress);
    };
  }, [])
  

  return (
    <div>
      <div>
        <button onClick={gameStart}
          disabled={started === true}
        >
          Start Game
        </button>
        <button onClick={() => dispatch(restartGame())}>
          Restart Game
        </button>
      </div>
      <div className="grid grid-cols-10 max-w-[500px] aspect-square border border-black">
        {gameBoard.map((item, index) => {
          return (
            <div key={index}
              className="border border-black min-w-[32px] aspect-square "
            >
              {item}
            </div>
          )
        })}
    </div>
   </div>
  )
}

export default App
