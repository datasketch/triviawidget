function Trivia(config) {
  if (!config.el) {
    throw new Error('An element must be set. Use a css selector or an HTML element that already exist on the DOM.')
  }
  if (typeof config.el === 'string') {
    this.el = document.querySelector(config.el)
  }
  if (config.el instanceof Element) {
    this.el = config.el
  }
  if (typeof config.questions === 'string') {
    this.questions = JSON.parse(config.questions)
  } else {
    this.questions = config.questions
  }
  this.score = 0
  this.step = 0
  this.slots = {}
  this.handleAnswerChange = this.handleAnswerChange.bind(this)
}

Trivia.prototype.init = function init() {
  this.createSlots()
  this.play()
}

Trivia.prototype.createSlots = function createSlots() {
  this.slots.progress = renderElement(createElement('div', {
    attrs: {
      class: 'quiz-progress'
    }
  }))
  this.slots.questions = renderElement(createElement('div', {
    attrs: { class: 'questions' }
  }))
  this.slots.score = renderElement(createElement('div', {
    attrs: {
      class: 'quiz-score'
    }
  }))

  this.el.appendChild(this.slots.progress)
  this.el.appendChild(this.slots.questions)
}

Trivia.prototype.updateProgress = function createProgress() {
  this.slots.progress.textContent = 'Pregunta ' + (this.step + 1) + '/' + this.questions.length
}

Trivia.prototype.isOver = function isOver() {
  return this.step === this.questions.length
}

Trivia.prototype.play = function showQuestion() {
  if (this.isOver()) {
    this.showScore()
    return
  }
  this.updateProgress()
  const question = this.renderQuestion(this.questions[this.step])
  this.slots.questions.hasChildNodes()
    ? this.slots.questions.replaceChild(question, this.slots.questions.childNodes[0])
    : this.slots.questions.appendChild(question)
  this.enableGame()
}

Trivia.prototype.enableGame = function enableGame() {
  const answers = this.el.querySelector('.answers')
  answers.addEventListener('change', this.handleAnswerChange)
}

Trivia.prototype.handleAnswerChange = function handleAnswerChange(event) {
  const answer = event.target.parentNode
  const value = parseInt(event.target.value)
  if  (this.questions[this.step].answer === value) {
    this.score++
  }
  this.step = this.step + 1
  event.currentTarget.removeEventListener('change', this.handleAnswerChange)
  this.play()
}

Trivia.prototype.showScore = function showScore() {
  this.slots.score.textContent = 'Resultado: ' + this.score + '/' + this.questions.length + '!'
  this.el.innerHTML = ''
  this.el.appendChild(this.slots.score)
}

Trivia.prototype.renderQuestion = function renderQuestion(question) {
  const element = createElement('div', {
    attrs: {
      class: 'question'
    },
    children: [
      createElement('p', {
        attrs: {
          class: 'question-text'
        },
        children: [question.text]
      }),
      createElement('div', {
        attrs: {
          class: 'answers'
        },
        children: question.choices.map(function (choice, index) {
          return createElement('label', {
            attrs: {
              class: 'answer'
            },
            children: [
              createElement('input', {
                attrs: {
                  type: 'radio',
                  name: 'question',
                  value: index
                }
              }),
              createElement('span', {
                children: [choice]
              }),
            ]
          })
        })
      })
    ]
  })
  return renderElement(element)
}

