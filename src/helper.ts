export function snakeBody(item: string, index: number) {
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
  else return {}
}