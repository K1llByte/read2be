<template>
   <div>
      <!-- Remove Friend -->
      <v-btn
         dark
         v-if="status == 1"
         color="#f07977"
         class="mb-5"
         width=180
         @click="removeFriend"
      >
         Remove
         <v-icon right dense>
            mdi-account-remove-outline
         </v-icon>
      </v-btn>
      
      <!-- Remove pending request -->
      <v-btn
         dark
         v-else-if="status == 0"
         color="grey"
         class="mb-5"
         width=180
         @click="removePending"
      >
         Cancel
         <v-icon right dense>
            mdi-account-question-outline
         </v-icon>
      </v-btn>

      <!-- Add friend request -->
      <v-btn
         v-else-if="status == -1"
         dark
         color="#f07977"
         class="mb-5"
         width=180
         @click="friendRequest"
      >
         Add Friend
         <v-icon right dense>
            mdi-account-plus-outline
         </v-icon>
      </v-btn>

      <!-- TEMPORARIO SO PARA TESTES -->
      <v-btn
         dark
         color="teal"
         class="ml-5 mb-5"
         width=180
         @click="acceptRequest"
      >
         Accept
         <v-icon right dense>
            mdi-check
         </v-icon>
      </v-btn>
   </div>
</template>

<script>
// import axios from "axios";

export default {
    
   name: 'FriendStatus',

   data() {
      return {
         status: -1,
      };
   },

   methods: {
      removeFriend: function() {
         this.status = -1;
      },
      removePending: function() {
         this.status = -1;
      },
      friendRequest: function() {
         this.status = 0;
      },
      acceptRequest: function() {
         this.status = 1;
      }
   },

   // created: function() {

   //    // get author's books' name and image
   //    axios
   //       .get('/read2be/api/users/' + this.idu + '?inline_books=1', this.$getOptions())
   //       .then(res => {
   //          this.user = res.data;
   //          this.books = res.data.books;
   //       })
   //       .catch(e => console.log('Erro no GET dos books do user: ' + e));
   // },

}
</script>