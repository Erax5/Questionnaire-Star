'use strict';
import {readFileSync} from "fs";

// Store data in an object to keep the global namespace clean. In an actual implementation this would be interfacing a database...
function Data() {
  // this.polls = {};
  // this.polls['test'] = {
  //   lang: "en",
  //   questions: [
  //     {q: "How old are you?", 
  //      a: ["0-13", "14-18", "19-25", "26-35", "36-45","45-"]
  //     },
  //     {q: "How much do you enjoy coding?", 
  //      a: ["1", "2", "3", "4", "5"]
  //     }
  //   ],
  //   answers: [],
  //   currentQuestion: 0,
  //   participants: []
  // }
  
  // Our code below
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
    this.userAnswers[quizId] = [];
  }
  
  this.userAnswers[quizId][userId] = answers;
}

Data.prototype.getUserAnswers = function (quizId, userId) {
  return this.userAnswers[quizId][userId] || [];
}

Data.prototype.getAnswers = function (quizId) {
  return this.userAnswers[quizId] || [];
}
// our code above

Data.prototype.getUILabels = function (lang) {
  //check if lang is valid before trying to load the dictionary file
  if (!["en", "sv", "cn"].some( el => el === lang))
    lang = "en";
  const labels = readFileSync("./server/data/labels-" + lang + ".json");
  return JSON.parse(labels);
}

// Data.prototype.pollExists = function (pollId) {
//   return typeof this.polls[pollId] !== "undefined"
// }

// Data.prototype.createPoll = function(pollId, lang="en") {
//   if (!this.pollExists(pollId)) {
//     let poll = {};
//     poll.lang = lang;  
//     poll.questions = [];
//     poll.answers = [];
//     poll.participants = [];
//     poll.currentQuestion = 0;              
//     this.polls[pollId] = poll;
//     console.log("poll created", pollId, poll);
//   }
//   return this.polls[pollId];
// }

// Data.prototype.getPoll = function(pollId) {
//   if (this.pollExists(pollId)) {
//     return this.polls[pollId];
//   }
//   return {};
// }

// Data.prototype.participateInPoll = function(pollId, name) {
//   console.log("participant will be added to", pollId, name);
//   if (this.pollExists(pollId)) {
//     this.polls[pollId].participants.push({name: name, answers: []})
//   }
// }

// Data.prototype.getParticipants = function(pollId) {
//   const poll = this.polls[pollId];
//   console.log("participants requested for", pollId);
//   if (this.pollExists(pollId)) { 
//     return this.polls[pollId].participants
//   }
//   return [];
// }

// Data.prototype.addQuestion = function(pollId, q) {
//   if (this.pollExists(pollId)) {
//     this.polls[pollId].questions.push(q);
//   }
// }

// Data.prototype.activateQuestion = function(pollId, qId = null) {
//   if (this.pollExists(pollId)) {
//     const poll = this.polls[pollId];
//     if (qId !== null) {
//       poll.currentQuestion = qId;
//     }
//     return poll.questions[poll.currentQuestion];
//   }
//   return {}
// }

// Data.prototype.getSubmittedAnswers = function(pollId) {
//   if (this.pollExists(pollId)) {
//     const poll = this.polls[pollId];
//     const answers = poll.answers[poll.currentQuestion];
//     if (typeof poll.questions[poll.currentQuestion] !== 'undefined') {
//       return answers;
//     }
//   }
//   return {}
// }

// Data.prototype.submitAnswer = function(pollId, answer) {
//   if (this.pollExists(pollId)) {
//     const poll = this.polls[pollId];
//     let answers = poll.answers[poll.currentQuestion];
//     // create answers object if no answers have yet been submitted
//     if (typeof answers !== 'object') {
//       answers = {};
//       answers[answer] = 1;
//       poll.answers.push(answers);
//     }
//     // create answer property if that specific answer has not yet been submitted
//     else if (typeof answers[answer] === 'undefined') {
//       answers[answer] = 1;
//     }
//     // if the property already exists, increase the number
//     else
//       answers[answer] += 1
//     console.log("answers looks like ", answers, typeof answers);
//   }
// }

export { Data };



