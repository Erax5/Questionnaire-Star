<template>
  <div class="wrapper">
    <header>
      <div>
        <router-link to="/">{{ uiLabels.home }}</router-link>
      </div>

    </header>
    <div class="padder">

      <!-- container for the quiz + completed questions -->
      <div class="quiz-container">
        <h2>Quiz 1</h2>
        <div v-if="questions.length > 0">
          <h3>{{ uiLabels.addedQuestions }}</h3>
          <div class="question" @click="editQuestion(question, index)" v-for="(question, index) in questions" :key="index">
            <h4>{{ question.question }}</h4>
            <p v-if="question.type === 'textAnswer'">{{question.answer}}</p>
            <ul v-else>
              <li v-for="(option, i) in question.options" :key="i">{{ option }}</li>
              <li><strong>{{ uiLabels.ans }}:</strong> {{ question.options[question.answer] }}</li>
            </ul>
            <!-- <p><strong>{{ uiLabels.type }}:</strong> {{ question.type }}</p> -->
             <div class="quiz-container-buttons">
                <span>{{ uiLabels.edit }}</span>
              <button @click="removeQuestion(index)" class="remove-button">-</button>
             </div>
          </div>
        </div>
        <p v-else>{{ uiLabels.questionAppear }}</p>
      </div>

      <!-- container for adding a new question -->
      <div class="question-container" v-if="isAddingQuestion || isEditingQuestion">
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
              <label for="question">{{ uiLabels.enterAnswer }}:</label>
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
                  <button class="remove-button" @click="removeOption(index)">-</button>
                </div>
              </div>
              <div class="add-remove-buttons">
                <button type="button" @click="addOption">{{ uiLabels.addOption }}</button>
              </div>
          <!-- TODO: add functionality for adding and removing options -->
          <!-- TODO: a -->
          <!-- TODO: also fix the placeholder not displaying the right thing -->
          </div>
        </div>
        <div class="button-container-2">
          <button v-if="isAddingQuestion" @click="saveQuestion()">{{ uiLabels.addQuestion }}</button>
          <button v-if="isEditingQuestion" @click="saveQuestion()">{{ uiLabels.save }}</button>
          <button @click="cancelAddingQuestion">{{ uiLabels.cancel }}</button>
        </div>
      </div>

      <div v-if="!isAddingQuestion && !isEditingQuestion">
        <button @click="startAddingQuestion">{{ uiLabels.addQuestion }}</button>
      </div>

      <div class="back-button-container">
        <router-link to="/list">{{ uiLabels.back }}</router-link>
      </div>

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
      isEditingQuestion: false, //this is true when actively editing a question
      editingIndex: null,
      newQuestion: {
        question: "",
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

  .padder {
    padding: 20px;
    flex-grow: 1;
  }

  .quiz-container {
    background-color: #ffffff;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;
  }

  .quiz-container:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  .quiz-container h2 {
    margin-bottom: 15px;
    font-size: 2em;
    color: #333;
  }

  .quiz-container .question {
    background-color: #f9f9f9;
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background-color 0.3s ease;
  }

  .quiz-container .question:hover {
    background-color: #e9e9e9;
  }

  .quiz-container .question h4 {
    margin: 0;
    font-size: 1.2em;
    color: #555;
  }

  .quiz-container .question p,
  .quiz-container .question ul {
    margin: 10px 0 0 0;
    font-size: 1.1em;
    color: #777;
  }

  .quiz-container .question ul {
    padding-left: 20px;
  }

  .quiz-container .question ul li {
    list-style-type: disc;
  }

  .quiz-container .remove-question {
    background-color: #ff4d4d;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .quiz-container .remove-question:hover {
    background-color: #cc0000;
  }

  .quiz-container-buttons {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .quiz-container .question {
    cursor: pointer;
    position: relative;
  }

  .quiz-container .question:hover .quiz-container-buttons span {
    text-decoration: underline;
  }

  .quiz-container .question:hover {
    background-color: #e0f7fa;
  }

  .quiz-container-buttons span {
    color: #007bff;
    cursor: pointer;
    font-size:1.2em;
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

  .remove-button {
    color: white;
    border: none;
    margin-left: 0.5em;
    background-color: #ff4d4d;
    padding: 0.5em 0.8em;
    border-radius: 0.5em;
    cursor: pointer;
  }

  .remove-button:hover {
    background-color: #cc0000;
  }

  .back-button-container {
    display: flex;
    justify-content: flex-end;
    margin-top: auto;
    font-size: large;
    padding: 20px;
  }

  input {
    width: 95%;
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
      border: 1px solid #ddd;
      border-radius: 0.5em;
  }

  .options-section input[type="checkbox"] {
    width: 1.2em;
    height: 1.2em;
    margin-right: 0.5em;
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