import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GAME_ARR, SNAKE_ARR, SNAKE_HEAD, WALL_BOTTOM, WALL_LEFT, WALL_RIGHT, WALL_TOP } from "../data/gameData";

type direction = 'right'|'left'|'top'|'bottom'

interface initialState {
  board: string[],
  snakeBody: number[],
  snakeHead: number,
  gameStart: boolean
  direction: direction
  speed: number,
  disableSwitchDirection: boolean,
  food: number
}

interface ChangeDirectionPayload {
  key: string;
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

function spawnFood(snakeHead : number, snakeBody: number[]) {
  function random() {
    return Math.floor(Math.random() * 100)
  }
  const random_number : number = random() 
  const hasMatch = snakeBody.some(bod => bod === random_number)
  const isMatch = random_number === snakeHead
  if (hasMatch || isMatch) {
    spawnFood(snakeHead, snakeBody)
  }

  return random_number
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


const initialState : initialState = {
  board: initialBoardState,
  snakeBody: SNAKE_ARR,
  snakeHead: SNAKE_HEAD,
  gameStart: false,
  direction: 'right',
  speed: 2,
  disableSwitchDirection: false,
  food: spawnFood(SNAKE_HEAD, SNAKE_ARR)

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
        return
      }
      const wallCollided = wallCollision(state.snakeHead, state.direction)
      if (wallCollided) {
        state.gameStart = false
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
              state.food = spawnFood(state.snakeHead, state.snakeBody)
              extendBody(newSnakeBody, snakeBodyCopy)
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

    restartGame: () => {
      return initialState
    },
    startGame: state => {
      state.gameStart = true
    }

  }

})

export const { moveSnake, changeDirection, restartGame, startGame } = gameSlice.actions

export default gameSlice.reducer
