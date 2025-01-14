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

      <!-- <p> {{ allAnswers }}</p> -->
      <!-- <p> {{ quizData }}</p> -->
       <!-- <p> {{ results }}</p> -->

      <div class="space-y-8 w-full max-w-4xl mx-auto p-4">
        <div v-if="allAnswers && quizData.questions && results.length > 0">
          <div v-for="(result, index) in results" :key="index" class="card">
            <div class="card-header">
              <h3 class="text-lg font-medium">
                {{ uiLabels.question }} {{ index + 1 }}: {{ result.question }}
              </h3>
            </div>
            <div class="card-content">
              <div v-if="result.type === 'multiChoice'" class="chart-container" style="display: flex; justify-content: center;">
                <VueApexCharts
                  type="pie"
                  :options="getChartOptions(result)"
                  :series="result.data.map(item => item.value)"
                />
              </div>
              <div v-else-if="result.type === 'textAnswer'" class="answers-list">
                <p v-for="(answer, answerIndex) in result.data" :key="answerIndex" style="font-size: 1em; margin-left: 1em;">
                  {{ uiLabels.result }} {{ answerIndex + 1 }}: {{ answer }}</p>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <p style="font-size: 1em; display: flex; justify-content: center;">{{ uiLabels.noResults }}</p>
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
import VueApexCharts from 'vue3-apexcharts';
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'ResultView',
  components: {
    ResponsiveNav,
    VueApexCharts
  },
  data() {
    return {
      uiLabels: {},
      lang: localStorage.getItem("lang") || "en",
      username: "",  
      results: [],
      quizData: {}, 
      allAnswers: {},
      colors: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']
    };
  },
  created() {
    this.username = this.getCookie("username") || "";
    socket.on("uiLabels", labels => this.uiLabels = labels);
    socket.emit("getUILabels", this.lang);

    if (!this.username) {
      console.log("User is not logged in: returning to login screen");
      this.$router.push("/");
      return;
    }

    const quizId = this.$route.params.id;
    if (!quizId) {
      console.log("No quiz id provided");
      this.$router.push("/list");
      return;
    }

    socket.on("quiz", quiz => {
      console.log("Received quiz data:", quiz);
      this.quizData = quiz;
      this.processResults();
    });

    socket.on("answers", answers => {
      console.log("Received answers data:", answers);
      this.allAnswers = answers;
      this.processResults();
    });

    socket.emit("getQuiz", quizId);
    socket.emit("getAnswers", quizId);
  },
  methods: {
    getCookie(name) {
      const nameEQ = name + "=";
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
      }
      return null;
    },

    switchLanguage() {
      localStorage.setItem("lang", this.lang);
      socket.emit("getUILabels", this.lang);
    },

    logOut() {
      document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      console.log("User logged out");
      this.$router.push("/");
    },

    processResults() {
      if (!this.quizData?.questions || !this.allAnswers) {
        console.error("Missing data:", {
          hasQuestions: Boolean(this.quizData?.questions),
          hasAnswers: Boolean(this.allAnswers)
        });
        return;
      }

      this.results = this.quizData.questions.map((question, index) => {
        const data = [];
        const type = question.type;

        if (type === 'multiChoice') {
          const optionCounts = new Array(question.options.length).fill(0);
          Object.values(this.allAnswers).forEach(userAnswers => {
            const answer = userAnswers[index];
            if (Array.isArray(answer)) {
              answer.forEach(answerIndex => {
                if (answerIndex >= 0 && answerIndex < optionCounts.length) {
                  optionCounts[answerIndex]++;
                }
              });
            } else if (answer !== null && answer !== undefined) {
              const answerIndex = parseInt(answer);
              if (answerIndex >= 0 && answerIndex < optionCounts.length) {
                optionCounts[answerIndex]++;
              }
            }
          });

          data.push(...question.options.map((option, i) => ({
            name: option,
            value: optionCounts[i]
          })));
        } 
        else {
          Object.values(this.allAnswers).forEach(userAnswers => {
          const answer = userAnswers[index];
          if (answer) {
            data.push(answer);
          }
        });
        }

        return { question: question.question, data, type };
      });
    },

    getChartOptions(result) {
      return {
        chart: {
          type: 'pie',
          width: '50vw',
          height: '50vh'
        },
        labels: result.data.map(item => item.name),
        colors: this.colors,
        legend: {
          fontSize: '15em'
        },
        tooltip: {
          y: {
            formatter: (value) => {
              const total = result.data.reduce((sum, item) => sum + item.value, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${percentage}%`;
            }
          }
        },
        plotOptions: {
          pie: {
            dataLabels: {
              enabled: true,
              offset: -5,
              style: {
                fontSize: '15em'
              }
            },
            expandOnClick: true,
            size: '70%'
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
              fontSize: '15em'
            },
            tooltip: {
              y: {
                formatter: (value) => {
                  const total = result.data.reduce((sum, item) => sum + item.value, 0);
                  const percentage = ((value / total) * 100).toFixed(1);
                  return `${percentage}%`;
                }
              }
            },
            plotOptions: {
              pie: {
                dataLabels: {
                  enabled: true,
                  offset: -5,
                  style: {
                    fontSize: '15em'
                  }
                },
                expandOnClick: true,
                size: '40%'
              }
            },
          }
        }]
      };
    }
  }
};
</script>
