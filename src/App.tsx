import { useAppSelector, useAppDispatch } from "./hooks/hooks"
import { startGame, changeDirection, restartGame, moveSnake, adjustSpeed } from "./features/gameSlice"
import { useEffect, useRef, useLayoutEffect } from 'react'



function App() {
  
  const gameState = useAppSelector(state => state.game)
  const gameBoard = gameState.board
  const speed = gameState.speed
  const started = gameState.gameStart
  const score = gameState.score
  const direction = gameState.direction

  
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

  function snakeBody(item: string, index: number) {
    const isOdd = index % 2 === 0

    if (item === 's' && isOdd) {
      return {
        backgroundColor: '#F1C40F'
      }
    }
    else if (item === 's' && !isOdd) {
      return {
        backgroundColor: '#F7DC6F'
      }
    }
    else if (item === 'h') {
      return {
        backgroundColor: '#F5B041'
      }
    }

    else if (item === 'O') {
      return {
        backgroundColor: '#f6546a',
        borderRadius: '50%',
      }
    }
    else return {      
    }
  }


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
      console.log('game over')
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
  }, [gameBoard])

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
        
        <select defaultValue={2}
          disabled={started === true}
          onChange={(e) => dispatch(adjustSpeed({speed: e.currentTarget.value}))}
          className="bg-green-200 px-2 py-1 me-auto rounded-md shadow-md drop-shadow-md hover:bg-green-300 active:scale-95  disabled:opacity-60 transition-all duration-200"
        >
          <option value={2}>
            2
          </option>
          <option value={3}>
            3
          </option>
          <option value={4}>
            4
          </option>
          <option value={5}>
            5
          </option>
          <option value={6}>
            6
          </option>
          <option value={7}>
            7
          </option>
          <option value={8}>
            8
          </option>
          <option value={9}>
            9
          </option>
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
