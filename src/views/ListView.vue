<template>
  <div class="wrapper">
    <header>
      <router-link to="/">{{ uiLabels.home }}</router-link>
      <router-link to="/">{{ uiLabels.signOut }}</router-link>
    </header>

    <div class="container">
        <h2>{{ uiLabels.QuestionnaireList }}</h2>

        <div class="nestled-div">
            <span>{{uiLabels.quiz}} 1</span> <!-- TODO: change hardcoded "1" into dynamic counting -->
            <button class="black-button" @click="shareQuiz(1)"> {{ uiLabels.share }}</button>
            <router-link class="black-button" to="/result">{{uiLabels.viewResult}}</router-link>
        </div>

        <!-- TODO: need to make this router-link, but still blue -->
        <div class="new-quiz">
            <router-link class="blue-button" to='/createquiz'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                    <path d="M8 4a.5.5 0 0 1.5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
                {{uiLabels.newQuiz}}
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
      hideNav: true
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
    toggleNav() {
      this.hideNav = ! this.hideNav;
    },
    shareQuiz(quizId) {
      const quizLink = `${window.location.origin}/quizzes/${quizId}`;
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