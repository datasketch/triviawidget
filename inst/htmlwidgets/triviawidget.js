HTMLWidgets.widget({
  name: 'triviawidget',
  type: 'output',
  factory: function(el, width, height) {
    return {
      renderValue: function(questions) {
        const trivia = new Trivia({ el: el, questions: questions })
        trivia.init()
      },
      resize: function(width, height) {}
    };
  }
});
