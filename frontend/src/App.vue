<template>

   <v-app>

      <MenuBar />

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
import Footer from './components/Footer.vue';

export default {
   name: 'App',

   components: {
      MenuBar,
      Footer,
   },

   data: () => ({
   }),

};
</script>


<style lang="scss">
   #app {
      font-family: Avenir, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-align: center;
      color: #2c3e50;
   }
</style>