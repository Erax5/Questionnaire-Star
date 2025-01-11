<template>
  <div class="wrapper">
    <header>
        <router-link to="/">{{ uiLabels.home }}</router-link>
    </header>
    
    <!-- HTML from user_view.html -->
    <div class="container">
        <div>
            <h1>{{ uiLabels.Questionnaire }}</h1>
            <!--Place to enter quiz id or similar?-->
        </div>

        <form>
            <p>//This place will show the questions set by admin.</p>
            <button type="button" class="submit-btn" onclick="window.location.href='user_view_thank.html';">{{ uiLabels.submit }}</button>
        </form>
    </div>

    <main>
      <form>

      </form>
    </main>
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
  name: 'UserView',
  components: {
    ResponsiveNav
  },
  data() {
    return {
      uiLabels: {},
      newPollId: "",
      lang: localStorage.getItem( "lang") || "en",
      hideNav: true,
    };
  },
  created() {
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.emit( "getUILabels", this.lang );
  },
  methods: {

  },
};
</script>

<style scoped>
.wrapper
{
    background-color: #f9f9f9;
}
footer {
    background-color: #f1f1f1;
    text-align: center;
    margin-top: auto;
  }

@media screen and (max-width: 50em) {

  input[type="text"],
  input[type="password"] {
    padding: 0.6em; /* Adjust padding for smaller devices */
  }

  footer{
    font-size: 2vw; 
    padding: 0.5em;
  }

  div{
    font-size: 2vw; 
    padding: 1em;
  }

  .checkbox {
    flex-direction: row;
  }

  .checkbox label {
    font-size: 1.2em; /* Adjust font size for smaller screens */
    margin-left: 0.3em; /* Remove margin to prevent offset */
  }
}
</style>