main()

async function main() {
  let data = await loadData(data) || await startNewGame()

  do {
    const activity = await getActivity()

    activities.push(activity)

    var choice = await getChoice('Add another activity', 'Take a quest')

  } while (choice === 'Add another activity')

  console.log(activities)
}

async function getChoice(...options) {
  const menu = await makeMenu(...options)

  show(menu)

  do {
    var event = await trigger(menu, 'click')

  } while (!options.includes(event.target.textContent))

  return event.target.textContent
}

async function makeMenu(...options) {
  const menu = document.createElement('menu')

  menu.innerHTML = options.map(
    option => `<button>${option}</button>`
  ).join('')

  menu.style = `
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 300px;
    margin: 0 auto;
  `

  return menu
}

async function getActivity() {
  const form = await makeNewActivityForm()

  show(form)

  do {
    await trigger(form, 'submit')

    var activity = {}

    activity.id = await getNewId()
    activity.name = await getActivityName(form)
    activity.difficulty = await getActivityDifficulty(form)
    activity.amount = await getActivityAmount(form)

  } while (!await isValidActivity(activity))

  return activity
}

function makeNewActivityForm() {
  const form = document.createElement('form')

  form.innerHTML = `
    <h2>Add a new activity</h2>
    <input type="text" name="name" placeholder="Name of the activity" required>
    <input type="number" name="difficulty" placeholder="Difficulty (1 - 10)" required>
    <input type="text" name="amount" placeholder="Amount (number with units like 5 laps)" required>
    <button type="submit">Add Activity</button>
  `

  form.style = `
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 300px;
    margin: 0 auto;
  `

  return form
}

function show(element) {
  document.body.replaceChildren(element)
}

async function trigger(element, event) {
  return new Promise(resolve => {
    element[`on${event}`] = e => (e.preventDefault(), resolve(e))
  })
}

async function getActivityName(form) {
  return form.elements.name.value
}

async function getActivityDifficulty(form) {
  return parseInt(form.elements.difficulty.value)
}

async function getActivityAmount(form) {
  return form.elements.amount.value
}

async function isValidActivity(activity) {
  let valid = true

  if (!activity.name) valid = false

  if (
    !activity.difficulty
    || activity.difficulty < 1
    || activity.difficulty > 10
    || !Number.isInteger(activity.difficulty)
  ) valid = false

  if (!activity.amount.match(/^\d+\D+$/)) valid = false

  return valid
}

async function makeActivity(genId, name, difficulty, amount) {
  const activity = {}

  activity.id = await genId()
  activity.name = name
  activity.difficulty = difficulty
  activity.amount = amount

  return activity
}

function getNewId() {
  return Math.floor(Math.random() * 1e9)
}

function getInitialConfidence() {
  do {
    var confidence = prompt('What is your confidence level in general (2 - 10)?')

    confidence = parseInt(confidence)

  } while (!confidence || confidence < 2 || confidence > 10)

  return confidence
}

/* obsolete */
() => {

  function getActivityName() {
    debugger
    do {
      var name = prompt('Name your new activity?')
    } while (!name)
  
    return name
  }
  
  function getActivityDifficulty() {
    do {
      var difficulty = prompt('Estimate the difficulty of the activity (1 - 10)?')
  
      difficulty = parseInt(difficulty)
    } while (!difficulty || difficulty < 1 || difficulty > 10)
  
    return difficulty
  }
  
  function getActivityAmount() {
    do {
      var amount = prompt('Decide the amount of the activity (number with units like 5 laps)')
    } while (!amount.match(/^\d+\D+$/))
  
    return amount
  }
  
}
