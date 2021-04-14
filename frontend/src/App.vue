<template>
  <v-app>
    <!-- <login></login> -->
    <!-- <register></register> -->
    <menu-bar></menu-bar>
    <searchbar></searchbar>
    <bookshelf></bookshelf>

    <template>
      <div class="text-center mt-6 mb-7">
          <v-pagination
            color="teal lighten-1"
            v-model="page"
            :length="10"
            :total-visible="5"
          ></v-pagination>
      </div>
    </template>
  </v-app>
</template>

<script>
// import Login from './components/Login.vue';
// import Register from './components/Register.vue';
import Bookshelf from './components/Bookshelf.vue';
import Searchbar from './components/Searchbar.vue';
import MenuBar from './components/MenuBar.vue';

export default {
  // components: { MenuBar, Login, Register, Bookshelf, Searchbar },
  components: { Bookshelf, Searchbar, MenuBar },
  name: 'App',

  data: () => ({
    page: 1,
  })
};
</script>