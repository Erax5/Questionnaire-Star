<template>
  <div class="wrapper">
    <header>
      <router-link to="/">{{ uiLabels.home }}</router-link>
      <div>
        <span style="margin-right: 1em;">{{ uiLabels.loggedIn }} {{ username }}</span>
        <button @click="logOut()" style="margin-right:1em">{{ uiLabels.signOut }}</button>
      </div>
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
      hideNav: true,
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