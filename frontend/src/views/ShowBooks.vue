<template>
  <v-app>
    <div>
      <h1 class="armwrestler x-large dark my-4">Books</h1>
      <SearchBar />
      <Filters />
      <Books />
    </div>
  </v-app>
</template>


<script>
import SearchBar from '../components/SearchBar.vue';
import Books from '../components/Books.vue';
import Filters from '../components/Filters.vue';

export default {
  name: 'ShowBooks',
  components: { SearchBar, Books, Filters },

  data: () => ({
  })
}
</script>
