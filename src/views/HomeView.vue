<template>
  <div class="wrapper">
    <header>
      <div>
        <router-link to="/">{{ uiLabels.home }} </router-link>
      </div>

      <!-- If this drop down should only be visible on this screen we need to fix the alignment of the header -->
      <div class="language-select">
        <select v-model="lang" @change="switchLanguage">
          <option value="en">English</option>
          <option value="sv">Swedish</option>
        </select>
      </div>

      <div>
        <router-link to="/signin">{{uiLabels.signIn}}</router-link>
        <router-link to="/signup">{{uiLabels.signUp}}</router-link>
      </div>
    </header>

    <h1>{{uiLabels.welcome}}</h1>

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
<style>
  select { /* TODO: this drop down menu shifts spots when changing languages*/
    width: 120px;
    padding: 5px;
    font-size: 1em; 
    background-color: #f1f1f1;
  }

  footer {
    background-color: #f1f1f1;
    text-align: center;
    margin-top: auto;
  }
</style>