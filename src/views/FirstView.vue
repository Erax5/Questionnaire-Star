<template>
  <div class="wrapper">
    <header>
      <div style="width:33%; align-items: center;">
        <span style="margin-left:0.5em; font-size: 1.1em">{{ uiLabels.home }}</span>
      </div>
      <div style="width:34%; display: flex; justify-content: center; align-items: center;">
        <select v-model="lang" @change="switchLanguage">
          <option value="en">English</option>
          <option value="sv">Svenska</option>
          <option value="cn">中文</option>
        </select>
      </div>
      <div style="width:33%; display: flex; justify-content: right; align-items: center;">
      </div>
    </header>

    <div class="welcome">
      <h1>{{uiLabels.welcome}}</h1> 
    </div>

    <div class="container" style="margin-left: 20em; margin-right: 20em; margin-bottom: 10em; display: flex; justify-content: center;">
      <router-link to="/signin" style="margin-right:2em">{{ uiLabels.signIn }}</router-link>
      <router-link to="/signup">{{ uiLabels.signUp }}</router-link>
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
  name: 'FirstView',
  components: {
    ResponsiveNav
  },
  data() {
    return {
      uiLabels: {},
      newPollId: "",
      lang: localStorage.getItem("lang") || "en",
      hideNav: true,
      username: this.getCookie("username") || ""
    }
  },
  created() {
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.emit( "getUILabels", this.lang );

    const username = this.getCookie("username");
    if (username) {
      this.$router.push("/home"); //add this when there is another home screen
      console.log("User is logged in");
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
    flex-grow: 1;
  }
</style>