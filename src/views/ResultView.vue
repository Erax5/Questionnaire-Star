<template>
  <div class="wrapper">
    <header>
      <router-link to="/">{{ uiLabels.home }}</router-link>
      <router-link to="/">{{ uiLabels.signOut }}</router-link>
    </header>
    
      <div class="container">
      <div class="header">
          <h2>{{uiLabels.result}}</h2>
      </div>

      <table class="results-table">
      </table>
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
    }
  }
}
</script>
<style scoped>
  /* body {
    font-family: Arial, sans-serif;
    font-size: 1.5vw;
    background-color: white;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
} */

  /* :root {
      --body-font-size-percentage: 100%;
  }

  header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5em;
      border-bottom: 1px solid #ddd;
  } */

  /* 
  h1 {
      font-size: 1.2rem;
      margin: 0;
      position: absolute;
      top: 20px;
      left: 20px;
  }

  h2 {
      text-align: center;
      font-size: 2em;
  } */

  .wrapper {
    background-color: #f9f9f9;
  }
  
  footer {
    background-color: #f1f1f1;
    text-align: center;
    margin-top: auto;
  }

  @media screen and (max-width: 50em) {
    footer{
      font-size: 2vw; 
      padding: 0.5em;
    }

    div{
      font-size: 2vw; 
    }
  }
</style>