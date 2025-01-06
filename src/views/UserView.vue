<template>
  <div class="wrapper">
    <header>
      <div>
        <router-link to="/">{{ uiLabels.home }}</router-link>
      </div>
    
    <!-- HTML from user_view.html -->
    <div class="container">
        <span>Questionnaire Star</span>
        <div class="header">
            <h1>Questionnaire</h1>
            <!--Place to enter quiz id or similar?-->
        </div>

        <form>
            <p>//This place will show the questions set by admin.</p>
            <button type="button" class="submit-btn" onclick="window.location.href='user_view_thank.html';">Submit</button>
        </form>
    </div>

    </header>
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
export default {
  name: 'UserView',
  data() {
    return {
      
    };
  },
  methods: {

  },
};
</script>

<style scoped>
.user-view {
  /* add more styles */
  footer {
    background-color: #f1f1f1;
    text-align: center;
    margin-top: auto;
  }
}
</style>