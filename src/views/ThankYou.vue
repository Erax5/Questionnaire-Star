<template>
  <div class="wrapper">
    <header>
      <div style="width:33%; align-items: center;">
        <router-link to="/home">{{ uiLabels.home }}</router-link>
      </div>
    </header>
    <div class="container">
      <div class="thank-you">
        <h1>{{ uiLabels.thankYou }}</h1> 
      </div>
      <div class="nestled-container">
        <router-link to="/list">{{ uiLabels.back }}</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import ResponsiveNav from '@/components/ResponsiveNav.vue';
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'ThankYou',
  components: {
    ResponsiveNav
  },
  data() {
    return {
      uiLabels: {},
      lang: localStorage.getItem("lang") || "en"
    };
  },
  created() {
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.emit( "getUILabels", this.lang );
  }
};
</script>

