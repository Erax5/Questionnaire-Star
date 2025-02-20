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
        <button @click="logOut()" style="margin-right:1em">{{ uiLabels.signOut }}</button>
      </div>
    </header>

    <div class="container">
      <div class="header">
        <h2>{{uiLabels.result}}</h2>
      </div>

      <div class="space-y-8 w-full max-w-4xl mx-auto p-4">
        <div v-if="allAnswers && quizData.questions && results.length > 0">
          <div v-for="(result, index) in results" :key="index" class="card">
            <div class="card-header">
              <h3 class="text-lg font-medium">
                {{ uiLabels.question }} {{ index + 1 }}: {{ result.question }}
              </h3>
            </div>
            
            <div class="card-content">
              <div v-if="result.type === 'multiChoice'" class="chart-wrapper">
                <div class="chart-container">
                  <VueApexCharts
                    ref="chart"
                    type="pie"
                    :options="getChartOptions(result)"
                    :series="result.data.map(item => item.value)"
                  />
                </div>
              </div>
              <div v-else-if="result.type === 'textAnswer'" class="answers-list">
                <p v-for="(answer, answerIndex) in result.data" :key="answerIndex" style="font-size: 1em; margin-left: 1em;">
                  {{ uiLabels.user }} {{ answerIndex + 1 }}: {{ answer }}</p>
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
  mounted() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
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

    handleResize() {
      if (this.$refs.chart) {
        const charts = Array.isArray(this.$refs.chart) ? this.$refs.chart : [this.$refs.chart];
        charts.forEach(chart => {
          if (chart && chart.chart) {
            chart.chart.updateOptions(this.getChartOptions());
          }
        });
      }
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
        } else {
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
      const vw = window.innerWidth;

      const calculateFontSize = () => {
        if (vw <= 480) {
          return '12px'; 
        } else if (vw <= 768) {
          return '14px'; 
        } else {
          const baseSize = Math.min(Math.max(vw * 0.015, 8), 30);
          return `${baseSize}px`; 
        }
      };

      const calculateLegendSize = () => {
        if (vw <= 480) {
          return '10px'; 
        } else if (vw <= 768) {
          return '12px';
        } else {
          const baseSize = Math.min(Math.max(vw * 0.015, 8), 30);
          return `${baseSize}px`; 
        }
      };

      const calculateLableDataSize = () => {
        if (vw <= 480) {
          return '8px'; 
        } else if (vw <= 768) {
          return '10px';
        } else {
          const baseSize = Math.min(Math.max(vw * 0.010, 5), 25);
          return `${baseSize}px`; 
        }
      };

      return {
        chart: {
          type: 'pie',
          animations: {
            enabled: true,
            speed: 500,
            animateGradually: {
              enabled: true,
              delay: 150
            },
            dynamicAnimation: {
              enabled: true,
              speed: 350
            }
          },
          redrawOnWindowResize: true,
          redrawOnParentResize: true
        },
        labels: result.data.map(item => item.name),
        colors: this.colors,
        legend: {
          position: 'bottom',
          fontSize: calculateLegendSize(),
          horizontalAlign: 'center',
          floating: false,
          itemMargin: {
            horizontal: Math.max(vw * 0.008, 3), 
            vertical: Math.max(vw * 0.002, 2)
          },
          formatter: function(seriesName, opts) {
            return [seriesName]
          }
        },
        tooltip: {
          style: {
            fontSize: calculateFontSize()
          },
          y: {
            formatter: (value) => {
              const total = result.data.reduce((sum, item) => sum + item.value, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${value} (${percentage}%)`;
            }
          }
        },
        dataLabels: {
          style: {
            fontSize: calculateLableDataSize()
          }
        }
      };
    }    
  }
};
</script>

<style scoped>
.card-content {
  display: flex;
  justify-content: center;
  width: 100%;
}

.chart-wrapper {
  width: 100%;
  max-width: 15em; 
  padding: 0.5rem;
  margin: 0 auto; 
  display: flex;
  justify-content: center;
}

.chart-container {
  position: relative;
  width: 100%;
  padding-top: 100%; 
}

.chart-container :deep(> div) {
  position: absolute !important;
  top: 0;
  left: 0;
  width: 100% !important;
  height: 100% !important;
}

@media (max-width: 1024px) {
  .chart-wrapper {
    max-width: 280px;
  }
  .container{
    min-width:80%;
  }
}

@media (max-width: 768px) {
  .chart-wrapper {
    max-width: 200px;
  }
}

@media (max-width: 480px) {
  .chart-wrapper {
    max-width: 200px;
    padding: 0.5rem;
  }
}
</style>
