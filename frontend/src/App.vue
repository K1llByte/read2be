<template>

   <v-app>

      <MenuBarLoggedIn v-if="this.$cookies.isKey('token')" />
      <MenuBar v-else />

      <v-main>
         <v-container fluid>
            <router-view :key="$route.path" />
         </v-container>
      </v-main>

      <Footer />
   </v-app>
</template>

<script>
import MenuBar from './components/MenuBar.vue';
import MenuBarLoggedIn from './components/MenuBarLoggedIn.vue';
import Footer from './components/Footer.vue';

export default {
   name: 'App',

   components: {
      MenuBar,
      MenuBarLoggedIn,
      Footer,
   },

   data: () => ({
   }),

   beforeCreate: function() {
      if (!this.$cookies.isKey('token')) {
         this.$router.push('/');
      }
      else if (this.$cookies.isKey('token') && this.$route.path == '/') {
         this.$router.push('/home');
      }
   },

};
</script>


<style lang="scss">
   #app {
      font-family: Avenir, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-align: center;
      background: #f6eaea;
   }
   @font-face {
      font-family: "ArmWrestler";
      src: local("ArmWrestler"),
         url(./fonts/ArmWrestler/ArmWrestler.ttf) format("truetype");
   }
   .armwrestler {
      font-family: 'ArmWrestler', bold;
      font-size: 230%;
      margin:auto;
      color:#fff7f6;
   }
   .armwrestler.x-small {
      font-family: 'ArmWrestler', bold;
      font-size: 130% !important;
   }
   .armwrestler.small {
      font-family: 'ArmWrestler', bold;
      font-size: 200% !important;
   }
   .armwrestler.medium {
      font-family: 'ArmWrestler', bold;
      font-size: 280% !important;
      margin:auto;
   }
   .armwrestler.large {
      font-family: 'ArmWrestler', bold;
      font-size: 330% !important;
      margin:auto;
   }
   .armwrestler.x-large {
      font-family: 'ArmWrestler', bold;
      font-size: 430% !important;
      margin:auto;
   }
   .armwrestler.dark {
      font-family: 'ArmWrestler', bold;
      font-size: 430%;
      margin:auto;
      color:#936464 !important;
   }
   .armwrestler.cadet {
      font-family: 'ArmWrestler', bold;
      font-size: 170%;
      margin:auto;
      margin-top: 10px;
      margin-bottom: 10px;
      color:#5F9EA0;
   }
   .main-color {
      font-family: 'ArmWrestler', bold;
      color: #a57474;
   }
</style>