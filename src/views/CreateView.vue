<template>
  <div class="wrapper">
    <header>
      <div>
        <router-link to="/">{{ uiLabels.home }}</router-link>
      </div>

    </header>

    <!-- container for the quiz + completed questions -->
    <div class="quiz-container">
      <h2>Quiz 1</h2>
      <div v-if="questions.length > 0">
        <h3>{{ uiLabels.addedQuestions }}</h3>
        <div class="option" v-for="(question, index) in questions" :key="index">
          <h4>{{ question.text }}</h4>
          <p v-if="question.type === 'textAnswer'">{{ question.answer }}</p>
          <ul v-else>
            <li v-for="(option, i) in question.options" :key="i">{{ option }}</li>
          </ul>
          <p><strong>{{ uiLabels.type }}:</strong> {{ question.type }}</p>
          <button @click="removeQuestion(index)" class="remove-option">-</button>
        </div>
      </div>
      <p v-else>{{ uiLabels.questionAppear }}</p>
    </div>


    <!-- container for adding a new question -->
    <div class="question-container" v-if="isAddingQuestion">
      <h2>{{ uiLabels.addQuestion }}</h2>
      <h3>{{ uiLabels.qType }}</h3>
      <div class="button-container">
        <button @click="setQuestionType('multiChoice')">{{ uiLabels.multChoice }}</button>
        <button @click="setQuestionType('textAnswer')">{{ uiLabels.answer }}</button>
      </div>

      <div v-if="questionType">
        <div v-if="questionType === 'textAnswer'">
          <input v-model="newQuestion.options" type="text" placeholder={{uiLabels.enterAnswer}} />
        </div>
        <div v-if="questionType === 'multiChoice'">
          <form>
            <div class="question-section">
              <label for="question">{{ uiLabels.enterQuestion }}:</label>
              <input type="text" id="question"  />
            </div>

            <div class="options-section">
              <label>{{uiLabels.setOptions}}:</label>
              <div v-for="(option, index) in newQuestion.options" :key="index" class="option">
                <label :for="'option ' + index">{{ String.fromCharCode(65 + index) }}:</label>
                <input v-model="options" :id="'option ' + index" />
                <button type="button" @click="removeOption(index)" class="remove-option">-</button>
              </div>
            </div>
            <div class="add-remove-buttons">
              <button type="button" @click="addOption">{{ uiLabels.addOption }}</button>
            </div>
          </form>
        <!-- TODO: add functionality for adding and removing options -->
         <!-- TODO: a -->
         <!-- TODO: also fix the placeholder not displaying the right thing -->
        </div>
      </div>

      <button @click="saveQuestion">{{ uiLabels.addQuestion }}</button>
      <button @click="cancelAddingQuestion">{{ uiLabels.cancel }}</button>
    </div>

    <div v-if="!isAddingQuestion">
      <button @click="startAddingQuestion">{{ uiLabels.addQuestion }}</button>
    </div>

    <div class="back-button-container">
      <router-link to="/list">{{ uiLabels.back }}</router-link>
    </div>

    <footer>
      <p>&copy; 2024 Questionnaire Star. All rights reserved.</p>
    </footer>
  </div>
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
      newQuestion: {
        text: "",
        options: [],
        answer: ""
      },
      questionType:"",
    }
  },
  created() {
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.emit( "getUILabels", this.lang );
  },
  methods: {
    switchLanguage() {
      localStorage.setItem( "lang", this.lang );
      socket.emit( "getUILabels", this.lang );
    },
    startAddingQuestion() {
      this.isAddingQuestion = true;
    },
    cancelAddingQuestion() {
      this.newQuestion = {
        text: "",
        options: [],
        answer: ""
      };
      this.questionType = "";
      this.isAddingQuestion = false;
    },
    setQuestionType(type) {
      this.questionType = type;
    }, 
    saveQuestion() {
      this.questions.push({ question: this.newQuestion, type: this.questionType});
      this.newQuestion = {
        text: "",
        options: [],
        answer: ""
      };
      this.questionType = "";
      this.isAddingQuestion = false;
    },
    removeQuestion(index) {
      this.questions.splice(index, 1);
    },
    toggleNav() {
      this.hideNav = ! this.hideNav;
    },
    addOption() {
      this.newQuestion.options.push("");
    },
    removeOption(index) {
      this.newQuestion.options.splice(index, 1);
    }

  }
}
</script>

<style scoped>
  .wrapper {
    background-color: #f9f9f9;
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #ddd;
  }

  .quiz-container {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    /* padding: 20px; */
  }

  .quiz-container h2 {
    margin-bottom: 10px;
  }

  .quiz-container .option {
    background-color: #f1f1f1;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 10px;
  }

  .question-container {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-top: 20px;
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
    background-color: #28a745;
    color: white;
    border: none;
  }

  .add-remove-buttons button:hover {
    background-color: #218838;
  }

  .remove-option {
    background-color: #dc3545;
    color: white;
    border: none;
  }

  .remove-option:hover {
    background-color: #c82333;
  }

  .back-button-container {
    display: flex;
    justify-content: flex-end;
    margin-top: auto;
    font-size: large;
    padding: 20px;
  }

  input {
    width: 90%;
    height: 1em;
    padding: 1em;
    margin-bottom: 1.5em;
    border: 1px solid #ccc;
    border-radius: 0.1875em;
  }

  .quiz-container {
    margin-bottom: 20px;
  }

  .question-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 20px;
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

  button {
    background-color: white;
    border: 1px solid #ccc;
    padding: 0.8em 1.2em;
    font-size: 1em;
    border-radius: 0.5em;
    cursor: pointer;
  }

  button:hover {
    background-color: #ddd;
  }

  .option {
      display: flex;
      align-items: center;
      margin-bottom: 1em;
  }

  .option label {
      margin-right: 0.5em;
      font-size: 1em;
  }

  .option input {
      flex: 1;
      padding: 0.5em;
      font-size: 1em;
      border: 1px solid #ddd;
      border-radius: 0.5em;
      width:50%
  }

  .option button {
      margin-left: 1em;
      background-color: #ff4d4d;
      color: white;
      border: none;
      padding: 0.5em 0.8em;
      border-radius: 0.5em;
      cursor: pointer;
  }

  .option button:hover {
      background-color: #cc0000;
  }
</style>