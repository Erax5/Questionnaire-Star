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
        <h2>{{ uiLabels.QuestionnaireList }}</h2>

        <div v-for="(quiz, index) in quizzes" :key="index" class="nestled-div" style="cursor:pointer;" @click.self="playQuiz(index)">
          <div @click.self="playQuiz(index)" style="width:50%; display: flex; justify-content: space-between; align-items: center;"><span style="user-select: none;" @click.self="playQuiz(index)">{{uiLabels.Questionnaire}} {{index+1}}</span> <!-- TODO: change hardcoded "1" into dynamic counting -->
          <span @click.self="playQuiz(index)" style="margin-left:2em; user-select: none;">{{uiLabels.creator}} {{ quiz.creatorId }}</span></div>
          
          <div @click.self="playQuiz(index)">
            <button class="black-button" @click="shareQuiz(index)"> {{ uiLabels.share }}</button>
            <button class="black-button" v-if="isCreator(index)" style="margin-left:1em;"  @click="viewResults(index)">{{uiLabels.viewResult}}</button>
          </div>
        </div>

        <!-- TODO: need to make this router-link, but still blue -->
        <div class="new-quiz">
            <router-link class="blue-button" to='/create'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                    <path d="M8 4a.5.5 0 0 1.5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
                {{uiLabels.create}}
            </router-link>
        </div>
    </div>

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
  name: 'HomeView',
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
      quizzes: [],
    }
  },
  created() {
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.emit( "getUILabels", this.lang );
    socket.on( "quizzes", quizzes => this.quizzes = quizzes );
    socket.emit( "getQuizzes" );

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
    isCreator(quizIndex) {
      return this.username === this.quizzes[quizIndex].creatorId;
    },
    playQuiz(quizIndex) {
      console.log(`Playing quiz ${quizIndex}`);
      this.$router.push(`/questionnaires/${quizIndex}`);
    },
    viewResults(quizIndex) {
      console.log(`Viewing results for quiz ${quizIndex}`);
      this.$router.push(`/results/${quizIndex}`);
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
    toggleNav() {
      this.hideNav = ! this.hideNav;
    },
    shareQuiz(quizId) {
      const quizLink = `${window.location.origin}/questionnaires/${quizId}`;
      navigator.clipboard.writeText(quizLink).then(() => {
      alert(this.uiLabels.linkCopy); // TODO: change to nicer window than an alert
      }).catch(err => {
      console.error(this.uiLabels.failedCopy, err);
      });
    }
  }
}
</script>
<style scoped>

  .new-quiz {
    display: flex;
    justify-content: center;
    margin-top: 1.5em;
  }

  .new-quiz a svg {
    margin-right: 0.3em;
  } 
</style>