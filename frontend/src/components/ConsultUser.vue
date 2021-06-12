<template>
    <div>
      <!-- User's avatar -->
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

      <!-- Friend status/Add friend -->
      <FriendStatus v-if="user.username != this.$cookies.get('user')" :idu="idu" />

      <v-divider class="mx-16"></v-divider>

      <!-- User's books -->
      <h2 class="mt-5 armwrestler medium main-color"><strong>Books</strong></h2>
      <v-card v-if="full_books.length" class="mx-auto pt-5 pb-3 mt-5" color="rgb(255, 0, 0, 0.2)"  width="1300px">
         <v-container>
            <v-row>
               <v-col
                  v-for="b in full_books"
                  :key="b.isbn"
                  cols="2"
               >
                  <Book :b="b" />
               </v-col>
            </v-row>
         </v-container>
      </v-card>
      <v-card v-else class="mx-auto mt-6 py-16" color="rgb(255, 0, 0, 0.2)"  width="1300px"  height="180px">
         <p class="armwrestler main-color">User has no books yet</p>
      </v-card>
      <h2 class="mt-5 mb-n6 armwrestler medium main-color"><strong>Friends</strong></h2>
      <ConsultFriends v-if="user.friends.length" :friends="user.friends"/>
      <v-card v-else class="mx-auto mt-12 py-16" color="rgb(255, 0, 0, 0.2)"  width="1300px"  height="180px">
         <p class="armwrestler main-color">User has no friends yet</p>
      </v-card>
    </div>
</template>

<script>
import axios from "axios";
import Book from "@/components/Book.vue";
import ConsultFriends from "@/components/ConsultFriends.vue";
import FriendStatus from "@/components/FriendStatus.vue";

export default {
    
   name: 'ConsultUser',

   props: ["idu"],

   components: {
      Book,
      ConsultFriends,
      FriendStatus,
   },

   data() {
      return {
         user: [],
         // books_status: [],
         full_books: [],
      };
   },

   created: function() {

      // get author's books' name and image
      axios
         .get('/read2be/api/users/' + this.idu + '?inline_books=1', this.$getOptions())
         .then(res => {
            this.user = res.data;
            // this.books_status = res.data.books;
            this.full_books = res.data.full_books;
         })
         .catch(e => {
            console.log('Erro no GET dos books do user: ' + e);
            
         });
   },

}
</script>