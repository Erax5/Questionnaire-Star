<template>
  <div class="wrapper">
    <header>
      <div style="width:33%; align-items: center;">
        <router-link to="/home">{{ uiLabels.home }}</router-link>
      </div>
      <div style="width:34%; display: flex; justify-content: center; align-items: center;">
        <select v-model="lang" @change="switchLanguage">
          <option value="en">English</option>
          <option value="sv">Svenska</option>
          <option value="cn">中文</option>
        </select>
      </div>
      <div style="width:33%; display: flex; justify-content: right; align-items: center;">
        <span style="margin-right: 1em;">{{ uiLabels.loggedIn }} {{ username }}</span>
        <button @click="logOut()" style="margin-right:1em">{{ uiLabels.signOut }}</button>
      </div>
    </header>

      <!-- container for the quiz + completed questions -->
      <div class="container">
        <h2>{{uiLabels.quiz}} 1</h2><!-- TODO: change hardcoded "1" into dynamic counting -->
        <div v-if="questions.length > 0">
          <h3>{{ uiLabels.addedQuestions }}</h3>
          <div class="question-container" v-for="(question, index) in questions" :key="index">
            <div class="question" @click="editQuestion(question, index)">
              <div style="width:40%;"><h4>{{ question.question }}</h4></div>
              <div style="width:30%;">
                <p v-if="question.type === 'textAnswer'">{{question.answer}}</p>
                <ul v-else>
                  <li v-for="(option, i) in question.options" :key="i">{{ option }}</li>
                  <li><strong>{{ uiLabels.ans }}:</strong> {{ question.options[question.answer] }}</li>
                </ul>
              </div>
              <span>{{ uiLabels.edit }}</span>
            </div>
            <div class="quiz-container-buttons">
              <!-- Button for deleting a question from the quiz overview -->
              <button class="red-button" @click.stop="removeQuestion(index)"> - </button>
            </div>
          </div>
        </div>
        <p v-else>{{ uiLabels.questionAppear }}</p>
      </div>

      <!-- container for adding a new question -->
      <div class="container" v-if="isAddingQuestion || isEditingQuestion">
        <h2>{{ uiLabels.addQuestion }}</h2>
        <h3>{{ uiLabels.qType }}</h3>
        <div class="button-container">
          <button @click="setQuestionType('multiChoice')">{{ uiLabels.multChoice }}</button>
          <button @click="setQuestionType('textAnswer')">{{ uiLabels.answer }}</button>
        </div>

        <div v-if="questionType">
          <div v-if="questionType === 'textAnswer'">
            <div class="question-section">
              <label for="question">{{ uiLabels.enterQuestion }}:</label>
              <input type="text" id="question" v-model="newQuestion.question"/>
            </div>
              <label style="margin-top:1em;" for="question">{{ uiLabels.enterAnswer }}:</label>
              <input v-model="newQuestion.answer" />
          </div>
          <div v-if="questionType === 'multiChoice'">
              <div class="question-section">
                <label for="question">{{ uiLabels.enterQuestion }}:</label>
                <input type="text" v-model="newQuestion.question"/>
              </div>

              <div class="options-section">
                <div style="display: flex; justify-content: space-between;">
                  <label>{{uiLabels.setOptions}}:</label>
                  <label>{{uiLabels.setAnswer}}</label>
                </div>
                <div v-for="(option, index) in newQuestion.options" :key="index" class="option">
                  <input 
                    type="text" 
                    v-model="newQuestion.options[index]" 
                    :placeholder="`${uiLabels.option} ${index + 1}`" 
                  />
                    <input type="checkbox" :checked="newQuestion.answer === index" @change="answerSwitch(index)"/>
                  <button class="red-button" @click="removeOption(index)">-</button>
                </div>
              </div>
              <div class="add-remove-buttons">
                <button class="red-button" @click="addOption">{{ uiLabels.addOption }}</button>
              </div>
          <!-- TODO: add functionality for adding and removing options -->
          <!-- TODO: a -->
          <!-- TODO: also fix the placeholder not displaying the right thing -->
          </div>
        </div>
        <div class="button-container-2">
          <button class="black-button" v-if="isAddingQuestion" @click="saveQuestion()">{{ uiLabels.addQuestion }}</button>
          <button class="black-button" v-if="isEditingQuestion" @click="saveQuestion()">{{ uiLabels.save }}</button>
          <button class="black-button" @click="cancelAddingQuestion">{{ uiLabels.cancel }}</button>
        </div>
      </div>

      <div v-if="!isAddingQuestion && !isEditingQuestion">
        <button style="margin-left:2em" class=black-button @click="startAddingQuestion">{{ uiLabels.addQuestion }}</button>
      </div>

      <div class="page-operation-button-container">
        <button class="blue-button" @click="publish()" style="margin-right:1em;">{{ uiLabels.publish }}</button>
        <router-link to="/list">{{ uiLabels.back }}</router-link>
      </div>

    </div>

    <footer>
      <p>&copy; {{uiLabels.footer}}</p>
    </footer>
</template>

<script>
import ResponsiveNav from '@/components/ResponsiveNav.vue';
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'CreateView',
  components: {
    ResponsiveNav
  },
  data() {
    return {
      uiLabels: {},
      newPollId: "",
      lang: localStorage.getItem( "lang") || "en",
      hideNav: true,
      questions: [],
      isAddingQuestion: false, //this is true when actively adding a question
      isEditingQuestion: false, //this is true when actively editing a question
      editingIndex: null,
      newQuestion: {
        question: "",
        options: [],
        answer: ""
      },
      questionType:"",
      username: this.getCookie("username") || ""
    }
  },
  created() {
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.emit( "getUILabels", this.lang );

    const username = this.getCookie("username");
    if (!username) {
      console.log("User is not logged in: returning to login screen");
      this.$router.push("/"); //add this when there is another home screen
    }
  },
  methods: {
    getCookie(name) {
      const nameEQ = name + "=";
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    },
    logOut() {
      document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      console.log("User logged out");
      this.$router.push("/");
    },
    switchLanguage() {
      localStorage.setItem( "lang", this.lang );
      socket.emit( "getUILabels", this.lang );
    },
    editQuestion(question, index) {
      if (this.isAddingQuestion) {
        if (confirm(this.uiLabels.editQuestionWarning)) {
          this.cancelAddingQuestion();
        } else {
          return;
        }
      }
      this.newQuestion = {
        question: question.question,
        options: [...question.options],
        answer: question.answer
      };
      this.questionType = question.type;
      this.editingIndex = index;
      this.startEditingQuestion();
    },
    answerSwitch(index) {
      if (this.newQuestion.answer === index) {
        this.newQuestion.answer = "";
      } else {
        this.newQuestion.answer = index;
      }
    },
    startAddingQuestion() {
      this.isAddingQuestion = true;
    },
    startEditingQuestion() {
      this.isEditingQuestion = true;
    },
    cancelAddingQuestion() {
      this.newQuestion = {
        question: "",
        options: [],
        answer: ""
      };
      this.questionType = "";
      this.isAddingQuestion = false;
      this.isEditingQuestion = false;
    },
    setQuestionType(type) {
      this.questionType = type;
    }, 
    saveQuestion() {
      if (this.newQuestion.question.trim() === '' || 
         (this.questionType === 'multiChoice' && (this.newQuestion.options.length === 0) || this.newQuestion.options.includes(''))){

        alert(this.uiLabels.addQuestionError); // TODO: replace with more user-friendly error handling
        return;
      }
      if (this.newQuestion.answer === '') {
        alert(this.uiLabels.answerError);
        return;
      }

      const newQuestion = {
        question: this.newQuestion.question,
        options: [...this.newQuestion.options],
        answer: this.newQuestion.answer,
        type: this.questionType
      };
      // if editing a question, remove the old question from the questions array and add the new one at the same index
      if (this.isEditingQuestion) {
        this.questions.splice(this.editingIndex, 1, newQuestion);
      }
      // if new question, add to the questions array
      else {
        this.questions.push(newQuestion);
      }
      
      // reset the newQuestion object
      this.newQuestion = {
        question: '',
        options: [],
        answer: ''
      };
      this.questionType = '';
      this.isAddingQuestion = false;
      this.isEditingQuestion = false;
    },
    removeQuestion(index) {
      this.questions.splice(index, 1);
    },
    toggleNav() {
      this.hideNav = ! this.hideNav;
    },
    addOption() {
      this.newQuestion.options.push('');
    },
    removeOption(index) {
      try {
        console.log('Removing option at index:', index);
        console.log('Options before removal:', this.newQuestion.options);

        this.newQuestion.options.splice(index, 1);
        if (this.newQuestion.answer === index) {
          this.newQuestion.answer = "";
        } else if (this.newQuestion.answer > index) {
          this.newQuestion.answer--;
        }

        console.log('Options after removal:', this.newQuestion.options);
      } catch (error) {
        console.error('Error removing option:', error);
      }
    },
    publish() {
      if (this.questions.length === 0) {
        alert(this.uiLabels.errorPublishing);
        return;
      }
      let quiz = {
        creatorId: this.getCookie("username"),
        quizId: null, // Id is set by the server
        questions: this.questions
      };
      socket.emit("publishQuiz", quiz);
      this.$router.push("/list");
    },
  }
}
</script>

<style scoped>
  .question-container {
    display: flex;
    align-items: center;
  }

  .question {
    background-color: #f0f0f0;
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background-color 0.3s ease;
    cursor: pointer;
    width: 95%;
  }

  .question:hover {
    background-color: #e0f7fa;
  }

  .question h4 {
    margin: 0;
    font-size: 1.2em;
    color: #555;
  }

  .question p,
  .question ul {
    margin: 10px 0 0 0;
    font-size: 1.1em;
    color: #777;
  }

  .question span {
    color: #007bff;
    cursor: pointer;
    font-size:1.2em;
  }

  .question-container h2 {
    margin-bottom: 10px;
  }

  .button-container button {
    background-color: #007bff;
    color: white;
    border: none;
  }

  .button-container button:hover {
    background-color: #0056b3;
  }

  .add-remove-buttons button {
    background-color: #007bff;
    color: white;
    border: none;
  }

  .add-remove-buttons button:hover {
    background-color: #0056b3;
  }
  
  .button-container-2 {
    display: flex;
    justify-content:center;
    margin-top: 20px;
    gap: 10px;
  }
  .question:hover span {
    text-decoration: underline;
  }
  /* TODO fix so that this rule works, it still underlines "Edit" when hovering "remove" */
  .question:hover + .remove-question-button:hover {
    text-decoration: none;
  }

  .page-operation-button-container {
      display: flex;
      justify-content: flex-end;
      padding: 20px;
  }

  input {
    width: 95%;
    height: 1.5em;
    padding: 1em;
    border: 1px solid #ccc;
    border-radius: 0.2em;
  }

  .finish-button {
    display: flex;
    justify-content: flex-end;
    margin-right: 20px;
  }

  .button-container {
    display: flex;
    margin: 20px;
    gap: 10px;
    justify-content: flex-start;
  }

  footer {
    background-color: #f1f1f1;
    text-align: center;
    margin-top: auto;
  }

  .option {
      display: flex;
      align-items: center;
      margin-bottom: 0.7em;
  }

  .option label {
      margin-right: 0.5em;
      font-size: 1em;
  }

  .option input {
      border: 1px solid #ddd;
      border-radius: 0.5em;
  }

  .options-section {
      margin: 1em;
    }

  .options-section input[type="checkbox"] {
    width: 1.2em;
    height: 1.2em;
    margin-left: 2em;
    cursor: pointer;
    accent-color: #007bff;
    border: 1px solid #ccc;
    border-radius: 0.25em;
    transition: background-color 0.3s ease, border-color 0.3s ease;
  }

  .options-section input[type="checkbox"]:hover {
    border-color: #007bff;
  }

  .options-section input[type="checkbox"]:checked {
    background-color: #007bff;
    border-color: #007bff;
  }
</style>