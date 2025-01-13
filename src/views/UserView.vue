<template>
  <div class="wrapper">
    <header>
      <div style="width:44%; align-items: center;">
        <router-link to="/">{{ uiLabels.home }}</router-link>
      </div>
      <div style="width:12%; display: flex; justify-content: center; align-items: center;">
        <select v-model="lang" @change="switchLanguage">
          <option value="en">English</option>
          <option value="sv">Svenska</option>
          <option value="cn">中文</option>
        </select>
      </div>
      <div style="width:44%; display: flex; justify-content: right; align-items: center;">
        <span style="width:40%; margin-right: 1em;">{{ uiLabels.loggedIn }} {{ username }}</span>
        <button @click="logOut()" style="margin-right:1em">{{ uiLabels.signOut }}</button>
      </div>
    </header>
    
    <div class="container">
        <div>
            <h1 style="text-align: left;">{{ uiLabels.Questionnaire }}</h1>
        </div>

        <form>
          <div style="margin-bottom:2em;" v-for="(question, questionIndex) in quiz.questions" :key="questionIndex">
            <h2 style="align-items: left; justify-content: left; text-align: left;">{{ question.question }}</h2>
            <div v-if="question.type === 'multiChoice'">
              <div class="nestled-div" @click="answerSwitch(questionIndex, optionIndex)" style="justify-content:flex-start; cursor:pointer;" v-for="(option, optionIndex) in question.options" :key="optionIndex">
                <input type="checkbox" :checked="userAnswers[questionIndex] === optionIndex" @change="answerSwitch(questionIndex, optionIndex)"/>
                <span style="margin-left:2em;">{{ option }}</span>
              </div>
            </div>
            <div v-else-if="question.type === 'textAnswer'">
              <input type="text" v-model="this.userAnswers[questionIndex]" :placeholder="uiLabels.enterAnswer" />
            </div>

          </div>

          <div style="display: flex; justify-content: space-between; margin-top: 2em;">
            <button type="button" class="submit-btn" @click="submitQuiz()">{{ uiLabels.submit }}</button>
            <router-link to="/list">{{ uiLabels.back }}</router-link>
          </div>
      </form>
    </div>

    <main>
      <form>

      </form>
    </main>
    <footer>
      <p>&copy; {{uiLabels.footer}}</p>
    </footer>
  </div>
</template>

<script>
import ResponsiveNav from '@/components/ResponsiveNav.vue';
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'UserView',
  components: {
    ResponsiveNav
  },
  data() {
    return {
      uiLabels: {},
      newPollId: "",
      lang: localStorage.getItem( "lang") || "en",
      hideNav: true,
      username: this.getCookie("username") || "",
      quiz: {},
      userAnswers: []
    };
  },
  created() {
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.emit( "getUILabels", this.lang );

    const username = this.getCookie("username");
    if (!username) {
      console.log("User is not logged in: returning to login screen");
      this.$router.push("/");
    }

    // Logic to get the questions from the server
    const quizId = this.$route.params.id;
    if (!quizId) {
      console.log("No quiz id provided");
      this.$router.push("/list");
    }
    else {
      socket.emit("getQuiz", quizId);
      socket.on("quiz", quiz => {
        this.quiz = quiz;
      });
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
    answerSwitch(questionIndex, optionIndex) {
      if (this.userAnswers[questionIndex] === optionIndex) {
        this.userAnswers[questionIndex] = null;
      } else {
        this.userAnswers[questionIndex] = optionIndex;
      }
    },
    submitQuiz() {
      if (this.userAnswers.length !== this.quiz.questions.length) {
        alert("Please answer all questions before submitting");
        return;
      }
      let form = {
        userId: this.getCookie("username"),
        quizId: this.quiz.quizId,
        answers: this.userAnswers
      }
      socket.emit("submitAnswers", form);

      this.$router.push('/thank-you'); // Navigate to ThankYou.vue
    },
    logOut() {
      document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      console.log("User logged out");
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
  .wrapper
  {
    background-color: #f9f9f9;
  }

  footer {
    background-color: #f1f1f1;
    text-align: center;
    margin-top: auto;
  }

  input[type="text"] {
    width: 95%;
    height: 1.5em;
    padding: 1em;
    border: 1px solid #ccc;
    border-radius: 0.2em;
    font-size:0.8em;
  }

@media screen and (max-width: 50em) {

  input[type="text"] {
    padding: 0.6em; /* Adjust padding for smaller devices */
  }

  footer{
    font-size: 2vw; 
    padding: 0.5em;
  }

  div{
    font-size: 2vw; 
    padding: 1em;
  }

  .checkbox {
    flex-direction: row;
  }

  .checkbox label {
    font-size: 1.2em; /* Adjust font size for smaller screens */
    margin-left: 0.3em; /* Remove margin to prevent offset */
  }
}
</style>