<template>
  <div class="wrapper">
    <header>
      <router-link to="/">{{ uiLabels.home }}</router-link>
      <router-link to="/">{{ uiLabels.signOut }}</router-link>
    </header>

    <div class="container">
        <h2>{{ uiLabels.QuestionnaireList }}</h2>

        <div class="quiz-item">
            <span>{{uiLabels.quiz}} 1</span> <!-- TODO: change hardcoded "1" into dynamic counting -->
            <button @click="shareQuiz(1)"> {{ uiLabels.share }}</button>
            <router-link to="/result" class="button" style="border: 1px solid #ccc; padding: 0.8em 1.2em; font-size: 1em;">{{uiLabels.viewResult}}</router-link>
        </div>

        <!-- TODO: need to make this router-link, but still blue -->
        <div class="new-quiz" onclick="window.location.href='/createquiz';">
            <button @click="window.location.href='/createquiz';">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                    <path d="M8 4a.5.5 0 0 1.5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
                {{uiLabels.newQuiz}}
            </button>
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

 .container {
    margin: 3em;
    background-color: white;
    border-radius: 1em;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
    padding: 2em;
  }

  .container h2 {
    font-size: 2em;
    margin: 0 0 1em 0;
  }

  .quiz-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1em;
    border: 1px solid #e0e0e0;
    border-radius: 0.5em;
    margin-bottom: 1em;
    background-color: #f5f5f5;
    transition: background-color 0.3s;
  }

  .quiz-item:hover {
    background-color: #ececec;
  }

  .quiz-item span {
    flex: 0.95;
  }

  .quiz-item button {
    background-color: #000000;
    border: 1px solid #ccc;
    padding: 0.8em 1.2em;
    font-size: 1em;
    border-radius: 0.5em;
    cursor: pointer;
  }

  .quiz-item button:hover {
    background-color: #464242;
  }

  .new-quiz {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1.5em;
  }

  .new-quiz button {
    display: flex;
    align-items: center;
    background-color: #007bff;
    color: white;
    border: none;
    padding: 0.7em 1em;
    font-size: 1em;
    border-radius: 0.5em;
    cursor: pointer;
  }

  .new-quiz button:hover {
    background-color: #0056b3;
  }

  .new-quiz button svg {
    margin-right: 0.3em;
  } 

  footer {
    background-color: #f1f1f1;
    text-align: center;
    margin-top: auto;
  }

.wrapper {
  background-color: #f9f9f9;
}
</style>