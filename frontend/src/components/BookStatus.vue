<template>
   <div>
      <v-select
         v-if="added"
         outlined
         :items="values_s"
         v-model="status"
         item-color= "red"
         color='#e09393'
         :menu-props="{
            bottom: true,
            offsetY: true,
            'max-width': 305,
            'nudge-right': 4,
            class: purple
         }"
         class='purple_bg'
         append-outer-icon="mdi-heart"
         @click:append-outer="test1"
      ></v-select>
      <v-btn
         v-else
         @click="addBook"
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
         values_s: ['Plan To Read', 'Reading', 'Finished', 'Dropped'],
         status: 'Plan To Read',
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

<style scoped>
   .theme--light.v-application{
   background-color: #f09c9c;
   }

   .theme--light.v-list{
   background: #ffcaca;
   }
   .theme--light.v-list-item:hover:before {
      opacity: 0.14;
   }
</style>