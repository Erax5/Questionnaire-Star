function sockets(io, socket, data) {
  
  socket.on('getUILabels', function(lang) {
    socket.emit('uiLabels', data.getUILabels(lang));
  });

  socket.on('publishQuiz', function(quiz) {
    data.publishQuiz(quiz);
  });

  socket.on('submitAnswers', function(form) {
    data.submitAnswers(form.quizId, form.userId, form.answers);
  });

  socket.on('getAnswers', function(quizId) {
    socket.emit('answers', data.getAnswers(quizId));
  });

  socket.on('getQuizzes', function() {
    socket.emit('quizzes', data.getQuizzes());
  });

  socket.on('getQuiz', function(quizId) {
    socket.emit('quiz', data.getQuiz(quizId));
  });
}

export { sockets };