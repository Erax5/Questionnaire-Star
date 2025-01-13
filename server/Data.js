'use strict';
import {readFileSync} from "fs";

// Store data in an object to keep the global namespace clean. In an actual implementation this would be interfacing a database...
function Data() {
  this.quizzes = [];
  this.userAnswers = [];
  this.currentId = 0;
}

/***********************************************
For performance reasons, methods are added to the
prototype of the Data object/class
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
***********************************************/
// our code below

Data.prototype.publishQuiz = function (quiz) {
  quiz.quizId = this.currentId;
  this.quizzes[this.currentId] = quiz;
  console.log("quiz published", this.quizzes[quiz.quizId]);
  this.currentId++;
}

Data.prototype.getQuizzes = function () {
  return this.quizzes;
}

Data.prototype.getQuiz = function (quizId) {
  return this.quizzes[quizId];
}

Data.prototype.submitAnswers = function (quizId, userId, answers) {
  if (!this.userAnswers[quizId]) {
    this.userAnswers[quizId] = {};
  }
  
  this.userAnswers[quizId][userId] = answers;
  console.log("answers submitted", this.userAnswers[quizId][userId]);
}
Data.prototype.getAnswers = function (quizId) {
  return this.userAnswers[quizId];
}
// our code above

Data.prototype.getUILabels = function (lang) {
  //check if lang is valid before trying to load the dictionary file
  if (!["en", "sv", "cn"].some( el => el === lang))
    lang = "en";
  const labels = readFileSync("./server/data/labels-" + lang + ".json");
  return JSON.parse(labels);
}

export { Data };



