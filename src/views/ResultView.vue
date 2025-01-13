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
        <span style="width:40%; margin-right: 1em;">{{ uiLabels.loggedIn }} {{ username }}</span>
        <button @click="logOut()" style="margin-right:1em">{{ uiLabels.signOut }}</button>
      </div>
    </header>
    
      <div class="container">
      <div class="header">
          <h2>{{uiLabels.result}}</h2>
      </div>

      <div class="space-y-8 w-full max-w-4xl mx-auto p-4">
        <div v-for="(result, index) in results" :key="index" class="card">
          <div class="card-header">
            <h3 class="text-lg font-medium">
              Question {{ index + 1 }}: {{ result.question }}
            </h3>
          </div>
          <div class="card-content">
            <div class="chart-container" style="height: 300px;">
              <VueApexCharts
                type="pie"
                :options="getChartOptions(result)"
                :series="result.data.map(item => item.value)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer>
      <p>&copy; {{uiLabels.footer}}</p>
    </footer>
  </div>
</template>

<script>
import ResponsiveNav from '@/components/ResponsiveNav.vue';
import VueApexCharts from 'vue3-apexcharts'
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'HomeView',
  components: {
    ResponsiveNav,
    VueApexCharts
  },
  data() {
    return {
      uiLabels: {},
      newPollId: "",
      lang: localStorage.getItem( "lang") || "en",
      hideNav: true,
      username: this.getCookie("username") || "",
      results: [],
      userData: {},
      quizData: [],


      userDataExample: {
        "userId": ["0", "2", "banana"]
      },
      quizDataExample: {
        "questions": [
          {
            "questionType": "multiChoice",
            "question": "What is the capital of France?",
            "options": ["Paris", "London", "Berlin", "Madrid"],
            "answer": "0"
          },
          {
            "questionType": "multiChoice",
            "question": "Which planet is known as the red Planet?",
            "options": ["Mars", "Earth", "Venus", "Pluto"],
            "answer": "1"
          },
          {
            "questionType": "textAnswer",
            "question": "What is my favorite fruit?",
            "answer": "banana"
          }
        ]
      },
      colors: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']
    }
  },
  created() {
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.emit( "getUILabels", this.lang );

    const username = this.getCookie("username");
    if (!username) {
      console.log("User is not logged in: returning to login screen");
      this.$router.push("/"); 
    }

    // Logic to get the questions from the server
    const quizId = this.$route.params.id;
    if (!quizId) {
      console.log("No quiz id provided");
      this.$router.push("/list");
    }
    else {
      socket.emit("getQuiz", quizId);
      socket.on("quiz", quiz => {
        this.quizData = quiz;
        console.log(this.quizData);
      });

      socket.emit("getAnswers", quizId);
      socket.on("answers", answers => {
        this.userData = answers;
        console.log(this.userData);
      });
    }
    // this.processAnswers()
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
    processAnswers() {
      this.results = this.quizData.questions.map((q, index) => {
        if (q.questionType === "multiChoice") {
          const data = q.options.map((option, optIndex) => ({
            name: option,
            value: this.userData.answers[index] === optIndex.toString() ? 1 : 0
          }));
          return {
            question: q.question,
            type: q.questionType,
            data: data
          };
        } else if (q.questionType === "textAnswer") {
          return {
            question: q.question,
            type: q.questionType,
            data: [{
              name: this.userData.answers[index],
              value: 1
            }]
          };
        }
      });
    },
    getChartOptions(result) {
      return {
        chart: {
          type: 'pie',
          width: '100%',
          height: '100%'
        },
        labels: result.data.map(item => item.name),
        colors: this.colors,
        legend: {
          position: 'bottom'
        },
        tooltip: {
          y: {
            formatter: (value) => {
              const total = result.data.reduce((sum, item) => sum + item.value, 0);
              const percentage = ((value / total) * 100).toFixed(0);
              return `${percentage}%`;
            }
          }
        },
        plotOptions: {
          pie: {
            dataLabels: {
              offset: -5
            },
            size: '70%' 
          }
        }
      }
    }
  }
}
</script>
<style scoped>
  .wrapper {
    background-color: #f9f9f9;
  }
  
  footer {
    background-color: #f1f1f1;
    text-align: center;
    margin-top: auto;
  }

  .card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 1.5rem;
  }

  .card-header {
    padding: 1.5rem;
    border-bottom: 1px solid #eee;
  }

  .card-content {
    padding: 1.5rem;
  }

  .chart-container {
    width: 100%;
    min-height: 250px; 
    max-width: 500px;
    margin: 0 auto; 
  }

  @media screen and (max-width: 50em) {
    footer{
      font-size: 2vw; 
      padding: 0.5em;
    }

    div{
      font-size: 2vw; 
    }
  }
</style>