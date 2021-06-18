<template>
   <v-card class="mx-auto pl-8 pt-5 pb-3 mt-8" color="rgb(255, 0, 0, 0.2)"  width="1300px">
      <v-container>
         <p v-if="books.length" class="armwrestler main-color">Recommended for you:</p>
         <v-row
            v-if="books.length"
         >
            <v-col
               v-for="b in books"
               :key="b.name"
            >
               <Book :b="b"/>
            </v-col>
         </v-row>
         <p v-else class="armwrestler main-color mx-auto mt-3 py-10">You have no recommendations yet!</p>
      </v-container>
   </v-card>
   
</template>


<script>
import axios from "axios";
import Book from "@/components/Book.vue";

export default {
      name: 'Books',

      components: {
         Book,
      },

      data: () => ({
         books: [],
      }),

      created: function() {
         // get user's recommendations
         axios
            .get('/read2be/api/users/' + this.$cookies.get('user') + '/recommendations', this.$cookies.get('options'))
            .then(res => {
               this.books = res.data.recommendations;
            })
            .catch(e => console.log('Erro no GET das recomendacoes do user (inicial): ' + e));
      },
};

</script>