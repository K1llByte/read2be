// "user_id":       "string",
// "username":      "string",
// "nickname":      "string",
// "password_hash": "string",
// "email":         "string",
// "role":          "string",
// "avatar_url":    "string",
// "books": [
//    {
//       "isbn":            "string",
//       "status":          "int",
//       "rate":            "int",
//       "date_registered": "string"
//    }
// ],
// "friends":["user_id:string"],
// "pending":["user_id:string"]

<template>
    <div>
      <v-avatar
         size="150"
         color="black"
         class="mt-5 mb-3"
      >
         <img
            :src=user.avatar_url
            :alt=user.nickname
         >
      </v-avatar>
      <h1 class="mt-5"><strong>{{user.nickname}}</strong></h1>
      <v-card class="mx-auto pt-5 pb-3 mt-5" color="rgb(255, 0, 0, 0.1)"  width="1300px">
         <h3>Username: {{user.username}}</h3>
         <h3>Name: {{user.nickname}}</h3>
         <h4>{{user.books.length}} books</h4>
      </v-card>
      <h2 class="mt-5"><strong>My Books</strong></h2>

    </div>
</template>

<script>
import axios from "axios";

export default {
    
   name: 'ConsultUser',

   props: ["idu"],

   data() {
      return {
         user: [],
      };
   },

   created: function() {

      // get user's info
      axios
         .get('/read2be/api/users/' + this.idu, this.$getOptions())
         .then(res => {
            this.user = res.data;
         })
         .catch(e => console.log('Erro no GET dos books do user: ' + e));
   },

}
</script>