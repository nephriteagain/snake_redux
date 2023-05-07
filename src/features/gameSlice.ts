import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GAME_ARR, SNAKE_ARR, SNAKE_HEAD } from "../data/gameData";

interface initialState {
  board: string[],
  snakeBody: number[],
  snakeHead: number,
  gameStart: boolean
  direction: ('right'|'left'|'top'|'bottom')
  speed: number,
  disableSwitchDirection: boolean
}

interface ChangeDirectionPayload {
  key: string;
}


const initialBoardState : string[] = GAME_ARR.map((item, index) => {
  if (SNAKE_HEAD === index) {
    return 'h'
  }

  
  return item
})




const initialState : initialState = {
  board: initialBoardState,
  snakeBody: SNAKE_ARR,
  snakeHead: SNAKE_HEAD,
  gameStart: false,
  direction: 'right',
  speed: 2,
  disableSwitchDirection: false

}


export const gameSlice = createSlice({
  name: 'game',
  initialState: initialState,
  reducers: {
    moveSnake: (state) => {

      if (!state.gameStart) {
        return  
      }
      
      if (state.direction === 'right') {
        let snakePos : number = state.snakeHead
        const boardCopy = state.board.map((_, index) => {
            if (state.snakeHead + 1 === index) {
              snakePos = index
              return 'h'
            }
            return ''
        })                          
          state.snakeHead = snakePos
          state.board = boardCopy
      } 
      else if (state.direction === 'left') {
        let snakePos : number = state.snakeHead
        const boardCopy = state.board.map((_, index) => {
            if (state.snakeHead - 1 === index) {
              snakePos = index
              return 'h'
            }
            return ''
        })                          
          state.snakeHead = snakePos
          state.board = boardCopy
      } 
      else if (state.direction === 'top') {
        let snakePos : number = state.snakeHead
        const boardCopy = state.board.map((_, index) => {
            if (state.snakeHead - 10 === index) {
              snakePos = index
              return 'h'
            }
            return ''
        })                          
          state.snakeHead = snakePos
          state.board = boardCopy
      } 
      else if (state.direction === 'bottom') {
        let snakePos : number = state.snakeHead
        const boardCopy = state.board.map((_, index) => {
            if (state.snakeHead + 10 === index) {
              snakePos = index
              return 'h'
            }
            return ''
        })                          
          state.snakeHead = snakePos
          state.board = boardCopy
      } 
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
