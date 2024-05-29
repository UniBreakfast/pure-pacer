const lsKey = 'pure_pacer_game_state'

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

  await saveState(null)

  await endGame(state)
}

async function _startGame() {
  const confidence = parseInt(prompt('Enter the starting confidence:'))

  if (!(confidence > 0)) throw new RangeError('Invalid confidence')
  
  return { confidence, history: [`${confidence}`]}
}

async function startGame() {
  return new Promise(resolve => {
    const form = createEstimateConfidenceForm()

    show(form)

    form.onsubmit = e => {
      e.preventDefault()

      const state = { confidence: parseInt(form[0].value), history: [] }

      resolve(state)
    }
  })
}

function createEstimateConfidenceForm() {
  const form = document.createElement('form')

  form.innerHTML = `
    <label>Estimate your initial confidence at this point
      <select>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
      </select>
    </label>
    <button>Submit</button>
  `;

  form.style = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 1em;
    border: 1px solid;
  `;

  return form
}

function show(el) {
  document.body.replaceChildren(el)
}

async function play({ confidence, history: [...history] }) {
  // let shift = parseInt(prompt(`Confidence: ${confidence}\n\nWhat's next?`))
  let shift = await getNextShift(confidence)
  
  confidence += shift

  if (shift > 0) shift = '+' + shift

  history.push(shift)
  
  if (confidence <= 0) throw { confidence, history }

  if (isNaN(confidence)) throw new RangeError('Corrupted confidence')

  return { confidence, history }
}

async function getNextShift(confidence) {
  return new Promise(resolve => {
    const form = createShiftForm(confidence)

    show(form)

    form.onsubmit = e => {
      e.preventDefault()

      resolve(parseInt(form[0].value))
    }
  })
}

function createShiftForm(confidence) {
  const form = document.createElement('form')

  form.innerHTML = `
    <label>Confidence: ${confidence}.<br>What's next?
      <input type="number" value="0" required>
    </label>
    <button>Submit</button>
  `;

  form.style = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 1em;
    border: 1px solid;
  `;

  form[0].style = `
    width: 4em;
    text-align: center;
  `;

  return form
}

async function endGame({ confidence, history }) {
  // alert(`Game over!\n\nFinal confidence: ${confidence}\n\nHistory:\n${history.join('\n')}`)
  await showEndGameMessage(confidence, history)
}

async function showEndGameMessage(confidence, history) {
  return new Promise(resolve => {
    const form = createEndGameMessage(confidence, history)

    show(form)

    form.onsubmit = e => {
      e.preventDefault()

      resolve()
    }
  })
}

function createEndGameMessage(confidence, history) {
  const form = document.createElement('form')

  form.innerHTML = `
    <p>Game over!</p>
    <p>Final confidence: ${confidence}</p>
    <p>History:</p>
    <pre>${history.join('\n')}</pre>
    <button>OK</button>
  `;

  form.style = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 1em;
    border: 1px solid;
  `;

  return form
}

async function loadPrevState() {
  return JSON.parse(localStorage.getItem(lsKey) || 'null')
}

async function saveState(state) {
  localStorage.setItem(lsKey, JSON.stringify(state))
}
