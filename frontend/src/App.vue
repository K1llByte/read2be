<template>

   <v-app>

      <MenuBarLoggedIn v-if="this.$logged" />
      <MenuBar v-else />

      <!-- Sizes your content based upon application components -->
      <v-main>

         <!-- Provides the application the proper gutter -->
         <v-container fluid>

            <!-- If using vue-router -->
            <router-view />
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
      if (!this.$logged && this.$route.path != '/login' && this.$route.path != '/register') {
         this.$router.push('/');
      }
      else if (this.$logged && this.$route.path == '/') {
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
</style>