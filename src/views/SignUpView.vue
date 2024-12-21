<template>
  <div class="wrapper">
    <header>
    <div>
      <router-link to="/">{{ uiLabels.home }}</router-link>
    </div>

    <div>
      <router-link to="/signin">{{ uiLabels.signIn }}</router-link>
    </div>
  </header>

    <form>
      <label for="email">{{ uiLabels.email }}</label>
      <input type="email" id="email" value="">
      <label for="password">{{ uiLabels.password }}</label>
      <input type="password" id="password" value="">
      <label for="confirm-password">{{uiLabels.confirmPassword}}</label>
      <input type="password" id="confirm-password" value="">
      <div class="checkbox">
        <input type="checkbox" class="my-checkbox" id="remember-me">
        <label for="remember-me">{{ uiLabels.rememberMe }}</label>
      </div>

      <router-link type="submit" to="/List">{{ uiLabels.signUp }}</router-link>
      <p id="passwordError" style="color: red; display: none;">{{uiLabels.noMatch}}</p> 
    </form>

    <!-- TODO:
    <script>
      const passwordInput = document.getElementById('password');
      const confirmPasswordInput = document.getElementById('confirm-password');
      const signupButton = document.getElementById('signupButton');
      const passwordError = document.getElementById('passwordError');

      signupButton.addEventListener('click', function (e) {
        e.preventDefault(); 

        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (password === confirmPassword) {
          passwordError.style.display = 'none'; 
        } else {
          passwordError.style.display = 'block'; 
        }
      });
    </script> -->

    <footer>
      <p>&copy; 2024 Questionnaire Star. All rights reserved.</p >
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
  
  footer {
    background-color: #f1f1f1;
    text-align: center;
    margin-top: auto;
  }
</style>