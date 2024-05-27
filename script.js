if (!confirm('Do you want to play a game?')) throw new Error('Game cancelled')

main()

async function main() {
  let state = await loadPrevState()
  
  while (Infinity) {
    await playGame(state)
    state = null
  }
}

async function playGame(state) {
  state ||= await startGame()

  try {
    while (Infinity) {
      state = await play(state)

      await saveState(state)
    }
  } catch (err) {
    if (err instanceof Error) throw err

    state = err
  }

  await endGame(state)

  await saveState(null)
}

async function startGame() {
  const score = parseInt(prompt('Enter the starting score:'))

  if (!(score > 0)) throw new RangeError('Invalid score')
  
  return { score, history: [`${score}`]}
}

async function play({ score, history: [...history] }) {
  let shift = parseInt(prompt(`Score: ${score}\n\nWhat's next?`))
  
  score += shift

  if (shift > 0) shift = '+' + shift

  history.push(shift)
  
  if (score <= 0) throw { score, history }

  if (isNaN(score)) throw new RangeError('Corrupted score')

  return { score, history }
}

async function endGame({ score, history }) {
  alert(`Game over!\n\nFinal score: ${score}\n\nHistory:\n${history.join('\n')}`)
}

async function loadPrevState() {
  return JSON.parse(localStorage.getItem('state') || 'null')
}

async function saveState(state) {
  localStorage.setItem('state', JSON.stringify(state))
}
