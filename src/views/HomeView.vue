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
        <span style="width:33%; margin-right: 1em;">{{ uiLabels.loggedIn }} {{ username }}</span>
        <button @click="logOut()" style="width:30%; margin-right:1em">{{ uiLabels.signOut }}</button>
        <router-link to="/user-view">{{ uiLabels.quiz }}</router-link>
      </div>
    </header>

    <div class="welcome">
      <h1>{{uiLabels.welcome}}</h1> 
    </div>

    <div class="container" style="margin-left: 30%; margin-right: 30%; margin-bottom: 15%; display: flex; justify-content: center;">
      <router-link class="blue-button" to="/list" style="margin-right:2em">{{ uiLabels.Quizzes }}</router-link>
      <router-link class="blue-button" to="/createquiz">{{ uiLabels.create }}</router-link>
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
      lang: localStorage.getItem("lang") || "en",
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
    switchLanguage() {
      localStorage.setItem( "lang", this.lang );
      socket.emit( "getUILabels", this.lang );
    },
    toggleNav() {
      this.hideNav = ! this.hideNav;
    },
    logOut() {
      document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      console.log("User logged out");
      this.$router.push("/");
    },
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