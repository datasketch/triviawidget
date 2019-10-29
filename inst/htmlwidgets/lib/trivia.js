function Trivia(config) {
  if (!config.el) {
    throw new Error('An element must be set. Use a css selector or an HTML element that already exist on the DOM.');
  }
  if (typeof config.el === 'string') {
    this.el = document.querySelector(config.el);
  }
  if (config.el instanceof Element) {
    this.el = config.el;
  }
  if (typeof config.questions === 'string') {
    this.questions = JSON.parse(config.questions);
  } else {
    this.questions = config.questions;
  }
  this.score = 0;
  this.step = 0;
  this.slots = {};
  this.answer = [];
  this.handleAnswerChange = this.handleAnswerChange.bind(this);
  this.handleNextButton = this.handleNextButton.bind(this);
}

Trivia.prototype.init = function init() {
  this.createSlots();
  this.play();
};

Trivia.prototype.createSlots = function createSlots() {
  this.slots.progress = document.createElement('div');
  this.slots.questions = document.createElement('div');
  this.slots.score = document.createElement('div');
  this.slots.button = document.createElement('button');

  this.slots.progress.classList.add('trivia-progress');
  this.slots.questions.classList.add('trivia-questions');
  this.slots.score.classList.add('trivia-score');
  this.slots.button.classList.add('trivia-next');

  this.el.appendChild(this.slots.progress);
  this.el.appendChild(this.slots.questions);
  this.el.appendChild(this.slots.button);

  this.registerNextButton();
};

Trivia.prototype.registerNextButton = function registerNextButton() {
  this.slots.button.textContent = 'Siguiente';
  this.slots.button.addEventListener('click', this.handleNextButton);
};

Trivia.prototype.updateProgress = function createProgress() {
  this.slots.progress.textContent = `Pregunta ${this.step + 1}/${this.questions.length}`;
};

Trivia.prototype.isOver = function isOver() {
  return this.step === this.questions.length;
};

Trivia.prototype.play = function showQuestion() {
  if (this.isOver()) {
    this.showScore();
    return;
  }
  this.slots.button.setAttribute('disabled', '');
  this.updateProgress();
  const question = this.renderQuestion(this.questions[this.step]);
  if (this.slots.questions.hasChildNodes()) {
    this.slots.questions.replaceChild(question, this.slots.questions.childNodes[0]);
  } else {
    this.slots.questions.appendChild(question);
  }
  this.enableGame();
};

Trivia.prototype.enableGame = function enableGame() {
  const answers = this.el.querySelector('.trivia-answers');
  answers.addEventListener('change', this.handleAnswerChange);
};

Trivia.prototype.handleAnswerChange = function handleAnswerChange(event) {
  const answer = parseInt(event.target.value, 10);
  if (this.answer.includes(answer)) {
    this.answer.splice(this.answer.indexOf(answer), 1);
  } else {
    this.answer.push(answer);
  }
  this.slots.button.removeAttribute('disabled');
};

Trivia.prototype.handleNextButton = function handleNextButton() {
  const question = this.questions[this.step];
  const guessed = this.answer.filter((answer) => question.answer.includes(answer));
  const score = guessed.length / question.answer.length;
  this.score += score;
  this.el.querySelector('.trivia-answers').removeEventListener('change', this.handleAnswerChange);
  this.step = this.step + 1;
  this.answer = [];
  this.play();
};

Trivia.prototype.showScore = function showScore() {
  this.slots.score.textContent = `Resultado: ${this.score}/${this.questions.length}`;
  this.el.innerHTML = '';
  this.el.appendChild(this.slots.score);
};

Trivia.prototype.renderQuestion = function renderQuestion(question) {
  const triviaQuestion = document.createElement('div');
  const triviaQuestionText = document.createElement('p');
  const triviaAnswers = document.createElement('div');

  triviaQuestion.classList.add('trivia-question');
  triviaQuestionText.classList.add('trivia-question-text');
  triviaAnswers.classList.add('trivia-answers');

  triviaQuestionText.textContent = question.text;

  question.choices.forEach((choice, index) => {
    const triviaAnswer = document.createElement('label');
    const triviaAnswerInput = document.createElement('input');
    const triviaAnswerSpan = document.createElement('span');

    triviaAnswer.classList.add('trivia-answer');

    triviaAnswerSpan.textContent = choice;

    triviaAnswerInput.setAttribute('type', question.answer.length > 1 ? 'checkbox' : 'radio');
    triviaAnswerInput.setAttribute('name', 'question');
    triviaAnswerInput.setAttribute('value', index);

    triviaAnswer.appendChild(triviaAnswerInput);
    triviaAnswer.appendChild(triviaAnswerSpan);
    triviaAnswers.appendChild(triviaAnswer);
  });

  triviaQuestion.appendChild(triviaQuestionText);
  triviaQuestion.appendChild(triviaAnswers);

  return triviaQuestion;
};
