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
        <router-link to="/signin">{{ uiLabels.signIn }}</router-link>
      </div>
    </header>

    <div class="login-div">
      <label for="email">{{ uiLabels.email }}</label>
      <input type="text" id="email" value="">
      <label for="password">{{ uiLabels.password }}</label>
      <input type="text" id="password" value="">
      <label for="confirm-password">{{uiLabels.confirmPassword}}</label>
      <input type="text" id="confirm-password" value="">
      <div class="checkbox">
        <input type="checkbox" id="remember-me">
        <label for="remember-me">{{ uiLabels.rememberMe }}</label>
      </div>

      <router-link class="blue-button" style="display:inline-block" to="/home">{{ uiLabels.signUp }}</router-link>
      <p id="passwordError" style="color: red; display: none;">{{uiLabels.noMatch}}</p> 
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
  name: 'SignUpView',
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

.checkbox {
  display: flex;
  align-items: center;
  margin-bottom: 1em;
}

.checkbox label {
  font-size: 0.8em;
  margin-left: 0.4em;
}

  @media screen and (max-width: 50em) {

    footer{
      font-size: 2vw; 
    }

    div{
      font-size: 2.2vw; 
    }

    .checkbox label {
      font-size: 1.2em;
      margin-left: 0.3em;
    }
  }
</style>