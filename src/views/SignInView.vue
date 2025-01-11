<template>
  <div class="wrapper">
    <header>
      <router-link to="/">{{ uiLabels.home }}</router-link>
      <router-link to="/signup">{{ uiLabels.signUp }}</router-link>
    </header>

    <form>
      <label for = "email">{{uiLabels.email}}</label>
      <input type = "text" id = "email" value = "">
      <label for = "password">{{uiLabels.password}}</label>
      <input type = "password" id = "password" value = "">
      <div class = "checkbox">
        <input type = "checkbox" class="my-checkbox" id = "remember-me">
        <label for = "remember-me">{{uiLabels.rememberMe}}</label>
      </div>
      <router-link to="/list">{{ uiLabels.signIn }}</router-link>
    </form>

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
  name: 'SignInView',
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
  form {
    width: 18.75em;
    margin: 2em auto;
    border: 1px solid #ccc;
    border-radius: 0.3125em;
    padding: 5em;
    box-shadow: 0 0 0.3125em rgba(0, 0, 0, 0.1);
  }

  input[type = "text"],
  input[type = "email"],
  input[type = "password"] {
    width: 100%;
    height: 1em;
    padding: 0.7em;
    margin-bottom: 1.5em;
    border: 1px solid #ccc;
    border-radius: 0.1875em;
  }

.wrapper {
  background-color: #f9f9f9;
}

  .checkbox {
    display: flex;
    align-items: center;
    margin-bottom: 1em;
  }

  .checkbox label {
    font-size: 0.8em;
    margin-left: 0.4em;
  }

  /* .my-checkbox {
    width: 1em;
  }  */
  
  footer {
    background-color: #f1f1f1;
    text-align: center;
    margin-top: auto;
  }

  @media screen and (max-width: 50em) {

    input[type="text"],
    input[type="password"] {
      /* padding: 0.6em; */
    }

    footer{
      font-size: 2vw; 
      /* padding: 0.5em; */
    }

    div{
      font-size: 2.2vw; 
      /* padding: 1em; */
    }

    .checkbox {
      /* flex-direction: row; */
    }

    .checkbox label {
      font-size: 1.2em;
      margin-left: 0.3em;
    }
  }

</style>