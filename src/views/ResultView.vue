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
      lang: localStorage.getItem("lang") || "en",
      hideNav: true,
      username: "",  
      results: [],
      userData: {},
      quizData: {}, 
      colors: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']
    }
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

    let hasQuiz = false;
    let hasAnswers = false;

    socket.on("quiz", quiz => {
      console.log("Received quiz data:", quiz);
      this.quizData = quiz;
      hasQuiz = true;
      if (hasAnswers) {
        this.processAnswers();
      }
    });

    socket.on("answers", answers => {
      console.log("Received answers data:", answers);
      const userAnswers = answers[this.username];
      if (!userAnswers) {
        console.error(`No answers found for user: ${this.username}`);
        return;
      }

      this.userData = {
        userId: this.username,
        answers: userAnswers
      };

      hasAnswers = true;
      if (hasQuiz) {
        this.processAnswers();
      }
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

    processAnswers() {
      console.log("Processing answers...");
      
      if (!this.quizData?.questions || !this.userData?.answers) {
        console.error("Missing data:", {
          hasQuestions: Boolean(this.quizData?.questions),
          hasUserAnswers: Boolean(this.userData?.answers)
        });
        return;
      }

      const userAnswers = this.userData.answers;
      const questions = this.quizData.questions;

      if (!Array.isArray(userAnswers) || !Array.isArray(questions)) {
        console.error("Invalid data format:", {
          userAnswers: typeof userAnswers,
          questions: typeof questions
        });
        return;
      }

      if (userAnswers.length !== questions.length) {
        console.error("Answer/question length mismatch:", {
          answersLength: userAnswers.length,
          questionsLength: questions.length
        });
        return;
      }

      this.results = questions.map((question, index) => {
        const answer = userAnswers[index];
        console.log(`Processing question ${index + 1}:`, { question, answer });

        let data = [];
        
        // 处理选择题
        if (question.options && Array.isArray(question.options)) {
          // 创建一个值数组，初始化为0
          const values = new Array(question.options.length).fill(0);
          
          // 处理多选答案
          if (Array.isArray(answer)) {
            answer.forEach(answerIndex => {
              if (answerIndex >= 0 && answerIndex < values.length) {
                values[answerIndex] = 1;
              }
            });
          } 
          // 处理单选答案
          else if (answer !== null && answer !== undefined) {
            const answerIndex = parseInt(answer);
            if (answerIndex >= 0 && answerIndex < values.length) {
              values[answerIndex] = 1;
            }
          }

          // 生成数据对象
          data = question.options.map((option, index) => ({
            name: option,
            value: values[index]
          }));
        } 
        // 处理文本题
        else {
          data = [{
            name: answer || "No answer provided",
            value: 1
          }];
        }

        return {
          question: question.question,
          data: data
        };
      });

      console.log("Processed results:", this.results);
    },

    getChartOptions(result) {
      return {
        chart: {
          type: 'pie',
          width: '50%',
          height: '50%'
        },
        labels: result.data.map(item => item.name),
        colors: this.colors,
        legend: {
          position: 'bottom',
          fontSize: '14px'
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
                fontSize: '12px'
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
              position: 'bottom',
              fontSize: '14px'
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
                    fontSize: '12px'
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
}
</script>
