import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GAME_ARR, SNAKE_ARR, SNAKE_HEAD, WALL_BOTTOM, WALL_LEFT, WALL_RIGHT, WALL_TOP } from "../data/gameData";

type direction = 'right'|'left'|'top'|'bottom'

interface initialState {
  board: string[]
  snakeBody: number[]
  snakeHead: number
  gameStart: boolean
  direction: direction
  speed: number
  disableSwitchDirection: boolean
  food: number
  score: number,
  collided: boolean
}

interface ChangeDirectionPayload {
  key: string;
}

interface adjustSpeedPayload {
  speed: string
}



const initialBoardState : string[] = GAME_ARR.map((item, index) => {
  if (SNAKE_HEAD === index) {
    return 'h'
  }
  const snakeBit = SNAKE_ARR.find(bod => bod === index)
  if (snakeBit === index) {
    return 's'
  }

  return item
})



function getRandomNumberWithoutExclusions(exclusions : number[]) {
  const excludedSet = new Set(exclusions);
  let randomNumber;
  
  do {
    randomNumber = Math.floor(Math.random() * 100);
  } while (excludedSet.has(randomNumber));
  
  return randomNumber;
}


function extendBody(newBody: number[], copyBody: number[]) {
  newBody.push(copyBody[copyBody.length - 1])
}

function selfCollision(snakeHead: number, snakeBody: number[]) {
  const collided = snakeBody.some(bod => bod === snakeHead)

  if (collided) {
    return true
  }
  return false
}

function wallCollision(snakeHead: number, direction: direction) {
  if (direction === 'right') {
    return WALL_RIGHT.some(wall => wall === snakeHead)
  }
  else if (direction === 'left') {
    return WALL_LEFT.some(wall => wall === snakeHead)
  }
  else if (direction === 'top') {
    return WALL_TOP.some(wall => wall === snakeHead)
  }
  else if (direction === 'bottom') {
    return WALL_BOTTOM.some(wall => wall === snakeHead)
  }
  else {
    return false
  }
}

const savedSpeed = Number(localStorage.getItem('snake_speed'))

const initialState : initialState = {
  board: initialBoardState,
  snakeBody: SNAKE_ARR,
  snakeHead: SNAKE_HEAD,
  gameStart: false,
  direction: 'right',
  speed: savedSpeed || 2,
  disableSwitchDirection: false,
  food: getRandomNumberWithoutExclusions([...SNAKE_ARR, SNAKE_HEAD]),
  score: 0,
  collided: false

}


export const gameSlice = createSlice({
  name: 'game',
  initialState: initialState,
  reducers: {
    moveSnake: (state) => {

      if (!state.gameStart) {
        return  
      }


      const selfCollided = selfCollision(state.snakeHead, state.snakeBody)
      if (selfCollided) {
        state.gameStart = false
        state.collided = true
        return
      }
      const wallCollided = wallCollision(state.snakeHead, state.direction)
      if (wallCollided) {
        state.gameStart = false
        state.collided = true
        return
      }

      const snakeBodyCopy = [...state.snakeBody]
      const newSnakeBody = snakeBodyCopy.map((item, index) => {
        if (item === snakeBodyCopy[0]) {
          return state.snakeHead
        }
        return snakeBodyCopy[index - 1]

      })
      
      function directionNum(direction: direction) {
        if (direction === 'right') return 1
        else if (direction === 'left') return -1
        else if (direction === 'top') return -10
        else if (direction === 'bottom') return 10
        else return 1
      }
      const direction = directionNum(state.direction)


        let snakePos : number = state.snakeHead
        const boardCopy = state.board.map((_, index) => {
            if (state.snakeHead === state.food) {
              state.food = getRandomNumberWithoutExclusions([...state.snakeBody, state.snakeHead])
              extendBody(newSnakeBody, snakeBodyCopy)
              state.score++
            }   
            if (state.snakeHead + direction === index) {
              snakePos = index
              return 'h'
            }
            
            if (state.food === index) {
              return 'O'
            } 
            
            const snakeBod = newSnakeBody.find(item => item === index)
            if (snakeBod === index) {
              return 's'
            }
            return '' 
        })               
        
          state.snakeBody = newSnakeBody
          state.snakeHead = snakePos
          state.board = boardCopy
      

      state.disableSwitchDirection = false
    
    },
    changeDirection: (state, action : PayloadAction<ChangeDirectionPayload>) => {      
      if (!state.gameStart || state.disableSwitchDirection) {
        return
      }
      
      else if ((
        action.payload.key === 'w' || action.payload.key === 'W') 
        && state.direction !== 'top' && state.direction !== 'bottom'
      ) {
        state.direction = 'top'
      }
      else if ((
        action.payload.key === 'a' || action.payload.key === 'A') 
        && state.direction !== 'left' && state.direction !== 'right'
      ) {
        state.direction = 'left'
      }
      else if ((
        action.payload.key === 's' || action.payload.key === 'S') 
        && state.direction !== 'bottom' && state.direction !== 'top'
      ) {
        state.direction = 'bottom'
      }
      else if ((
        action.payload.key === 'd' || action.payload.key === 'D') 
        && state.direction !== 'right' && state.direction !== 'left'
      ) {
        state.direction = 'right'
      }

      state.disableSwitchDirection = true
    },

    restartGame: (state) => {
      return {...initialState, speed: state.speed}
    },
    startGame: state => {
      state.gameStart = true
    },
    adjustSpeed: (state, action: PayloadAction<adjustSpeedPayload>) => {
      state.speed = Number(action.payload.speed)
      localStorage.setItem('snake_speed', action.payload.speed)
    }

  }

})

export const { moveSnake, changeDirection, restartGame, startGame, adjustSpeed } = gameSlice.actions

export default gameSlice.reducer
