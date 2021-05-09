<template>
  <v-app>
    <div>
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
