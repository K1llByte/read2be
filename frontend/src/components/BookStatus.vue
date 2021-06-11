<template>
   <div>
      <!-- v-col 4.2 -add book / status-->
      <!-- Status dos livros: -->
      <!-- 1 - Reading -->
      <!-- 2 - Finished -->
      <!-- 3 - Plan to Read -->
      <!-- 4 - Dropped -->
      <v-btn
         v-if="added"
         @click="test1()"
      >Status</v-btn>
      
      <v-btn
         v-else
      >Add Book</v-btn>
   </div>
</template>

<script>
import axios from "axios";

export default {
   
   name: 'BookStatus',

   props: ["idb"],

   data() {
      return {
         books: [],
         added: false,
         info: null,
      };
   },

   methods: {
      test1: function(){
         alert(this.info.status + '\n' + this.info.rate);
      },
   },

   created: function() {
      
      // get user's books
      axios
         .get('/read2be/api/users/' + this.$user, this.$getOptions())
         .then(res => {
            this.books = res.data.books;
            this.added = this.books.some(b => b.isbn === this.idb);
            if (this.added){
               this.info = this.books.filter(b => b.isbn === this.idb)[0];
            }
         })
         .catch(e => console.log('Erro no GET dos books do user: ' + e));
   },

}
</script>
