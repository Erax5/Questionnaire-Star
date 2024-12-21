<template>
  <div class="wrapper">
    <header>
      <div>
        <router-link to="/">{{ uiLabels.home }}</router-link>
      </div>

      <div>
        <router-link to="/signup">{{ uiLabels.signUp }}</router-link>
      </div>
    </header>

    <div class="container">
        <main>
            <h2>Quiz 1</h2>
            <form>
                <div class="question-section">
                    <label for="question">Set your question:</label>
                    <input type="text" id="question"  />
                </div>

                <!-- Problem to solve: When delete option A, the label of the next option should be updated to A, and so on. -->
                <div class="options-section">
                    <label>Set your options:</label>
                    <div class="option">
                        <label for="option-a">A:</label>
                        <input type="text" id="option-a" />
                        <button type="button" class="remove-option">-</button>
                    </div>
                    <div class="option">
                        <label for="option-b">B:</label>
                        <input type="text" id="option-b"/>
                        <button type="button" class="remove-option">-</button>
                    </div>
                    <div class="option">
                        <label for="option-c">C:</label>
                        <input type="text" id="option-c"  />
                        <button type="button" class="remove-option">-</button>
                    </div>
                    <div class="option">
                        <label for="option-d">D:</label>
                        <input type="text" id="option-d" />
                        <button type="button" class="remove-option">-</button>
                    </div>
                </div>
                <div class="add-remove-buttons">
                    <button type="button" id="add-option">+ Add Option</button>
                </div>
                <div class="buttons">
                    <button type="button" class="done" onclick="window.location.href='choose_ques_type.html';">Done this question</button>
                    <button type="button" class="finish" onclick="window.location.href='list.html';">Finish</button>
                </div>
            </form>
        </main>
    </div>
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
<style scoped>
  .welcome {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1; /* Allow the content to fill available space */
    text-align: center;
  }

  footer {
    background-color: #f1f1f1;
    text-align: center;
    margin-top: auto;
  }
</style>