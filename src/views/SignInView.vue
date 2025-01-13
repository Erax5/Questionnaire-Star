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
        <router-link to="/signup">{{ uiLabels.signUp }}</router-link>
      </div>
    </header>

    <div class="login-div">
      <label for="username">{{ uiLabels.username }}:</label>
      <input type="text" v-model="username" id="username" required>
      <div class="checkbox">
        <input type="checkbox" class="my-checkbox" @click="switchRememberMe()" id="remember-me">
        <label for="remember-me">{{uiLabels.rememberMe}}</label>
      </div>
      <button class="blue-button" @click="login">{{ uiLabels.logIn }}</button>
    </div>

    <footer>
      <p>&copy; {{uiLabels.footer}}</p>
    </footer>
  </div>
</template>

<script>
import ResponsiveNav from '@/components/ResponsiveNav.vue';
import io from 'socket.io-client';
import router from '../router';
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
      hideNav: true,
      username: "",
      rememberMe: false
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
    switchRememberMe() {
      this.rememberMe = !this.rememberMe;
    },
    login() {
      if(this.username.trim() === "") {
        alert("Please enter a username");
        return;
      }
      if(this.rememberMe === true) this.setCookie("username", this.username, 1);
      else this.setSessionCookie("username", this.username);

      console.log("Logged in as: " + this.getCookie("username"));
      router.push("/home");
    },
    setCookie(cname, cvalue, days) {
      const d = new Date();
      d.setTime(d.getTime() + (days*24*60*60*1000));
      const expires = "expires="+ d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    },
    setSessionCookie(cname, cvalue) {
      document.cookie = cname + "=" + cvalue + ";path=/";
    },
    getCookie(name) {
      const nameEQ = name + "=";
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    }
  }
}
</script>
<style scoped>
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

  input[type="checkbox"] {
    width: 1.5em;
    height: 1.5em;
  } 
  input[type="label"] {
    font-size: 1.5em;
  }
  
  footer {
    background-color: #f1f1f1;
    text-align: center;
    margin-top: auto;
  }

  @media screen and (max-width: 50em) {

    footer{
      font-size: 2vw; 
      /* padding: 0.5em; */
    }

    div{
      font-size: 2.2vw; 
      /* padding: 1em; */
    }

    .checkbox label {
      font-size: 1.2em;
      margin-left: 0.3em;
    }
  }

</style>