<template>
    <div>
      <v-avatar
         size="150"
         color="black"
         class="mt-5"
      >
         <img
            :src=user.avatar_url
            :alt=user.nickname
         >
      </v-avatar>
      <h2 class="main-color"><strong>@{{user.username}}</strong></h2>
      <v-card class="mx-auto pt-5 pb-3 mt-5" color="rgb(255, 0, 0, 0.1)"  width="1300px">
         <h3 v-if="user.nickname"><strong style="color:#a57474">Name: </strong>{{user.nickname}}</h3>
         <h3 v-else><strong style="color:#a57474">Name: </strong>{{"  -  "}}</h3>
         <h4>{{user.books.length}} books</h4>
      </v-card>
      <h2 class="mt-5"><strong>Books</strong></h2>
      <v-card class="mx-auto pt-5 pb-3 mt-5" color="rgb(255, 0, 0, 0.2)"  width="1300px">
         <v-container>
            <v-row>
               <v-col
                  v-for="b in books"
                  :key="b.isbn"
                  cols="2"
               >
                  <Book :b="b" />
               </v-col>
            </v-row>
         </v-container>
      </v-card>
      <h2 class="mt-5 mb-n6"><strong>Friends</strong></h2>
      <ConsultFriends :friends="user.friends"/>
    </div>
</template>

<script>
import axios from "axios";
import Book from "@/components/Book.vue";
import ConsultFriends from "@/components/ConsultFriends.vue";

export default {
    
   name: 'ConsultUser',

   props: ["idu"],

   components: {
      Book,
      ConsultFriends,
   },

   data() {
      return {
         user: [],
         books: [],
      };
   },

   created: function() {

      // get author's books' name and image
      axios
         .get('/read2be/api/users/' + this.idu + '?inline_books=1', this.$getOptions())
         .then(res => {
            this.user = res.data;
            this.books = res.data.books;
         })
         .catch(e => console.log('Erro no GET dos books do user: ' + e));
   },

}
</script>