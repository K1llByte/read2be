<template>
   <div>
      <!-- Remove Friend -->
      <!-- <v-btn
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
      </v-btn> -->
      
      <!-- Remove pending request -->
      <!-- <v-btn
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
      </v-btn> -->

      <!-- Add friend request -->
      <!-- <v-btn
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
      </v-btn> -->

      <!-- TEMPORARIO SO PARA TESTES -->
      <!-- <v-btn
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
      </v-btn> -->

      <!-- Add friend request -->
      <v-btn
         v-if="!isFriend && !sent"
         dark
         color="#f07977"
         class="mb-5"
         width=180
         @click="addFriend"
      >
         Add Friend
         <v-icon right dense>
            mdi-account-plus-outline
         </v-icon>
      </v-btn>
      <p
         v-else-if="!isFriend && sent"
         color=red
         class="mb-5"
      >
         Friend request sent!
      </p>
      <!-- Remove Friend -->
      <v-btn
         dark
         v-else-if="isFriend"
         color="red lighten-1"
         class="mb-5"
         width=180
         @click="removeFriend"
      >
         Remove Friend
         <v-icon right dense>
            mdi-account-remove-outline
         </v-icon>
      </v-btn>
      <p
         v-else-if="!isFriend && removed"
         color=red
         class="mb-5"
      >
         Friend removed!
      </p>

      <v-snackbar
         v-model="snackbar"
         timeout="2500"
         color="#221D45"
         right
         class="mb-16 mr-5"
      >
         {{ text }}

         <template v-slot:action="{ attrs }">
         <v-btn
            color="red"
            text
            v-bind="attrs"
            @click="snackbar = false"
         >
            Close
         </v-btn>
         </template>
      </v-snackbar>
   </div>
</template>

<script>
import axios from "axios";

export default {
    
   name: 'FriendStatus',

   props: ["idu"],

   data() {
      return {
         isFriend: false,
         sent: false,
         snackbar: false,
         text: '',
         uid: null,
         removed: null,
      };
   },

   methods: {
      addFriend: function() {
         // alert(this.$cookies.get('options').headers.Authorization);
         axios
            .post('/read2be/api/users/' + this.idu + '/requests', {}, this.$cookies.get('options'))
            .then(res => {
               res.data = null;
               this.sent = true;
               this.text = 'Friend request sent! :)';
               this.snackbar = true;
            })
            .catch(e => {
               console.log('Erro no POST do friend request: ' + e);
               if (e.response.status == 400) {
                  this.text = 'Friend request already sent!';
                  this.snackbar = true;
               }
            });
      },
      removeFriend: function() {
         axios
            .delete('/read2be/api/users/' + this.$cookies.get('user') + '/friends/' + this.uid, this.$cookies.get('options'))
            .then(res => {
               res.data = null;
               this.isFriend = false;
               this.removed = true;
               this.text = 'Removed friend! :(';
               this.snackbar = true;
            })
            .catch(e => {
               if (e.response.status == 400) {
                  this.text = 'No friend to remove!';
                  this.snackbar = true;
               }
               if (e.response.status == 401) {
                  this.text = 'Forbidden!';
                  this.snackbar = true;
               }
               else {
                  console.log('Erro no DELETE do friend: ' + e);
               }
            });
      },
      // removePending: function() {
      //    this.status = -1;
      // },
      // friendRequest: function() {
      //    this.status = 0;
      // },
      // acceptRequest: function() {
      //    this.status = 1;
      // }
   },

   created: function() {

      // check if user is user's friend
      axios
         .get('/read2be/api/users/' + this.$cookies.get('user'), this.$cookies.get('options'))
         .then(res => {
            this.isFriend = res.data.friends.some(f => f.username === this.idu);
         })
         .catch(e => console.log('Erro no GET dos friends do user: ' + e));
      
      // get user id
      axios
         .get('/read2be/api/users/' + this.idu, this.$cookies.get('options'))
         .then(res => {
            this.uid = res.data.user_id;
         })
         .catch(e => console.log('Erro no GET da info do user: ' + e));
   },

}
</script>