<template>
  <div class="wrapper">
    <header>
      <div style="width:33%; align-items: center;">
        <router-link to="/">{{ uiLabels.home }}</router-link>
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
    
    <!-- HTML from user_view.html -->
    <div class="container">
        <div>
            <h1>{{ uiLabels.Questionnaire }}</h1>
            <!--Place to enter quiz id or similar?-->
        </div>

        <form>
          <span>{{ quiz }}</span>
          <div v-for="(question, questionIndex) in quiz.questions" :key="questionIndex">
            <h2>{{ question.question }}</h2>
            det här syns så länge det finns en fråga
            <div v-if="question.type === 'multiChoice'">
              det här borde synas om frågan är multiple choice
              <div v-for="(option, optionIndex) in question.options" :key="optionIndex">
                <input type="checkbox" :checked="userAnswers[questionIndex] === optionIndex" @change="answerSwitch(questionIndex, optionIndex)"/>
                <span>{{ option }}</span>
              </div>
            </div>
            <div v-else-if="question.type === 'textAnswer'">
              det här ser du om det är en textfråga
              <input type="text" v-model="question.answer">
            </div>

          </div>

          <div style="display: flex; justify-content: space-between;">
            <button type="button" class="submit-btn" @click="submitQuiz">{{ uiLabels.submit }}</button>
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
      this.$router.push("/"); //add this when there is another home screen
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
        console.log(quiz);
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
      this.userAnswers[questionIndex] = optionIndex
    },
    submitQuiz() {
      // Logic to submit the quiz
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

@media screen and (max-width: 50em) {

  input[type="text"],
  input[type="password"] {
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