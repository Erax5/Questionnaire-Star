<template>
  <div class="wrapper">
    <header>
      <div>
        <router-link to="/">{{ uiLabels.home }}</router-link>
      </div>
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
      <p>&copy; 2024 Questionnaire Star. All rights reserved.</p>
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
</style>