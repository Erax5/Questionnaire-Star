<template>
  <div class="wrapper">
    <header>
      <div>
        <router-link to="/">{{ uiLabels.home }}</router-link>
      </div>

      <!-- If this drop down should only be visible on this screen we need to fix the alignment of the header -->
      <select v-model="lang" @change="switchLanguage">
        <option value="en">English</option>
        <option value="sv">Svenska</option>
        <option value="cn">中文</option>
      </select>

      <div>
        <router-link to="/signin">{{ uiLabels.signIn }}</router-link>
        <router-link to="/signup">{{ uiLabels.signUp }}</router-link>
        <router-link to="/user-view">{{ uiLabels.quiz }}</router-link>
      </div>
    </header>

    <div class="welcome">
      <h1>{{uiLabels.welcome}}</h1> 
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
    }
  }
}
</script>
<style scoped>
  .welcome {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1; /* Allow the content to fill available space */
    text-align: center;
  }

  .wrapper {
    background-color: #f9f9f9;
  }

  footer {
    background-color: #f1f1f1;
    text-align: center;
    margin-top: auto;
  }

  @media screen and (max-width: 50em) {
    select {
      font-size: 1.5vw; 
      padding: 1em; 
      min-width: 70px;
    }

    footer{
      font-size: 2vw; 
      padding: 0.5em;
    }

    div{
      font-size: 2vw; 
      padding: 1em;
    }
  }
</style>