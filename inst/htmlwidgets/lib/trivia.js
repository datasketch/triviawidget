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
  this.handleAnswerChange = this.handleAnswerChange.bind(this);
}

Trivia.prototype.init = function init() {
  this.createSlots();
  this.play();
};

Trivia.prototype.createSlots = function createSlots() {
  this.slots.progress = document.createElement('div');
  this.slots.questions = document.createElement('div');
  this.slots.score = document.createElement('div');

  this.slots.progress.classList.add('trivia-progress');
  this.slots.questions.classList.add('trivia-questions');
  this.slots.score.classList.add('trivia-score');

  this.el.appendChild(this.slots.progress);
  this.el.appendChild(this.slots.questions);
};

Trivia.prototype.updateProgress = function createProgress() {
  this.slots.progress.textContent = 'Pregunta ' + (this.step + 1) + '/' + this.questions.length;
};

Trivia.prototype.isOver = function isOver() {
  return this.step === this.questions.length;
};

Trivia.prototype.play = function showQuestion() {
  if (this.isOver()) {
    this.showScore();
    return;
  }
  this.updateProgress();
  const question = this.renderQuestion(this.questions[this.step]);
  this.slots.questions.hasChildNodes()
    ? this.slots.questions.replaceChild(question, this.slots.questions.childNodes[0])
    : this.slots.questions.appendChild(question);
  this.enableGame();
};

Trivia.prototype.enableGame = function enableGame() {
  const answers = this.el.querySelector('.trivia-answers');
  answers.addEventListener('change', this.handleAnswerChange);
};

Trivia.prototype.handleAnswerChange = function handleAnswerChange(event) {
  const value = parseInt(event.target.value);
  const question = this.questions[this.step];
  if (question.answer === value) {
    this.score++;
  }
  this.step = this.step + 1;
  event.currentTarget.removeEventListener('change', this.handleAnswerChange);
  this.play();
};

Trivia.prototype.showScore = function showScore() {
  this.slots.score.textContent = 'Resultado: ' + this.score + '/' + this.questions.length + '!';
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

  question.choices.forEach(function (choice, index) {
    const triviaAnswer = document.createElement('label');
    const triviaAnswerInput = document.createElement('input');
    const triviaAnswerSpan = document.createElement('span');

    triviaAnswer.classList.add('trivia-answer');

    triviaAnswerSpan.textContent = choice;

    triviaAnswerInput.setAttribute('type', 'radio');
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
