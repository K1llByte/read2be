<template>
  <v-app>
    <div>
      <h1 class="armwrestler x-large dark my-4">Books</h1>
      <Filters />
      <Books />
    </div>
  </v-app>
</template>


<script>
import Books from '../components/Books.vue';
import Filters from '../components/Filters.vue';

export default {
  name: 'ShowBooks',
  components: { Books, Filters },

  data: () => ({
  })
}
</script>
