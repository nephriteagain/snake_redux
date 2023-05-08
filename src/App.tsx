import { useAppSelector, useAppDispatch } from "./hooks/hooks"
import { startGame, changeDirection, restartGame, moveSnake, adjustSpeed } from "./features/gameSlice"
import { useEffect, useRef, useLayoutEffect, useState } from 'react'

import { SPEED_OPTIONS } from "./data/gameData"
import { snakeBody } from "./helper"

function App() {
  const [speedOptions, setSpeedOptions] = useState(SPEED_OPTIONS)  

  const gameState = useAppSelector(state => state.game)
  const gameBoard = gameState.board
  const speed = gameState.speed
  const started = gameState.gameStart
  const score = gameState.score
  const direction = gameState.direction
  const collided = gameState.collided

  
  const dispatch = useAppDispatch()

  const intervalRef : any = useRef(null)
  const snakeRef : any = useRef(null)

  function gameStart() {
    dispatch(startGame())    
    intervalRef.current = setInterval(() => {
      dispatch(moveSnake())
    }, 1000/ speed)
  }

  
  

  function handleKeyPress(e: KeyboardEvent) {
    dispatch(changeDirection({key: e.key}))
  }

  useEffect(() => {
    if (collided) {
      alert(`game over, your score is ${score}`)
    }
  },[collided])

  useEffect(() => {
    document.addEventListener('keyup', handleKeyPress);
    return () => {
      document.removeEventListener('keyup', handleKeyPress);
    };
  }, [])
  
  useEffect(() => {
    if (!started) {
      clearInterval(intervalRef.current)
      intervalRef.current = null      
    }
  }, [started])

  useLayoutEffect(() => {
    if (direction === 'right') {
      snakeRef.current.style.transform = 'rotate(0deg)'
    }
    else if (direction === 'bottom') {
      snakeRef.current.style.transform = 'rotate(90deg)'
    }
    else if (direction === 'left') {
      snakeRef.current.style.transform = 'rotate(180deg)'
    }
    else if (direction === 'top') {
      snakeRef.current.style.transform = 'rotate(270deg)'
    }
  }, [gameBoard, direction])

  return (
    <div>
      <div className="flex">
        <button onClick={gameStart}
          disabled={started === true}
          className=" px-2 py-1 bg-blue-300 me-3 rounded-md shadow-lg drop-shadow-md disabled:opacity-50 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          Start Game
        </button>
        <button onClick={() => dispatch(restartGame())}

          className=" px-2 py-1 bg-red-300 me-3 rounded-md shadow-lg drop-shadow-md disabled:opacity-50 hover:scale-105 active:scale-95 transition-all duration-200"

        >
          Restart Game
        </button>
        
        <select
          defaultValue={speed}
          disabled={started === true}
          onChange={(e) => dispatch(adjustSpeed({speed: e.currentTarget.value}))}
          className="bg-green-200 px-2 py-1 me-auto rounded-md shadow-md drop-shadow-md hover:bg-green-300 active:scale-95  disabled:opacity-60 transition-all duration-200"
        >
          {speedOptions.map((item) => {
            return (
              <option value={item} key={item}                
              >
                {item}
              </option>
            )
          })}          
        </select>

        <div className="px-2 py-1 bg-blue-200 rounded-md shadow-md drop-shadow-md hover:scale-105 transition-all duration-200">
          score: {score}
        </div>
      </div>
      <div className="mt-10 grid grid-cols-10 max-w-[500px] aspect-square shadow-lg drop-shadow-md grass">
        {gameBoard.map((item, index) => {
          if (item === 'h') {
            return (
              <div key={index}
                className="min-w-[32px] aspect-square snake-head"
                style={snakeBody(item, index)}
                ref={snakeRef}
              >
  
              </div>
            )
          }
          return (
            <div key={index}
              className="min-w-[32px] aspect-square"
              style={snakeBody(item, index)}
            >

            </div>
          )
        })}
    </div>
   </div>
  )
}

export default App
